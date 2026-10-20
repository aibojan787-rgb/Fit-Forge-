import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import {
  useDeleteMeasurements,
  useMeasurements,
} from '@/features/measurements/api/use-measurements'
import { MeasurementForm } from '@/features/measurements/components/measurement-form'
import { measurementFields } from '@/features/measurements/fields'
import type { Measurements } from '@/features/measurements/types'

type Mode = 'view' | 'edit' | 'confirm-delete'

export function MeasurementsManager() {
  const measurements = useMeasurements()
  const remove = useDeleteMeasurements()
  const [mode, setMode] = useState<Mode>('view')

  if (measurements.isPending) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }

  const saved: Measurements | null = measurements.data ?? null

  // No measurements yet: the form is the only thing to show ("add new").
  if (!saved) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">No measurements saved yet. Add them to see your sizes.</p>
        <MeasurementForm submitLabel="Save measurements" />
      </div>
    )
  }

  if (mode === 'edit') {
    return (
      <MeasurementForm
        submitLabel="Save changes"
        onSaved={() => setMode('view')}
        onCancel={() => setMode('view')}
      />
    )
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-white p-6 md:p-8">
      <dl className="grid gap-5 sm:grid-cols-2">
        {measurementFields.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-lg font-medium text-foreground">{saved[key]}</dd>
          </div>
        ))}
      </dl>

      {remove.isError ? (
        <Notice tone="error" title="Could not delete your measurements">
          Please try again.
        </Notice>
      ) : null}

      {mode === 'confirm-delete' ? (
        <div className="space-y-4 rounded-xl border border-brick/40 bg-brick/5 p-4">
          <p className="text-sm text-foreground">
            Delete these measurements? You will need to add them again before we can suggest sizes.
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setMode('view')} disabled={remove.isPending}>
              Keep them
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => remove.mutate(undefined, { onSuccess: () => setMode('view') })}
            >
              {remove.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="destructive" onClick={() => setMode('confirm-delete')}>
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
          <Button type="button" onClick={() => setMode('edit')}>
            <Pencil aria-hidden="true" />
            Edit
          </Button>
        </div>
      )}
    </div>
  )
}
