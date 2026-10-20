import { Link, useSearchParams } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import { useOrder } from '@/features/orders/api/use-orders'
import { formatPrice } from '@/lib/money'

export function ConfirmationPage() {
  const [params] = useSearchParams()
  const id = params.get('id') ?? ''
  const order = useOrder(id)

  if (!id) {
    return <Notice tone="warning" title="No order number was provided" />
  }
  if (order.isPending) {
    return <Skeleton className="h-64 w-full rounded-2xl" />
  }
  if (order.isError) {
    return (
      <Notice tone="error" title="Your order could not be loaded">
        Refresh the page to try again.
      </Notice>
    )
  }
  if (!order.data) {
    return <Notice tone="warning" title="We could not find that order" />
  }

  const current = order.data

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-3 text-center">
        <CheckCircle2 className="mx-auto size-12 text-navy" aria-hidden="true" />
        <h1 className="text-4xl">Thank you, {current.shipping.fullName.split(' ')[0]}</h1>
        <p className="text-muted-foreground">
          Order <span className="font-medium text-foreground">{current.id}</span> is confirmed. A confirmation
          was sent to {current.shipping.email}.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-white p-6">
        <h2 className="font-serif text-2xl text-navy">Items</h2>
        <ul className="divide-y divide-border">
          {current.lines.map((line) => (
            <li key={`${line.productId}-${line.size}`} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {line.name}, size {line.size} x {line.quantity}
              </span>
              <span className="font-medium">{formatPrice(line.unitPriceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{formatPrice(current.shippingCents)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total paid (mock)</dt>
            <dd>{formatPrice(current.totalCents)}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-2 rounded-2xl border border-border bg-white p-6 text-sm">
        <h2 className="font-serif text-2xl text-navy">Shipping to</h2>
        <p>{current.shipping.fullName}</p>
        <p>{current.shipping.addressLine1}</p>
        {current.shipping.addressLine2 ? <p>{current.shipping.addressLine2}</p> : null}
        <p>
          {current.shipping.city}, {current.shipping.postcode}, {current.shipping.country}
        </p>
      </section>

      <div className="flex justify-center">
        <Link to="/app" className={buttonVariants({ size: 'lg' })}>
          Keep shopping
        </Link>
      </div>
    </div>
  )
}
