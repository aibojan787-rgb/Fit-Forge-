import { Navigate, Outlet, useLocation } from 'react-router'
import { useOnboarding, useSession } from '@/features/auth/api/use-auth'
import { emptyOnboardingProgress } from '@/features/auth/types'
import { firstUnfinishedStep, onboardingSteps } from '@/app/onboarding-steps'
import { LoadingState } from '@/components/layout/loading-state'

// Logged-out users go to /login.
export function RequireSession() {
  const session = useSession()
  const location = useLocation()

  if (session.isPending) {
    return <LoadingState label="Checking your session" />
  }
  if (!session.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

// Logged-in users with unfinished onboarding continue at their first unfinished step.
// Shopping routes need onboarding to be complete. Onboarding routes are open after completion.
export function RequireOnboarding() {
  const onboarding = useOnboarding()

  if (onboarding.isPending) {
    return <LoadingState label="Loading your profile" />
  }
  const next = firstUnfinishedStep(onboarding.data ?? emptyOnboardingProgress)
  if (next) {
    return <Navigate to={next.path} replace />
  }
  return <Outlet />
}

export function RequireOnboardingStep() {
  const onboarding = useOnboarding()
  const location = useLocation()

  if (onboarding.isPending) {
    return <LoadingState label="Loading your profile" />
  }
  const next = firstUnfinishedStep(onboarding.data ?? emptyOnboardingProgress)
  if (!next) {
    // Onboarding is finished, so any step can be revisited.
    return <Outlet />
  }
  const requestedIndex = onboardingSteps.findIndex((step) => location.pathname.startsWith(step.path))
  const nextIndex = onboardingSteps.indexOf(next)
  if (requestedIndex > nextIndex) {
    return <Navigate to={next.path} replace />
  }
  return <Outlet />
}

// Logged-in users skip the login page.
export function RedirectIfSession() {
  const session = useSession()
  if (session.isPending) {
    return <LoadingState label="Checking your session" />
  }
  if (session.data) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
