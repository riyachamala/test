# TalentHub Setup Guide

This guide will walk you through setting up TalentHub, an AI-powered recruitment platform.

## 🎯 Quick Start (5 minutes)

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

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start servers:**
   ```bash
   # Terminal 1: Backend
   python main.py
   
   # Terminal 2: Frontend
   npm run dev
   ```

## 🔑 Required API Keys

### 1. Pinecone (Vector Database)

1. Sign up at [Pinecone](https://www.pinecone.io/)
2. Create a new project
3. Get your API key and environment
4. Add to `.env`:
   ```env
   PINECONE_API_KEY=your_api_key_here
   PINECONE_ENV=your_environment_here
   ```

### 2. Groq (AI Model)

1. Sign up at [Groq Console](https://console.groq.com/)
2. Get your API key
3. Add to `.env`:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

## 🛠️ System Requirements

### Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **Tesseract OCR** (for PDF text extraction)

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
1. Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
2. Install and add to PATH

## 📁 Project Structure

```
talenhub/
├── backend/                 # FastAPI backend
│   ├── api.py              # API endpoints
│   ├── config.py           # Configuration
│   ├── database.py         # Database setup
│   ├── models.py           # Data models
│   └── services.py         # Business logic
├── app/                    # Next.js frontend
├── components/             # React components
├── lib/                   # API client
├── uploads/               # File uploads
├── main.py               # Backend entry point
├── start.sh              # Linux/macOS startup script
├── start.bat             # Windows startup script
└── docker-compose.yml    # Docker deployment
```

## 🚀 Running the Application

### Development Mode

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

### Production Mode

#### Using Docker

1. **Build and run:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

#### Manual Production Setup

1. **Backend:**
   ```bash
   pip install -r requirements.txt
   uvicorn backend.api:app --host 0.0.0.0 --port 8000
   ```

2. **Frontend:**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./talenhub.db

# Pinecone
PINECONE_API_KEY=your_key
PINECONE_ENV=your_env

# AI Models
GROQ_API_KEY=your_key

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Security
SECRET_KEY=your-secret-key
```

### Database Options

**SQLite (Default - Development):**
```env
DATABASE_URL=sqlite+aiosqlite:///./talenhub.db
```

**PostgreSQL (Production):**
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/talenhub
```

## 🧪 Testing the Setup

### 1. Health Check

Visit: http://localhost:8000/api/health

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "version": "1.0.0"
}
```

### 2. API Documentation

Visit: http://localhost:8000/docs

You should see the FastAPI interactive documentation.

### 3. Frontend

Visit: http://localhost:3000

You should see the TalentHub dashboard.

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

## 🔍 Troubleshooting

### Common Issues

#### 1. "Tesseract not found"
```bash
# Ubuntu/Debian
sudo apt install tesseract-ocr

# macOS
brew install tesseract

# Windows
# Download and install from GitHub releases
```

#### 2. "Pinecone connection error"
- Verify API key and environment in `.env`
- Check network connectivity
- Ensure Pinecone project is active

#### 3. "File upload failed"
- Check file size (max 10MB)
- Ensure file is PDF format
- Verify uploads directory exists

#### 4. "Database error"
```bash
# Delete database and restart
rm talenhub.db
python main.py
```

#### 5. "Frontend can't connect to backend"
- Ensure backend is running on port 8000
- Check CORS settings in `.env`
- Verify `NEXT_PUBLIC_API_URL` in `.env`

### Logs

**Backend logs:**
```bash
# Check terminal running python main.py
```

**Frontend logs:**
```bash
# Check browser console (F12)
# Check terminal running npm run dev
```

### Performance Issues

1. **Slow resume processing:**
   - Ensure Tesseract is installed
   - Check file sizes
   - Monitor Pinecone API limits

2. **Slow AI responses:**
   - Check Groq API limits
   - Verify network connectivity
   - Monitor API response times

## 🔒 Security Notes

### Development
- Default secret key is used
- SQLite database
- No authentication

### Production
- Change all default secrets
- Use PostgreSQL
- Implement authentication
- Enable HTTPS
- Set up proper CORS
- Add rate limiting

## 📈 Monitoring

### Health Checks
- Backend: `GET /api/health`
- Frontend: Browser console

### Metrics to Monitor
- API response times
- File upload success rates
- AI processing times
- Database query performance

## 🆘 Getting Help

1. **Check logs** for error messages
2. **Verify API keys** are correct
3. **Test endpoints** using `/docs`
4. **Check prerequisites** are installed
5. **Review troubleshooting** section above

## 🚀 Next Steps

After successful setup:

1. **Upload sample resumes** to test the system
2. **Create job postings** to test matching
3. **Try the AI chat** for insights
4. **Explore the API** at `/docs`
5. **Customize the UI** in the components folder

---

**Need more help?** Check the main README.md for detailed documentation.