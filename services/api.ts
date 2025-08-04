import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeUrl: string;
  matchingScore: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedFor: string;
  feedback?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  applicantsCount: number;
  createdAt: string;
}

export interface DashboardStats {
  openJobs: number;
  totalCandidates: number;
  reviewedCandidates: number;
  pendingCandidates: number;
  averageMatchingScore: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// API functions
export const apiService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  createJob: async (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount'>): Promise<Job> => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Candidates
  getCandidates: async (jobId?: string): Promise<Candidate[]> => {
    const params = jobId ? { jobId } : {};
    const response = await api.get('/candidates', { params });
    return response.data;
  },

  getTopCandidates: async (jobId: string): Promise<Candidate[]> => {
    const response = await api.get(`/candidates/top/${jobId}`);
    return response.data;
  },

  updateCandidateStatus: async (id: string, status: Candidate['status']): Promise<Candidate> => {
    const response = await api.put(`/candidates/${id}/status`, { status });
    return response.data;
  },

  // File uploads
  uploadResume: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadJobDescription: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('jobDescription', file);
    const response = await api.post('/upload/job-description', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Chatbot
  sendChatMessage: async (message: string, context?: string): Promise<ChatMessage> => {
    const response = await api.post('/chat', { message, context });
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<any> => {
    const response = await api.get('/analytics');
    return response.data;
  },
};

export default api;