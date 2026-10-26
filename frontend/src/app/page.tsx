'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Search,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Lock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { RiskScoreCircle } from '@/components/ui/RiskScoreCircle'

const FEATURED_SKILLS = [
  'Python',
  'Next.js',
  'React',
  'SQL',
  'UI/UX Design',
  'Machine Learning',
  'Docker',
  'TypeScript',
  'FastAPI',
]

export default function HomePage() {
  const [activeTrustSignal, setActiveTrustSignal] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-navy text-primary-text flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-secondary border border-border text-xs sm:text-sm text-champagne mb-8">
          <Sparkles className="w-4 h-4 text-champagne" />
          <span>Hacktoberfest 2026 Open-Source AI Project</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Turn Your Skills Into Verified{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-champagne">
            Career Opportunities
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-secondary-text max-w-2xl leading-relaxed">
          From Skills to Opportunities. Discover verified student roles, scan listings for upfront fee fraud with
          open-weight AI, and generate ATS-ready tailored resumes without fabricated claims.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/marketplace">
            <Button size="lg" className="px-8 py-3.5 bg-emerald text-navy font-semibold hover:bg-emerald/90">
              Find Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Link href="/trustcheck">
            <Button variant="outline" size="lg" className="px-8 py-3.5 border-border hover:bg-navy-secondary">
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald" />
              Check Internship Safety
            </Button>
          </Link>
        </div>

        {/* Floating Skill Chips */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 max-w-3xl">
          {FEATURED_SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-full bg-navy-elevated border border-border text-xs font-medium text-secondary-text hover:border-champagne/40 hover:text-champagne transition-colors"
            >
              #{skill}
            </span>
          ))}
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-border bg-navy-elevated/50 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald">100% Free</div>
            <div className="text-xs sm:text-sm text-secondary-text mt-1">Open Source Platform</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-champagne">Gemma 2:2B</div>
            <div className="text-xs sm:text-sm text-secondary-text mt-1">Google Open-Weight AI (Ollama)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-text">10 Signals</div>
            <div className="text-xs sm:text-sm text-secondary-text mt-1">Deterministic Fraud Detection</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald">ATS-Ready</div>
            <div className="text-xs sm:text-sm text-secondary-text mt-1">Truth-Preserving PDF Resumes</div>
          </div>
        </div>
      </section>

      {/* 3. SIX CORE FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Comprehensive Career Technology</h2>
          <p className="mt-4 text-secondary-text max-w-xl mx-auto">
            Engineered to empower any student—regardless of background or institution—with verifiable safety and true skill matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Skill-Based Discovery</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Transparent skill matching score. Search internships and entry roles that match your existing projects and coursework.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-danger-red/10 border border-danger-red/20 flex items-center justify-center text-danger-red mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Internship TrustCheck</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Scan listing URLs and descriptions for upfront registration fees, document extortion, and spoofed domains.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">AI Resume Tailor</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Upload one master resume. Generate ATS-optimized role-specific resumes. Guaranteed zero invented credentials.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Opportunity Trust Passport</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Every marketplace opportunity includes a transparent safety passport detailing verification status and observed indicators.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Application Tracker</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Track status from Saved to Interview and Selection. Keep linked TrustCheck reports and tailored resumes in one place.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Employer Recruitment</h3>
            <p className="mt-2 text-sm text-secondary-text leading-relaxed">
              Verified employer accounts can post opportunities, review matching candidate profiles, and manage applicants directly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TRUSTCHECK PREVIEW (FLAGSHIP DEMO) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-navy-elevated/40 border border-border rounded-2xl my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-red/10 border border-danger-red/30 text-xs font-semibold text-danger-red mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              Flagship Safety Feature
            </div>
            <h2 className="text-3xl font-bold">Explainable Risk Detection</h2>
            <p className="mt-4 text-secondary-text text-sm sm:text-base leading-relaxed">
              Campus to Career checks 10 deterministic security rules combined with open-weight language inference. We never give a vague rating—we show exactly what triggered the warning.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <span className="text-sm text-secondary-text">SSRF protection blocks internal/reserved cloud metadata IPs.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <span className="text-sm text-secondary-text">Scans for upfront fee extortion and registration charges.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                <span className="text-sm text-secondary-text">Flags domain spoofing and suspicious personal email contacts.</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/trustcheck">
                <Button className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
                  Scan Any Listing URL Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Report Mock Card */}
          <div className="lg:col-span-7 bg-navy border border-border rounded-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <RiskScoreCircle score={78} size={90} strokeWidth={8} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">78 / 100</span>
                    <Badge variant="danger">Very High Risk Indicators</Badge>
                  </div>
                  <div className="text-xs text-secondary-text mt-1 font-mono">
                    Scanned: quickhire-interns-portal.example
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-champagne/40 text-champagne text-xs">
                Deterministic + Gemma 2 (Ollama)
              </Badge>
            </div>

            {/* Signals List */}
            <div className="mt-6 space-y-3">
              <div className="p-3.5 rounded-lg bg-navy-secondary/60 border border-border text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-danger-red">
                    <AlertTriangle className="w-4 h-4" />
                    Upfront Fee Requested (+30)
                  </div>
                  <span className="text-xs font-mono text-secondary-text">Weight 30</span>
                </div>
                <p className="text-xs text-secondary-text mt-1">
                  &ldquo;A refundable security deposit of ₹3,000 is required upon accepting the offer.&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-navy-secondary/60 border border-border text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-danger-red">
                    <AlertTriangle className="w-4 h-4" />
                    Identity Document Request (+25)
                  </div>
                  <span className="text-xs font-mono text-secondary-text">Weight 25</span>
                </div>
                <p className="text-xs text-secondary-text mt-1">
                  Listing asks for Aadhaar and bank account details prior to interview.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-navy-secondary/60 border border-border text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-warning-amber">
                    <AlertTriangle className="w-4 h-4" />
                    Domain Mismatch (+20)
                  </div>
                  <span className="text-xs font-mono text-secondary-text">Weight 20</span>
                </div>
                <p className="text-xs text-secondary-text mt-1">
                  Application domain does not match claimed official employer website.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-navy-secondary border border-border/60 text-xs text-secondary-text italic text-left">
              Recommendation: Do not submit money or personal identity documents to this listing.
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESUME TAILOR DEMONSTRATION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Truth-Preserving AI Resume Tailoring</h2>
        <p className="mt-4 text-secondary-text max-w-xl mx-auto">
          One master profile powers multiple tailored roles—without hallucinating skills you don&apos;t have.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1: Tailored for AI Role */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="border-emerald/40 text-emerald">
                Role: Junior AI Developer
              </Badge>
              <span className="text-xs text-secondary-text">ATS Score: 94%</span>
            </div>
            <h4 className="font-semibold text-primary-text">Highlighted Skills & Projects</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald/10 text-emerald text-xs border border-emerald/20">Python</span>
              <span className="px-2 py-0.5 rounded bg-emerald/10 text-emerald text-xs border border-emerald/20">FastAPI</span>
              <span className="px-2 py-0.5 rounded bg-emerald/10 text-emerald text-xs border border-emerald/20">PyTorch</span>
              <span className="px-2 py-0.5 rounded bg-navy-secondary text-secondary-text text-xs">SQL</span>
            </div>
            <p className="mt-4 text-xs text-secondary-text leading-relaxed">
              Summary: &ldquo;Aspiring AI Engineer skilled in building backend API microservices with Python and integrating open-weight LLM inference pipelines.&rdquo;
            </p>
          </div>

          {/* Card 2: Tailored for UI/UX Role */}
          <div className="p-6 rounded-xl bg-navy-elevated border border-border">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="border-champagne/40 text-champagne">
                Role: Graphic & UI Designer
              </Badge>
              <span className="text-xs text-secondary-text">ATS Score: 91%</span>
            </div>
            <h4 className="font-semibold text-primary-text">Highlighted Skills & Projects</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 rounded bg-champagne/10 text-champagne text-xs border border-champagne/20">Figma</span>
              <span className="px-2 py-0.5 rounded bg-champagne/10 text-champagne text-xs border border-champagne/20">Design Systems</span>
              <span className="px-2 py-0.5 rounded bg-champagne/10 text-champagne text-xs border border-champagne/20">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded bg-navy-secondary text-secondary-text text-xs">Prototyping</span>
            </div>
            <p className="mt-4 text-xs text-secondary-text leading-relaxed">
              Summary: &ldquo;Product designer dedicated to creating accessible web interfaces, atomic design systems, and responsive user experiences.&rdquo;
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/resume">
            <Button variant="outline" className="border-champagne/40 text-champagne hover:bg-champagne/10">
              Open Resume Workspace
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Four Simple Steps to Your First Role</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-xl bg-navy-elevated border border-border text-center">
            <div className="w-10 h-10 rounded-full bg-emerald/20 text-emerald font-bold flex items-center justify-center mx-auto mb-4">1</div>
            <h4 className="font-semibold">Enter Your Skills</h4>
            <p className="mt-2 text-xs text-secondary-text">Add languages, tools, and projects. No corporate experience required.</p>
          </div>
          <div className="p-6 rounded-xl bg-navy-elevated border border-border text-center">
            <div className="w-10 h-10 rounded-full bg-champagne/20 text-champagne font-bold flex items-center justify-center mx-auto mb-4">2</div>
            <h4 className="font-semibold">Discover Opportunities</h4>
            <p className="mt-2 text-xs text-secondary-text">Filter by remote, stipend, and transparent skill match score.</p>
          </div>
          <div className="p-6 rounded-xl bg-navy-elevated border border-border text-center">
            <div className="w-10 h-10 rounded-full bg-danger-red/20 text-danger-red font-bold flex items-center justify-center mx-auto mb-4">3</div>
            <h4 className="font-semibold">Verify Safety</h4>
            <p className="mt-2 text-xs text-secondary-text">Check the Trust Passport to avoid upfront fee scams and fake offers.</p>
          </div>
          <div className="p-6 rounded-xl bg-navy-elevated border border-border text-center">
            <div className="w-10 h-10 rounded-full bg-emerald/20 text-emerald font-bold flex items-center justify-center mx-auto mb-4">4</div>
            <h4 className="font-semibold">Apply with Tailored PDF</h4>
            <p className="mt-2 text-xs text-secondary-text">Generate ATS-ready PDFs emphasizing relevant coursework.</p>
          </div>
        </div>
      </section>

      {/* 7. EMPLOYER CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-navy-elevated to-navy border-t border-border text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Hiring Early-Career Talent?</h2>
          <p className="mt-4 text-secondary-text">
            Post verified student opportunities, connect with motivated candidates based on verified skills, and build your recruitment pipeline.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/employer/dashboard">
              <Button size="lg" className="bg-champagne text-navy font-semibold hover:bg-champagne/90">
                Open Employer Recruitment Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
