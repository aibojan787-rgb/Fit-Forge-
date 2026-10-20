import { Navigate } from 'react-router'
import { LoginForm } from '@/features/auth/components/login-form'
import { useSession } from '@/features/auth/api/use-auth'
import { Wordmark } from '@/components/layout/wordmark'

export function LoginPage() {
  const session = useSession()

  if (session.data) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-16 items-center px-4 md:px-8">
        <Wordmark />
      </header>
      <main className="grid flex-1 md:grid-cols-2">
        <section
          aria-hidden="true"
          className="hidden flex-col justify-end bg-beige p-12 md:flex"
        >
          <p className="max-w-md font-serif text-4xl leading-tight text-navy">
            Clothes cut for the body you actually have.
          </p>
        </section>
        <section className="flex items-center justify-center px-4 py-12 md:px-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl">Log in</h1>
              <p className="text-muted-foreground">
                Pick up where you left off, or start your fit profile.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </main>
    </div>
  )
}
