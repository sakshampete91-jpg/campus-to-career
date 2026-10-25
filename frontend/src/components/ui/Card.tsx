import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
  noPadding?: boolean
}

export function Card({ header, footer, noPadding, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-navy-elevated border border-border rounded-xl overflow-hidden',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-border">{header}</div>
      )}
      <div className={cn(noPadding ? '' : 'p-6')}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-border">{footer}</div>
      )}
    </div>
  )
}
