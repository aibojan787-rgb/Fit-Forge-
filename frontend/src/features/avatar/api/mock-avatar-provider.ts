import { mockDelay } from '@/lib/mock-db'
import type { AvatarProvider } from '@/features/avatar/api/avatar-provider'
import type { Avatar } from '@/features/avatar/types'

// Demo provider: the avatar is the user's own front photo. No model is built.
export const mockAvatarProvider: AvatarProvider = {
  id: 'mock',
  async createAvatar({ photos, onProgress }) {
    const front = photos.find((photo) => photo.slotId === 'front') ?? photos[0]
    if (!front) {
      throw new Error('At least one photo is needed to create an avatar')
    }

    const steps = ['Checking photos', 'Estimating body shape', 'Building your avatar']
    for (const [index, message] of steps.entries()) {
      onProgress?.({ value: (index + 1) / (steps.length + 1), message })
      await mockDelay(700)
    }

    const avatar: Avatar = {
      id: crypto.randomUUID(),
      frontImage: front.dataUrl,
      provider: 'mock',
      createdAt: new Date().toISOString(),
    }
    return avatar
  },
}
