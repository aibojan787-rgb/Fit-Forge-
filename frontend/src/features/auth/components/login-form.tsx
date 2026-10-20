import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Notice } from '@/components/layout/notice'
import { useLogin } from '@/features/auth/api/use-auth'
import { loginSchema } from '@/features/auth/types'

type FieldErrors = Partial<Record<'email' | 'password', string>>

export function LoginForm() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if ((field === 'email' || field === 'password') && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }
    setErrors({})
    login.mutate(result.data, {
      onSuccess: () => {
        // The route guards send the user to their first unfinished step.
        void navigate('/', { replace: true })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-brick">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password ? (
          <p id="password-error" className="text-sm text-brick">
            {errors.password}
          </p>
        ) : null}
      </div>

      {login.isError ? (
        <Notice tone="error" title="Could not log you in">
          Please try again in a moment.
        </Notice>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Log in'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Demo sign-in: any email and a password of 6+ characters.
      </p>
    </form>
  )
}
