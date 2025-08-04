# Recruitment Web Interface

A modern React-based recruitment management system with AI-powered candidate matching and chatbot functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for backend)

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the API base URL if needed:
     ```
     REACT_APP_API_BASE_URL=http://localhost:8000
     ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

### Backend Setup (Optional)

1. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables**
   - Get API keys for:
     - Pinecone (vector database)
     - Groq (AI/LLM)
   - Update `.env` file with your keys

3. **Start Backend Server**
   ```bash
   python backend.py
   ```

## 📁 Project Structure

```
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Dashboard.tsx
│   ├── TopCandidates.tsx
│   ├── Chatbot.tsx
│   ├── Upload.tsx
│   ├── JobManagement.tsx
│   ├── CandidateArchive.tsx
│   └── AdminLogin.tsx
├── services/           # API and external services
│   └── api.ts
├── types/              # TypeScript type definitions
├── backend.py          # Python backend (optional)
└── package.json        # Frontend dependencies
```

## 🎯 Features

### Core Pages
- **Dashboard**: Analytics and overview
- **Top Candidates**: AI-sorted candidate list
- **Chatbot**: AI recruitment assistant
- **Upload**: File upload for resumes/jobs
- **Job Management**: CRUD operations for job postings
- **Candidate Archive**: Search and filter candidates
- **Admin Login**: Authentication system

### Key Features
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Modern React hooks
- ✅ File upload with drag & drop
- ✅ Real-time chat interface
- ✅ PDF resume viewer
- ✅ Search and filtering
- ✅ Status management (approve/reject)
- ✅ Mock data for demonstration

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development

# Backend (when setting up)
PINECONE_API_KEY=your_key_here
PINECONE_ENV=your_env_here
INDEX_NAME=recruitment-index
NAMESPACE=resumes
MODEL_NAME=all-MiniLM-L6-v2
GROQ_API_KEY=your_groq_key_here
```

### API Configuration

The frontend is configured to connect to a backend at `localhost:8000`. Update `services/api.ts` if your backend runs on a different port.

## 🎮 Usage Guide

### 1. Dashboard
- View recruitment analytics
- See recent activity
- Access quick actions

### 2. Upload Files
- Drag & drop resumes (PDF)
- Upload job descriptions
- Monitor upload progress

### 3. Review Candidates
- View AI-sorted candidates
- See matching scores
- Approve/reject candidates
- View detailed profiles

### 4. AI Chatbot
- Ask about candidates
- Get matching insights
- Use suggested questions

### 5. Job Management
- Create new job postings
- Edit existing jobs
- Track applicant counts

### 6. Candidate Archive
- Search by name/email
- Filter by status
- View historical data

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Adding New Features
1. Create new components in `components/`
2. Add new pages in `pages/`
3. Update routing in `App.tsx`
4. Add API endpoints in `services/api.ts`

## 🔗 API Endpoints

The frontend expects these backend endpoints:

- `GET /dashboard/stats` - Dashboard statistics
- `GET /jobs` - List all jobs
- `POST /jobs` - Create new job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `GET /candidates` - List candidates
- `PUT /candidates/:id/status` - Update candidate status
- `POST /upload/resume` - Upload resume
- `POST /upload/job-description` - Upload job description
- `POST /chat` - Chatbot endpoint

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 in use**
   - The dev server will suggest an alternative port
   - Or kill the process: `lsof -ti:3000 | xargs kill -9`

2. **Dependencies not found**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Backend connection failed**
   - Check if backend is running on port 8000
   - Verify CORS settings in backend
   - Check network connectivity

4. **File upload issues**
   - Ensure files are PDF format
   - Check file size limits
   - Verify backend upload endpoint

### Debug Mode
- Open browser developer tools (F12)
- Check Console for error messages
- Network tab shows API calls

## 📦 Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag `build/` folder to Netlify
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `build/` contents
- **Docker**: Use provided Dockerfile

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
- Check the troubleshooting section
- Review browser console for errors
- Ensure all dependencies are installed
- Verify environment variables are set correctly