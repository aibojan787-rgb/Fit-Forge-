import { Loader2 } from 'lucide-react'

type LoadingStateProps = {
  label: string
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div role="status" className="flex min-h-svh items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-navy" aria-hidden="true" />
      <span className="text-sm">{label}...</span>
    </div>
  )
}
