import { z } from 'zod'

export type User = {
  id: string
  email: string
  name: string
}

export type Session = {
  user: User
  token: string
}

export type OnboardingProgress = {
  measurements: boolean
  style: boolean
  photos: boolean
  avatar: boolean
}

export const loginSchema = z.object({
  email: z.email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Use at least 6 characters' }),
})

export type LoginInput = z.infer<typeof loginSchema>

export const emptyOnboardingProgress: OnboardingProgress = {
  measurements: false,
  style: false,
  photos: false,
  avatar: false,
}
