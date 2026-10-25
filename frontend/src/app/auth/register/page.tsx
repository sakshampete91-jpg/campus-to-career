'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, User, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  const [role, setRole] = useState<'student' | 'employer'>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!fullName || !email || !password) {
      setLocalError('Please fill out all required fields.')
      return
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.')
      return
    }

    if (role === 'employer' && !companyName) {
      setLocalError('Please enter your company or organization name.')
      return
    }

    try {
      await registerUser({
        full_name: fullName,
        email,
        password,
        role,
        company_name: role === 'employer' ? companyName : undefined,
      })

      if (role === 'student') {
        router.push('/onboarding')
      } else {
        router.push('/employer/dashboard')
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') {
        setLocalError(detail)
      } else if (Array.isArray(detail)) {
        setLocalError(detail.map((d: any) => d.msg || JSON.stringify(d)).join(', '))
      } else if (detail && typeof detail === 'object') {
        setLocalError(detail.msg || JSON.stringify(detail))
      } else {
        setLocalError('Registration failed. Email may already be in use.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-navy-elevated p-8 rounded-2xl border border-border shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-xs font-semibold text-emerald mb-3">
            Open Access Active
          </div>
          <h2 className="text-3xl font-extrabold text-primary-text tracking-tight">Create an Account</h2>
          <p className="mt-2 text-sm text-secondary-text">
            Join <span className="text-emerald font-semibold">Campus to Career</span>, or enter directly without registration:
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Link href="/dashboard">
              <Button size="sm" className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
                Enter as Student
              </Button>
            </Link>
            <Link href="/employer/dashboard">
              <Button size="sm" variant="outline" className="border-border">
                Enter as Employer
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-navy-secondary border border-border">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              role === 'student'
                ? 'bg-emerald text-navy shadow'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <User className="w-4 h-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              role === 'employer'
                ? 'bg-champagne text-navy shadow'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Employer
          </button>
        </div>

        {(localError || error) && (
          <div className="p-3 rounded-lg bg-danger-red/10 border border-danger-red/30 flex items-center gap-2 text-danger-red text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{typeof (localError || error) === 'string' ? (localError || error) : 'Registration failed.'}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Morgan"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
          />

          {role === 'employer' && (
            <Input
              label="Company / Organization Name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Innovations"
            />
          )}

          <Input
            label="Password (min 8 characters)"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-emerald text-navy font-semibold hover:bg-emerald/90"
          >
            {isLoading ? 'Creating Account...' : 'Get Started'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-sm text-secondary-text">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-emerald hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
