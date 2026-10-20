import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/features/catalog/types'
import type { CartItem } from '@/features/cart/types'
import { MAX_QUANTITY } from '@/features/cart/types'
import { formatPrice } from '@/lib/money'
import { cn } from '@/lib/utils'

type CartLineProps = {
  item: CartItem
  product: Product
  busy: boolean
  onSizeChange: (size: string) => void
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartLine({ item, product, busy, onSizeChange, onQuantityChange, onRemove }: CartLineProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-white p-4">
      <img src={product.image} alt={product.name} className="size-24 shrink-0 rounded-xl object-cover" />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-base font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.colour}</p>
          </div>
          <p className="shrink-0 font-medium">{formatPrice(product.priceCents * item.quantity)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`Size for ${product.name}`}>
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              disabled={busy}
              aria-pressed={size === item.size}
              onClick={() => onSizeChange(size)}
              className={cn(
                'min-w-10 rounded-full border px-3 py-1 text-sm transition-colors disabled:opacity-50',
                size === item.size
                  ? 'border-navy bg-navy text-white'
                  : 'border-border text-navy hover:border-navy/50',
              )}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Decrease quantity of ${product.name}`}
              disabled={busy || item.quantity <= 1}
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="rounded-full"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </Button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Increase quantity of ${product.name}`}
              disabled={busy || item.quantity >= MAX_QUANTITY}
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="rounded-full"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={onRemove}
            className="text-brick hover:text-brick"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </Button>
        </div>
      </div>
    </article>
  )
}
