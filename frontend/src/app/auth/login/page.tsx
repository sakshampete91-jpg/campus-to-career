'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Building,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { initDemoSession } = useAuthStore()
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  const handleInstantEnter = async (role: 'student' | 'employer') => {
    setLoadingRole(role)
    try {
      await initDemoSession(role)
      if (role === 'employer') {
        router.push('/employer/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch {
      router.push(role === 'employer' ? '/employer/dashboard' : '/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-navy-elevated p-8 rounded-2xl border border-border shadow-2xl text-center">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-xs font-semibold text-emerald mb-3">
            <Sparkles className="w-4 h-4" /> Zero-Login Open Access Active
          </div>
          <h2 className="text-3xl font-extrabold text-primary-text tracking-tight">
            Explore Campus to Career
          </h2>
          <p className="mt-2 text-sm text-secondary-text leading-relaxed">
            No registration, passwords, or credit cards required. Choose a role below to jump right into the full platform experience.
          </p>
        </div>

        {/* 1-Click Instant Enter Cards */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => handleInstantEnter('student')}
            disabled={loadingRole !== null}
            className="w-full p-5 rounded-xl bg-gradient-to-r from-emerald/15 to-navy-secondary border border-emerald/40 hover:border-emerald text-left transition-all group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-base text-primary-text flex items-center gap-2">
                  Enter as Student <span className="text-xs px-2 py-0.5 rounded bg-emerald/20 text-emerald">Alex Rivera</span>
                </div>
                <div className="text-xs text-secondary-text mt-0.5">
                  Browse opportunities, tailor resumes, verify trust scores, track jobs
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleInstantEnter('employer')}
            disabled={loadingRole !== null}
            className="w-full p-5 rounded-xl bg-gradient-to-r from-champagne/10 to-navy-secondary border border-champagne/30 hover:border-champagne text-left transition-all group shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-base text-primary-text flex items-center gap-2">
                  Enter as Employer <span className="text-xs px-2 py-0.5 rounded bg-champagne/20 text-champagne">TechNova Labs</span>
                </div>
                <div className="text-xs text-secondary-text mt-0.5">
                  Manage candidate listings, inspect applicant matches, post roles
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-champagne group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick feature links */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-secondary-text mb-3">Or explore flagship tools directly without entering a dashboard:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/marketplace"
              className="p-2.5 rounded-lg bg-navy-secondary border border-border text-secondary-text hover:text-primary-text hover:border-emerald/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald" /> Opportunities
            </Link>
            <Link
              href="/trustcheck"
              className="p-2.5 rounded-lg bg-navy-secondary border border-border text-secondary-text hover:text-primary-text hover:border-emerald/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald" /> TrustCheck
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
