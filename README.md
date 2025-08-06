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

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
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
1. Sign up at [Groq](https://console.groq.com/)
2. Get your API key
3. Add to `.env` file

## 🏃‍♂️ Running the Application

### 1. Start the Backend

```bash
# Start the FastAPI server
python main.py
```

The backend will be available at `http://localhost:8000`

### 2. Start the Frontend

```bash
# In a new terminal, start the Next.js development server
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`

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

The application uses SQLite by default (good for development). For production, consider:

### PostgreSQL Setup
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/talenhub
```

Install PostgreSQL dependencies:
```bash
pip install asyncpg
```

### Database Migrations
```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

## 🔒 Security Considerations

### Production Deployment

1. **Change default secret key**
2. **Use environment variables for all sensitive data**
3. **Enable HTTPS**
4. **Implement proper authentication**
5. **Add rate limiting**
6. **Use production database (PostgreSQL)**
7. **Set up proper CORS origins**

### Authentication (TODO)
The current version doesn't include authentication. For production:

1. Implement JWT authentication
2. Add user roles and permissions
3. Secure file uploads
4. Add API rate limiting

## 🧪 Testing

### Backend Testing
```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Frontend Testing
```bash
# Run Next.js tests
npm test
```

## 🚀 Deployment

### Backend Deployment (FastAPI)

#### Using Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Using Railway/Heroku
```bash
# Add Procfile
echo "web: uvicorn backend.api:app --host 0.0.0.0 --port \$PORT" > Procfile
```

### Frontend Deployment (Next.js)

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Static Export
```bash
npm run build
npm run export
```

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

## 📈 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check browser console for errors

### Performance Monitoring
- Monitor API response times
- Check database query performance
- Monitor file upload sizes and processing times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check logs for error messages
4. Open an issue on GitHub

---

**Note**: This is a development version. For production use, implement proper authentication, security measures, and use production-grade databases and services.