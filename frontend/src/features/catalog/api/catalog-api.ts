import { mockDelay } from '@/lib/mock-db'
import type { Gender } from '@/features/style/types'
import type { Outfit, Product } from '@/features/catalog/types'
import { outfitSeed, productSeed } from '@/features/catalog/api/catalog-seed'

export interface CatalogApi {
  listOutfits(gender: Gender): Promise<Outfit[]>
  getOutfit(id: string): Promise<Outfit | null>
  listProducts(ids: readonly string[]): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
}

const mockCatalogApi: CatalogApi = {
  async listOutfits(gender) {
    await mockDelay(200)
    return outfitSeed.filter((outfit) => outfit.gender === gender)
  },

  async getOutfit(id) {
    await mockDelay(150)
    return outfitSeed.find((outfit) => outfit.id === id) ?? null
  },

  async listProducts(ids) {
    await mockDelay(150)
    return productSeed.filter((product) => ids.includes(product.id))
  },

  async getProduct(id) {
    await mockDelay(120)
    return productSeed.find((product) => product.id === id) ?? null
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const catalogApi: CatalogApi = mockCatalogApi
