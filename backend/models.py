from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="recruiter")  # recruiter, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class JobPosting(Base):
    __tablename__ = "job_postings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    department = Column(String)
    location = Column(String)
    job_type = Column(String)  # full-time, part-time, contract
    salary_range = Column(String)
    requirements = Column(JSON)  # List of requirements
    status = Column(String, default="draft")  # draft, active, closed
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    matches = relationship("Match", back_populates="job_posting")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_size = Column(Integer)
    metadata = Column(JSON)  # Extracted resume data
    skills = Column(JSON)  # Extracted skills
    experience_years = Column(Integer)
    education = Column(JSON)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    matches = relationship("Match", back_populates="candidate")

class Match(Base):
    __tablename__ = "matches"
    
    id = Column(Integer, primary_key=True, index=True)
    job_posting_id = Column(Integer, ForeignKey("job_postings.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    match_score = Column(Float, nullable=False)
    match_details = Column(JSON)  # Detailed matching analysis
    status = Column(String, default="pending")  # pending, reviewed, shortlisted, rejected
    reviewed_by = Column(Integer, ForeignKey("users.id"))
    reviewed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    job_posting = relationship("JobPosting", back_populates="matches")
    candidate = relationship("Candidate", back_populates="matches")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    scheduled_at = Column(DateTime(timezone=True))
    duration = Column(Integer)  # minutes
    interview_type = Column(String)  # phone, video, onsite
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Models for API
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    role: str = "recruiter"

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

class JobPostingCreate(BaseModel):
    title: str
    description: str
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    salary_range: Optional[str] = None
    requirements: Optional[list] = None

class JobPostingResponse(BaseModel):
    id: int
    title: str
    description: str
    department: Optional[str]
    location: Optional[str]
    job_type: Optional[str]
    salary_range: Optional[str]
    requirements: Optional[list]
    status: str
    created_at: datetime

class CandidateUpload(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class CandidateResponse(BaseModel):
    id: int
    resume_id: str
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    file_name: str
    file_size: Optional[int]
    skills: Optional[list]
    experience_years: Optional[int]
    education: Optional[list]
    uploaded_at: datetime

class MatchResponse(BaseModel):
    id: int
    job_posting_id: int
    candidate_id: int
    match_score: float
    match_details: Optional[dict]
    status: str
    created_at: datetime
    job_posting: JobPostingResponse
    candidate: CandidateResponse

class MatchRequest(BaseModel):
    job_posting_id: int
    filters: Optional[dict] = None

class ChatRequest(BaseModel):
    job_description: str
    candidate_id: Optional[int] = None
    message: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    best_candidate: Optional[str] = None
    match_score: Optional[float] = None