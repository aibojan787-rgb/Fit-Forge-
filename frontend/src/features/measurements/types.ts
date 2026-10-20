import { z } from 'zod'

export const measurementsSchema = z.object({
  heightCm: z.number().min(120, 'Height looks too small').max(230, 'Height looks too large'),
  chestCm: z.number().min(60, 'Chest looks too small').max(180, 'Chest looks too large'),
  waistCm: z.number().min(50, 'Waist looks too small').max(180, 'Waist looks too large'),
  hipsCm: z.number().min(60, 'Hips look too small').max(190, 'Hips look too large'),
  inseamCm: z.number().min(55, 'Inseam looks too short').max(110, 'Inseam looks too long'),
})

export type Measurements = z.infer<typeof measurementsSchema>

export type MeasurementKey = keyof Measurements
