import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-xs font-semibold text-emerald mb-3">
            <Shield className="w-3.5 h-3.5" /> Privacy First
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-secondary-text text-sm">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-secondary-text leading-relaxed">
          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">1. Student Data Protection</h2>
            <p>
              Campus to Career is built with student safety at its core. We do not sell your personal data to third-party recruiters, advertisers, or lead generators. Your master resume and contact information are only shared with opportunities you actively choose to apply to.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">2. Local & Open-Weight AI Processing</h2>
            <p>
              Internship fraud risk scoring and resume tailoring operate via open-weight inference. Listing URLs analyzed through TrustCheck are evaluated through deterministic security filters and sanitized text extraction without retaining personally identifiable submission logs.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">3. Account Rights & Deletion</h2>
            <p>
              You maintain full ownership of your profile, projects, and application logs. You may update or delete your profile information at any time directly through your account preferences.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
