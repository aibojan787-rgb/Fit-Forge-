import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type WordmarkProps = {
  className?: string
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <Link
      to="/app"
      aria-label="Fit Forge home"
      className={cn(
        'font-serif text-xl font-semibold tracking-[0.25em] text-navy uppercase',
        className,
      )}
    >
      Fit Forge
    </Link>
  )
}
