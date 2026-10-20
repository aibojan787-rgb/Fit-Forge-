const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** Formats an amount in US cents, for example 18900 becomes "$189.00". */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100)
}
