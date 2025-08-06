import os
import json
import uuid
from typing import List, Dict, Optional, Tuple
from collections import defaultdict
from operator import itemgetter
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from pdf2image import convert_from_path
import pytesseract
from autogen import ConversableAgent
from backend.config import settings
from backend.models import Candidate, JobPosting, Match
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# Initialize Pinecone
pc = Pinecone(api_key=settings.PINECONE_API_KEY, environment=settings.PINECONE_ENV)

# Create index if it doesn't exist
if settings.INDEX_NAME not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=settings.INDEX_NAME,
        dimension=384,
        metric="cosine",
        spec=pc.ServerlessSpec(cloud="aws", region="us-east-1")
    )

index = pc.Index(settings.INDEX_NAME)
embedder = SentenceTransformer(settings.MODEL_NAME)

# Initialize AI Agent
llm_config = {
    "config_list": [{
        "model": "llama-3.3-70b-versatile",
        "api_key": settings.GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
    }]
}

explainer = ConversableAgent(
    name="RecruitmentExpert",
    system_message=(
        "You are an expert recruiter and HR professional. "
        "Analyze job descriptions and candidate resumes to provide insights on: "
        "1. Skills match and gaps "
        "2. Experience relevance "
        "3. Cultural fit indicators "
        "4. Recommendations for interview questions "
        "Always be professional, objective, and constructive."
    ),
    llm_config=llm_config,
    human_input_mode="NEVER"
)

def read_pdf_text(file_path: str) -> str:
    """Extract text from PDF using multiple methods."""
    try:
        # Try direct text extraction first
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content + "\n"
        
        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"PDF text extraction failed: {e}")
    
    # Fallback to OCR
    try:
        images = convert_from_path(file_path)
        ocr_text = ""
        for image in images:
            ocr_text += pytesseract.image_to_string(image) + "\n"
        return ocr_text.strip()
    except Exception as e:
        print(f"OCR failed: {e}")
        return ""

def chunk_text(text: str, chunk_size: int = 200) -> List[str]:
    """Split text into chunks for vectorization."""
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def extract_resume_data(text: str) -> Dict:
    """Extract structured data from resume text."""
    # This is a simplified version - in production, you'd use more sophisticated NLP
    skills = []
    experience_years = 0
    education = []
    
    # Basic skill extraction (simplified)
    common_skills = [
        "python", "javascript", "react", "node.js", "java", "c++", "sql", "mongodb",
        "aws", "docker", "kubernetes", "git", "agile", "scrum", "figma", "photoshop",
        "marketing", "sales", "project management", "data analysis", "machine learning"
    ]
    
    text_lower = text.lower()
    for skill in common_skills:
        if skill in text_lower:
            skills.append(skill)
    
    # Extract years of experience (simplified)
    import re
    experience_patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'experience:\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*years?\s*in\s*'
    ]
    
    for pattern in experience_patterns:
        match = re.search(pattern, text_lower)
        if match:
            experience_years = int(match.group(1))
            break
    
    return {
        "skills": skills,
        "experience_years": experience_years,
        "education": education,
        "raw_text": text
    }

async def process_resume(file_path: str, file_name: str, file_size: int, 
                        candidate_data: Dict, db: AsyncSession) -> Candidate:
    """Process uploaded resume and store in database and vector index."""
    
    # Extract text from PDF
    text = read_pdf_text(file_path)
    if not text:
        raise ValueError("Could not extract text from PDF")
    
    # Extract structured data
    resume_data = extract_resume_data(text)
    
    # Generate unique resume ID
    resume_id = str(uuid.uuid4())
    
    # Create chunks and embeddings
    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No text chunks could be created")
    
    vectors = embedder.encode(chunks).tolist()
    
    # Store in Pinecone
    metadata = {
        "resume_id": resume_id,
        "file_name": file_name,
        "skills": resume_data["skills"],
        "experience_years": resume_data["experience_years"]
    }
    
    upserts = [
        (f"{resume_id}_chunk_{i}", vec, metadata)
        for i, vec in enumerate(vectors)
    ]
    
    index.upsert(vectors=upserts, namespace=settings.NAMESPACE)
    
    # Create candidate record
    candidate = Candidate(
        resume_id=resume_id,
        full_name=candidate_data.get("full_name"),
        email=candidate_data.get("email"),
        phone=candidate_data.get("phone"),
        file_path=file_path,
        file_name=file_name,
        file_size=file_size,
        metadata=resume_data,
        skills=resume_data["skills"],
        experience_years=resume_data["experience_years"],
        education=resume_data["education"]
    )
    
    db.add(candidate)
    await db.commit()
    await db.refresh(candidate)
    
    return candidate

