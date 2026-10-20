import { z } from 'zod'
import { mockDelay, readMockItem, writeMockItem } from '@/lib/mock-db'
import { withTimeoutAndRetry, describeServiceError } from '@/lib/async'
import { fingerprint } from '@/lib/fingerprint'
import { mockAvatarProvider } from '@/features/avatar/api/mock-avatar-provider'
import { selectAvatarProvider } from '@/features/avatar/api/select-avatar-provider'
import type { AvatarProgress } from '@/features/avatar/api/avatar-provider'
import {
  avatarSchema,
  userPhotoSchema,
  type Avatar,
  type PhotoSlotId,
  type UserPhoto,
} from '@/features/avatar/types'

export type CreateAvatarOptions = {
  signal?: AbortSignal
  onProgress?: (progress: AvatarProgress) => void
}

export type CreateAvatarResult = {
  avatar: Avatar
  /** Set when the requested service failed and the demo avatar was used instead. */
  fallbackReason: string | null
}

export interface AvatarApi {
  getPhotos(): Promise<UserPhoto[]>
  savePhoto(slotId: PhotoSlotId, dataUrl: string): Promise<UserPhoto[]>
  getAvatar(): Promise<Avatar | null>
  createAvatar(options: CreateAvatarOptions): Promise<CreateAvatarResult>
}

const PHOTOS_KEY = 'photos'
const AVATAR_KEY = 'avatar'
const CACHE_PREFIX = 'avatar-cache:'
const photosSchema = z.array(userPhotoSchema)

const AVATAR_TIMEOUT_MS = 90_000
const AVATAR_RETRIES = 1

const mockAvatarApi: AvatarApi = {
  async getPhotos() {
    await mockDelay(100)
    return readMockItem(PHOTOS_KEY, photosSchema) ?? []
  },

  async savePhoto(slotId, dataUrl) {
    await mockDelay(150)
    const current = readMockItem(PHOTOS_KEY, photosSchema) ?? []
    const next = [...current.filter((photo) => photo.slotId !== slotId), { slotId, dataUrl }]
    if (!writeMockItem(PHOTOS_KEY, next)) {
      throw new Error('Browser storage is full. Try smaller photos or clear site data.')
    }
    return next
  },

  async getAvatar() {
    await mockDelay(100)
    return readMockItem(AVATAR_KEY, avatarSchema)
  },

  async createAvatar({ signal, onProgress }) {
    const photos = readMockItem(PHOTOS_KEY, photosSchema) ?? []
    const cacheKey = `${CACHE_PREFIX}${fingerprint(photos.map((photo) => photo.dataUrl))}`

    // Same photos as an earlier run: reuse the result instead of calling the service again.
    const cached = readMockItem(cacheKey, avatarSchema)
    if (cached) {
      onProgress?.({ value: 1, message: 'Using your saved avatar' })
      writeMockItem(AVATAR_KEY, cached)
      return { avatar: cached, fallbackReason: null }
    }

    const selected = selectAvatarProvider()
    let fallbackReason = selected.configError
    let avatar: Avatar

    try {
      avatar = await withTimeoutAndRetry(
        (taskSignal) =>
          selected.provider.createAvatar({ photos, signal: taskSignal, onProgress }),
        { timeoutMs: AVATAR_TIMEOUT_MS, retries: AVATAR_RETRIES, signal },
      )
    } catch (error) {
      if (signal?.aborted) throw error
      fallbackReason = `${describeServiceError(error)}. Using the demo avatar instead.`
      avatar = await mockAvatarProvider.createAvatar({ photos, signal, onProgress })
    }

    writeMockItem(AVATAR_KEY, avatar)
    if (avatar.provider !== mockAvatarProvider.id) {
      writeMockItem(cacheKey, avatar)
    }
    return { avatar, fallbackReason }
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const avatarApi: AvatarApi = mockAvatarApi
