import { z } from 'zod'
import { readMockItem, writeMockItem } from '@/lib/mock-db'
import { withTimeoutAndRetry, describeServiceError } from '@/lib/async'
import { toDataUrl } from '@/lib/image'
import type { Avatar } from '@/features/avatar/types'
import type { TryOnProvider } from '@/features/tryon/api/tryon-provider'
import { mockTryOnProvider } from '@/features/tryon/api/mock-tryon-provider'
import { selectTryOnProvider } from '@/features/tryon/api/select-tryon-provider'
import type { TryOnGarment, TryOnOutcome, TryOnProgress } from '@/features/tryon/types'

export type TryOnChainInput = {
  avatar: Avatar
  garments: readonly TryOnGarment[]
  signal: AbortSignal
  onProgress?: (progress: TryOnProgress) => void
}

export interface TryOnApi {
  /** Applies garments one after another. Each step wears the result of the previous one. */
  generateLook(input: TryOnChainInput): Promise<TryOnOutcome>
}

const TIMEOUT_MS = 150_000
const RETRIES = 1
const CACHE_PREFIX = 'tryon-cache:'
const cacheSchema = z.string()

function cacheKey(providerId: string, avatarId: string, garmentIds: readonly string[]): string {
  return `${CACHE_PREFIX}${providerId}:${avatarId}:${garmentIds.join('+')}`
}

function createTryOnApi(selected: ReturnType<typeof selectTryOnProvider>): TryOnApi {
  return {
    async generateLook({ avatar, garments, signal, onProgress }) {
      let person = avatar.frontImage
      let provider: TryOnProvider = selected.provider
      let fallbackReason: string | null = selected.configError
      let fromCache = true
      const appliedIds: string[] = []

      for (const [index, garment] of garments.entries()) {
        appliedIds.push(garment.id)
        const report = (message: string) => onProgress?.({ step: index + 1, total: garments.length, message })
        report('Preparing')

        if (provider.id !== mockTryOnProvider.id) {
          const cached = readMockItem(cacheKey(provider.id, avatar.id, appliedIds), cacheSchema)
          if (cached) {
            person = cached
            continue
          }
        }

        fromCache = false
        let resultUrl: string
        try {
          resultUrl = await withTimeoutAndRetry(
            (taskSignal) => provider.generate({ person, garment }, { signal: taskSignal, onProgress: report }),
            { timeoutMs: TIMEOUT_MS, retries: RETRIES, signal },
          )
        } catch (error) {
          if (signal.aborted) throw error
          // Real service failed. Show the demo preview for the rest of this look.
          fallbackReason = `${describeServiceError(error)}. Showing a demo preview instead.`
          provider = mockTryOnProvider
          resultUrl = await mockTryOnProvider.generate(
            { person, garment },
            { signal, onProgress: report },
          )
        }

        if (provider.id !== mockTryOnProvider.id) {
          const stored = await toDataUrl(resultUrl, signal)
          if (stored) {
            writeMockItem(cacheKey(provider.id, avatar.id, appliedIds), stored)
          }
        }
        person = resultUrl
      }

      return {
        imageUrl: person,
        providerId: provider.id,
        fallbackReason,
        fromCache,
      }
    },
  }
}

// The provider is chosen once from env in select-tryon-provider.ts.
export const tryOnApi: TryOnApi = createTryOnApi(selectTryOnProvider())
