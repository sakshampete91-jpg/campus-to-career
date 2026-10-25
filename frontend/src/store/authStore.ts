import { create } from 'zustand'
import { authApi } from '@/lib/api'
import { saveToken, removeToken, saveUserRole } from '@/lib/auth'
import type { User, AuthCredentials, RegisterData } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (credentials: AuthCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
  initDemoSession: (role?: string) => Promise<void>
  clearError: () => void
}

const DEFAULT_DEMO_USER: User = {
  id: 'b8206a42-8a17-45b5-aeaf-19da5a8de3e9',
  email: 'student1@demo.campustocareer.example',
  full_name: 'Jamie Chen',
  role: 'student',
  headline: 'Computer Science Student & Full-Stack Developer',
  skills: [
    { name: 'Python', proficiency: 'advanced' },
    { name: 'React', proficiency: 'intermediate' },
    { name: 'TypeScript', proficiency: 'intermediate' },
    { name: 'SQL', proficiency: 'intermediate' },
    { name: 'FastAPI', proficiency: 'intermediate' },
    { name: 'Git', proficiency: 'advanced' },
  ],
  education: [
    {
      institution: 'University Engineering Department',
      degree: 'B.S. in Computer Science',
      graduation_year: 2026,
    },
  ],
  projects: [
    {
      title: 'Real-Time Chat Application',
      description: 'Built WebSocket-based chat system with Next.js and Redis.',
      tech_stack: ['Next.js', 'Redis', 'WebSockets'],
    },
  ],
  work_type_preference: ['remote', 'hybrid'],
  opportunity_type_preference: ['internship', 'entry_level'],
  is_active: true,
  created_at: new Date().toISOString(),
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item: any) => {
        if (typeof item === 'string') return item
        return item?.msg || item?.message || JSON.stringify(item)
      })
      .join(', ')
  }
  if (detail && typeof detail === 'object') {
    return (detail as any).msg || (detail as any).message || JSON.stringify(detail)
  }
  return fallback
}

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_DEMO_USER,
  token: 'ctc_demo_session_token',
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const data = await authApi.login(credentials)
      saveToken(data.access_token)
      saveUserRole(data.user.role)
      set({ user: data.user, token: data.access_token, isLoading: false })
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Login failed. Please check your credentials.')
      set({ error: message, isLoading: false })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.register(data)
      saveToken(response.access_token)
      saveUserRole(response.user.role)
      set({ user: response.user, token: response.access_token, isLoading: false })
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Registration failed. Please try again.')
      set({ error: message, isLoading: false })
      throw err
    }
  },

  logout: () => {
    removeToken()
    set({ user: DEFAULT_DEMO_USER, token: null })
  },

  fetchMe: async () => {
    try {
      const user = await authApi.getMe()
      if (user) {
        set({ user, isLoading: false })
        return
      }
    } catch {
      // Retain default demo user
    }
    set({ user: DEFAULT_DEMO_USER, isLoading: false })
  },

  initDemoSession: async (role: string = 'student') => {
    set({ isLoading: true })
    try {
      const data = await authApi.getDemoSession(role)
      saveToken(data.access_token)
      saveUserRole(data.user.role)
      set({ user: data.user, token: data.access_token, isLoading: false })
    } catch {
      set({ user: DEFAULT_DEMO_USER, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
