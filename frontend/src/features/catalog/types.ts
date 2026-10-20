import type { Gender, StyleId } from '@/features/style/types'

export const productCategories = ['outerwear', 'knitwear', 'tops', 'bottoms', 'accessories'] as const
export type ProductCategory = (typeof productCategories)[number]

export type Product = {
  id: string
  name: string
  gender: Gender
  category: ProductCategory
  /** Price in US cents. */
  priceCents: number
  colour: string
  description: string
  sizes: readonly string[]
  /** Flat garment image used for display and try-on. */
  image: string
}

export type Outfit = {
  id: string
  title: string
  summary: string
  gender: Gender
  styles: readonly StyleId[]
  productIds: readonly string[]
  image: string
}
