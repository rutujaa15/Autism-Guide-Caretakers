# db.py
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from config import PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT
# ---------------------------
# DATABASE CONFIG
# ---------------------------
DB_CONFIG = {
    "host": PG_HOST,
    "port": PG_PORT,
    "dbname": PG_DB,
    "user": PG_USER,
    "password": PG_PASSWORD
}
   

# ---------------------------
# CONNECTION
# ---------------------------
def get_db_connection():
    return psycopg2.connect(
        cursor_factory=RealDictCursor,
        **DB_CONFIG
    )

# ---------------------------
# TABLE CREATION QUERY
# ---------------------------
CREATE_USERS_TABLE = """
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

CREATE_MEMORIES_TABLE = """
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50), -- user / assistant / system
    memory_type VARCHAR(50) DEFAULT 'short', -- short / long
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP
);
"""


def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(CREATE_USERS_TABLE)
    cur.execute(CREATE_MEMORIES_TABLE)
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Users and Memories tables created successfully")

# ---------------------------
# RUN DIRECTLY
# ---------------------------
if __name__ == "__main__":
    create_tables()
