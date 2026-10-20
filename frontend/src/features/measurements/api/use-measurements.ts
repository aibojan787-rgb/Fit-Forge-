import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { measurementsApi } from '@/features/measurements/api/measurements-api'
import { useCompleteOnboardingStep, useResetOnboardingStep } from '@/features/auth/api/use-auth'
import type { Measurements } from '@/features/measurements/types'

export const measurementsKeys = {
  all: ['measurements'] as const,
}

export function useMeasurements() {
  return useQuery({
    queryKey: measurementsKeys.all,
    queryFn: () => measurementsApi.getMeasurements(),
  })
}

export function useSaveMeasurements() {
  const queryClient = useQueryClient()
  const completeStep = useCompleteOnboardingStep()

  return useMutation({
    mutationFn: async (input: Measurements) => {
      const saved = await measurementsApi.saveMeasurements(input)
      await completeStep.mutateAsync('measurements')
      return saved
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(measurementsKeys.all, saved)
    },
  })
}

// Deleting measurements sends the user back to the measure step, because sizes need them.
export function useDeleteMeasurements() {
  const queryClient = useQueryClient()
  const resetStep = useResetOnboardingStep()

  return useMutation({
    mutationFn: async () => {
      await measurementsApi.deleteMeasurements()
      await resetStep.mutateAsync('measurements')
    },
    onSuccess: () => {
      queryClient.setQueryData(measurementsKeys.all, null)
    },
  })
}
