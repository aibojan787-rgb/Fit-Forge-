import type { ReactNode } from 'react'
import type { Product } from '@/features/catalog/types'
import { formatPrice } from '@/lib/money'

type ProductTileProps = {
  product: Product
  action?: ReactNode
}

export function ProductTile({ product, action }: ProductTileProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-white p-4">
      <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-beige sm:size-28">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans text-base font-semibold text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.colour}</p>
          </div>
          <p className="shrink-0 font-medium text-foreground">{formatPrice(product.priceCents)}</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        {action ? <div className="mt-auto pt-1">{action}</div> : null}
      </div>
    </article>
  )
}
