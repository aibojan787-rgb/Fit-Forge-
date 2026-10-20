import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth-api'
import type { LoginInput } from '@/features/auth/types'
import type { OnboardingStepId } from '@/app/onboarding-steps'

export const authKeys = {
  session: ['auth', 'session'] as const,
  onboarding: ['auth', 'onboarding'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: () => authApi.getSession(),
  })
}

export function useOnboarding() {
  return useQuery({
    queryKey: authKeys.onboarding,
    queryFn: () => authApi.getOnboarding(),
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session, session)
      void queryClient.invalidateQueries({ queryKey: authKeys.onboarding })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null)
      queryClient.removeQueries({ queryKey: authKeys.onboarding })
    },
  })
}

export function useCompleteOnboardingStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (step: OnboardingStepId) => authApi.completeOnboardingStep(step),
    onSuccess: (progress) => {
      queryClient.setQueryData(authKeys.onboarding, progress)
    },
  })
}

export function useResetOnboardingStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (step: OnboardingStepId) => authApi.resetOnboardingStep(step),
    onSuccess: (progress) => {
      queryClient.setQueryData(authKeys.onboarding, progress)
    },
  })
}
