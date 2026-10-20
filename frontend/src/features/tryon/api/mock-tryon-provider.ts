import { mockDelay } from '@/lib/mock-db'
import type { TryOnProvider } from '@/features/tryon/api/tryon-provider'

// Demo provider: returns the person image unchanged after a short wait.
// The viewer labels this result as a demo preview.
export const mockTryOnProvider: TryOnProvider = {
  id: 'mock',
  async generate({ person }, { signal, onProgress }) {
    onProgress?.('Fitting the piece on you')
    await mockDelay(1200)
    if (signal.aborted) {
      throw new DOMException('Cancelled', 'AbortError')
    }
    return person
  },
}
