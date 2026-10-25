'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  ShieldCheck,
  FileText,
  Bookmark,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { opportunitiesApi, applicationsApi } from '@/lib/api'
import { Opportunity } from '@/types'

export default function StudentDashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [applicationsCount, setApplicationsCount] = useState({ saved: 2, applied: 1, interviewing: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMe()
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const opps: any = await opportunitiesApi.list({ limit: 3 })
      setOpportunities(Array.isArray(opps) ? opps : opps?.items || [])
    } catch (err) {
      console.error('Failed to load opportunities for dashboard', err)
    } finally {
      setIsLoading(false)
    }
  }

  const studentSkills = user?.skills?.map((s) => (typeof s === 'string' ? s : s.name)) || ['Python', 'SQL', 'React']

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. WELCOME BANNER */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-navy-elevated to-navy-secondary border border-border shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-xs font-semibold text-emerald mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Alex'}!
          </h1>
          <p className="mt-2 text-secondary-text text-sm max-w-xl">
            You have <span className="text-emerald font-semibold">{studentSkills.length} verified skills</span> in your profile. We found matching entry roles and internships ready for review.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/marketplace">
            <Button className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/trustcheck">
            <Button variant="outline" className="border-border">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald" />
              Scan a Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-navy-elevated border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Saved Roles</span>
            <Bookmark className="w-4 h-4 text-champagne" />
          </div>
          <div className="text-2xl font-bold mt-2">{applicationsCount.saved}</div>
          <div className="text-xs text-secondary-text mt-1">Ready to review</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-elevated border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Applications</span>
            <Briefcase className="w-4 h-4 text-emerald" />
          </div>
          <div className="text-2xl font-bold mt-2">{applicationsCount.applied}</div>
          <div className="text-xs text-emerald mt-1">Under review</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-elevated border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Trust Checks</span>
            <ShieldCheck className="w-4 h-4 text-emerald" />
          </div>
          <div className="text-2xl font-bold mt-2">100%</div>
          <div className="text-xs text-secondary-text mt-1">Verified safe</div>
        </div>

        <div className="p-5 rounded-xl bg-navy-elevated border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Tailored Resumes</span>
            <FileText className="w-4 h-4 text-champagne" />
          </div>
          <div className="text-2xl font-bold mt-2">2</div>
          <div className="text-xs text-secondary-text mt-1">PDFs generated</div>
        </div>
      </div>

      {/* 3. MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Recommended Matches (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald" /> High Skill Matches
            </h2>
            <Link href="/marketplace" className="text-xs text-emerald hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{opp.title}</h3>
                    <Badge variant={opp.trust_status === 'verified' ? 'success' : 'default'}>
                      {opp.trust_status}
                    </Badge>
                  </div>
                  <div className="text-sm text-secondary-text mt-0.5">
                    {opp.company_name} • <span className="capitalize">{opp.work_arrangement}</span> • {opp.compensation || 'Stipend available'}
                  </div>

                  {/* Skills required */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {opp.required_skills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-navy-secondary border border-border text-xs text-secondary-text"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/marketplace/${opp.id}`}>
                    <Button variant="outline" size="sm" className="border-border">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/resume?role=${encodeURIComponent(opp.title)}`}>
                    <Button size="sm" className="bg-emerald text-navy font-semibold">
                      Tailor Resume
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Quick Action Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick TrustCheck widget */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald" /> Fast TrustCheck
            </h3>
            <p className="text-xs text-secondary-text mt-2 leading-relaxed">
              Found an opportunity on social media or an external job board? Check if it asks for fees or deposits.
            </p>
            <Link href="/trustcheck" className="block mt-4">
              <Button className="w-full bg-navy-secondary border border-border text-primary-text hover:bg-navy-secondary/80 text-xs">
                Open TrustCheck Scanner
              </Button>
            </Link>
          </div>

          {/* Master Resume Status */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h3 className="font-bold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-champagne" /> Resume Workspace
            </h3>
            <p className="text-xs text-secondary-text mt-2 leading-relaxed">
              Generate role-specific ATS PDFs highlighting your projects. Zero fabricated claims guaranteed.
            </p>
            <Link href="/resume" className="block mt-4">
              <Button className="w-full bg-champagne text-navy font-semibold hover:bg-champagne/90 text-xs">
                Tailor Master Resume
              </Button>
            </Link>
          </div>

          {/* Profile Skill Pills */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h3 className="font-bold text-base mb-3">Your Profile Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {studentSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-emerald/10 border border-emerald/20 text-xs text-emerald font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
            <Link href="/profile" className="block mt-4 text-xs text-emerald hover:underline">
              Edit Skills & Preferences →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
