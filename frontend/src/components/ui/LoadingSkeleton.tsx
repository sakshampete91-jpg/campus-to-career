import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  count?: number
  type?: 'card' | 'list' | 'text' | 'circle'
}

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-navy-secondary rounded-lg',
        className
      )}
      aria-hidden="true"
    />
  )
}

function CardSkeleton() {
  return (
    <div className="bg-navy-elevated border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-5 w-3/4" />
          <SkeletonBox className="h-4 w-1/2" />
        </div>
        <SkeletonBox className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBox className="h-16 w-full" />
      <div className="flex gap-2">
        <SkeletonBox className="h-6 w-16 rounded-full" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
        <SkeletonBox className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <SkeletonBox className="h-4 w-24" />
        <SkeletonBox className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border">
      <SkeletonBox className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
      <SkeletonBox className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function LoadingSkeleton({ className, count = 3, type = 'card' }: LoadingSkeletonProps) {
  return (
    <div className={cn('w-full', className)} aria-label="Loading..." role="status">
      <span className="sr-only">Loading...</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={type === 'card' ? 'mb-4' : ''}>
          {type === 'card' && <CardSkeleton />}
          {type === 'list' && <ListSkeleton />}
          {type === 'text' && <SkeletonBox className="h-4 w-full mb-2" />}
          {type === 'circle' && <SkeletonBox className="h-16 w-16 rounded-full" />}
        </div>
      ))}
    </div>
  )
}
