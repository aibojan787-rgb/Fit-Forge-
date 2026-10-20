import type { Product } from '@/features/catalog/types'
import type { CartItem } from '@/features/cart/types'
import { formatPrice } from '@/lib/money'

type OrderSummaryProps = {
  items: readonly { line: CartItem; product: Product }[]
  shippingCents: number | null
}

export function OrderSummary({ items, shippingCents }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, { line, product }) => sum + product.priceCents * line.quantity, 0)
  const total = subtotal + (shippingCents ?? 0)

  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-border bg-white p-6">
      <h2 className="font-serif text-2xl text-navy">Order summary</h2>
      <ul className="space-y-3">
        {items.map(({ line, product }) => (
          <li key={`${line.productId}-${line.size}`} className="flex items-center gap-3">
            <img src={product.image} alt="" className="size-14 rounded-xl object-cover" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{product.name}</p>
              <p className="text-muted-foreground">
                Size {line.size}, qty {line.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">{formatPrice(product.priceCents * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd>{shippingCents === null ? 'Choose an option' : formatPrice(shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </aside>
  )
}
