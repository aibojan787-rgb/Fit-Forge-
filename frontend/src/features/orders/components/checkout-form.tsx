import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Notice } from '@/components/layout/notice'
import type { CartItem } from '@/features/cart/types'
import { usePlaceOrder, useDeliveryOptions } from '@/features/orders/api/use-orders'
import {
  checkoutInputSchema,
  countries,
  type DeliveryOptionId,
  type ShippingDetails,
} from '@/features/orders/types'
import { formatPrice } from '@/lib/money'
import { cn } from '@/lib/utils'

type ShippingField = keyof ShippingDetails
type FieldErrors = Partial<Record<ShippingField, string>>

type CheckoutFormProps = {
  lines: readonly CartItem[]
  deliveryId: DeliveryOptionId
  onDeliveryChange: (id: DeliveryOptionId) => void
}

const emptyShipping: Record<ShippingField, string> = {
  fullName: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  country: 'US',
}

const fieldDefs: readonly { key: Exclude<ShippingField, 'country'>; label: string; autoComplete: string }[] = [
  { key: 'fullName', label: 'Full name', autoComplete: 'name' },
  { key: 'email', label: 'Email', autoComplete: 'email' },
  { key: 'addressLine1', label: 'Address line 1', autoComplete: 'address-line1' },
  { key: 'addressLine2', label: 'Address line 2 (optional)', autoComplete: 'address-line2' },
  { key: 'city', label: 'City', autoComplete: 'address-level2' },
  { key: 'postcode', label: 'Postcode / ZIP', autoComplete: 'postal-code' },
]

export function CheckoutForm({ lines, deliveryId, onDeliveryChange }: CheckoutFormProps) {
  const navigate = useNavigate()
  const delivery = useDeliveryOptions()
  const placeOrder = usePlaceOrder()
  const [values, setValues] = useState<Record<ShippingField, string>>(emptyShipping)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = checkoutInputSchema.safeParse({
      shipping: values,
      deliveryId,
    })
    if (!result.success) {
      const next: FieldErrors = {}
      for (const issue of result.error.issues) {
        const [section, field] = issue.path
        if (section === 'shipping' && typeof field === 'string' && !next[field as ShippingField]) {
          next[field as ShippingField] = issue.message
        }
      }
      setErrors(next)
      return
    }
    setErrors({})
    placeOrder.mutate(
      { input: result.data, lines },
      {
        onSuccess: (order) => {
          void navigate(`/order/confirmation?id=${encodeURIComponent(order.id)}`, { replace: true })
        },
      },
    )
  }

  const options = delivery.data ?? []

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <section aria-labelledby="shipping-heading" className="space-y-5">
        <h2 id="shipping-heading" className="text-2xl">
          Shipping details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {fieldDefs.map(({ key, label, autoComplete }) => (
            <div key={key} className={cn('space-y-2', (key === 'addressLine1' || key === 'addressLine2' || key === 'fullName' || key === 'email') && 'sm:col-span-2')}>
              <Label htmlFor={`ship-${key}`}>{label}</Label>
              <Input
                id={`ship-${key}`}
                autoComplete={autoComplete}
                value={values[key]}
                onChange={(event) => setValues((prev) => ({ ...prev, [key]: event.target.value }))}
                aria-invalid={Boolean(errors[key])}
                aria-describedby={errors[key] ? `ship-${key}-error` : undefined}
              />
              {errors[key] ? (
                <p id={`ship-${key}-error`} className="text-sm text-brick">
                  {errors[key]}
                </p>
              ) : null}
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="ship-country">Country</Label>
            <select
              id="ship-country"
              value={values.country}
              onChange={(event) => setValues((prev) => ({ ...prev, country: event.target.value }))}
              className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-labelledby="delivery-heading" className="space-y-4">
        <h2 id="delivery-heading" className="text-2xl">
          Delivery
        </h2>
        <div role="radiogroup" aria-label="Delivery option" className="grid gap-3">
          {options.map((option) => {
            const selected = option.id === deliveryId
            return (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-colors',
                  selected ? 'border-navy bg-beige/40' : 'border-border bg-white hover:border-navy/40',
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={selected}
                    onChange={() => onDeliveryChange(option.id)}
                    className="size-4 accent-navy"
                  />
                  <span>
                    <span className="block font-medium">{option.label}</span>
                    <span className="block text-sm text-muted-foreground">{option.description}</span>
                  </span>
                </span>
                <span className="font-medium">{formatPrice(option.priceCents)}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="payment-heading" className="space-y-3">
        <h2 id="payment-heading" className="text-2xl">
          Payment
        </h2>
        <Notice tone="info" title="Payment is simulated in this demo">
          <span className="flex items-start gap-2">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            No card details are collected or stored. Placing the order creates a mock order.
          </span>
        </Notice>
      </section>

      {placeOrder.isError ? (
        <Notice tone="error" title="The order could not be placed">
          {placeOrder.error instanceof Error ? placeOrder.error.message : 'Please try again.'}
        </Notice>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={placeOrder.isPending || lines.length === 0}>
        {placeOrder.isPending ? 'Placing order...' : 'Place order'}
      </Button>
    </form>
  )
}
