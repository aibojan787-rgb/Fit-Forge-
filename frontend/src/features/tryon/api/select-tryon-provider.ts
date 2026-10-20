import type { TryOnProvider } from '@/features/tryon/api/tryon-provider'
import { idmVtonTryOnProvider } from '@/features/tryon/api/idm-vton-provider'
import { mockTryOnProvider } from '@/features/tryon/api/mock-tryon-provider'

export type SelectedTryOnProvider = {
  provider: TryOnProvider
  /** Set when the env asks for a provider that does not exist. */
  configError: string | null
}

// The single place where VITE_TRYON_PROVIDER is read.
export function selectTryOnProvider(): SelectedTryOnProvider {
  const name = (import.meta.env.VITE_TRYON_PROVIDER ?? '').trim().toLowerCase()

  if (name === '' || name === 'mock') {
    return { provider: mockTryOnProvider, configError: null }
  }
  if (name === 'idm-vton') {
    return { provider: idmVtonTryOnProvider, configError: null }
  }
  return {
    provider: mockTryOnProvider,
    configError: `try-on provider "${name}" is not available`,
  }
}
