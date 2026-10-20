import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { Notice } from '@/components/layout/notice'
import { useProducts } from '@/features/catalog/api/use-catalog'
import { useCart } from '@/features/cart/api/use-cart'
import { CheckoutForm } from '@/features/orders/components/checkout-form'
import { OrderSummary } from '@/features/orders/components/order-summary'
import { useDeliveryOptions } from '@/features/orders/api/use-orders'
import type { DeliveryOptionId } from '@/features/orders/types'

export function CheckoutPage() {
  const cart = useCart()
  const lines = useMemo(() => cart.data ?? [], [cart.data])
  const productIds = useMemo(() => [...new Set(lines.map((line) => line.productId))], [lines])
  const products = useProducts(productIds)
  const delivery = useDeliveryOptions()
  const [deliveryId, setDeliveryId] = useState<DeliveryOptionId>('standard')

  if (cart.isPending) {
    return <Skeleton className="h-96 w-full rounded-2xl" />
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
        <h1 className="text-4xl">Nothing to check out</h1>
        <p className="text-muted-foreground">Your bag is empty.</p>
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
  const shippingCents = delivery.data?.find((option) => option.id === deliveryId)?.priceCents ?? null

  return (
    <div className="space-y-8">
      <h1 className="text-4xl">Checkout</h1>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
        <CheckoutForm lines={lines} deliveryId={deliveryId} onDeliveryChange={setDeliveryId} />
        <OrderSummary items={priced} shippingCents={shippingCents} />
      </div>
    </div>
  )
}
