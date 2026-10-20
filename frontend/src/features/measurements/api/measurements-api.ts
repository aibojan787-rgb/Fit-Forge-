import { z } from 'zod'
import { mockDelay, readMockItem, removeMockItem, writeMockItem } from '@/lib/mock-db'
import { measurementsSchema, type Measurements } from '@/features/measurements/types'

export interface MeasurementsApi {
  getMeasurements(): Promise<Measurements | null>
  saveMeasurements(input: Measurements): Promise<Measurements>
  deleteMeasurements(): Promise<void>
}

const storedSchema = z.object({
  heightCm: z.number(),
  chestCm: z.number(),
  waistCm: z.number(),
  hipsCm: z.number(),
  inseamCm: z.number(),
})

const MEASUREMENTS_KEY = 'measurements'

const mockMeasurementsApi: MeasurementsApi = {
  async getMeasurements() {
    await mockDelay(120)
    return readMockItem(MEASUREMENTS_KEY, storedSchema)
  },

  async saveMeasurements(input) {
    await mockDelay()
    const parsed = measurementsSchema.parse(input)
    writeMockItem(MEASUREMENTS_KEY, parsed)
    return parsed
  },

  async deleteMeasurements() {
    await mockDelay()
    removeMockItem(MEASUREMENTS_KEY)
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const measurementsApi: MeasurementsApi = mockMeasurementsApi
