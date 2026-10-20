import { useNavigate } from 'react-router'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/layout/notice'
import { PhotoUploadGrid } from '@/features/avatar/components/photo-upload-grid'
import { usePhotos } from '@/features/avatar/api/use-avatar'
import { photoSlots } from '@/features/avatar/types'
import { useCompleteOnboardingStep } from '@/features/auth/api/use-auth'

export function PhotosPage() {
  const navigate = useNavigate()
  const photos = usePhotos()
  const completeStep = useCompleteOnboardingStep()

  const uploaded = photos.data ?? []
  const complete = uploaded.length === photoSlots.length

  function handleContinue() {
    completeStep.mutate('photos', {
      onSuccess: () => {
        void navigate('/onboarding/generating')
      },
    })
  }

  if (photos.isPending) {
    return <p className="text-muted-foreground">Loading your photos...</p>
  }
  if (photos.isError) {
    return (
      <Notice tone="error" title="Your photos could not be loaded">
        Refresh the page and try again.
      </Notice>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl">Upload six photos of yourself</h1>
        <p className="max-w-xl text-muted-foreground">
          We build your personal avatar from these. Good light, a plain background and fitted clothes
          give the best result.
        </p>
      </div>

      <Notice tone="info" title="Use test photos only">
        <span className="flex items-start gap-2">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          This is a demo. Photos stay in this browser and are never sent to a server by the mock flow.
        </span>
      </Notice>

      <PhotoUploadGrid photos={uploaded} />

      {completeStep.isError ? (
        <Notice tone="error" title="Could not save your progress">
          Please try again.
        </Notice>
      ) : null}

      <div className="flex justify-end">
        <Button size="lg" disabled={!complete || completeStep.isPending} onClick={handleContinue}>
          {completeStep.isPending ? 'Saving...' : 'Continue to avatar'}
        </Button>
      </div>
    </div>
  )
}
