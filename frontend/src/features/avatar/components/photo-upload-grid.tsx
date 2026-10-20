import { useRef, useState } from 'react'
import { Camera, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Notice } from '@/components/layout/notice'
import { photoSlots, type PhotoSlotId, type UserPhoto } from '@/features/avatar/types'
import { useSavePhoto } from '@/features/avatar/api/use-avatar'
import { cn } from '@/lib/utils'

type PhotoUploadGridProps = {
  photos: readonly UserPhoto[]
}

export function PhotoUploadGrid({ photos }: PhotoUploadGridProps) {
  const savePhoto = useSavePhoto()
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeSlot, setActiveSlot] = useState<PhotoSlotId | null>(null)

  function chooseFile(slotId: PhotoSlotId) {
    setActiveSlot(slotId)
    inputRef.current?.click()
  }

  function handleFile(file: File | undefined) {
    if (!file || !activeSlot) return
    savePhoto.mutate({ slotId: activeSlot, file })
  }

  const uploadedCount = photos.length

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          handleFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {photoSlots.map((slot) => {
          const photo = photos.find((item) => item.slotId === slot.id)
          const isBusy = savePhoto.isPending && activeSlot === slot.id
          return (
            <li key={slot.id} className="space-y-2">
              <div
                className={cn(
                  'relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border bg-muted',
                  photo ? 'border-navy/20' : 'border-dashed border-navy/40',
                )}
              >
                {photo ? (
                  <img src={photo.dataUrl} alt={`${slot.label} photo`} className="size-full object-cover" />
                ) : (
                  <Camera className="size-8 text-navy/50" aria-hidden="true" />
                )}
                {photo ? (
                  <span className="absolute top-2 left-2 flex size-7 items-center justify-center rounded-full bg-navy text-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{slot.label}</p>
                  <p className="hidden text-xs text-muted-foreground md:block">{slot.hint}</p>
                </div>
                <Button
                  type="button"
                  variant={photo ? 'outline' : 'default'}
                  size="sm"
                  disabled={savePhoto.isPending}
                  onClick={() => chooseFile(slot.id)}
                  aria-label={photo ? `Replace ${slot.label} photo` : `Upload ${slot.label} photo`}
                >
                  {isBusy ? 'Saving...' : photo ? <RefreshCw className="size-3.5" aria-hidden="true" /> : 'Upload'}
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {uploadedCount} of {photoSlots.length} photos added
      </p>

      {savePhoto.isError ? (
        <Notice tone="error" title="That photo could not be saved">
          {savePhoto.error instanceof Error ? savePhoto.error.message : 'Please try a different photo.'}
        </Notice>
      ) : null}
    </div>
  )
}
