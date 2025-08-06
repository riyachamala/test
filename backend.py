"""
import os
import pinecone
from pinecone import Pinecone, ServerlessSpec #using pinecone as database
from pypdf import PdfReader #to read pdfs
from sentence_transformers import SentenceTransformer #creates dense vector embeddings of text
from operator import itemgetter
from collections import defaultdict #not exactly necessary, just for default dict
from autogen import ConversableAgent #for agent conversation with user
import sys #command line
from dotenv import load_dotenv
import pytesseract
from pdf2image import convert_from_path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"



# load env values
load_dotenv()

API_KEY = os.getenv("PINECONE_API_KEY")
ENV = os.getenv("PINECONE_ENV")
INDEX_NAME = os.getenv("INDEX_NAME")
DIMENSION = 384
MODEL_NAME = os.getenv("MODEL_NAME")
ALL_PDFS = []
CHUNK_SIZE = 200
NAMESPACE = os.getenv("NAMESPACE")
TOP_K = 2


#instantiate: one index with different resume-ids as metadata and under one namespace
pc = Pinecone(api_key=API_KEY, environment=ENV)
pc.Index(INDEX_NAME).delete(delete_all=True, namespace=NAMESPACE)


if INDEX_NAME not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
      name=INDEX_NAME,
      dimension=DIMENSION,
      metric="cosine",
      spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
index    = pc.Index(INDEX_NAME)
embedder = SentenceTransformer(MODEL_NAME)

from pdf2image import convert_from_path
import pytesseract

def read_pdf_text(path):
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content + "\n"
        if text.strip():
            return text
    except Exception as e:
        print(f"[ERROR] Reading PDF with pypdf failed: {e}")

    # Fallback to OCR
    print(f"[OCR] Using Tesseract to extract from: {path}")
    try:
        images = convert_from_path(path)
        ocr_text = ""
        for i, image in enumerate(images):
            ocr_text += pytesseract.image_to_string(image)
        return ocr_text
    except Exception as e:
        print(f"[ERROR] OCR failed for {path}: {e}")
        return ""


# all chunks share same resume id
def chunk_text(text, size=CHUNK_SIZE):
    words = text.split()
    return [" ".join(words[i:i+size]) for i in range(0, len(words), size)]

#uploading all resumes that are stored in a folder through chunking and then embedding into vectors
def upsert_resumes_from_folder(folder):
    for fname in os.listdir(folder):
        print("Found files:", os.listdir(folder))

        if not fname.lower().endswith(".pdf"):
            continue
        thing  = os.path.splitext(fname)[0]
        full = os.path.join(folder, fname)
        text = read_pdf_text(full)
        ALL_PDFS.append(text)
        chunks = chunk_text(text)
        if not chunks:
            continue
        vecs = embedder.encode(chunks).tolist()
        upserts = [
            (f"{thing}_chunk_{i}", v, {"resume_id": thing})
            for i, v in enumerate(vecs)
        ]
        index.upsert(vectors=upserts, namespace=NAMESPACE)
        print(f"Indexed {len(chunks)} chunks for '{thing}'")

from operator import itemgetter
from collections import defaultdict

#
def find_best_resume_for_job(job_desc, top_k=TOP_K, filter_meta=None):
    #convert to embedding vector
    q_vec = embedder.encode(job_desc).tolist()
    #query the pinecone index with job embedding to find top_k most similar
    resp = index.query(
        vector=q_vec,
        namespace=NAMESPACE,
        top_k=top_k,
        include_metadata=True,
        filter=filter_meta,
        temperature = 0.5
    )
    #aggregate similarity scores from all matching chunks that are organized by resumeid
    scores = defaultdict(list) #cosine similarity is just geometric intrep of dot product -- how close the two vectors are
    for match in resp["matches"]:
        thing = match["metadata"]["resume_id"] #each chunk's resume id
        scores[thing].append(match["score"]) #collect all scores for each resume
    #avg the chunk-level scores for each resume
    avg = {thing: sum(vals)/len(vals) for thing, vals in scores.items()}
    #sort resumes by descending avg scores, best match first this way
    return sorted(avg.items(), key=itemgetter(1), reverse=True)

#set up groq llm for autogen to use
llm_config={
  "config_list":[
    {
      "model": "llama-3.3-70b-versatile",
      "api_key": os.environ["GROQ_API_KEY"],
      "base_url": "https://api.groq.com/openai/v1",
    }
  ]
}

#intialize agent for chatbot
explainer = ConversableAgent(
    name="Explainer",
    system_message = (
  "You are an expert recruiter. Always focus on whether the candidate fits the *specific job description provided*. "
  "If a candidate lacks required experience, training, or relevant qualifications, say so clearly. "
  "Never generalize about their resume quality; focus on match or mismatch with the job."
    ),
    llm_config=llm_config,
    human_input_mode="NEVER"
)
conversation_history = []


#main loop with prompts and chat history logging
def full_loop():

    print("\nEnter your JOB DESCRIPTION. Finish by entering an empty line:")
    job_lines = []
    while True:
        try:
            line = input()
        except EOFError:
            break
        if not line.strip():
            break
        job_lines.append(line)
    job_text = "\n".join(job_lines).strip()
    if not job_text:
        print("No job description provided, exiting.")
        sys.exit(0)


    matches = find_best_resume_for_job(job_text, top_k=2)
    if not matches:
        print("No resumes matched.")
        sys.exit(0)

    print("\nRanked Resumes for this Job Description:")
    for thing, score in matches:
        print(f"--{thing} — Avg cosine: {score:.4f}")
    best_id, best_score = matches[0]
    print(f"\n**Best Fit:** {best_id} (score {best_score:.4f})")

    best_path = os.path.join("resumes", f"{best_id}.pdf")
    if not os.path.exists(best_path):
        print(f"Could not find file for {best_id}, skipping explanation.")
        sys.exit(0)
    full_text = read_pdf_text(best_path)
    ALL_PDFS.remove(full_text) #remove the best match pdf from OTHER pdfs

    print("\n=== Chat with Explainer (type 'exit' to quit) ===")
    conversation_history.clear()
    conversation_history.append({
      "role": "user",
      "content": (
        f"Job Description:\n{job_text}\n\n"
        f"Best Candidate Resume:\n{full_text}\n\n"
        "Explain why the Best Canidate Resume is a good fit."
      )
    })


    reply = explainer.generate_reply(conversation_history)
    conversation_history.append({"role": "assistant", "content": reply})
    print("AI:", reply)
    #add essential history for comparisons
    for idx, resume_text in enumerate(ALL_PDFS):
        conversation_history.append({
            "role": "user",
            "content": f"Other Candidate #{idx+1} Resume:\n{resume_text}"
        })
    
    #reminder to optimize
    conversation_history.append({
    "role": "user",
    "content": f"Remember: the job we're evaluating candidates for is a {job_text} position."
    }) 



    while True:
        user_msg = input("\nYou: ").strip()
        if user_msg.lower() in ("exit", "quit"):
            print("Goodbye!")
            break
        if user_msg.lower() in "rerank":
            ALL_PDFS.append(full_text)
            full_loop()
        conversation_history.append({"role": "user", "content": user_msg})
        reply = explainer.generate_reply(conversation_history)
        conversation_history.append({"role": "assistant", "content": reply})
        print("AI:", reply)

if __name__ == "__main__":
    upsert_resumes_from_folder("resumes")
    full_loop()
    

"""