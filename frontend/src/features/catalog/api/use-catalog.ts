import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '@/features/catalog/api/catalog-api'
import type { Gender } from '@/features/style/types'

export const catalogKeys = {
  outfits: (gender: Gender) => ['catalog', 'outfits', gender] as const,
  outfit: (id: string) => ['catalog', 'outfit', id] as const,
  products: (ids: readonly string[]) => ['catalog', 'products', ...ids] as const,
  product: (id: string) => ['catalog', 'product', id] as const,
}

export function useOutfits(gender: Gender) {
  return useQuery({
    queryKey: catalogKeys.outfits(gender),
    queryFn: () => catalogApi.listOutfits(gender),
  })
}

export function useOutfit(id: string) {
  return useQuery({
    queryKey: catalogKeys.outfit(id),
    queryFn: () => catalogApi.getOutfit(id),
  })
}

export function useProducts(ids: readonly string[]) {
  return useQuery({
    queryKey: catalogKeys.products(ids),
    queryFn: () => catalogApi.listProducts(ids),
    enabled: ids.length > 0,
  })
}
