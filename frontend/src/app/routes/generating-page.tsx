import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/layout/notice'
import { Progress } from '@/components/ui/progress'
import { useCreateAvatar } from '@/features/avatar/api/use-avatar'
import { useCompleteOnboardingStep } from '@/features/auth/api/use-auth'

type GenerationStatus = { value: number; message: string }
const startStatus: GenerationStatus = { value: 0, message: 'Getting ready' }

export function GeneratingPage() {
  const navigate = useNavigate()
  const createAvatar = useCreateAvatar()
  const completeStep = useCompleteOnboardingStep()
  const { mutate: createMutate, isError: failed } = createAvatar
  const { mutate: completeMutate, isPending: completing } = completeStep
  const [status, setStatus] = useState<GenerationStatus>(startStatus)
  const [fallbackReason, setFallbackReason] = useState<string | null>(null)
  const started = useRef(false)

  const finish = useCallback(() => {
    completeMutate('avatar', {
      onSuccess: () => {
        void navigate('/app', { replace: true })
      },
    })
  }, [completeMutate, navigate])

  const run = useCallback(() => {
    setFallbackReason(null)
    createMutate(
      { onProgress: (update) => setStatus(update) },
      {
        onSuccess: ({ fallbackReason: reason }) => {
          if (reason) {
            // Let the user read why the demo avatar was used before moving on.
            setFallbackReason(reason)
            return
          }
          finish()
        },
      },
    )
  }, [createMutate, finish])

  useEffect(() => {
    // Guard against React StrictMode running effects twice.
    if (started.current) return
    started.current = true
    run()
  }, [run])

  return (
    <div className="mx-auto max-w-md space-y-8 py-12 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl">Creating your avatar</h1>
        <p className="text-muted-foreground">This takes a moment. Keep this tab open.</p>
      </div>

      {failed ? (
        <div className="space-y-4">
          <Notice tone="error" title="Avatar creation failed">
            Please try again.
          </Notice>
          <Button
            size="lg"
            onClick={() => {
              setStatus(startStatus)
              run()
            }}
          >
            Try again
          </Button>
        </div>
      ) : null}

      {!failed && fallbackReason ? (
        <div className="space-y-4 text-left">
          <Notice tone="warning" title="Using the demo avatar">
            {fallbackReason}
          </Notice>
          <Button size="lg" className="w-full" disabled={completing} onClick={finish}>
            {completing ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      ) : null}

      {!failed && !fallbackReason ? (
        <div className="space-y-4">
          <Progress value={status.value * 100} aria-label="Avatar progress" />
          <p className="flex items-center justify-center gap-2 text-sm text-navy" role="status">
            {status.value >= 1 ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {status.message}
          </p>
        </div>
      ) : null}
    </div>
  )
}
