'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SignalEvidence } from '@/types'

interface SignalRowProps {
  signal: SignalEvidence
}

export function SignalRow({ signal }: SignalRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'border rounded-lg overflow-hidden transition-colors',
        signal.detected
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-border bg-navy-secondary/50'
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex-shrink-0">
          {signal.detected ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-primary">
              {signal.signal_name.replace(/_/g, ' ')}
            </span>
            {signal.detected && (
              <span className="text-xs text-red-400 font-mono bg-red-500/10 px-1.5 py-0.5 rounded">
                +{signal.weight} risk
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
            {signal.explanation}
          </p>
        </div>

        <div className="flex-shrink-0 text-text-secondary">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50">
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mt-3 mb-1">Explanation</p>
            <p className="text-sm text-text-secondary leading-relaxed">{signal.explanation}</p>
          </div>
          {signal.evidence && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Evidence</p>
              <p className="text-sm text-text-secondary/80 font-mono bg-navy/50 rounded p-2.5 text-xs leading-relaxed">
                {signal.evidence}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
