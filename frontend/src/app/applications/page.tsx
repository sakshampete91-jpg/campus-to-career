'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface AppItem {
  id: string
  title: string
  company: string
  status: 'saved' | 'applied' | 'under_review' | 'interview' | 'rejected' | 'selected'
  appliedDate: string
  trustStatus: 'verified' | 'partially_verified'
  tailoredRole: string
}

const INITIAL_APPLICATIONS: AppItem[] = [
  {
    id: '1',
    title: 'Junior AI Developer',
    company: 'TechVentures Inc',
    status: 'under_review',
    appliedDate: 'Oct 22, 2026',
    trustStatus: 'verified',
    tailoredRole: 'Junior AI Developer',
  },
  {
    id: '2',
    title: 'Graphic Designer Intern',
    company: 'CreativeStudio',
    status: 'saved',
    appliedDate: 'Saved Oct 24',
    trustStatus: 'verified',
    tailoredRole: 'Graphic & UI Designer',
  },
  {
    id: '3',
    title: 'Full Stack Developer Intern',
    company: 'CodeCraft Solutions',
    status: 'applied',
    appliedDate: 'Oct 25, 2026',
    trustStatus: 'verified',
    tailoredRole: 'Full Stack Web Developer',
  },
]

const COLUMNS = [
  { key: 'saved', label: 'Saved', color: 'border-border' },
  { key: 'applied', label: 'Applied', color: 'border-emerald/40' },
  { key: 'under_review', label: 'Under Review', color: 'border-champagne/40' },
  { key: 'interview', label: 'Interview', color: 'border-emerald' },
  { key: 'selected', label: 'Selected', color: 'border-emerald bg-emerald/10' },
]

export default function ApplicationTrackerPage() {
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPLICATIONS)

  const moveStatus = (id: string, newStatus: AppItem['status']) => {
    setApps(apps.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Application Tracker</h1>
          <p className="text-secondary-text text-sm mt-1">
            Manage your opportunities pipeline, view associated TrustCheck reports, and access tailored resumes.
          </p>
        </div>

        <Link href="/marketplace">
          <Button className="bg-emerald text-navy font-semibold hover:bg-emerald/90 text-xs">
            Browse More Roles
          </Button>
        </Link>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colApps = apps.filter((a) => a.status === col.key)

          return (
            <div
              key={col.key}
              className={`p-4 rounded-xl bg-navy-elevated border ${col.color} min-h-[500px] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-3">
                  <span className="font-semibold text-xs uppercase tracking-wider text-secondary-text">
                    {col.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-navy-secondary text-primary-text font-mono">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colApps.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-lg bg-navy-secondary border border-border/80 hover:border-emerald/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-primary-text leading-tight">
                          {item.title}
                        </span>
                        <Badge variant="success" className="text-[9px] px-1 py-0">
                          Safe
                        </Badge>
                      </div>

                      <div className="text-[11px] text-secondary-text">{item.company}</div>

                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-secondary-text">
                        <span>{item.appliedDate}</span>
                        <Link href="/resume" className="text-champagne hover:underline">
                          Tailored PDF
                        </Link>
                      </div>

                      {/* Status action toggle dropdown/menu */}
                      <div className="mt-2 flex gap-1">
                        {col.key !== 'applied' && (
                          <button
                            onClick={() => moveStatus(item.id, 'applied')}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-navy text-emerald hover:bg-navy/80 border border-border"
                          >
                            Mark Applied
                          </button>
                        )}
                        {col.key !== 'interview' && (
                          <button
                            onClick={() => moveStatus(item.id, 'interview')}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-navy text-champagne hover:bg-navy/80 border border-border"
                          >
                            Interview
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 text-center">
                <span className="text-[10px] text-secondary-text italic">
                  Drag & drop / click action
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
