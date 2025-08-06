// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  department?: string;
  location?: string;
  job_type?: string;
  salary_range?: string;
  requirements?: string[];
  status: string;
  created_at: string;
}

export interface Candidate {
  id: number;
  resume_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  file_name: string;
  file_size?: number;
  skills?: string[];
  experience_years?: number;
  education?: any[];
  uploaded_at: string;
}

export interface Match {
  id: number;
  job_posting_id: number;
  candidate_id: number;
  match_score: number;
  match_details?: any;
  status: string;
  created_at: string;
  job_posting: JobPosting;
  candidate: Candidate;
}

export interface Analytics {
  total_jobs: number;
  total_candidates: number;
  total_matches: number;
  active_jobs: number;
  shortlisted_candidates: number;
}

export interface ChatRequest {
  job_description: string;
  candidate_id?: number;
  message?: string;
}

export interface ChatResponse {
  reply: string;
  best_candidate?: string;
  match_score?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Job Postings
  async getJobs(status?: string, department?: string): Promise<JobPosting[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (department) params.append('department', department);
    
    return this.request<JobPosting[]>(`/api/jobs?${params.toString()}`);
  }

  async getJob(id: number): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/jobs/${id}`);
  }

  async createJob(job: Omit<JobPosting, 'id' | 'created_at'>): Promise<JobPosting> {
    return this.request<JobPosting>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: number, job: Partial<JobPosting>): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(id: number): Promise<void> {
    return this.request<void>(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Candidates
  async getCandidates(skills?: string, experience_min?: number): Promise<Candidate[]> {
    const params = new URLSearchParams();
    if (skills) params.append('skills', skills);
    if (experience_min) params.append('experience_min', experience_min.toString());
    
    return this.request<Candidate[]>(`/api/candidates?${params.toString()}`);
  }

  async getCandidate(id: number): Promise<Candidate> {
    return this.request<Candidate>(`/api/candidates/${id}`);
  }

  async uploadCandidate(
    file: File,
    full_name?: string,
    email?: string,
    phone?: string
  ): Promise<{ message: string; candidate_id: number; resume_id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (full_name) formData.append('full_name', full_name);
    if (email) formData.append('email', email);
    if (phone) formData.append('phone', phone);

    const response = await fetch(`${this.baseUrl}/api/candidates/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  // Matches
  async createMatches(job_posting_id: number, filters?: any): Promise<Match[]> {
    return this.request<Match[]>('/api/matches', {
      method: 'POST',
      body: JSON.stringify({ job_posting_id, filters }),
    });
  }

  async getMatches(job_id?: number, candidate_id?: number, status?: string): Promise<Match[]> {
    const params = new URLSearchParams();
    if (job_id) params.append('job_id', job_id.toString());
    if (candidate_id) params.append('candidate_id', candidate_id.toString());
    if (status) params.append('status', status);
    
    return this.request<Match[]>(`/api/matches?${params.toString()}`);
  }

  async updateMatchStatus(match_id: number, status: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/matches/${match_id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // AI Chat
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    return this.request<Analytics>('/api/analytics');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.request<{ status: string; timestamp: string; version: string }>('/api/health');
  }
}

export const apiClient = new ApiClient();
