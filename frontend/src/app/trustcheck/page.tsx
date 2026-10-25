'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle,
  FileSearch,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { trustcheckApi } from '@/lib/api'
import { TrustCheckReport } from '@/types'
import { RiskScoreCircle } from '@/components/ui/RiskScoreCircle'

export default function TrustCheckScannerPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [knownWebsite, setKnownWebsite] = useState('')
  const [listingText, setListingText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<TrustCheckReport | null>(null)
  const [error, setError] = useState('')

  // Synthetic Test Case Quick-Fillers
  const loadScenario = (scenario: 'scam_fee' | 'scam_docs' | 'legit') => {
    setError('')
    setReport(null)
    if (scenario === 'scam_fee') {
      setUrl('https://internships-fasttrack.example/apply/tech2026')
      setCompanyName('Global Career Accelerators Ltd')
      setKnownWebsite('https://legitglobal.example')
      setListingText(
        'Exciting 3-month Software Development Internship with guaranteed placement! To secure your seat in the training cohort, a mandatory registration deposit of ₹3,500 is required upon initial screening. High stipend promised after training.'
      )
    } else if (scenario === 'scam_docs') {
      setUrl('https://quick-onboard-careers.example/intake')
      setCompanyName('Express Talent Network')
      setKnownWebsite('https://expresstalent.example')
      setListingText(
        'Immediate opening for Junior Operations Associate. Send your original Aadhaar card copy, PAN card, and bank account number to careers-hr@gmail.com within 24 hours to receive your appointment letter. Urgent vacancy!'
      )
    } else {
      setUrl('https://careers.cloudworks.example/jobs/se-intern')
      setCompanyName('CloudWorks Technologies')
      setKnownWebsite('https://careers.cloudworks.example')
      setListingText(
        'CloudWorks is seeking a motivated Junior Backend Engineer. Responsibilities include writing REST APIs in Python and writing unit tests. This is a paid 3-month remote internship with a monthly stipend of ₹20,000. No fees of any kind are charged.'
      )
    }
  }

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!url.trim()) {
      setError('Please provide an internship or application URL to scan.')
      return
    }

    setIsLoading(true)
    try {
      const result = await trustcheckApi.scan({
        url: url.trim(),
        company_name: companyName.trim(),
        known_official_website: knownWebsite.trim(),
        listing_text: listingText.trim(),
      })
      setReport(result)
    } catch (err: any) {
      console.error('TrustCheck scan failed', err)
      setError(err.response?.data?.detail || 'Scan failed. Please check the URL format and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger-red/10 border border-danger-red/30 text-xs font-semibold text-danger-red mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Flagship Fraud-Risk Inspection System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Internship TrustCheck Scanner
        </h1>
        <p className="mt-3 text-secondary-text text-sm sm:text-base leading-relaxed">
          Verify before you apply. Combines 10 deterministic security rules (SSRF mitigation, domain comparison, keyword detection) with open-weight language inference via Llama 3.2.
        </p>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="mb-8 p-4 rounded-xl bg-navy-elevated border border-border">
        <div className="text-xs font-semibold text-champagne mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Try Demo Synthetic Scenarios:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadScenario('scam_fee')}
            className="px-3 py-1.5 rounded-lg bg-danger-red/10 border border-danger-red/30 text-danger-red text-xs hover:bg-danger-red/20 transition-colors"
          >
            Scenario 1: Registration Fee Extortion
          </button>
          <button
            type="button"
            onClick={() => loadScenario('scam_docs')}
            className="px-3 py-1.5 rounded-lg bg-warning-amber/10 border border-warning-amber/30 text-warning-amber text-xs hover:bg-warning-amber/20 transition-colors"
          >
            Scenario 2: Aadhaar & Bank Details Request
          </button>
          <button
            type="button"
            onClick={() => loadScenario('legit')}
            className="px-3 py-1.5 rounded-lg bg-emerald/10 border border-emerald/30 text-emerald text-xs hover:bg-emerald/20 transition-colors"
          >
            Scenario 3: Legitimate Verified Role
          </button>
        </div>
      </div>

      {/* Scan Input Form */}
      <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-2xl mb-12">
        <form onSubmit={handleScan} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Internship / Application URL *"
              type="text"
              required
              placeholder="https://example-careers.com/apply/intern"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Input
              label="Claimed Company Name"
              type="text"
              placeholder="e.g. Apex Innovations Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <Input
            label="Known Official Company Website (For Domain Verification)"
            type="text"
            placeholder="https://apexinnovations.example"
            value={knownWebsite}
            onChange={(e) => setKnownWebsite(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-secondary-text mb-1.5">
              Pasted Listing Text or Email Description (Recommended for full signal detection)
            </label>
            <textarea
              rows={4}
              placeholder="Paste the full job description, WhatsApp message, or email here..."
              value={listingText}
              onChange={(e) => setListingText(e.target.value)}
              className="w-full bg-navy-secondary border border-border rounded-lg p-3 text-sm text-primary-text focus:outline-none focus:border-emerald font-sans"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger-red/10 border border-danger-red/30 flex items-center gap-2 text-danger-red text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Safety Disclaimer */}
          <div className="p-3.5 rounded-lg bg-navy-secondary/60 border border-border text-xs text-secondary-text leading-relaxed">
            <div className="font-semibold text-primary-text mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald" /> Security & Privacy Guardrails
            </div>
            URLs pointing to private IP subnets, AWS metadata endpoints (169.254.x), or unsafe schemes (javascript:) are blocked by design. TrustCheck provides a provisional assessment, not financial or legal counsel.
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full py-3.5 bg-emerald text-navy font-semibold hover:bg-emerald/90 text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-navy border-t-transparent" />
                Analyzing Signals & Running Verification...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FileSearch className="w-5 h-5" />
                Analyze Opportunity Safety
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* RESULT REPORT SECTION */}
      {report && (
        <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-2xl space-y-8 animate-fadeIn">
          {/* Header row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-5">
              <RiskScoreCircle score={report.risk_score} size={100} strokeWidth={9} />
              <div>
                <div className="text-2xl font-black">
                  Risk Score: {report.risk_score} / 100
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      report.risk_category === 'lower_risk'
                        ? 'success'
                        : report.risk_category === 'some_warning_signs'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {report.risk_label}
                  </Badge>
                  <span className="text-xs text-secondary-text">
                    Scanned at {new Date(report.scanned_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-secondary-text">AI Inference Engine:</div>
              <Badge variant="outline" className="border-champagne/40 text-champagne text-xs mt-1">
                {report.ai_available ? 'Ollama Llama 3.2 (Active)' : 'Deterministic Rules Mode'}
              </Badge>
            </div>
          </div>

          {/* Observed Signals List */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-champagne" /> Signal Breakdown & Evidence
            </h3>

            <div className="space-y-3">
              {report.signals.map((sig) => (
                <div
                  key={sig.signal_name}
                  className={`p-4 rounded-xl border transition-colors ${
                    sig.detected
                      ? 'bg-danger-red/10 border-danger-red/40'
                      : 'bg-navy-secondary/40 border-border/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize flex items-center gap-2">
                      {sig.detected ? (
                        <AlertTriangle className="w-4 h-4 text-danger-red" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald" />
                      )}
                      {sig.signal_name.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-secondary-text">
                      Weight: +{sig.weight}
                    </span>
                  </div>

                  <p className="text-xs text-secondary-text mt-1.5">{sig.explanation}</p>

                  {sig.evidence && (
                    <div className="mt-2 text-xs font-mono p-2 rounded bg-navy border border-border/80 text-primary-text">
                      Evidence: {sig.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Box */}
          {report.ai_analysis && (
            <div className="p-5 rounded-xl bg-navy-secondary border border-champagne/30">
              <h4 className="text-xs font-semibold text-champagne mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Contextual AI Interpretation:
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">{report.ai_analysis}</p>
            </div>
          )}

          {/* Action Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="p-6 rounded-xl bg-navy-secondary/60 border border-border">
              <h4 className="font-bold text-sm mb-3 text-emerald">Recommended Next Steps:</h4>
              <ul className="space-y-2 text-xs text-secondary-text">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-[11px] text-secondary-text/80 italic border-t border-border pt-4">
            {report.disclaimer}
          </div>
        </div>
      )}
    </div>
  )
}
