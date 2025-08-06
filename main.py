# main.py
import os
import json
from pathlib import Path
from collections import defaultdict
from operator import itemgetter

from fastapi import FastAPI, UploadFile, File, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec
from pdf2image import convert_from_path
import pytesseract

from autogen import ConversableAgent
from models import Base, JobPosting, Candidate, Match
from database import engine, SessionLocal

# OCR config
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

# Load env
load_dotenv()
API_KEY = os.getenv("PINECONE_API_KEY")
ENV = os.getenv("PINECONE_ENV")
INDEX_NAME = os.getenv("INDEX_NAME")
NAMESPACE = os.getenv("NAMESPACE")
MODEL_NAME = os.getenv("MODEL_NAME")

DIMENSION = 384
TOP_K = 5
RESUME_FOLDER = "resumes"
os.makedirs(RESUME_FOLDER, exist_ok=True)

# DB setup
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with SessionLocal() as session:
        yield session

# Pinecone
pc = Pinecone(api_key=API_KEY, environment=ENV)
if INDEX_NAME not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=INDEX_NAME,
        dimension=DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
index = pc.Index(INDEX_NAME)
embedder = SentenceTransformer(MODEL_NAME)

# Agent setup
llm_config = {
    "config_list": [{
        "model": "llama-3.3-70b-versatile",
        "api_key": os.environ["GROQ_API_KEY"],
        "base_url": "https://api.groq.com/openai/v1",
    }]
}
explainer = ConversableAgent(
    name="Explainer",
    system_message="You are an expert recruiter. Always focus on job fit.",
    llm_config=llm_config,
    human_input_mode="NEVER"
)

# Utilities
def read_pdf_text(path):
    try:
        reader = PdfReader(path)
        return "".join([p.extract_text() + "\n" for p in reader.pages if p.extract_text()])
    except:
        images = convert_from_path(path)
        return "".join([pytesseract.image_to_string(img) for img in images])

def chunk_text(text, size=200):
    words = text.split()
    return [" ".join(words[i:i+size]) for i in range(0, len(words), size)]

async def upsert_resume(file_path, resume_id, db: AsyncSession):
    text = read_pdf_text(file_path)
    chunks = chunk_text(text)
    vectors = embedder.encode(chunks).tolist()
    metadata = {"resume_id": resume_id}
    upserts = [(f"{resume_id}_chunk_{i}", vec, metadata) for i, vec in enumerate(vectors)]
    index.upsert(vectors=upserts, namespace=NAMESPACE)
    candidate = Candidate(resume_id=resume_id, file_path=file_path, metadata=json.dumps(metadata))
    db.add(candidate)
    await db.commit()

async def find_best_resumes(job_desc, filters=None):
    q_vec = embedder.encode(job_desc).tolist()
    resp = index.query(
        vector=q_vec,
        namespace=NAMESPACE,
        top_k=TOP_K,
        include_metadata=True,
        filter=filters or {},
    )
    scores = defaultdict(list)
    for match in resp.get("matches", []):
        rid = match["metadata"]["resume_id"]
        scores[rid].append(match["score"])
    avg = {rid: sum(vals)/len(vals) for rid, vals in scores.items()}
    return sorted(avg.items(), key=itemgetter(1), reverse=True)

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await init_db()

@app.post("/api/candidates/upload")
async def upload(files: list[UploadFile] = File(...), db: AsyncSession = Depends(get_db)):
    for file in files:
        path = os.path.join(RESUME_FOLDER, file.filename)
        with open(path, "wb") as f:
            f.write(await file.read())
        await upsert_resume(path, file.filename.replace(".pdf", ""), db)
    return {"message": "Uploaded and indexed"}

@app.get("/api/candidates")
async def list_candidates(db: AsyncSession = Depends(get_db)):
    candidates = await db.execute(select(Candidate))
    results = candidates.scalars().all()
    return [
        {
            "id": c.id,
            "resume_id": c.resume_id,
            "file_path": c.file_path,
            "metadata": json.loads(c.metadata),
        }
        for c in results
    ]


@app.post("/api/job-postings")
async def create_job(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    job = JobPosting(title=data["title"], description=data["description"])
    db.add(job)
    await db.commit()
    return {"message": "Job saved"}

@app.post("/api/match-candidates")
async def match(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    filters = data.get("filters")  # dict e.g., {"location": {"$eq": "remote"}}
    results = await find_best_resumes(data["description"], filters)
    return {"matches": results}

@app.post("/api/chatbot")
async def chatbot(request: Request):
    data = await request.json()
    desc = data.get("job_description")
    matches = await find_best_resumes(desc)
    if not matches:
        return {"reply": "No matching candidates."}
    top_id = matches[0][0]
    path = os.path.join(RESUME_FOLDER, f"{top_id}.pdf")
    text = read_pdf_text(path)
    reply = explainer.generate_reply([{"role": "user", "content": f"Job:\n{desc}\nResume:\n{text}"}])
    return {"reply": reply, "best_candidate": top_id}

@app.get("/api/analytics")
async def analytics(db: AsyncSession = Depends(get_db)):
    job_total = (await db.execute(select(JobPosting))).scalars().all()
    candidate_total = (await db.execute(select(Candidate))).scalars().all()
    return {"job_postings": len(job_total), "candidates": len(candidate_total)}
