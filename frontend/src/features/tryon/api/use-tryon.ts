import { useMutation } from '@tanstack/react-query'
import { tryOnApi, type TryOnChainInput } from '@/features/tryon/api/tryon-api'

export function useTryOnLook() {
  return useMutation({
    mutationFn: (input: TryOnChainInput) => tryOnApi.generateLook(input),
  })
}
