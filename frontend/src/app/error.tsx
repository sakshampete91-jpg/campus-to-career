'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-navy text-primary-text flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-navy-elevated border border-border rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-danger-red/15 border border-danger-red/30 flex items-center justify-center mx-auto text-danger-red">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-xs text-secondary-text leading-relaxed">
            {error?.message || 'An unexpected error occurred while rendering this page.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="w-3.5 h-3.5 mr-1.5" /> Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
