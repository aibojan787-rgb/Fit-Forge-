import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Check, Plus, ShoppingBag, Sparkles } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import { useOutfit, useProducts } from '@/features/catalog/api/use-catalog'
import { ProductTile } from '@/features/catalog/components/product-tile'
import type { Product } from '@/features/catalog/types'
import { useAddToCart } from '@/features/cart/api/use-cart'
import type { CartItem } from '@/features/cart/types'
import { formatPrice } from '@/lib/money'
import { cn } from '@/lib/utils'

export function OutfitPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const outfit = useOutfit(id)
  const products = useProducts(outfit.data?.productIds ?? [])
  const addToCart = useAddToCart()
  // Null means "all pieces selected". Stays in sync when the outfit loads.
  const [selection, setSelection] = useState<string[] | null>(null)
  // Size per piece. Falls back to the first size until the shopper picks one.
  const [sizes, setSizes] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)

  if (outfit.isPending) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-[4/5] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (outfit.isError) {
    return (
      <Notice tone="error" title="This outfit could not be loaded">
        Refresh the page to try again.
      </Notice>
    )
  }

  if (!outfit.data) {
    return (
      <div className="space-y-4">
        <Notice tone="warning" title="We could not find that outfit" />
        <Link to="/app" className={buttonVariants({ variant: 'outline' })}>
          Back to outfits
        </Link>
      </div>
    )
  }

  const current = outfit.data
  const selectedIds = selection ?? current.productIds
  const pieces = products.data ?? []
  const selectedTotal = pieces
    .filter((product) => selectedIds.includes(product.id))
    .reduce((sum, product) => sum + product.priceCents, 0)

  const sizeFor = (product: Product) => sizes[product.id] ?? product.sizes[0] ?? 'One size'

  function toggle(productId: string) {
    setAdded(false)
    setSelection((prev) => {
      const base = prev ?? current.productIds
      return base.includes(productId) ? base.filter((item) => item !== productId) : [...base, productId]
    })
  }

  function bagLines(productList: readonly Product[]): CartItem[] {
    return productList.map((product) => ({ productId: product.id, size: sizeFor(product), quantity: 1 }))
  }

  function addPieces(productList: readonly Product[]) {
    addToCart.mutate(bagLines(productList), {
      onSuccess: () => setAdded(true),
    })
  }

  function openTryOn() {
    const params = new URLSearchParams({ items: selectedIds.join(',') })
    void navigate(`/app/try-on?${params.toString()}`)
  }

  const selectedProducts = pieces.filter((product) => selectedIds.includes(product.id))

  return (
    <div className="space-y-10">
      <Link to="/app" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All outfits
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-2xl bg-beige">
          <img src={current.image} alt={`${current.title} outfit`} className="aspect-[4/5] w-full object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl">{current.title}</h1>
            <p className="text-muted-foreground">{current.summary}</p>
          </div>

          <section aria-labelledby="pieces-heading" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 id="pieces-heading" className="text-2xl">
                Pieces
              </h2>
              <p className="text-sm text-muted-foreground">Pick a size, then add to bag</p>
            </div>

            {products.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-28 w-full rounded-2xl" />
                <Skeleton className="h-28 w-full rounded-2xl" />
              </div>
            ) : null}

            {products.isError ? <Notice tone="error" title="Pieces could not be loaded" /> : null}

            <ul className="space-y-3">
              {pieces.map((product) => {
                const included = selectedIds.includes(product.id)
                const size = sizeFor(product)
                return (
                  <li key={product.id} className="space-y-2">
                    <ProductTile product={product} />
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-white p-3">
                      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Size for ${product.name}`}>
                        {product.sizes.map((option) => (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={option === size}
                            onClick={() => setSizes((prev) => ({ ...prev, [product.id]: option }))}
                            className={cn(
                              'min-w-10 rounded-full border px-3 py-1 text-sm transition-colors',
                              option === size
                                ? 'border-navy bg-navy text-white'
                                : 'border-border text-navy hover:border-navy/50',
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={included ? 'default' : 'outline'}
                          aria-pressed={included}
                          onClick={() => toggle(product.id)}
                        >
                          {included ? <Check className="size-3.5" aria-hidden="true" /> : null}
                          {included ? 'In try-on' : 'Add to try-on'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={addToCart.isPending}
                          onClick={() => addPieces([product])}
                          aria-label={`Add ${product.name}, size ${size}, to bag`}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                          Bag
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          {addToCart.isError ? (
            <Notice tone="error" title="Could not add to your bag">
              Please try again.
            </Notice>
          ) : null}

          {added ? (
            <Notice tone="info" title="Added to your bag">
              <Link to="/cart" className="font-medium underline">
                View bag
              </Link>
            </Notice>
          ) : null}

          <div className="mt-auto space-y-3 border-t border-border pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Selected total</span>
              <span className={cn('font-medium', selectedIds.length === 0 && 'text-muted-foreground')}>
                {formatPrice(selectedTotal)}
              </span>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              disabled={selectedProducts.length === 0 || addToCart.isPending}
              onClick={() => addPieces(selectedProducts)}
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              Add selected to bag
            </Button>
            <Button
              size="lg"
              className="w-full"
              disabled={selectedIds.length === 0}
              onClick={openTryOn}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Try on selected pieces
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
