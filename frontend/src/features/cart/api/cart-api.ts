import { z } from 'zod'
import { mockDelay, readMockItem, removeMockItem, writeMockItem } from '@/lib/mock-db'
import {
  MAX_QUANTITY,
  cartItemSchema,
  type CartItem,
  type CartLineKey,
  type CartLinePatch,
} from '@/features/cart/types'

export interface CartApi {
  getCart(): Promise<CartItem[]>
  addItems(items: readonly CartItem[]): Promise<CartItem[]>
  updateLine(key: CartLineKey, patch: CartLinePatch): Promise<CartItem[]>
  removeLine(key: CartLineKey): Promise<CartItem[]>
  clearCart(): Promise<void>
}

const CART_KEY = 'cart'
const cartSchema = z.array(cartItemSchema)

const sameLine = (a: CartLineKey, b: CartLineKey) => a.productId === b.productId && a.size === b.size

const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))

// Lines that end up with the same product and size are merged into one.
function mergeLines(lines: readonly CartItem[]): CartItem[] {
  const merged: CartItem[] = []
  for (const line of lines) {
    const existing = merged.find((item) => sameLine(item, line))
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + line.quantity)
    } else {
      merged.push({ ...line, quantity: clampQuantity(line.quantity) })
    }
  }
  return merged
}

function readCart(): CartItem[] {
  return readMockItem(CART_KEY, cartSchema) ?? []
}

function saveCart(lines: CartItem[]): CartItem[] {
  writeMockItem(CART_KEY, lines)
  return lines
}

const mockCartApi: CartApi = {
  async getCart() {
    await mockDelay(120)
    return readCart()
  },

  async addItems(items) {
    await mockDelay(150)
    return saveCart(mergeLines([...readCart(), ...items]))
  },

  async updateLine(key, patch) {
    await mockDelay(120)
    const current = readCart()
    const target = current.find((line) => sameLine(line, key))
    if (!target) return current

    const updated: CartItem = {
      productId: target.productId,
      size: patch.size ?? target.size,
      quantity: patch.quantity === undefined ? target.quantity : clampQuantity(patch.quantity),
    }
    const others = current.filter((line) => !sameLine(line, key))
    return saveCart(mergeLines([...others, updated]))
  },

  async removeLine(key) {
    await mockDelay(120)
    return saveCart(readCart().filter((line) => !sameLine(line, key)))
  },

  async clearCart() {
    await mockDelay(100)
    removeMockItem(CART_KEY)
  },
}

// Mock is the only implementation for now. A backend implementation goes here,
// selected by useMockApi from src/lib/api-config.ts.
export const cartApi: CartApi = mockCartApi
