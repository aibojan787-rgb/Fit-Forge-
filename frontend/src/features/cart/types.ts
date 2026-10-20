import { z } from 'zod'

export const MAX_QUANTITY = 10

export const cartItemSchema = z.object({
  productId: z.string(),
  size: z.string(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
})

export type CartItem = z.infer<typeof cartItemSchema>

/** A cart line is identified by product and size. */
export type CartLineKey = Pick<CartItem, 'productId' | 'size'>

export type CartLinePatch = {
  size?: string
  quantity?: number
}
