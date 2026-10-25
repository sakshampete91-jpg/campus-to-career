'use client'

import { useCallback } from 'react'
import { useOpportunityStore } from '@/store/opportunityStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { X, SlidersHorizontal } from 'lucide-react'

const opportunityTypes = [
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'full-time', label: 'Full-time' },
]

const workArrangements = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' },
]

const trustStatuses = [
  { value: 'verified', label: 'Verified' },
  { value: 'partially_verified', label: 'Partially Verified' },
  { value: 'unverified', label: 'Unverified' },
]

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
]

interface FilterSectionProps {
  title: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (value: string) => void
}

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
      <div className="space-y-1">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onChange(opt.value)}
              className="rounded border-border bg-navy-secondary text-emerald focus:ring-emerald/50 focus:ring-2 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

const toArr = (v: any): string[] => (Array.isArray(v) ? v : v ? [v] : [])

export function OpportunityFilters() {
  const { filters, setFilter, clearFilters } = useOpportunityStore()

  const oppTypes = toArr(filters.opportunity_type)
  const workArr = toArr(filters.work_arrangement)
  const trustStat = toArr(filters.trust_status)
  const expLevels = toArr(filters.experience_level)

  const toggleArrayFilter = useCallback(
    (key: 'opportunity_type' | 'work_arrangement' | 'trust_status' | 'experience_level', value: string) => {
      const current = toArr(filters[key])
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      setFilter(key, next)
    },
    [filters, setFilter]
  )

  const hasActiveFilters =
    oppTypes.length > 0 ||
    workArr.length > 0 ||
    trustStat.length > 0 ||
    expLevels.length > 0 ||
    filters.is_paid !== null

  return (
    <div className="bg-navy-elevated border border-border rounded-xl p-5 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald" />
          <span className="font-semibold text-sm text-text-primary">Filters</span>
          {hasActiveFilters && (
            <Badge variant="green" className="text-xs">Active</Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 px-2 text-text-secondary">
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <FilterSection
        title="Type"
        options={opportunityTypes}
        selected={oppTypes}
        onChange={(v) => toggleArrayFilter('opportunity_type', v)}
      />

      <FilterSection
        title="Work Arrangement"
        options={workArrangements}
        selected={workArr}
        onChange={(v) => toggleArrayFilter('work_arrangement', v)}
      />

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Compensation</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="is_paid"
              checked={filters.is_paid === null}
              onChange={() => setFilter('is_paid', null)}
              className="border-border bg-navy-secondary text-emerald focus:ring-emerald/50 focus:ring-2 w-4 h-4"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">All</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="is_paid"
              checked={filters.is_paid === true}
              onChange={() => setFilter('is_paid', true)}
              className="border-border bg-navy-secondary text-emerald focus:ring-emerald/50 focus:ring-2 w-4 h-4"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Paid only</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="is_paid"
              checked={filters.is_paid === false}
              onChange={() => setFilter('is_paid', false)}
              className="border-border bg-navy-secondary text-emerald focus:ring-emerald/50 focus:ring-2 w-4 h-4"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Unpaid / Stipend</span>
          </label>
        </div>
      </div>

      <FilterSection
        title="Trust Status"
        options={trustStatuses}
        selected={trustStat}
        onChange={(v) => toggleArrayFilter('trust_status', v)}
      />

      <FilterSection
        title="Experience Level"
        options={experienceLevels}
        selected={expLevels}
        onChange={(v) => toggleArrayFilter('experience_level', v)}
      />
    </div>
  )
}
