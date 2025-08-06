// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface MatchResult {
  matches: [string, number][] // [resume_id, relevance_score]
}

export interface ChatbotResponse {
  reply: string
  best_candidate: string
}

export interface AnalyticsData {
  job_postings: number
  candidates: number
}

export interface JobPosting {
  title: string
  description: string
}

export interface MatchFilters {
  location?: { $eq: string }
  experience?: { $gte: number }
  skills?: { $in: string[] }
}

// Generic API call function with improved error handling
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)

    // Check for different types of errors
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          error: "Request timeout - backend service may be unavailable",
          message: "demo_mode",
        }
      }

      if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
        return {
          error: "Backend service unavailable - using demo data",
          message: "demo_mode",
        }
      }
    }

    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// API Functions

/**
 * Upload candidate resumes (PDF files)
 */
export async function uploadCandidateResumes(files: File[]): Promise<ApiResponse> {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout for uploads

    const response = await fetch(`${API_BASE_URL}/api/candidates/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("Resume upload failed:", error)

    if (error instanceof Error && (error.name === "AbortError" || error.message.includes("fetch"))) {
      return {
        error: "Backend service unavailable - files saved locally for demo",
        message: "demo_mode",
      }
    }

    return {
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}

/**
 * Create a new job posting
 */
export async function createJobPosting(jobData: JobPosting): Promise<ApiResponse> {
  const result = await apiCall("/api/job-postings", {
    method: "POST",
    body: JSON.stringify(jobData),
  })

  // If backend is unavailable, simulate success
  if (result.error && result.message === "demo_mode") {
    return {
      data: { id: Date.now(), ...jobData },
      message: "Job created locally - backend unavailable",
    }
  }

  return result
}

/**
 * Match candidates to a job description
 */
export async function matchCandidates(description: string, filters?: MatchFilters): Promise<ApiResponse<MatchResult>> {
  const result = await apiCall<MatchResult>("/api/match-candidates", {
    method: "POST",
    body: JSON.stringify({
      description,
      filters: filters || {},
    }),
  })

  // If backend is unavailable, return demo matches
  if (result.error && result.message === "demo_mode") {
    const demoMatches: [string, number][] = [
      ["resume_001", 0.95],
      ["resume_002", 0.89],
      ["resume_003", 0.84],
      ["resume_004", 0.78],
      ["resume_005", 0.72],
    ]

    return {
      data: { matches: demoMatches },
      message: "Using demo matches - backend unavailable",
    }
  }

  return result
}

/**
 * Get chatbot explanation for job matching
 */
export async function getChatbotExplanation(jobDescription: string): Promise<ApiResponse<ChatbotResponse>> {
  const result = await apiCall<ChatbotResponse>("/api/chatbot", {
    method: "POST",
    body: JSON.stringify({
      job_description: jobDescription,
    }),
  })

  // If backend is unavailable, return demo explanation
  if (result.error && result.message === "demo_mode") {
    return {
      data: {
        reply: `Based on the job description analysis, I've identified the key requirements and matched them against our candidate database.\n\nThe top matches show strong alignment in:\n• Technical skills and experience level\n• Industry background and domain knowledge\n• Communication and collaboration abilities\n\nThe best candidate (resume_001) demonstrates 95% compatibility with your requirements, particularly excelling in the core competencies you've outlined.`,
        best_candidate: "resume_001",
      },
      message: "Using demo explanation - backend unavailable",
    }
  }

  return result
}

/**
 * Fetch dashboard analytics
 */
export async function getDashboardAnalytics(): Promise<ApiResponse<AnalyticsData>> {
  const result = await apiCall<AnalyticsData>("/api/analytics", {
    method: "GET",
  })

  // Always return demo data if backend is unavailable
  if (result.error) {
    return {
      data: {
        job_postings: 24,
        candidates: 1247,
      },
      message: "Using demo data - backend service unavailable",
    }
  }

  return result
}

// Utility functions for data transformation
export function formatMatchResults(matches: [string, number][]): Array<{
  resumeId: string
  relevanceScore: number
  matchPercentage: number
}> {
  return matches.map(([resumeId, score]) => ({
    resumeId,
    relevanceScore: score,
    matchPercentage: Math.round(score * 100),
  }))
}

export function getTopMatches(matches: [string, number][], limit = 5) {
  return matches
    .sort((a, b) => b[1] - a[1]) // Sort by relevance score descending
    .slice(0, limit)
}
