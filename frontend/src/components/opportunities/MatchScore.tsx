'use client'

import { cn, getMatchScoreColor } from '@/lib/utils'
import type { MatchScore } from '@/types'

interface MatchScoreProps {
  score: MatchScore
  className?: string
}

export function MatchScoreDisplay({ score, className }: MatchScoreProps) {
  const overall = score.overall ?? score.match_score ?? score.score ?? 0
  const skillMatch = score.skill_match ?? overall
  const expMatch = score.experience_match ?? Math.max(0, overall - 10)
  const prefMatch = score.preference_match ?? overall

  return (
    <div className={cn('bg-navy-secondary border border-border rounded-xl p-4 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">Skill Match</span>
        <span className={cn('text-2xl font-bold', getMatchScoreColor(overall))}>
          {overall}%
        </span>
      </div>

      {/* Sub-scores */}
      <div className="space-y-2.5">
        {[
          { label: 'Skill Match', value: skillMatch },
          { label: 'Experience', value: expMatch },
          { label: 'Preferences', value: prefMatch },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">{item.label}</span>
              <span className={getMatchScoreColor(item.value)}>{item.value}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  item.value >= 80 ? 'bg-emerald' : item.value >= 60 ? 'bg-amber-500' : 'bg-slate-500'
                )}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Matched skills */}
      {score.matched_skills.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Matched Skills</p>
          <div className="flex flex-wrap gap-1">
            {score.matched_skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {score.missing_skills.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary">Skills to Develop</p>
          <div className="flex flex-wrap gap-1">
            {score.missing_skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
