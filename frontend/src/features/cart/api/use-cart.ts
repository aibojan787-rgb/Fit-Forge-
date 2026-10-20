import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/features/cart/api/cart-api'
import type { CartItem, CartLineKey, CartLinePatch } from '@/features/cart/types'

export const cartKeys = {
  all: ['cart'] as const,
}

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: () => cartApi.getCart(),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: readonly CartItem[]) => cartApi.addItems(items),
    onSuccess: (lines) => {
      queryClient.setQueryData(cartKeys.all, lines)
    },
  })
}

export function useUpdateCartLine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, patch }: { key: CartLineKey; patch: CartLinePatch }) => cartApi.updateLine(key, patch),
    onSuccess: (lines) => {
      queryClient.setQueryData(cartKeys.all, lines)
    },
  })
}

export function useRemoveCartLine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (key: CartLineKey) => cartApi.removeLine(key),
    onSuccess: (lines) => {
      queryClient.setQueryData(cartKeys.all, lines)
    },
  })
}
