import { mockDelay, readMockItem, writeMockItem } from '@/lib/mock-db'
import { catalogApi } from '@/features/catalog/api/catalog-api'
import type { CartItem } from '@/features/cart/types'
import {
  orderSchema,
  type CheckoutInput,
  type DeliveryOption,
  type Order,
  type OrderLine,
} from '@/features/orders/types'

export interface OrdersApi {
  getDeliveryOptions(): Promise<DeliveryOption[]>
  /** Prices come from the catalog, never from the client. Payment is a mock step. */
  placeOrder(input: CheckoutInput & { lines: readonly CartItem[] }): Promise<Order>
  getOrder(id: string): Promise<Order | null>
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Tracked, 3 to 5 working days',
    priceCents: 495,
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Next working day if ordered before 2pm',
    priceCents: 1495,
  },
]

const orderKey = (id: string) => `order:${id}`

const mockOrdersApi: OrdersApi = {
  async getDeliveryOptions() {
    await mockDelay(100)
    return deliveryOptions
  },

  async placeOrder({ shipping, deliveryId, lines }) {
    await mockDelay(900)
    if (lines.length === 0) {
      throw new Error('Your cart is empty')
    }

    const products = await catalogApi.listProducts(lines.map((line) => line.productId))
    const orderLines: OrderLine[] = lines.map((line) => {
      const product = products.find((item) => item.id === line.productId)
      if (!product) {
        throw new Error('One of the pieces is no longer available')
      }
      return {
        productId: product.id,
        name: product.name,
        size: line.size,
        quantity: line.quantity,
        unitPriceCents: product.priceCents,
      }
    })

    const delivery = deliveryOptions.find((option) => option.id === deliveryId)
    if (!delivery) {
      throw new Error('Choose a delivery option')
    }

    const subtotalCents = orderLines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0)
    const order: Order = {
      id: `FF-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lines: orderLines,
      shipping,
      deliveryId,
      subtotalCents,
      shippingCents: delivery.priceCents,
      totalCents: subtotalCents + delivery.priceCents,
    }

    if (!writeMockItem(orderKey(order.id), order)) {
      throw new Error('Browser storage is full. Clear site data and try again.')
    }
    return order
  },

  async getOrder(id) {
    await mockDelay(150)
    return readMockItem(orderKey(id), orderSchema)
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const ordersApi: OrdersApi = mockOrdersApi
