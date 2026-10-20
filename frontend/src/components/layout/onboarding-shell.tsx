import { Outlet, useLocation } from 'react-router'
import { Progress } from '@/components/ui/progress'
import { Wordmark } from '@/components/layout/wordmark'
import { onboardingSteps } from '@/app/onboarding-steps'

export function OnboardingShell() {
  const { pathname } = useLocation()
  const currentIndex = Math.max(
    0,
    onboardingSteps.findIndex((step) => pathname.startsWith(step.path)),
  )
  const current = onboardingSteps[currentIndex]
  const percent = ((currentIndex + 1) / onboardingSteps.length) * 100

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 md:px-8">
          <Wordmark />
          <p className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {onboardingSteps.length}
            <span className="hidden sm:inline">: {current.title}</span>
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3 md:px-8">
          <Progress value={percent} aria-label="Onboarding progress" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-8 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
