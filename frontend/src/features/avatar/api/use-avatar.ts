import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { avatarApi, type CreateAvatarOptions } from '@/features/avatar/api/avatar-api'
import type { PhotoSlotId } from '@/features/avatar/types'
import { fileToResizedDataUrl } from '@/lib/image'

export const avatarKeys = {
  photos: ['avatar', 'photos'] as const,
  current: ['avatar', 'current'] as const,
}

export function usePhotos() {
  return useQuery({
    queryKey: avatarKeys.photos,
    queryFn: () => avatarApi.getPhotos(),
  })
}

export function useCurrentAvatar() {
  return useQuery({
    queryKey: avatarKeys.current,
    queryFn: () => avatarApi.getAvatar(),
  })
}

export function useSavePhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slotId, file }: { slotId: PhotoSlotId; file: File }) => {
      const dataUrl = await fileToResizedDataUrl(file)
      return avatarApi.savePhoto(slotId, dataUrl)
    },
    onSuccess: (photos) => {
      queryClient.setQueryData(avatarKeys.photos, photos)
    },
  })
}

export function useCreateAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (options: CreateAvatarOptions) => avatarApi.createAvatar(options),
    onSuccess: ({ avatar }) => {
      queryClient.setQueryData(avatarKeys.current, avatar)
    },
  })
}
