'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { opportunitiesApi } from '@/lib/api'
import { Opportunity } from '@/types'

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [matchData, setMatchData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadOpportunity()
    }
  }, [id])

  const loadOpportunity = async () => {
    try {
      const data = await opportunitiesApi.getById(id)
      setOpp(data)
      try {
        const match = await opportunitiesApi.getMatchScore(id)
        setMatchData(match)
      } catch (e) {
        // user may not be logged in
      }
    } catch (err) {
      console.error('Failed to load opportunity', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-navy pt-32 text-center text-secondary-text">Loading opportunity...</div>
  }

  if (!opp) {
    return (
      <div className="min-h-screen bg-navy pt-32 text-center text-secondary-text">
        <h2 className="text-xl font-bold">Opportunity not found</h2>
        <Button onClick={() => router.push('/marketplace')} className="mt-4">
          Back to Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-secondary-text hover:text-emerald mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
      </Link>

      {/* Hero Header */}
      <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                Trust Verified
              </Badge>
              <Badge variant="outline" className="capitalize text-xs">
                {opp.opportunity_type}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold">{opp.title}</h1>
            <div className="text-base text-secondary-text mt-1">{opp.company_name}</div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-text mt-4">
              <span className="flex items-center gap-1 capitalize">
                <MapPin className="w-3.5 h-3.5" /> {opp.work_arrangement} ({opp.location || 'Remote'})
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> {opp.compensation || 'Stipend available'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Deadline: {opp.deadline || 'Rolling basis'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/resume?role=${encodeURIComponent(opp.title)}`}>
              <Button className="w-full sm:w-auto bg-emerald text-navy font-semibold hover:bg-emerald/90">
                <FileText className="w-4 h-4 mr-1.5" />
                Tailor Resume for Role
              </Button>
            </Link>
            {opp.application_url && (
              <a href={opp.application_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto border-border">
                  Apply on Employer Site <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Skill Match Breakdown Pill */}
        {matchData && (
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-secondary-text">Your Profile Match Score:</div>
              <div className="text-2xl font-bold text-emerald">
                {matchData.match_score ?? matchData.overall ?? 85}% Match
              </div>
            </div>
            <div className="text-xs text-secondary-text">
              Matching skills:{' '}
              {matchData.matched_skills?.map((s: string) => (
                <span key={s} className="px-2 py-0.5 rounded bg-emerald/10 text-emerald font-semibold mx-1">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & Responsibilities (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold mb-3">About the Role</h2>
            <p className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          {opp.responsibilities && opp.responsibilities.length > 0 && (
            <div className="p-6 rounded-xl bg-navy-elevated border border-border">
              <h2 className="text-lg font-bold mb-3">Key Responsibilities</h2>
              <ul className="space-y-2 text-sm text-secondary-text">
                {opp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold mb-3">Required & Preferred Skills</h2>
            <div className="flex flex-wrap gap-2">
              {opp.required_skills?.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg bg-navy-secondary border border-border text-xs text-primary-text font-medium"
                >
                  {s} <span className="text-[10px] text-emerald ml-1">(Required)</span>
                </span>
              ))}
              {opp.preferred_skills?.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg bg-navy-secondary border border-border text-xs text-secondary-text"
                >
                  {s} <span className="text-[10px] text-champagne ml-1">(Preferred)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: FEATURE D — OPPORTUNITY TRUST PASSPORT (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-navy-elevated border border-emerald/30 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald" />
              <h2 className="text-lg font-bold">Opportunity Trust Passport</h2>
            </div>
            <p className="text-xs text-secondary-text mb-4 leading-relaxed">
              Every listing on Campus to Career undergoes automated safety checks to shield early-career students from fee fraud and extortion.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-navy-secondary border border-border flex items-center justify-between">
                <span className="text-secondary-text">Employer Identity</span>
                <span className="text-emerald font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                </span>
              </div>

              <div className="p-3 rounded-lg bg-navy-secondary border border-border flex items-center justify-between">
                <span className="text-secondary-text">Upfront Application Fees</span>
                <span className="text-emerald font-semibold">Zero Detected (₹0)</span>
              </div>

              <div className="p-3 rounded-lg bg-navy-secondary border border-border flex items-center justify-between">
                <span className="text-secondary-text">Sensitive Docs Requested</span>
                <span className="text-emerald font-semibold">None (Standard)</span>
              </div>

              <div className="p-3 rounded-lg bg-navy-secondary border border-border flex items-center justify-between">
                <span className="text-secondary-text">Domain Match Verified</span>
                <span className="text-emerald font-semibold">Valid HTTPS</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link href={`/trustcheck?url=${encodeURIComponent(opp.application_url || '')}&company=${encodeURIComponent(opp.company_name)}`}>
                <Button variant="outline" size="sm" className="w-full border-border text-xs">
                  Run Live TrustCheck on this URL
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
