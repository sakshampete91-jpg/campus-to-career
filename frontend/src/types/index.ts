// All TypeScript interfaces for the Campus to Career app

export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'employer' | 'admin'
  skills?: Skill[]
  education?: Education
  academic_year?: string
  github_url?: string
  linkedin_url?: string
  company_name?: string
  profile_photo_url?: string
  work_preferences?: WorkPreferences
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export interface Education {
  institution: string
  degree: string
  field_of_study: string
  start_year?: number
  end_year?: number
}

export interface WorkPreferences {
  work_types: Array<'remote' | 'hybrid' | 'onsite'>
  opportunity_types: Array<'internship' | 'freelance' | 'part-time' | 'full-time'>
}

export interface Opportunity {
  id: string
  title: string
  company_name: string
  company_website?: string
  description: string
  responsibilities: string[]
  required_skills: string[]
  preferred_skills: string[]
  compensation?: string
  is_paid: boolean
  work_arrangement: 'remote' | 'hybrid' | 'onsite'
  location: string
  experience_level: 'entry' | 'junior' | 'mid' | 'senior'
  opportunity_type: 'internship' | 'freelance' | 'part-time' | 'full-time'
  deadline?: string
  application_url: string
  trust_status: 'verified' | 'partially_verified' | 'unverified' | 'elevated_risk'
  trust_score?: number
  created_at: string
  posted_by?: string
}

export interface TrustCheckReport {
  scan_id: string
  scanned_at: string
  url: string
  company_name: string
  risk_score: number
  risk_category: string
  risk_label: string
  signals: SignalEvidence[]
  ai_analysis: string
  ai_available: boolean
  url_safe: boolean
  url_safety_reason: string
  live_scan_succeeded: boolean
  recommendations: string[]
  disclaimer: string
}

export interface SignalEvidence {
  signal_name: string
  weight: number
  detected: boolean
  explanation: string
  evidence: string
}

export interface Application {
  id: string
  opportunity: Opportunity
  status: 'saved' | 'applied' | 'under_review' | 'interview' | 'rejected' | 'selected'
  applied_at?: string
  notes?: string
  created_at: string
}

export interface Resume {
  id: string
  filename: string
  uploaded_at: string
  extracted_content?: ResumeContent
}

export interface ResumeContent {
  summary?: string
  experience?: string
  education?: string
  skills?: string
  projects?: string
  certifications?: string
}

export interface TailoredResume {
  original_resume_id: string
  target_role: string
  tailored_content: ResumeContent
  changes: string[]
  match_score: number
}

export interface MatchScore {
  match_score?: number
  score?: number
  overall?: number
  skill_match?: number
  experience_match?: number
  preference_match?: number
  matched_skills: string[]
  missing_skills: string[]
}

export interface FilterState {
  search?: string
  q?: string
  opportunity_type?: string[] | string
  work_arrangement?: string[] | string
  is_paid?: boolean | null
  trust_status?: string[] | string
  experience_level?: string[] | string
  page?: number
  limit?: number
  offset?: number
}

export interface ApiError {
  detail: string
  status?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  role: 'student' | 'employer'
  company_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
