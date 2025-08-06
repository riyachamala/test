from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./talenhub.db"
    
    # Pinecone
    PINECONE_API_KEY: str
    PINECONE_ENV: str
    INDEX_NAME: str = "talenhub-index"
    NAMESPACE: str = "resumes"
    
    # AI Models
    MODEL_NAME: str = "all-MiniLM-L6-v2"
    GROQ_API_KEY: str
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # CORS - Simplified for localhost only
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"

settings = Settings()