async def find_matching_candidates(job_description: str, top_k: int = 5, 
                                 filters: Optional[Dict] = None) -> List[Tuple[str, float]]:
    """Find best matching candidates for a job description."""
    
    # Create embedding for job description
    job_vector = embedder.encode(job_description).tolist()
    
    # Query Pinecone
    query_response = index.query(
        vector=job_vector,
        namespace=settings.NAMESPACE,
        top_k=top_k * 2,  # Get more to account for filtering
        include_metadata=True,
        filter=filters or {}
    )
    
    # Aggregate scores by resume
    scores = defaultdict(list)
    for match in query_response.get("matches", []):
        resume_id = match["metadata"]["resume_id"]
        scores[resume_id].append(match["score"])
    
    # Calculate average scores
    avg_scores = {
        resume_id: sum(scores_list) / len(scores_list)
        for resume_id, scores_list in scores.items()
    }
    
    # Sort by score
    sorted_matches = sorted(avg_scores.items(), key=itemgetter(1), reverse=True)
    
    return sorted_matches[:top_k]

async def create_match(job_posting_id: int, candidate_id: int, match_score: float,
                      match_details: Optional[Dict] = None, db: AsyncSession) -> Match:
    """Create a match record between job and candidate."""
    
    match = Match(
        job_posting_id=job_posting_id,
        candidate_id=candidate_id,
        match_score=match_score,
        match_details=match_details or {}
    )
    
    db.add(match)
    await db.commit()
    await db.refresh(match)
    
    return match

async def get_ai_analysis(job_description: str, candidate_text: str) -> str:
    """Get AI analysis of candidate fit for job."""
    
    prompt = f"""
    Job Description:
    {job_description}
    
    Candidate Resume:
    {candidate_text}
    
    Please provide a comprehensive analysis including:
    1. Skills match and gaps
    2. Experience relevance
    3. Overall fit score (1-10)
    4. Key strengths
    5. Areas of concern
    6. Recommended interview questions
    """
    
    conversation = [{"role": "user", "content": prompt}]
    reply = explainer.generate_reply(conversation)
    
    return reply

async def get_chat_response(job_description: str, candidate_id: Optional[int] = None,
                           message: Optional[str] = None, db: AsyncSession) -> Dict:
    """Get AI chat response for recruitment queries."""
    
    if candidate_id:
        # Get specific candidate analysis
        candidate_query = select(Candidate).where(Candidate.id == candidate_id)
        candidate_result = await db.execute(candidate_query)
        candidate = candidate_result.scalar_one_or_none()
        
        if not candidate:
            return {"reply": "Candidate not found."}
        
        candidate_text = candidate.metadata.get("raw_text", "")
        analysis = await get_ai_analysis(job_description, candidate_text)
        
        return {
            "reply": analysis,
            "best_candidate": candidate.full_name or candidate.resume_id,
            "match_score": None
        }
    else:
        # Find best matches and analyze
        matches = await find_matching_candidates(job_description, top_k=1)
        
        if not matches:
            return {"reply": "No matching candidates found for this job description."}
        
        best_candidate_id, match_score = matches[0]
        
        # Get candidate details
        candidate_query = select(Candidate).where(Candidate.resume_id == best_candidate_id)
        candidate_result = await db.execute(candidate_query)
        candidate = candidate_result.scalar_one_or_none()
        
        if not candidate:
            return {"reply": "Best candidate not found in database."}
        
        candidate_text = candidate.metadata.get("raw_text", "")
        analysis = await get_ai_analysis(job_description, candidate_text)
        
        return {
            "reply": analysis,
            "best_candidate": candidate.full_name or candidate.resume_id,
            "match_score": match_score
        }