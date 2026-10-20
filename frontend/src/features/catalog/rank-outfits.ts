import type { StyleId } from '@/features/style/types'
import type { Outfit } from '@/features/catalog/types'

/** Outfits that match more of the user's styles come first. Ties keep alphabetical order. */
export function rankOutfits(outfits: readonly Outfit[], preferred: readonly StyleId[]): Outfit[] {
  const score = (outfit: Outfit) => outfit.styles.filter((style) => preferred.includes(style)).length

  return [...outfits].sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title))
}
