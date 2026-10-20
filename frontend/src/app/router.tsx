import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { OnboardingShell } from '@/components/layout/onboarding-shell'
import {
  RedirectIfSession,
  RequireOnboarding,
  RequireOnboardingStep,
  RequireSession,
} from '@/app/guards'
import { CartPage } from '@/app/routes/cart-page'
import { CheckoutPage } from '@/app/routes/checkout-page'
import { ConfirmationPage } from '@/app/routes/confirmation-page'
import { GeneratingPage } from '@/app/routes/generating-page'
import { LoginPage } from '@/app/routes/login-page'
import { MeasurePage } from '@/app/routes/measure-page'
import { MeasurementsPage } from '@/app/routes/measurements-page'
import { NotFoundPage } from '@/app/routes/not-found-page'
import { OutfitPage } from '@/app/routes/outfit-page'
import { OutfitsPage } from '@/app/routes/outfits-page'
import { PhotosPage } from '@/app/routes/photos-page'
import { StylePage } from '@/app/routes/style-page'
import { TryOnPage } from '@/app/routes/try-on-page'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  {
    element: <RedirectIfSession />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <RequireSession />,
    children: [
      // Profile pages stay open even when onboarding is unfinished, so measurements can be re-added.
      {
        element: <AppShell />,
        children: [{ path: '/app/measurements', element: <MeasurementsPage /> }],
      },
      {
        element: <RequireOnboardingStep />,
        children: [
          {
            path: '/onboarding',
            element: <OnboardingShell />,
            children: [
              { index: true, element: <Navigate to="/onboarding/measure" replace /> },
              { path: 'measure', element: <MeasurePage /> },
              { path: 'style', element: <StylePage /> },
              { path: 'photos', element: <PhotosPage /> },
              { path: 'generating', element: <GeneratingPage /> },
            ],
          },
        ],
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <AppShell />,
            children: [
              { path: '/app', element: <OutfitsPage /> },
              { path: '/app/outfit/:id', element: <OutfitPage /> },
              { path: '/app/try-on', element: <TryOnPage /> },
              { path: '/cart', element: <CartPage /> },
            ],
          },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/order/confirmation', element: <ConfirmationPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
