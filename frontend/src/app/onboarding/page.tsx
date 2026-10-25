'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, Plus, X, GraduationCap, Code, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SkillChip } from '@/components/ui/SkillChip'
import { useAuthStore } from '@/store/authStore'
import { usersApi } from '@/lib/api'

interface SkillItem {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, fetchMe } = useAuthStore()

  const [step, setStep] = useState(1)
  const [skills, setSkills] = useState<SkillItem[]>([
    { name: 'Python', level: 'intermediate' },
    { name: 'Git', level: 'intermediate' },
  ])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')

  // Step 2 state
  const [academicYear, setAcademicYear] = useState('3rd Year')
  const [workTypes, setWorkTypes] = useState<string[]>(['remote', 'hybrid'])
  const [oppTypes, setOppTypes] = useState<string[]>(['internship', 'freelance'])

  // Step 3 state
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addSkill = () => {
    if (!newSkillName.trim()) return
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }])
    setNewSkillName('')
  }

  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name))
  }

  const toggleWorkType = (type: string) => {
    setWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const toggleOppType = (type: string) => {
    setOppTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      await usersApi.updateProfile({
        skills: skills.map((s) => ({ name: s.name, level: s.level })),
        academic_year: academicYear,
        work_type_preference: workTypes,
        opportunity_type_preference: oppTypes,
        github_url: githubUrl || undefined,
        linkedin_url: linkedinUrl || undefined,
      })
      await fetchMe()
      router.push('/dashboard')
    } catch (err) {
      console.error('Failed to save profile during onboarding', err)
      // Navigate anyway for hackathon demo resilience
      router.push('/dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-navy-elevated border border-border p-8 rounded-2xl shadow-2xl">
        {/* Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-secondary-text mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'Skills & Strengths'}
              {step === 2 && 'Education & Preferences'}
              {step === 3 && 'Links & Portfolio'}
            </span>
          </div>
          <div className="w-full bg-navy-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: SKILLS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Code className="w-6 h-6 text-emerald" /> Add Your Skills
              </h2>
              <p className="text-secondary-text text-sm mt-1">
                Enter your programming languages, tools, or domain knowledge. No previous job required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. React, SQL, Figma..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 bg-navy-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-emerald"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="bg-navy-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-primary-text focus:outline-none focus:border-emerald"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <Button type="button" onClick={addSkill} className="bg-emerald text-navy font-semibold">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {/* Added Skills List */}
            <div className="p-4 rounded-xl bg-navy-secondary/50 border border-border min-h-[100px] flex flex-wrap gap-2 items-start">
              {skills.length === 0 ? (
                <span className="text-secondary-text text-xs italic">No skills added yet. Add at least one to continue.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-elevated border border-emerald/30 text-xs font-medium text-emerald"
                  >
                    {skill.name}
                    <span className="text-[10px] text-secondary-text uppercase">({skill.level})</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.name)}
                      className="hover:text-danger-red ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                disabled={skills.length === 0}
                onClick={() => setStep(2)}
                className="bg-emerald text-navy font-semibold hover:bg-emerald/90"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: EDUCATION & PREFERENCES */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-champagne" /> Academic Year & Preferences
              </h2>
              <p className="text-secondary-text text-sm mt-1">
                Tell us your current study stage and what type of opportunities you are looking for.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text mb-2">Current Academic Stage</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-navy-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-emerald"
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
              <label className="block text-xs font-medium text-secondary-text mb-2">Work Arrangement Preferences</label>
              <div className="flex flex-wrap gap-2">
                {['remote', 'hybrid', 'onsite'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleWorkType(type)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                      workTypes.includes(type)
                        ? 'bg-emerald/15 border-emerald text-emerald'
                        : 'bg-navy-secondary border-border text-secondary-text hover:text-primary-text'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text mb-2">Opportunity Types</label>
              <div className="flex flex-wrap gap-2">
                {['internship', 'freelance', 'part-time', 'full-time'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleOppType(type)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                      oppTypes.includes(type)
                        ? 'bg-champagne/15 border-champagne text-champagne'
                        : 'bg-navy-secondary border-border text-secondary-text hover:text-primary-text'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: LINKS & COMPLETE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-emerald" /> Portfolio & Profiles
              </h2>
              <p className="text-secondary-text text-sm mt-1">
                Share your GitHub or LinkedIn profile so employers can see your code and projects.
              </p>
            </div>

            <Input
              label="GitHub Profile URL (Optional)"
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />

            <Input
              label="LinkedIn Profile URL (Optional)"
              type="url"
              placeholder="https://linkedin.com/in/yourusername"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-navy-secondary border border-border text-xs text-secondary-text leading-relaxed">
              <div className="font-semibold text-emerald mb-1">Your Profile is Ready</div>
              Once finished, you can browse opportunities with automatic skill match calculations and generate customized resumes with one click.
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleComplete}
                className="bg-emerald text-navy font-semibold hover:bg-emerald/90"
              >
                {isSubmitting ? 'Saving Profile...' : 'Complete & Open Dashboard'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
