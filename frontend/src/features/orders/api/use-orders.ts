import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/features/orders/api/orders-api'
import { cartApi } from '@/features/cart/api/cart-api'
import { cartKeys } from '@/features/cart/api/use-cart'
import type { CheckoutInput } from '@/features/orders/types'
import type { CartItem } from '@/features/cart/types'

export const ordersKeys = {
  deliveryOptions: ['orders', 'delivery-options'] as const,
  order: (id: string) => ['orders', 'order', id] as const,
}

export function useDeliveryOptions() {
  return useQuery({
    queryKey: ordersKeys.deliveryOptions,
    queryFn: () => ordersApi.getDeliveryOptions(),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ordersKeys.order(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: id.length > 0,
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ input, lines }: { input: CheckoutInput; lines: readonly CartItem[] }) => {
      const order = await ordersApi.placeOrder({ ...input, lines })
      await cartApi.clearCart()
      return order
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}
