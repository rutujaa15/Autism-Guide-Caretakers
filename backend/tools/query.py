import os
from db import get_db_connection
from config import PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, GEMINI_API_KEY

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import PGVector
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from langchain_huggingface import HuggingFaceEmbeddings


# =========================================================
# 1️⃣ EMBEDDINGS
# =========================================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = PGVector(
    connection_string=f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}",
    collection_name="documents",
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})


# =========================================================
# 2️⃣ LLM (Gemini)
# =========================================================

os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    temperature=0.2,
)


# =========================================================
# 3️⃣ UTILITIES
# =========================================================

def format_docs(docs):
    """Convert Document objects into clean string context."""
    if not docs:
        return "No relevant context found."

    return "\n\n".join(doc.page_content for doc in docs)


# =========================================================
# 4️⃣ MEMORY HELPERS
# =========================================================

def fetch_recent_memories(user_id=None, limit=5):
    conn = None
    cur = None
    try:
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
        return [row["content"] for row in rows] if rows else []

    except Exception as e:
        print("Memory fetch error:", e)
        return []

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


def save_memory(content, user_id=None, role="user", memory_type="short"):
    conn = None
    cur = None
    try:
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

    except Exception as e:
        print("Memory save error:", e)

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# =========================================================
# 5️⃣ PROMPT
# =========================================================

prompt = ChatPromptTemplate.from_template("""
You are a helpful autism support assistant.

User Memory:
{memory}

Knowledge Context:
{context}

If the answer is NOT present in the knowledge context, respond with:
"I do not know."

Question:
{question}

Answer:
""")


# =========================================================
# 6️⃣ LCEL RAG PIPELINE (FIXED VERSION)
# =========================================================

rag_pipeline = (
    {
        # ✅ Extract question FIRST, then retrieve docs
        "context": RunnableLambda(
            lambda x: format_docs(
                retriever.get_relevant_documents(x["question"])
            )
        ),
        "question": RunnableLambda(lambda x: x["question"]),
        "memory": RunnableLambda(lambda x: x["memory"]),
    }
    | prompt
    | llm
    | StrOutputParser()
)


# =========================================================
# 7️⃣ MAIN FUNCTION (ASYNC FOR FASTAPI)
# =========================================================

async def get_answer(question: str, user_id=None) -> str:
    try:
        # 1️⃣ Fetch memory
        memories = fetch_recent_memories(user_id=user_id, limit=5)
        memory_text = "\n".join(memories) if memories else "No prior memory."

        # 2️⃣ Run RAG async
        response = await rag_pipeline.ainvoke(
            {
                "question": question,
                "memory": memory_text
            }
        )

        # 3️⃣ Save conversation
        save_memory(question, user_id=user_id, role="user")
        save_memory(response, user_id=user_id, role="assistant")

        return response

    except Exception as e:
        print("RAG Error:", e)
        return "Sorry, something went wrong while processing your request."
