'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Briefcase, Users, Eye, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function EmployerDashboardPage() {
  const [activeListings] = useState([
    {
      id: '1',
      title: 'Junior AI Developer',
      applicationsCount: 8,
      status: 'active',
      workArrangement: 'remote',
      stipend: '₹15,000/month',
      date: 'Oct 20, 2026',
    },
    {
      id: '2',
      title: 'Graphic Designer Intern',
      applicationsCount: 14,
      status: 'active',
      workArrangement: 'hybrid',
      stipend: '₹8,000/month',
      date: 'Oct 22, 2026',
    },
  ])

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Employer Recruitment Portal</h1>
          <p className="text-secondary-text text-sm mt-1">
            Manage your student listings, review skill matches, and verify candidate applications.
          </p>
        </div>

        <Link href="/employer/listings/new">
          <Button className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
            <Plus className="w-4 h-4 mr-1.5" /> Post New Opportunity
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-navy-elevated border border-border">
          <span className="text-xs text-secondary-text">Active Job Posts</span>
          <div className="text-3xl font-bold mt-2">2</div>
          <div className="text-xs text-emerald mt-1">Trust verified</div>
        </div>
        <div className="p-6 rounded-xl bg-navy-elevated border border-border">
          <span className="text-xs text-secondary-text">Total Student Applicants</span>
          <div className="text-3xl font-bold mt-2">22</div>
          <div className="text-xs text-champagne mt-1">Across all postings</div>
        </div>
        <div className="p-6 rounded-xl bg-navy-elevated border border-border">
          <span className="text-xs text-secondary-text">Avg Skill Match Score</span>
          <div className="text-3xl font-bold mt-2">84%</div>
          <div className="text-xs text-secondary-text mt-1">Based on student skills</div>
        </div>
      </div>

      {/* Active Listings Table */}
      <div className="p-6 rounded-2xl bg-navy-elevated border border-border shadow-xl">
        <h2 className="text-lg font-bold mb-4">Your Posted Opportunities</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-secondary-text">
                <th className="pb-3 font-medium">Job Title</th>
                <th className="pb-3 font-medium">Arrangement</th>
                <th className="pb-3 font-medium">Compensation</th>
                <th className="pb-3 font-medium">Applicants</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {activeListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-navy-secondary/30 transition-colors">
                  <td className="py-4 font-semibold text-primary-text">{listing.title}</td>
                  <td className="py-4 capitalize text-secondary-text">{listing.workArrangement}</td>
                  <td className="py-4 text-secondary-text">{listing.stipend}</td>
                  <td className="py-4 font-mono text-emerald font-semibold">{listing.applicationsCount}</td>
                  <td className="py-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <Button variant="outline" size="sm" className="border-border text-xs">
                      View Applicants
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
