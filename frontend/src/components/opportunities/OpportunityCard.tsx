'use client'

import Link from 'next/link'
import { MapPin, Clock, DollarSign, Shield, ExternalLink, Bookmark, CheckCircle } from 'lucide-react'
import { cn, getTrustStatusColor, getTrustStatusLabel, formatDate, truncate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SkillChip } from '@/components/ui/SkillChip'
import type { Opportunity } from '@/types'

interface OpportunityCardProps {
  opportunity: Opportunity
  matchScore?: number
  onSave?: (id: string) => void
  isSaved?: boolean
  compact?: boolean
}

const trustBadgeVariant = (status: string) => {
  switch (status) {
    case 'verified': return 'green'
    case 'partially_verified': return 'amber'
    case 'elevated_risk': return 'red'
    default: return 'gray'
  }
}

const arrangementBadgeVariant = (arr: string) => {
  switch (arr) {
    case 'remote': return 'green'
    case 'hybrid': return 'blue'
    default: return 'gray'
  }
}

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case 'internship': return 'gold'
    case 'freelance': return 'blue'
    case 'part-time': return 'gray'
    default: return 'outline'
  }
}

export function OpportunityCard({
  opportunity,
  matchScore,
  onSave,
  isSaved = false,
  compact = false,
}: OpportunityCardProps) {
  return (
    <div className="bg-navy-elevated border border-border rounded-xl p-5 hover:border-emerald/30 transition-all duration-200 group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/marketplace/${opportunity.id}`}
            className="font-semibold text-text-primary hover:text-emerald transition-colors line-clamp-2 leading-snug"
          >
            {opportunity.title}
          </Link>
          <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1">
            <span className="font-medium text-text-primary/80">{opportunity.company_name}</span>
            {opportunity.company_website && (
              <a
                href={opportunity.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald hover:text-emerald-400 transition-colors"
                aria-label="Company website"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </p>
        </div>

        {/* Match score */}
        {matchScore !== undefined && (
          <div
            className={cn(
              'flex-shrink-0 flex flex-col items-center',
              matchScore >= 80
                ? 'text-emerald-400'
                : matchScore >= 60
                ? 'text-amber-400'
                : 'text-text-secondary'
            )}
          >
            <span className="text-lg font-bold leading-none">{matchScore}%</span>
            <span className="text-xs opacity-70">match</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={typeBadgeVariant(opportunity.opportunity_type) as 'gold'}>
          {opportunity.opportunity_type}
        </Badge>
        <Badge variant={arrangementBadgeVariant(opportunity.work_arrangement) as 'green'}>
          {opportunity.work_arrangement}
        </Badge>
        {opportunity.is_paid ? (
          <Badge variant="green">
            <DollarSign className="h-3 w-3" />
            {opportunity.compensation || 'Paid'}
          </Badge>
        ) : (
          <Badge variant="gray">Unpaid</Badge>
        )}
        <Badge variant={trustBadgeVariant(opportunity.trust_status) as 'green'}>
          <Shield className="h-3 w-3" />
          {getTrustStatusLabel(opportunity.trust_status)}
        </Badge>
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {truncate(opportunity.description, 160)}
        </p>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {opportunity.required_skills.slice(0, 4).map((skill) => (
          <SkillChip key={skill} name={skill} size="sm" />
        ))}
        {opportunity.required_skills.length > 4 && (
          <span className="text-xs text-text-secondary self-center">
            +{opportunity.required_skills.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          {opportunity.deadline && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due {formatDate(opportunity.deadline)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(opportunity.id)}
              aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
              className="h-8 w-8 p-0"
            >
              <Bookmark
                className={cn('h-4 w-4', isSaved ? 'fill-emerald text-emerald' : '')}
              />
            </Button>
          )}
          <Link href={`/marketplace/${opportunity.id}`}>
            <Button variant="primary" size="sm">View</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
