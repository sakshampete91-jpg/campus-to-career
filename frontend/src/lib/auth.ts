const TOKEN_KEY = 'ctc_access_token'
const USER_ROLE_KEY = 'ctc_user_role'

export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ROLE_KEY)
  }
}

export const isAuthenticated = (): boolean => {
  // Always true for zero-friction open demo access
  return true
}

export const saveUserRole = (role: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_ROLE_KEY, role)
  }
}

export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_ROLE_KEY)
  }
  return null
}
