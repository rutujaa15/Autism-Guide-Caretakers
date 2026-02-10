import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import router as auth_router
from scripts.query import get_answer
from db import create_tables

app = FastAPI()

# Create DB tables on startup
@app.on_event("startup")
def startup():
    create_tables()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict this
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/chat")
def chat(q: Question):
    answer = get_answer(q.question)
    return {"answer": answer}

app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "Auth server running"}
