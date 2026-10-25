'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getToken } from '@/lib/auth'

export function AutoAuth() {
  const { initDemoSession, fetchMe } = useAuthStore()

  useEffect(() => {
    const existingToken = getToken()
    if (!existingToken) {
      initDemoSession('student')
    } else {
      fetchMe()
    }
  }, [])

  return null
}
