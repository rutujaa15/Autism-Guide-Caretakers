import sys
import os
from db import get_db_connection
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, GEMINI_API_KEY

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_huggingface import HuggingFaceEmbeddings

# -------------------------
# Embeddings (CORRECT)
# -------------------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = PGVector(
    connection_string=f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}",
    collection_name="documents",
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY


# -------------------------
# LLM (Gemini)
# -------------------------
llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    temperature=0.2

)

# docs = retriever.invoke("what is autism")
# print("\nRETRIEVED DOCS COUNT:", len(docs))
# if docs:
#     print("\nSAMPLE DOC:\n", docs[0].page_content[:500])

# -------------------------
# MEMORY HELPERS (Postgres)
# -------------------------

def fetch_recent_memories(user_id=None, limit=5):
    conn = get_db_connection()
    cur = conn.cursor()

    if user_id:
        cur.execute(
            """
            SELECT content FROM memories
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT %s
            """,
            (user_id, limit)
        )
    else:
        cur.execute(
            """
            SELECT content FROM memories
            ORDER BY created_at DESC
            LIMIT %s
            """,
            (limit,)
        )

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [row["content"] for row in rows]


def save_memory(content, user_id=None, role="user", memory_type="short"):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO memories (user_id, role, memory_type, content)
        VALUES (%s, %s, %s, %s)
        """,
        (user_id, role, memory_type, content)
    )

    conn.commit()
    cur.close()
    conn.close()

# -------------------------
# Prompt
# -------------------------
prompt = ChatPromptTemplate.from_template("""
User Memory:
{memory}

Knowledge Context:
{context}

If the answer is not in the context, say "I do not know".

Question:
{question}

Answer:
""")



# -------------------------
# LCEL RAG PIPELINE
# -------------------------
rag_pipeline = (
    {
        "context": retriever | (lambda x: x["question"]),
        "question": lambda x: x["question"],
        "memory": lambda x: x["memory"],
    }
    | prompt
    | llm
    | StrOutputParser()
)


# -------------------------
# FUNCTION FOR API
# -------------------------
def get_answer(question: str, user_id=None) -> str:
    # 1️⃣ fetch memory
    memories = fetch_recent_memories(user_id=user_id, limit=5)
    memory_text = "\n".join(memories) if memories else "No prior memory."

    # 2️⃣ run RAG with memory
    response = rag_pipeline.invoke(
        {
            "question": question,
            "memory": memory_text
        }
    )

    # 3️⃣ save conversation
    save_memory(content=question, user_id=user_id, role="user")
    save_memory(content=response, user_id=user_id, role="assistant")

    return response
