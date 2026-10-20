import { z } from 'zod'

export const photoSlots = [
  { id: 'front', label: 'Front', hint: 'Facing the camera, arms relaxed' },
  { id: 'three-quarter', label: 'Three-quarter', hint: 'Turned about 45 degrees' },
  { id: 'side-left', label: 'Left side', hint: 'Profile, arms relaxed' },
  { id: 'side-right', label: 'Right side', hint: 'Profile, arms relaxed' },
  { id: 'back', label: 'Back', hint: 'Facing away from the camera' },
  { id: 'full-length', label: 'Full length', hint: 'Head to toe, whole body in frame' },
] as const

export const photoSlotIds = photoSlots.map((slot) => slot.id)

export type PhotoSlotId = (typeof photoSlots)[number]['id']

export const userPhotoSchema = z.object({
  slotId: z.enum(photoSlotIds),
  dataUrl: z.string().startsWith('data:image/'),
})

export type UserPhoto = z.infer<typeof userPhotoSchema>

export type Avatar = {
  id: string
  frontImage: string
  provider: string
  createdAt: string
}

export const avatarSchema = z.object({
  id: z.string(),
  frontImage: z.string(),
  provider: z.string(),
  createdAt: z.string(),
})
