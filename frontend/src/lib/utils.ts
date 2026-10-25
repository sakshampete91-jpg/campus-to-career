import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getRiskColor(score: number): string {
  if (score >= 70) return '#EF4444'
  if (score >= 50) return '#F59E0B'
  if (score >= 30) return '#EAB308'
  return '#10B981'
}

export function getRiskLabel(score: number): string {
  if (score >= 70) return 'Very High Risk'
  if (score >= 50) return 'High Risk'
  if (score >= 30) return 'Moderate Risk'
  if (score >= 10) return 'Low Risk'
  return 'Very Low Risk'
}

export function getTrustStatusColor(status: string): string {
  switch (status) {
    case 'verified':
      return 'text-emerald-500 bg-emerald-500/10'
    case 'partially_verified':
      return 'text-amber-500 bg-amber-500/10'
    case 'unverified':
      return 'text-slate-400 bg-slate-400/10'
    case 'elevated_risk':
      return 'text-red-500 bg-red-500/10'
    default:
      return 'text-slate-400 bg-slate-400/10'
  }
}

export function getTrustStatusLabel(status: string): string {
  switch (status) {
    case 'verified':
      return 'Verified'
    case 'partially_verified':
      return 'Partially Verified'
    case 'unverified':
      return 'Unverified'
    case 'elevated_risk':
      return 'Elevated Risk'
    default:
      return 'Unknown'
  }
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-slate-400'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
