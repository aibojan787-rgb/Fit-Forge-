import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Outfit, Product } from '@/features/catalog/types'
import { formatPrice } from '@/lib/money'
import { cn } from '@/lib/utils'

type OutfitCardProps = {
  outfit: Outfit
  products: readonly Product[]
  className?: string
}

export function OutfitCard({ outfit, products, className }: OutfitCardProps) {
  const pieces = products.filter((product) => outfit.productIds.includes(product.id))
  const total = pieces.reduce((sum, product) => sum + product.priceCents, 0)

  return (
    <Link
      to={`/app/outfit/${outfit.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:border-navy/40',
        className,
      )}
    >
      <div className="aspect-[4/5] overflow-hidden bg-beige">
        <img
          src={outfit.image}
          alt={`${outfit.title} outfit`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-2xl text-navy">{outfit.title}</h2>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-navy/60" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">{outfit.summary}</p>
        <p className="mt-auto pt-3 text-sm font-medium text-foreground">
          {outfit.productIds.length} pieces
          {pieces.length > 0 ? `, ${formatPrice(total)} total` : null}
        </p>
      </div>
    </Link>
  )
}
