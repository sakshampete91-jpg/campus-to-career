'use client'

import { getRiskColor } from '@/lib/utils'

interface RiskScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function RiskScoreCircle({
  score,
  size = 120,
  strokeWidth = 10,
  className,
}: RiskScoreCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getRiskColor(score)

  const getRiskLabel = (s: number) => {
    if (s >= 70) return 'Very High Risk'
    if (s >= 50) return 'High Risk'
    if (s >= 30) return 'Moderate Risk'
    if (s >= 10) return 'Low Risk'
    return 'Very Low Risk'
  }

  return (
    <div
      className={className}
      role="img"
      aria-label={`Risk score: ${score} out of 100 — ${getRiskLabel(score)}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E2D45"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-text-secondary mt-0.5">/ 100</span>
      </div>
    </div>
  )
}
