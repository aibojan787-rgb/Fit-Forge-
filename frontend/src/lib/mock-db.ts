import type { z } from 'zod'

// Mock persistence for the demo. Everything here lives in this browser only.
const STORAGE_PREFIX = 'fit-forge.'
export const MOCK_DELAY_MS = 350

export function mockDelay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function readMockItem<T>(key: string, schema: z.ZodType<T>): T | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    const result = schema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

/** Returns false when the browser refuses the write (for example, storage is full). */
export function writeMockItem<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeMockItem(key: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // Storage can be blocked in private windows. Nothing else to clean up.
  }
}
