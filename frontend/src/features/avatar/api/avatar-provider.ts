import type { Avatar, UserPhoto } from '@/features/avatar/types'

export type AvatarProgress = {
  /** 0 to 1 */
  value: number
  message: string
}

export type AvatarProviderInput = {
  photos: readonly UserPhoto[]
  signal?: AbortSignal
  onProgress?: (progress: AvatarProgress) => void
}

/**
 * Turns the user's photos into a personal avatar.
 * Screens use only this interface, so a paid or self-hosted service can replace the mock later.
 */
export interface AvatarProvider {
  readonly id: string
  createAvatar(input: AvatarProviderInput): Promise<Avatar>
}
