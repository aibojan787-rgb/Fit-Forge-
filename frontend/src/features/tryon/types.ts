export type TryOnGarment = {
  id: string
  name: string
  /** URL or data URL of a flat garment image. */
  image: string
}

export type TryOnRequest = {
  /** Person image as a URL or data URL. */
  person: string
  garment: TryOnGarment
}

export type TryOnProgress = {
  step: number
  total: number
  message: string
}

export type TryOnOutcome = {
  /** Person image with every garment applied. URL or data URL. */
  imageUrl: string
  /** Provider that produced the image, for example "mock" or "idm-vton". */
  providerId: string
  /** Set when a real provider was requested but the mock was shown instead. */
  fallbackReason: string | null
  /** True when every step came from the local cache. */
  fromCache: boolean
}
