'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, AlertTriangle, CheckCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { RiskScoreCircle } from '@/components/ui/RiskScoreCircle'
import { trustcheckApi } from '@/lib/api'
import { TrustCheckReport } from '@/types'

export default function TrustCheckReportPage() {
  const params = useParams()
  const router = useRouter()
  const scanId = params?.scanId as string

  const [report, setReport] = useState<TrustCheckReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (scanId) {
      loadReport()
    }
  }, [scanId])

  const loadReport = async () => {
    try {
      const data = await trustcheckApi.getScan(scanId)
      setReport(data)
    } catch (err) {
      console.error('Failed to load scan report', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-navy pt-32 text-center text-secondary-text">Loading report...</div>
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-navy pt-32 text-center text-secondary-text">
        <h2 className="text-xl font-bold">Report not found</h2>
        <Button onClick={() => router.push('/trustcheck')} className="mt-4">
          Return to Scanner
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link href="/trustcheck" className="inline-flex items-center gap-1.5 text-xs text-secondary-text hover:text-emerald mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
      </Link>

      <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="flex items-center gap-5">
            <RiskScoreCircle score={report.risk_score} size={100} strokeWidth={9} />
            <div>
              <div className="text-2xl font-black">Risk Score: {report.risk_score} / 100</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={report.risk_score >= 50 ? 'danger' : 'success'}>
                  {report.risk_label}
                </Badge>
                <span className="text-xs text-secondary-text">
                  URL: {report.url}
                </span>
              </div>
            </div>
          </div>

          <Link href="/trustcheck">
            <Button variant="outline" className="border-border text-xs">
              Scan Another Listing
            </Button>
          </Link>
        </div>

        {/* Signals */}
        <div>
          <h3 className="text-lg font-bold mb-4">Detected Signals</h3>
          <div className="space-y-3">
            {report.signals.map((sig) => (
              <div key={sig.signal_name} className="p-4 rounded-xl bg-navy-secondary/60 border border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm capitalize">{sig.signal_name.replace(/_/g, ' ')}</span>
                  <span className="text-xs text-secondary-text">Weight: +{sig.weight}</span>
                </div>
                <p className="text-xs text-secondary-text mt-1">{sig.explanation}</p>
                {sig.evidence && (
                  <div className="mt-2 text-xs font-mono p-2 rounded bg-navy text-primary-text">
                    {sig.evidence}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 rounded-xl bg-navy-secondary border border-border">
          <h4 className="font-bold text-sm mb-3 text-emerald">Recommendations</h4>
          <ul className="space-y-2 text-xs text-secondary-text">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
