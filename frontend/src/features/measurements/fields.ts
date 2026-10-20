import type { MeasurementKey } from '@/features/measurements/types'

export type MeasurementField = {
  key: MeasurementKey
  label: string
  hint: string
}

export const measurementFields: readonly MeasurementField[] = [
  { key: 'heightCm', label: 'Height (cm)', hint: 'Without shoes' },
  { key: 'chestCm', label: 'Chest (cm)', hint: 'Fullest part' },
  { key: 'waistCm', label: 'Waist (cm)', hint: 'Natural waistline' },
  { key: 'hipsCm', label: 'Hips (cm)', hint: 'Fullest part of seat' },
  { key: 'inseamCm', label: 'Inseam (cm)', hint: 'Crotch to ankle' },
]
