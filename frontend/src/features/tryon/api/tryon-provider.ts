import type { TryOnRequest } from '@/features/tryon/types'

export type TryOnProviderOptions = {
  signal: AbortSignal
  onProgress?: (message: string) => void
}

/**
 * Virtual try-on: person photo + garment image in, person wearing the garment out.
 * Screens only use TryOnViewer, which uses this interface. A paid or self-hosted service
 * replaces the provider here without touching the screens.
 */
export interface TryOnProvider {
  readonly id: string
  /** Resolves to a URL or data URL of the result image. */
  generate(request: TryOnRequest, options: TryOnProviderOptions): Promise<string>
}
