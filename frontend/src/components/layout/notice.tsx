import type { ReactNode } from 'react'
import { AlertTriangle, Info, OctagonAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type NoticeTone = 'info' | 'warning' | 'error'

type NoticeProps = {
  tone?: NoticeTone
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

const toneStyles: Record<NoticeTone, string> = {
  info: 'border-beige bg-muted text-navy',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  error: 'border-brick/40 bg-brick/5 text-brick',
}

const toneIcons: Record<NoticeTone, LucideIcon> = {
  info: Info,
  warning: AlertTriangle,
  error: OctagonAlert,
}

export function Notice({ tone = 'info', title, children, action, className }: NoticeProps) {
  const Icon = toneIcons[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border p-4 text-sm', toneStyles[tone], className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 space-y-1">
        <p className="font-medium">{title}</p>
        {children ? <div className="text-current/80">{children}</div> : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  )
}
