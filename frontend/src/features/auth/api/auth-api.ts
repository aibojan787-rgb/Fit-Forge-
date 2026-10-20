import { z } from 'zod'
import { mockDelay, readMockItem, removeMockItem, writeMockItem } from '@/lib/mock-db'
import {
  emptyOnboardingProgress,
  type LoginInput,
  type OnboardingProgress,
  type Session,
} from '@/features/auth/types'
import type { OnboardingStepId } from '@/app/onboarding-steps'

export interface AuthApi {
  getSession(): Promise<Session | null>
  login(input: LoginInput): Promise<Session>
  logout(): Promise<void>
  getOnboarding(): Promise<OnboardingProgress>
  completeOnboardingStep(step: OnboardingStepId): Promise<OnboardingProgress>
  resetOnboardingStep(step: OnboardingStepId): Promise<OnboardingProgress>
}

const sessionSchema = z.object({
  user: z.object({ id: z.string(), email: z.string(), name: z.string() }),
  token: z.string(),
})

const onboardingSchema = z.object({
  measurements: z.boolean(),
  style: z.boolean(),
  photos: z.boolean(),
  avatar: z.boolean(),
})

const SESSION_KEY = 'session'
const ONBOARDING_KEY = 'onboarding'

// Mock implementation. Any email and a password of 6+ characters logs in.
const mockAuthApi: AuthApi = {
  async getSession() {
    await mockDelay(150)
    return readMockItem(SESSION_KEY, sessionSchema)
  },

  async login(input) {
    await mockDelay()
    const session: Session = {
      user: {
        id: 'demo-user',
        email: input.email,
        name: input.email.split('@')[0] ?? 'there',
      },
      token: crypto.randomUUID(),
    }
    writeMockItem(SESSION_KEY, session)
    return session
  },

  async logout() {
    await mockDelay(100)
    removeMockItem(SESSION_KEY)
  },

  async getOnboarding() {
    await mockDelay(100)
    return readMockItem(ONBOARDING_KEY, onboardingSchema) ?? emptyOnboardingProgress
  },

  async completeOnboardingStep(step) {
    await mockDelay(150)
    const current = readMockItem(ONBOARDING_KEY, onboardingSchema) ?? emptyOnboardingProgress
    const next: OnboardingProgress = { ...current, [step]: true }
    writeMockItem(ONBOARDING_KEY, next)
    return next
  },

  async resetOnboardingStep(step) {
    await mockDelay(150)
    const current = readMockItem(ONBOARDING_KEY, onboardingSchema) ?? emptyOnboardingProgress
    const next: OnboardingProgress = { ...current, [step]: false }
    writeMockItem(ONBOARDING_KEY, next)
    return next
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const authApi: AuthApi = mockAuthApi
