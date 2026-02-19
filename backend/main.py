import sys
import os

# =========================================================
# 🔥 PATCH LANGCHAIN RETRIEVER (COMPATIBILITY FIX)
# =========================================================

try:
    from langchain_core.vectorstores import VectorStoreRetriever

    # If new LangChain version removed get_relevant_documents,
    # add it back so your existing RAG pipeline keeps working.
    if not hasattr(VectorStoreRetriever, "get_relevant_documents"):
        def get_relevant_documents(self, query):
            return self.invoke(query)

        VectorStoreRetriever.get_relevant_documents = get_relevant_documents

except Exception:
    pass

# =========================================================
# NORMAL IMPORTS
# =========================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

from auth import router as auth_router
from db import create_tables
from backend.tools.query import get_answer

from fastmcp import FastMCP


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(title="Autism Guide Backend + MCP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()


# =========================================================
# MCP SERVER
# =========================================================

mcp = FastMCP(name="autism-guide")

@mcp.tool(
    name="rag_query",
    description="Answer autism-related questions using RAG + memory."
)
async def rag_query_tool(question: str, user_id: int | None = None):
    return await get_answer(question, user_id)

app.mount("/mcp", mcp)


# =========================================================
# REST CHAT ENDPOINT
# =========================================================

class QuestionSchema(BaseModel):
    question: str
    user_id: int | None = None


@app.post("/chat")
async def chat(q: QuestionSchema):
    answer = await get_answer(q.question, user_id=q.user_id)
    return {"answer": answer}


app.include_router(auth_router)


@app.get("/")
def root():
    return {"status": "Backend + MCP running 🚀"}
