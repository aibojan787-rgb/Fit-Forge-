import { z } from 'zod'

export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
] as const

export const deliveryOptionIds = ['standard', 'express'] as const
export type DeliveryOptionId = (typeof deliveryOptionIds)[number]

export type DeliveryOption = {
  id: DeliveryOptionId
  label: string
  description: string
  priceCents: number
}

export const shippingSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: z.email({ message: 'Enter a valid email address' }),
  addressLine1: z.string().trim().min(3, 'Enter your street address'),
  addressLine2: z.string().trim(),
  city: z.string().trim().min(2, 'Enter your city'),
  postcode: z.string().trim().min(3, 'Enter your postcode'),
  country: z.enum(countries.map((country) => country.code)),
})

export type ShippingDetails = z.infer<typeof shippingSchema>

export const checkoutInputSchema = z.object({
  shipping: shippingSchema,
  deliveryId: z.enum(deliveryOptionIds),
})

export type CheckoutInput = z.infer<typeof checkoutInputSchema>

export type OrderLine = {
  productId: string
  name: string
  size: string
  quantity: number
  unitPriceCents: number
}

export type Order = {
  id: string
  createdAt: string
  lines: OrderLine[]
  shipping: ShippingDetails
  deliveryId: DeliveryOptionId
  subtotalCents: number
  shippingCents: number
  totalCents: number
}

export const orderSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  lines: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      size: z.string(),
      quantity: z.number(),
      unitPriceCents: z.number(),
    }),
  ),
  shipping: shippingSchema,
  deliveryId: z.enum(deliveryOptionIds),
  subtotalCents: z.number(),
  shippingCents: z.number(),
  totalCents: z.number(),
})
