import { NavLink, Outlet } from 'react-router'
import { LogOut, Ruler, Shirt, ShoppingBag, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Wordmark } from '@/components/layout/wordmark'
import { useLogout } from '@/features/auth/api/use-auth'
import { useCart } from '@/features/cart/api/use-cart'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/app', label: 'Outfits', icon: Shirt, end: true },
  { to: '/app/try-on', label: 'Try on', icon: Sparkles, end: false },
  { to: '/app/measurements', label: 'Measurements', icon: Ruler, end: false },
  { to: '/cart', label: 'Cart', icon: ShoppingBag, end: false },
] as const

export function AppShell() {
  const logout = useLogout()
  const cart = useCart()
  const cartCount = (cart.data ?? []).reduce((sum, line) => sum + line.quantity, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <Wordmark />
          <nav aria-label="Main" className="flex items-center gap-1 md:gap-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-navy text-white'
                      : 'text-navy hover:bg-beige/60',
                  )
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                {to === '/cart' && cartCount > 0 ? (
                  <span className="rounded-full bg-brick px-1.5 text-xs text-white" aria-label={`${cartCount} items in bag`}>
                    {cartCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              className="rounded-full text-navy"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
