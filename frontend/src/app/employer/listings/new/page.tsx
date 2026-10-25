'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { opportunitiesApi } from '@/lib/api'

export default function NewListingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [companyName, setCompanyName] = useState('TechVentures Inc')
  const [companyWebsite, setCompanyWebsite] = useState('https://techventures.example')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('Python, SQL, REST APIs')
  const [compensation, setCompensation] = useState('₹18,000/month')
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'hybrid' | 'onsite'>('remote')
  const [opportunityType, setOpportunityType] = useState<'internship' | 'freelance' | 'part-time' | 'full-time'>('internship')
  const [appUrl, setAppUrl] = useState('https://techventures.example/apply')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await opportunitiesApi.create({
        title,
        company_name: companyName,
        company_website: companyWebsite,
        description,
        responsibilities: [
          'Design and implement backend software features',
          'Participate in agile sprint planning and code reviews',
          'Write comprehensive automated unit and integration tests',
        ],
        required_skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        preferred_skills: ['Docker', 'Git'],
        compensation,
        is_paid: true,
        work_arrangement: workArrangement,
        location: workArrangement === 'remote' ? 'Remote' : 'Hybrid City',
        experience_level: 'entry',
        opportunity_type: opportunityType,
        application_url: appUrl,
      })
      router.push('/employer/dashboard')
    } catch (err: any) {
      console.error('Failed to create opportunity', err)
      setError(err.response?.data?.detail || 'Failed to post opportunity.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link href="/employer/dashboard" className="inline-flex items-center gap-1.5 text-xs text-secondary-text hover:text-emerald mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Employer Dashboard
      </Link>

      <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-2xl">
        <h1 className="text-2xl font-black mb-2">Create New Student Opportunity</h1>
        <p className="text-secondary-text text-xs mb-6">
          All listings are verified to ensure zero fee requests and transparent skill criteria.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-danger-red/10 border border-danger-red/30 text-danger-red text-xs mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Opportunity Title *"
            type="text"
            required
            placeholder="e.g. Junior Backend Engineer Intern"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              label="Official Website URL"
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-secondary-text mb-1">Work Arrangement</label>
              <select
                value={workArrangement}
                onChange={(e) => setWorkArrangement(e.target.value as any)}
                className="w-full bg-navy-secondary border border-border rounded-lg px-3 py-2 text-sm text-primary-text"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text mb-1">Opportunity Type</label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value as any)}
                className="w-full bg-navy-secondary border border-border rounded-lg px-3 py-2 text-sm text-primary-text"
              >
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="part-time">Part-Time</option>
                <option value="full-time">Full-Time Entry</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Stipend / Compensation"
              type="text"
              placeholder="e.g. ₹20,000/month or Unpaid"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
            />
            <Input
              label="Application URL *"
              type="url"
              required
              placeholder="https://company.example/apply"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
            />
          </div>

          <Input
            label="Required Skills (Comma separated) *"
            type="text"
            required
            placeholder="Python, React, SQL..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-secondary-text mb-1">Role Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the learning opportunities, mentors, and mission of the team..."
              className="w-full bg-navy-secondary border border-border rounded-lg p-3 text-xs text-primary-text focus:outline-none focus:border-emerald font-sans"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 bg-emerald text-navy font-semibold hover:bg-emerald/90"
          >
            {isSubmitting ? 'Publishing Listing...' : 'Publish Verified Listing'}
          </Button>
        </form>
      </div>
    </div>
  )
}
