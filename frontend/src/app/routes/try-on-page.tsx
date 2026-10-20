import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Check, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import { useCurrentAvatar } from '@/features/avatar/api/use-avatar'
import { useProducts } from '@/features/catalog/api/use-catalog'
import { TryOnViewer } from '@/features/tryon/components/tryon-viewer'
import { cn } from '@/lib/utils'

export function TryOnPage() {
  const [params, setParams] = useSearchParams()
  const avatar = useCurrentAvatar()

  const selectedIds = useMemo(
    () => (params.get('items') ?? '').split(',').filter((id) => id.length > 0),
    [params],
  )
  const products = useProducts(selectedIds)
  const items = useMemo(() => {
    const byId = new Map((products.data ?? []).map((product) => [product.id, product]))
    return selectedIds.flatMap((id) => {
      const product = byId.get(id)
      return product ? [product] : []
    })
  }, [products.data, selectedIds])

  function setItems(ids: string[]) {
    const next = new URLSearchParams(params)
    if (ids.length === 0) next.delete('items')
    else next.set('items', ids.join(','))
    setParams(next, { replace: true })
  }

  if (avatar.isPending) {
    return <Skeleton className="aspect-[3/4] w-full max-w-md rounded-2xl" />
  }
  if (avatar.isError) {
    return (
      <Notice tone="error" title="Your avatar could not be loaded">
        Refresh the page to try again.
      </Notice>
    )
  }
  if (!avatar.data) {
    return (
      <Notice tone="warning" title="Create your avatar first">
        <Link to="/onboarding/photos" className="font-medium underline">
          Upload your photos
        </Link>
      </Notice>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl">Try on</h1>
          <p className="text-muted-foreground">
            Each piece you select is shown on you. Remove a piece to see the look without it.
          </p>
        </div>

        {selectedIds.length === 0 ? (
          <Notice tone="info" title="No pieces selected">
            <Link to="/app" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-2' })}>
              Browse outfits
            </Link>
          </Notice>
        ) : null}

        {products.isPending && selectedIds.length > 0 ? (
          <Skeleton className="h-24 w-full rounded-2xl" />
        ) : null}

        <ul className="space-y-2" aria-label="Selected pieces">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
            >
              <img src={item.image} alt="" className="size-12 rounded-xl object-cover" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.name}</span>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => setItems(selectedIds.filter((id) => id !== item.id))}
                className="flex size-8 items-center justify-center rounded-full text-navy hover:bg-beige/60"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        {items.length > 0 ? (
          <p className={cn('flex items-center gap-2 text-sm text-muted-foreground')}>
            <Check className="size-4 text-navy" aria-hidden="true" />
            {items.length} {items.length === 1 ? 'piece' : 'pieces'} on you
          </p>
        ) : null}
      </div>

      <TryOnViewer avatar={avatar.data} items={items} />
    </div>
  )
}
