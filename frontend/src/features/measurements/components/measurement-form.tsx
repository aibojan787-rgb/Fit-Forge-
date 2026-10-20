import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Notice } from '@/components/layout/notice'
import { useMeasurements, useSaveMeasurements } from '@/features/measurements/api/use-measurements'
import { measurementFields } from '@/features/measurements/fields'
import {
  measurementsSchema,
  type MeasurementKey,
  type Measurements,
} from '@/features/measurements/types'

type FormValues = Record<MeasurementKey, string>
type FormErrors = Partial<Record<MeasurementKey, string>>

type MeasurementFormProps = {
  submitLabel?: string
  onSaved?: () => void
  onCancel?: () => void
}

export function MeasurementForm({
  submitLabel = 'Save and continue',
  onSaved,
  onCancel,
}: MeasurementFormProps) {
  const saved = useMeasurements()
  const save = useSaveMeasurements()
  const [values, setValues] = useState<Partial<FormValues>>({})
  const [errors, setErrors] = useState<FormErrors>({})

  const current = (key: MeasurementKey): string => {
    const edited = values[key]
    if (edited !== undefined) return edited
    const stored = saved.data?.[key]
    return stored !== undefined ? String(stored) : ''
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const numbers = Object.fromEntries(
      measurementFields.map(({ key }) => [key, Number(current(key).replace(',', '.'))]),
    )
    const result = measurementsSchema.safeParse(numbers)
    if (!result.success) {
      const nextErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string' && field in numbers && !nextErrors[field as MeasurementKey]) {
          nextErrors[field as MeasurementKey] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }
    setErrors({})
    const payload: Measurements = result.data
    save.mutate(payload, {
      onSuccess: () => {
        onSaved?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 rounded-2xl border border-border bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {measurementFields.map(({ key, label, hint }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              inputMode="decimal"
              placeholder={hint}
              value={current(key)}
              onChange={(event) => setValues((prev) => ({ ...prev, [key]: event.target.value }))}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
            />
            {errors[key] ? (
              <p id={`${key}-error`} className="text-sm text-brick">
                {errors[key]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {save.isError ? (
        <Notice tone="error" title="Could not save your measurements">
          Please try again.
        </Notice>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={save.isPending}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size="lg" disabled={save.isPending || saved.isPending}>
          {save.isPending ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
