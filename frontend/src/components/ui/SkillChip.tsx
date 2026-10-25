'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

interface SkillChipProps {
  name: string
  level?: SkillLevel
  onRemove?: () => void
  className?: string
  size?: 'sm' | 'md'
}

const levelColors: Record<SkillLevel, string> = {
  beginner: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  intermediate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  advanced: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
}

const levelDots: Record<SkillLevel, string> = {
  beginner: 'bg-blue-400',
  intermediate: 'bg-amber-400',
  advanced: 'bg-emerald-400',
}

export function SkillChip({ name, level, onRemove, className, size = 'md' }: SkillChipProps) {
  const baseColor = level ? levelColors[level] : 'bg-navy-secondary text-text-secondary border-border'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        baseColor,
        className
      )}
    >
      {level && (
        <span
          className={cn('rounded-full flex-shrink-0', levelDots[level], size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')}
          aria-hidden="true"
        />
      )}
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity rounded-full focus:outline-none focus:opacity-100"
          aria-label={`Remove ${name}`}
        >
          <X className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        </button>
      )}
    </span>
  )
}
