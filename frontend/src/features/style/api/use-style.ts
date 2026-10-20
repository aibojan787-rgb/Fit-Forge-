import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { styleApi } from '@/features/style/api/style-api'
import { useCompleteOnboardingStep } from '@/features/auth/api/use-auth'
import type { StyleAnswers } from '@/features/style/types'

export const styleKeys = {
  all: ['style'] as const,
}

export function useStyle() {
  return useQuery({
    queryKey: styleKeys.all,
    queryFn: () => styleApi.getStyle(),
  })
}

export function useSaveStyle() {
  const queryClient = useQueryClient()
  const completeStep = useCompleteOnboardingStep()

  return useMutation({
    mutationFn: async (input: StyleAnswers) => {
      const saved = await styleApi.saveStyle(input)
      await completeStep.mutateAsync('style')
      return saved
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(styleKeys.all, saved)
    },
  })
}
