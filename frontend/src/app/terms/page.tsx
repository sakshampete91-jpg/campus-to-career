import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-xs font-semibold text-champagne mb-3">
            <FileText className="w-3.5 h-3.5" /> Open Source License
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-secondary-text text-sm">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-secondary-text leading-relaxed">
          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">1. Permissive Open-Source Terms</h2>
            <p>
              Campus to Career is released under the MIT Open Source License. The software is provided as-is, without warranties of any kind, express or implied.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">2. TrustCheck Advisory Notice</h2>
            <p>
              Internship TrustCheck is an automated heuristic and AI-assisted screening tool intended to identify potential fraud signals (such as upfront fees or domain anomalies). Scores and warnings represent risk signals, not formal legal or fraud verdicts. Students should always independently verify employer credentials before making financial or career commitments.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-navy-elevated border border-border">
            <h2 className="text-lg font-bold text-primary-text mb-2">3. Employer Conduct & Zero-Fee Guarantee</h2>
            <p>
              Employers posting listings on Campus to Career are strictly prohibited from demanding application fees, training deposits, or purchasing requirements from students. Violating listings are subject to immediate removal.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
