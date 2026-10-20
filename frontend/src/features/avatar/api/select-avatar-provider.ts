import type { AvatarProvider } from '@/features/avatar/api/avatar-provider'
import { mockAvatarProvider } from '@/features/avatar/api/mock-avatar-provider'

export type SelectedAvatarProvider = {
  provider: AvatarProvider
  /** Set when the env asks for a provider that does not exist. */
  configError: string | null
}

// The single place where VITE_AVATAR_PROVIDER is read.
// No free avatar service is configured yet, so every value other than "mock" falls back.
export function selectAvatarProvider(): SelectedAvatarProvider {
  const name = (import.meta.env.VITE_AVATAR_PROVIDER ?? '').trim().toLowerCase()

  if (name === '' || name === 'mock') {
    return { provider: mockAvatarProvider, configError: null }
  }
  return {
    provider: mockAvatarProvider,
    configError: `avatar provider "${name}" is not available`,
  }
}
