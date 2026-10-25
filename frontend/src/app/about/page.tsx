import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Github,
  Code,
  Users,
  Sparkles,
  Lock,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-champagne/10 border border-champagne/30 text-xs font-semibold text-champagne mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Hacktoberfest 2026 Submission</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">About Campus to Career</h1>
        <p className="mt-4 text-secondary-text text-base leading-relaxed">
          From Skills to Opportunities. An open-source, student-first platform designed to bridge early-career talent with verified opportunities while protecting students from fraudulent internships and fee extortion.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="space-y-12">
        <section className="p-8 rounded-2xl bg-navy-elevated border border-border">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-secondary-text text-sm leading-relaxed">
            Every year, millions of students search for internships, freelance projects, and their first entry-level jobs. Unfortunately, bad actors exploit student ambition through bogus listings requesting upfront registration fees, security deposits, or sensitive identity documents like Aadhaar, PAN cards, and banking details.
          </p>
          <p className="text-secondary-text text-sm leading-relaxed mt-4">
            <span className="text-primary-text font-semibold">Campus to Career</span> is built to serve students from any college, university, or background worldwide. We empower candidates to match opportunities based purely on their demonstrable skills, inspect any listing with explainable AI-assisted trust verification, and generate ATS-tailored resumes that never fabricate qualifications.
          </p>
        </section>

        {/* AI & Security Architecture */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <div className="w-10 h-10 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-3">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Open-Weight AI (Llama 3.2)</h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              We leverage Meta&apos;s open-weight <code className="text-emerald">llama3.2:1b</code> model running locally via Ollama. No mandatory paid API keys, no credit cards, and a verified deterministic rule fallback when local inference runtimes are offline.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <div className="w-10 h-10 rounded-lg bg-danger-red/10 border border-danger-red/20 flex items-center justify-center text-danger-red mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deterministic Security Guardrails</h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              Security-critical operations do not rely solely on language models. We enforce strict Server-Side Request Forgery (SSRF) defenses, blocking private subnets, cloud metadata (169.254.x), and unsafe schemes.
            </p>
          </div>
        </section>

        {/* Four-Person Team Workflow */}
        <section className="p-8 rounded-2xl bg-navy-elevated border border-border">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-champagne" /> Four-Person Engineering Collaboration
          </h2>
          <p className="text-secondary-text text-sm mb-6 leading-relaxed">
            Campus to Career was architected for modular parallel development across four engineering roles using GitHub Desktop:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-navy-secondary border border-border">
              <div className="font-bold text-emerald mb-1">Teammate 1 — Frontend & UX</div>
              <div className="text-secondary-text">Design system, accessible components, responsive layouts, and user journeys.</div>
            </div>
            <div className="p-4 rounded-lg bg-navy-secondary border border-border">
              <div className="font-bold text-champagne mb-1">Teammate 2 — Backend & Database</div>
              <div className="text-secondary-text">FastAPI routers, SQLite/PostgreSQL schema, JWT auth, and role-based permissions.</div>
            </div>
            <div className="p-4 rounded-lg bg-navy-secondary border border-border">
              <div className="font-bold text-emerald mb-1">Teammate 3 — AI & TrustCheck</div>
              <div className="text-secondary-text">Deterministic risk scorer, Ollama REST client, SSRF defenses, and explainable evidence.</div>
            </div>
            <div className="p-4 rounded-lg bg-navy-secondary border border-border">
              <div className="font-bold text-champagne mb-1">Teammate 4 — Resume Tailor & Integration</div>
              <div className="text-secondary-text">Document text extraction, gap analysis, ReportLab ATS PDF generation, and test suites.</div>
            </div>
          </div>
        </section>

        {/* Open Source & Links */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-navy-elevated to-navy-secondary border border-border text-center">
          <h2 className="text-2xl font-bold mb-2">Open-Source & Community</h2>
          <p className="text-secondary-text text-xs max-w-xl mx-auto mb-6">
            Released under the permissive MIT License. Contributions, bug reports, and pull requests are welcomed via our documented Git workflow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/marketplace">
              <Button className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
                Explore Marketplace <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/trustcheck">
              <Button variant="outline" className="border-border">
                Scan Internship Safety
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
