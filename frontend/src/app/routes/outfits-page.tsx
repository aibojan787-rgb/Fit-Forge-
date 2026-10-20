import { useMemo } from 'react'
import { Link } from 'react-router'
import { Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Notice } from '@/components/layout/notice'
import { useStyle } from '@/features/style/api/use-style'
import { useOutfits, useProducts } from '@/features/catalog/api/use-catalog'
import { OutfitCard } from '@/features/catalog/components/outfit-card'
import { rankOutfits } from '@/features/catalog/rank-outfits'

export function OutfitsPage() {
  const style = useStyle()
  const gender = style.data?.gender ?? 'men'
  const preferredStyles = style.data?.styles ?? []
  const outfits = useOutfits(gender)

  const productIds = useMemo(
    () => [...new Set((outfits.data ?? []).flatMap((outfit) => outfit.productIds))],
    [outfits.data],
  )
  const products = useProducts(productIds)

  const ranked = rankOutfits(outfits.data ?? [], preferredStyles)

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl">Outfits for you</h1>
          <p className="max-w-xl text-muted-foreground">
            Chosen from your style answers. Open an outfit to see its pieces and try them on.
          </p>
        </div>
        <Link to="/app/try-on" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'self-start md:self-auto' })}>
          <Sparkles className="size-4" aria-hidden="true" />
          Open try-on
        </Link>
      </div>

      {outfits.isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading outfits">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      ) : null}

      {outfits.isError ? (
        <Notice tone="error" title="Outfits could not be loaded">
          Refresh the page to try again.
        </Notice>
      ) : null}

      {outfits.data && ranked.length === 0 ? (
        <Notice tone="info" title="No outfits for this profile yet">
          New outfits are added often. Check back soon.
        </Notice>
      ) : null}

      {ranked.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} products={products.data ?? []} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
