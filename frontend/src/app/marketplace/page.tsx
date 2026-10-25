'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Briefcase, MapPin, DollarSign, ShieldCheck, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { opportunitiesApi, applicationsApi } from '@/lib/api'
import { Opportunity } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function MarketplacePage() {
  const { user } = useAuthStore()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArrangement, setSelectedArrangement] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [onlyPaid, setOnlyPaid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    fetchOpportunities()
  }, [selectedArrangement, selectedType, onlyPaid])

  const fetchOpportunities = async () => {
    setIsLoading(true)
    try {
      const data: any = await opportunitiesApi.list({
        q: searchQuery || undefined,
        work_arrangement: selectedArrangement || undefined,
        opportunity_type: selectedType || undefined,
        is_paid: onlyPaid ? true : undefined,
      })
      setOpportunities(Array.isArray(data) ? data : data?.items || [])
    } catch (err) {
      console.error('Failed to load marketplace listings', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOpportunities()
  }

  const toggleSave = async (oppId: string) => {
    if (savedIds.includes(oppId)) {
      setSavedIds(savedIds.filter((id) => id !== oppId))
    } else {
      setSavedIds([...savedIds, oppId])
      try {
        await applicationsApi.save(oppId)
      } catch (err) {
        // demo resilience
      }
    }
  }

  return (
    <div className="min-h-screen bg-navy text-primary-text pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Opportunity Marketplace</h1>
        <p className="text-secondary-text text-sm mt-1">
          Explore student-first internships, part-time roles, and entry positions with verified trust reports.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-navy-elevated border border-border mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-secondary-text" />
            <input
              type="text"
              placeholder="Search by job title, company name, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-emerald"
            />
          </div>
          <Button type="submit" className="bg-emerald text-navy font-semibold hover:bg-emerald/90">
            Search
          </Button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 text-xs">
          <span className="text-secondary-text font-medium flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Arrangement filter */}
          {['remote', 'hybrid', 'onsite'].map((arr) => (
            <button
              key={arr}
              onClick={() => setSelectedArrangement(selectedArrangement === arr ? '' : arr)}
              className={`px-3 py-1 rounded-full border capitalize transition-all ${
                selectedArrangement === arr
                  ? 'bg-emerald/20 border-emerald text-emerald'
                  : 'bg-navy-secondary border-border text-secondary-text hover:text-primary-text'
              }`}
            >
              {arr}
            </button>
          ))}

          {/* Type filter */}
          {['internship', 'freelance', 'part-time', 'full-time'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? '' : type)}
              className={`px-3 py-1 rounded-full border capitalize transition-all ${
                selectedType === type
                  ? 'bg-champagne/20 border-champagne text-champagne'
                  : 'bg-navy-secondary border-border text-secondary-text hover:text-primary-text'
              }`}
            >
              {type}
            </button>
          ))}

          {/* Paid only checkbox toggle */}
          <button
            onClick={() => setOnlyPaid(!onlyPaid)}
            className={`px-3 py-1 rounded-full border transition-all ${
              onlyPaid
                ? 'bg-emerald/20 border-emerald text-emerald'
                : 'bg-navy-secondary border-border text-secondary-text hover:text-primary-text'
            }`}
          >
            Paid Only
          </button>

          {(selectedArrangement || selectedType || onlyPaid || searchQuery) && (
            <button
              onClick={() => {
                setSelectedArrangement('')
                setSelectedType('')
                setOnlyPaid(false)
                setSearchQuery('')
              }}
              className="text-danger-red hover:underline ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-secondary-text">Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-elevated border border-border">
          <Briefcase className="w-12 h-12 text-secondary-text mx-auto mb-3" />
          <h3 className="text-lg font-semibold">No opportunities found</h3>
          <p className="text-secondary-text text-sm mt-1">Try clearing some filters or searching with different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const isSaved = savedIds.includes(opp.id)

            return (
              <div
                key={opp.id}
                className="p-6 rounded-xl bg-navy-elevated border border-border hover:border-emerald/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant={opp.trust_status === 'verified' ? 'success' : 'default'} className="text-[10px]">
                      <ShieldCheck className="w-3 h-3 mr-1 inline" />
                      {opp.trust_status.replace('_', ' ')}
                    </Badge>
                    <button
                      onClick={() => toggleSave(opp.id)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        isSaved
                          ? 'bg-champagne/20 border-champagne text-champagne'
                          : 'border-border text-secondary-text hover:text-primary-text'
                      }`}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <h3 className="font-bold text-lg text-primary-text">{opp.title}</h3>
                  <div className="text-sm text-secondary-text mt-0.5">{opp.company_name}</div>

                  <div className="flex items-center gap-4 text-xs text-secondary-text mt-3">
                    <span className="flex items-center gap-1 capitalize">
                      <MapPin className="w-3 h-3" /> {opp.work_arrangement}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {opp.compensation || 'Stipend'}
                    </span>
                  </div>

                  <p className="text-xs text-secondary-text mt-3 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {opp.required_skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-navy-secondary text-[11px] text-secondary-text border border-border/80"
                      >
                        {skill}
                      </span>
                    ))}
                    {opp.required_skills && opp.required_skills.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-secondary-text">
                        +{opp.required_skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <Link href={`/marketplace/${opp.id}`}>
                    <Button variant="outline" size="sm" className="border-border text-xs">
                      Trust Passport
                    </Button>
                  </Link>
                  <Link href={`/resume?role=${encodeURIComponent(opp.title)}`}>
                    <Button size="sm" className="bg-emerald text-navy font-semibold text-xs">
                      Tailor Resume <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
