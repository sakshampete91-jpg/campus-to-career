import axios from 'axios'
import { getToken, removeToken } from './auth'
import type {
  AuthCredentials,
  RegisterData,
  AuthResponse,
  User,
  Opportunity,
  Application,
  TrustCheckReport,
  Resume,
  TailoredResume,
  MatchScore,
  FilterState,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor: handle 401 gracefully without forcing login redirects
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Zero-friction mode: do not redirect away to /auth/login
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (credentials: AuthCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials).then((r) => r.data),

  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  getMe: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  getDemoSession: (role: string = 'student') =>
    apiClient.get<AuthResponse>(`/auth/demo-session?role=${role}`).then((r) => r.data),
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunitiesApi = {
  list: (filters?: any) =>
    apiClient
      .get<any>('/opportunities', { params: filters })
      .then((r) => (Array.isArray(r.data) ? r.data : r.data?.items || [])),

  getById: (id: string) =>
    apiClient.get<Opportunity>(`/opportunities/${id}`).then((r) => r.data),

  create: (data: Partial<Opportunity>) =>
    apiClient.post<Opportunity>('/opportunities', data).then((r) => r.data),

  getMatchScore: (opportunityId: string) =>
    apiClient
      .get<any>(`/opportunities/${opportunityId}/match-score`)
      .then((r) => r.data),
}

// ─── Applications ─────────────────────────────────────────────────────────────

export const applicationsApi = {
  list: () =>
    apiClient.get<Application[]>('/applications').then((r) => r.data),

  save: (opportunityId: string) =>
    apiClient
      .post<Application>('/applications', { opportunity_id: opportunityId, status: 'saved' })
      .then((r) => r.data),

  updateStatus: (applicationId: string, status: Application['status']) =>
    apiClient
      .patch<Application>(`/applications/${applicationId}`, { status })
      .then((r) => r.data),

  remove: (applicationId: string) =>
    apiClient.delete(`/applications/${applicationId}`).then((r) => r.data),
}

// ─── TrustCheck ──────────────────────────────────────────────────────────────

export const trustCheckApi = {
  scan: (data: {
    url: string
    listing_text?: string
    company_name?: string
    known_official_website?: string
  }) => apiClient.post<TrustCheckReport>('/trustcheck/scan', data).then((r) => r.data),

  getScan: (scanId: string) =>
    apiClient.get<TrustCheckReport>(`/trustcheck/scans/${scanId}`).then((r) => r.data),
}

export const trustcheckApi = trustCheckApi

// ─── Resume ──────────────────────────────────────────────────────────────────

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post<Resume>('/resume/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  list: () => apiClient.get<Resume[]>('/resume').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Resume>(`/resume/${id}`).then((r) => r.data),

  tailor: (dataOrResumeId: any, targetRole?: string, jobDescription?: string) => {
    if (typeof dataOrResumeId === 'object') {
      return apiClient.post<any>('/resume/tailor', dataOrResumeId).then((r) => r.data)
    }
    return apiClient
      .post<TailoredResume>('/resume/tailor', {
        resume_id: dataOrResumeId,
        target_role: targetRole,
        job_description: jobDescription,
      })
      .then((r) => r.data)
  },

  generatePdf: (contentOrId: any) => {
    if (typeof contentOrId === 'object') {
      const payload =
        contentOrId && 'tailored_content' in contentOrId
          ? contentOrId
          : { tailored_content: contentOrId }
      return apiClient
        .post('/resume/generate-pdf', payload, { responseType: 'blob' })
        .then((r) => r.data)
    }
    return apiClient
      .get(`/resume/${contentOrId}/pdf`, { responseType: 'blob' })
      .then((r) => r.data)
  },
}

// ─── Profile & Users ─────────────────────────────────────────────────────────

export const usersApi = {
  getProfile: () => apiClient.get<User>('/users/profile').then((r) => r.data),
  updateProfile: (data: any) => apiClient.put<User>('/users/profile', data).then((r) => r.data),
}

export const profileApi = {
  update: (data: Partial<User>) =>
    apiClient.patch<User>('/profile', data).then((r) => r.data),
}
