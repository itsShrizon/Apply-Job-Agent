# db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()


# Update with your PostgreSQL credentials and database name
DATABASE_URL = 'postgresql://postgres:159@db:5432/applyjobagent'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
