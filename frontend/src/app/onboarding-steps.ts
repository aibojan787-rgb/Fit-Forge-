import type { OnboardingProgress } from '@/features/auth/types'

export type OnboardingStepId = keyof OnboardingProgress

export type OnboardingStep = {
  id: OnboardingStepId
  path: string
  title: string
}

export const onboardingSteps: readonly OnboardingStep[] = [
  { id: 'measurements', path: '/onboarding/measure', title: 'Measure' },
  { id: 'style', path: '/onboarding/style', title: 'Your style' },
  { id: 'photos', path: '/onboarding/photos', title: 'Your photos' },
  { id: 'avatar', path: '/onboarding/generating', title: 'Your avatar' },
]

export function firstUnfinishedStep(progress: OnboardingProgress): OnboardingStep | null {
  return onboardingSteps.find((step) => !progress[step.id]) ?? null
}
