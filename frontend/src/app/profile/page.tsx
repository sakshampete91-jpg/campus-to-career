'use client'

import React, { useState, useEffect } from 'react'
import { User, Code, GraduationCap, Globe, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { usersApi } from '@/lib/api'

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()

  const [fullName, setFullName] = useState(user?.full_name || 'Alex Morgan')
  const [academicYear, setAcademicYear] = useState(user?.academic_year || '3rd Year')
  const [githubUrl, setGithubUrl] = useState(user?.github_url || 'https://github.com/alexmorgan')
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || 'https://linkedin.com/in/alexmorgan')
  const [skillsText, setSkillsText] = useState('Python, React, SQL, Git, FastAPI, TypeScript')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      if (user.academic_year) setAcademicYear(user.academic_year)
      if (user.github_url) setGithubUrl(user.github_url)
      if (user.linkedin_url) setLinkedinUrl(user.linkedin_url)
      if (user.skills && user.skills.length > 0) {
        const str = user.skills.map((s) => (typeof s === 'string' ? s : s.name)).join(', ')
        setSkillsText(str)
      }
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSavedSuccess(false)

    try {
      const parsedSkills = skillsText.split(',').map((s) => ({
        name: s.trim(),
        level: 'intermediate',
      })).filter((s) => Boolean(s.name))

      await usersApi.updateProfile({
        full_name: fullName,
        academic_year: academicYear,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        skills: parsedSkills as any,
      })
      await fetchMe()
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to update profile', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="p-8 rounded-2xl bg-navy-elevated border border-border shadow-2xl">
        <h1 className="text-2xl font-black mb-2 flex items-center gap-2">
          <User className="w-6 h-6 text-emerald" /> Profile & Skill Preferences
        </h1>
        <p className="text-secondary-text text-xs mb-8">
          Manage your verified information used for opportunity matching and truthful resume generation.
        </p>

        {savedSuccess && (
          <div className="p-3 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center gap-2 text-emerald text-xs mb-6">
            <CheckCircle className="w-4 h-4" /> Profile changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-secondary-text mb-1.5">
              Academic Stage
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-navy-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-primary-text"
            >
              <option value="1st Year">1st Year / Freshman</option>
              <option value="2nd Year">2nd Year / Sophomore</option>
              <option value="3rd Year">3rd Year / Junior</option>
              <option value="Final Year">Final Year / Senior</option>
              <option value="Recent Graduate">Recent Graduate</option>
              <option value="Postgraduate / Masters">Postgraduate / Masters</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-text mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-champagne" /> Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full bg-navy-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-primary-text"
            />
            <div className="text-[11px] text-secondary-text mt-1">
              Used to calculate match percentages on the Marketplace.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="GitHub Profile URL"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
            <Input
              label="LinkedIn Profile URL"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald text-navy font-semibold hover:bg-emerald/90 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
