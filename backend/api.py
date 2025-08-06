from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import os
import aiofiles
from datetime import datetime

from backend.config import settings
from backend.database import get_db, init_db
from backend.models import (
    User, JobPosting, Candidate, Match, Interview,
    UserCreate, UserResponse, JobPostingCreate, JobPostingResponse,
    CandidateResponse, MatchResponse, MatchRequest, ChatRequest, ChatResponse
)
from backend.services import (
    process_resume, find_matching_candidates, create_match,
    get_chat_response, get_ai_analysis
)

# Create FastAPI app
app = FastAPI(
    title="TalentHub API",
    description="AI-powered recruitment platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded resumes
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    await init_db()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "TalentHub API is running", "version": "1.0.0"}

# User Management
@app.post("/api/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user."""
    # Check if user already exists
    existing_user = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    if existing_user.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password (in production, use proper hashing)
    hashed_password = user_data.password  # TODO: Implement proper hashing
    
    user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    """Get all users."""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

# Job Postings
@app.post("/api/jobs", response_model=JobPostingResponse)
async def create_job(job_data: JobPostingCreate, db: AsyncSession = Depends(get_db)):
    """Create a new job posting."""
    job = JobPosting(
        title=job_data.title,
        description=job_data.description,
        department=job_data.department,
        location=job_data.location,
        job_type=job_data.job_type,
        salary_range=job_data.salary_range,
        requirements=job_data.requirements,
        created_by=1  # TODO: Get from authenticated user
    )
    
    db.add(job)
    await db.commit()
    await db.refresh(job)
    
    return job

@app.get("/api/jobs", response_model=List[JobPostingResponse])
async def get_jobs(
    status: Optional[str] = None,
    department: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all job postings with optional filters."""
    query = select(JobPosting)
    
    if status:
        query = query.where(JobPosting.status == status)
    if department:
        query = query.where(JobPosting.department == department)
    
    result = await db.execute(query)
    jobs = result.scalars().all()
    return jobs

@app.get("/api/jobs/{job_id}", response_model=JobPostingResponse)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific job posting."""
    result = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job

@app.put("/api/jobs/{job_id}", response_model=JobPostingResponse)
async def update_job(job_id: int, job_data: JobPostingCreate, db: AsyncSession = Depends(get_db)):
    """Update a job posting."""
    result = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.title = job_data.title
    job.description = job_data.description
    job.department = job_data.department
    job.location = job_data.location
    job.job_type = job_data.job_type
    job.salary_range = job_data.salary_range
    job.requirements = job_data.requirements
    
    await db.commit()
    await db.refresh(job)
    
    return job

@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a job posting."""
    result = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    await db.delete(job)
    await db.commit()
    
    return {"message": "Job deleted successfully"}

# Candidate Management
@app.post("/api/candidates/upload")
async def upload_candidate(
    file: UploadFile = File(...),
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Upload and process a candidate resume."""
    
    # Validate file
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Process resume
    try:
        candidate_data = {
            "full_name": full_name,
            "email": email,
            "phone": phone
        }
        
        candidate = await process_resume(
            file_path=file_path,
            file_name=file.filename,
            file_size=len(content),
            candidate_data=candidate_data,
            db=db
        )
        
        return {
            "message": "Resume uploaded and processed successfully",
            "candidate_id": candidate.id,
            "resume_id": candidate.resume_id
        }
    
    except Exception as e:
        # Clean up file if processing fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")

@app.get("/api/candidates", response_model=List[CandidateResponse])
async def get_candidates(
    skills: Optional[str] = None,
    experience_min: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all candidates with optional filters."""
    query = select(Candidate)
    
    if skills:
        # Filter by skills (simplified)
        query = query.where(Candidate.skills.contains([skills]))
    if experience_min is not None:
        query = query.where(Candidate.experience_years >= experience_min)
    
    result = await db.execute(query)
    candidates = result.scalars().all()
    return candidates

@app.get("/api/candidates/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(candidate_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific candidate."""
    result = await db.execute(select(Candidate).where(Candidate.id == candidate_id))
    candidate = result.scalar_one_or_none()
    
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    return candidate

# Matching
@app.post("/api/matches", response_model=List[MatchResponse])
async def create_matches(match_request: MatchRequest, db: AsyncSession = Depends(get_db)):
    """Find and create matches for a job posting."""
    
    # Get job posting
    job_result = await db.execute(
        select(JobPosting).where(JobPosting.id == match_request.job_posting_id)
    )
    job = job_result.scalar_one_or_none()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    # Find matching candidates
    matches = await find_matching_candidates(
        job.description,
        top_k=5,
        filters=match_request.filters
    )
    
    created_matches = []
    
    for resume_id, match_score in matches:
        # Get candidate by resume_id
        candidate_result = await db.execute(
            select(Candidate).where(Candidate.resume_id == resume_id)
        )
        candidate = candidate_result.scalar_one_or_none()
        
        if candidate:
            # Check if match already exists
            existing_match = await db.execute(
                select(Match).where(
                    Match.job_posting_id == match_request.job_posting_id,
                    Match.candidate_id == candidate.id
                )
            )
            
            if not existing_match.scalar_one_or_none():
                match = await create_match(
                    job_posting_id=match_request.job_posting_id,
                    candidate_id=candidate.id,
                    match_score=match_score,
                    db=db
                )
                created_matches.append(match)
    
    return created_matches

@app.get("/api/matches", response_model=List[MatchResponse])
async def get_matches(
    job_id: Optional[int] = None,
    candidate_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get matches with optional filters."""
    query = select(Match)
    
    if job_id:
        query = query.where(Match.job_posting_id == job_id)
    if candidate_id:
        query = query.where(Match.candidate_id == candidate_id)
    if status:
        query = query.where(Match.status == status)
    
    result = await db.execute(query)
    matches = result.scalars().all()
    return matches

@app.put("/api/matches/{match_id}")
async def update_match_status(
    match_id: int,
    status: str,
    db: AsyncSession = Depends(get_db)
):
    """Update match status."""
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match.status = status
    match.reviewed_at = datetime.utcnow()
    match.reviewed_by = 1  # TODO: Get from authenticated user
    
    await db.commit()
    await db.refresh(match)
    
    return {"message": "Match status updated successfully"}

# AI Chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Get AI chat response for recruitment queries."""
    try:
        response = await get_chat_response(
            job_description=request.job_description,
            candidate_id=request.candidate_id,
            message=request.message,
            db=db
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# Analytics
@app.get("/api/analytics")
async def get_analytics(db: AsyncSession = Depends(get_db)):
    """Get platform analytics."""
    # Count jobs
    jobs_result = await db.execute(select(JobPosting))
    total_jobs = len(jobs_result.scalars().all())
    
    # Count candidates
    candidates_result = await db.execute(select(Candidate))
    total_candidates = len(candidates_result.scalars().all())
    
    # Count matches
    matches_result = await db.execute(select(Match))
    total_matches = len(matches_result.scalars().all())
    
    # Count active jobs
    active_jobs_result = await db.execute(
        select(JobPosting).where(JobPosting.status == "active")
    )
    active_jobs = len(active_jobs_result.scalars().all())
    
    # Count shortlisted candidates
    shortlisted_result = await db.execute(
        select(Match).where(Match.status == "shortlisted")
    )
    shortlisted_candidates = len(shortlisted_result.scalars().all())
    
    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "total_matches": total_matches,
        "active_jobs": active_jobs,
        "shortlisted_candidates": shortlisted_candidates
    }

# Health check
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }