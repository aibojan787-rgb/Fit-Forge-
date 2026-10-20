import { useMemo } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import { useProducts } from '@/features/catalog/api/use-catalog'
import { useCart, useRemoveCartLine, useUpdateCartLine } from '@/features/cart/api/use-cart'
import { CartLine } from '@/features/cart/components/cart-line'
import { formatPrice } from '@/lib/money'

export function CartPage() {
  const cart = useCart()
  const lines = useMemo(() => cart.data ?? [], [cart.data])
  const productIds = useMemo(() => [...new Set(lines.map((line) => line.productId))], [lines])
  const products = useProducts(productIds)
  const updateLine = useUpdateCartLine()
  const removeLine = useRemoveCartLine()
  const busy = updateLine.isPending || removeLine.isPending

  if (cart.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    )
  }

  if (cart.isError) {
    return (
      <Notice tone="error" title="Your bag could not be loaded">
        Refresh the page to try again.
      </Notice>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <h1 className="text-4xl">Your bag is empty</h1>
        <p className="text-muted-foreground">Add pieces from an outfit to see them here.</p>
        <Link to="/app" className={buttonVariants({ size: 'lg' })}>
          Browse outfits
        </Link>
      </div>
    )
  }

  const productById = new Map((products.data ?? []).map((product) => [product.id, product]))
  const priced = lines.flatMap((line) => {
    const product = productById.get(line.productId)
    return product ? [{ line, product }] : []
  })
  const subtotal = priced.reduce((sum, { line, product }) => sum + product.priceCents * line.quantity, 0)
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <div className="space-y-8">
      <h1 className="text-4xl">Your bag</h1>

      {updateLine.isError || removeLine.isError ? (
        <Notice tone="error" title="That change could not be saved">
          Please try again.
        </Notice>
      ) : null}

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:gap-10">
        <div className="space-y-4">
          {products.isPending ? <Skeleton className="h-32 w-full rounded-2xl" /> : null}
          {priced.map(({ line, product }) => (
            <CartLine
              key={`${line.productId}-${line.size}`}
              item={line}
              product={product}
              busy={busy}
              onSizeChange={(size) =>
                updateLine.mutate({ key: { productId: line.productId, size: line.size }, patch: { size } })
              }
              onQuantityChange={(quantity) =>
                updateLine.mutate({ key: { productId: line.productId, size: line.size }, patch: { quantity } })
              }
              onRemove={() => removeLine.mutate({ productId: line.productId, size: line.size })}
            />
          ))}
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-white p-6">
          <h2 className="font-serif text-2xl text-navy">Summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Items ({itemCount})</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-muted-foreground">Chosen at checkout</dd>
            </div>
          </dl>
          <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            to='/checkout'
            aria-disabled={busy || priced.length === 0}
            className={buttonVariants({ size: 'lg', className: 'w-full' })}
          >
            Checkout
            <ArrowRight className='size-4' aria-hidden='true' />
          </Link>
        </aside>
      </div>
    </div>
  )
}
