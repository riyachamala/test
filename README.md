# TalentHub - AI-Powered Recruitment Platform

A full-stack recruitment platform that uses AI to match candidates with job postings. Built with Next.js frontend and FastAPI backend, featuring vector search, resume parsing, and intelligent matching.

## 🚀 Features

### Frontend (Next.js)
- Modern, responsive UI with Tailwind CSS
- Real-time analytics dashboard
- Job posting management
- Candidate upload and management
- AI-powered matching interface
- Interactive chat with AI assistant

### Backend (FastAPI)
- RESTful API with comprehensive endpoints
- SQLAlchemy async database operations
- Pinecone vector database integration
- AI-powered resume parsing and matching
- File upload handling with validation
- Real-time analytics and reporting

### AI & ML Features
- Resume text extraction (PDF + OCR fallback)
- Vector embeddings for semantic search
- AI-powered candidate-job matching
- Intelligent chat assistant for recruitment queries
- Skills and experience extraction from resumes

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Python 3.8+** installed
2. **Node.js 18+** and npm/pnpm installed
3. **Tesseract OCR** installed for PDF text extraction
4. **API Keys** for external services

### Installing Tesseract OCR

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)

## 🔧 Environment Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd talenhub

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./talenhub.db

# Pinecone (Vector Database)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENV=your_pinecone_environment
INDEX_NAME=talenhub-index
NAMESPACE=resumes

# AI Models
MODEL_NAME=all-MiniLM-L6-v2
GROQ_API_KEY=your_groq_api_key

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# CORS (localhost only)
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. API Keys Setup

#### Pinecone Setup
1. Sign up at [Pinecone](https://www.pinecone.io/)
2. Create a new project
3. Get your API key and environment
4. Add to `.env` file

#### Groq Setup
1. Sign up at [Groq Console](https://console.groq.com/)
2. Get your API key
3. Add to `.env` file

## 🏃‍♂️ Running the Application

### Option 1: Using the startup script (Recommended)

**Linux/macOS:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env

# Run the startup script
./start.sh
```

**Windows:**
```cmd
# Copy environment template
copy .env.example .env

# Edit .env with your API keys
notepad .env

# Run the startup script
start.bat
```

### Option 2: Manual setup

1. **Start backend:**
   ```bash
   python main.py
   ```
   - Backend: http://localhost:8000
   - API docs: http://localhost:8000/docs

2. **Start frontend:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000

### 3. Verify Installation

- Backend health check: `http://localhost:8000/api/health`
- Frontend: `http://localhost:3000`
- API documentation: `http://localhost:8000/docs`

## 📁 Project Structure

```
talenhub/
├── backend/                 # FastAPI backend
│   ├── __init__.py
│   ├── api.py              # Main API endpoints
│   ├── config.py           # Configuration settings
│   ├── database.py         # Database setup
│   ├── models.py           # SQLAlchemy models
│   └── services.py         # Business logic
├── app/                    # Next.js frontend
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── jobs/
│   ├── candidates/
│   ├── interviews/
│   └── chat/
├── components/             # React components
├── lib/                   # Utilities and API client
├── styles/                # CSS modules
├── uploads/               # File uploads (created automatically)
├── main.py               # Backend entry point
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
└── README.md
```

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/{id}` - Get specific job
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Candidates
- `GET /api/candidates` - List all candidates
- `POST /api/candidates/upload` - Upload resume
- `GET /api/candidates/{id}` - Get specific candidate

### Matches
- `POST /api/matches` - Create AI matches
- `GET /api/matches` - List matches
- `PUT /api/matches/{id}` - Update match status

### AI Chat
- `POST /api/chat` - Get AI analysis

### Analytics
- `GET /api/analytics` - Get platform analytics

## 🗄️ Database

The application uses SQLite by default (perfect for localhost development).

### Database Location
- SQLite file: `./talenhub.db` (created automatically)

## 🔧 Troubleshooting

### Common Issues

1. **Tesseract not found**
   - Ensure Tesseract is installed and in PATH
   - Update path in `backend/services.py`

2. **Pinecone connection errors**
   - Verify API key and environment
   - Check network connectivity

3. **File upload errors**
   - Ensure uploads directory exists
   - Check file size limits
   - Verify file format (PDF only)

4. **Database errors**
   - Delete `talenhub.db` and restart
   - Check database URL in `.env`

### Logs
- Backend logs: Check terminal running `python main.py`
- Frontend logs: Check browser console and terminal running `npm run dev`

## 📊 Using the Application

### 1. Upload Resumes
1. Go to the Candidates page
2. Upload PDF resumes
3. The system will automatically:
   - Extract text from PDFs
   - Create vector embeddings
   - Store in Pinecone
   - Extract skills and experience

### 2. Create Job Postings
1. Go to the Jobs page
2. Click "Add New Job"
3. Fill in job details
4. Save the job posting

### 3. AI Matching
1. Select a job posting
2. Click "Find Matches"
3. View AI-generated candidate matches
4. Review match scores and details

### 4. AI Chat
1. Go to the AI Assistant page
2. Ask questions about candidates or jobs
3. Get AI-powered insights and recommendations

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check logs for error messages
4. Open an issue on GitHub

---

**Note**: This is configured for localhost development. For production deployment, additional security measures would be needed.