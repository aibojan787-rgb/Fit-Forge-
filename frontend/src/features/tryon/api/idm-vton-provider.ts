import { toDataUrl } from '@/lib/image'
import type { TryOnProvider } from '@/features/tryon/api/tryon-provider'

// IDM-VTON on a free Hugging Face Space (CC-BY-NC-SA 4.0: non-commercial use only).
// Its tryon endpoint takes: person (image + mask), garment image, garment description,
// auto-mask flag, crop flag, denoising steps and seed.
const DEFAULT_SPACE = 'yisol/IDM-VTON'
const DENOISE_STEPS = 30
const SEED = 42

function isHfToken(value: string): value is `hf_${string}` {
  return value.startsWith('hf_')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function imageUrlFromOutput(data: unknown): string {
  const first: unknown = Array.isArray(data) ? data[0] : undefined
  if (typeof first === 'string') return first
  if (isRecord(first) && typeof first.url === 'string') return first.url
  throw new Error('The try-on service returned an unexpected response')
}

async function imageSource(source: string, signal: AbortSignal): Promise<Blob> {
  const response = await fetch(source, { signal })
  if (!response.ok) {
    throw new Error(`Could not load image (${response.status})`)
  }
  return response.blob()
}

export const idmVtonTryOnProvider: TryOnProvider = {
  id: 'idm-vton',
  async generate({ person, garment }, { signal, onProgress }) {
    const space = import.meta.env.VITE_IDM_VTON_SPACE || DEFAULT_SPACE
    const token = import.meta.env.VITE_HF_TOKEN?.trim() ?? ''

    // Loaded on demand so the Gradio client is not part of the main bundle.
    const { Client, handle_file } = await import('@gradio/client')

    onProgress?.('Connecting to the free try-on service')
    const client = await Client.connect(space, isHfToken(token) ? { token } : {})

    onProgress?.('Sending your photo and the piece')
    const [personBlob, garmentBlob] = await Promise.all([
      imageSource(person, signal),
      imageSource(garment.image, signal),
    ])

    onProgress?.('Generating the try-on, this can take up to a minute')
    const result = await client.predict('/tryon', [
      {
        background: handle_file(personBlob),
        layers: [],
        composite: null,
      },
      handle_file(garmentBlob),
      garment.name,
      true,
      false,
      DENOISE_STEPS,
      SEED,
    ])

    if (signal.aborted) {
      throw new DOMException('Cancelled', 'AbortError')
    }
    const url = imageUrlFromOutput(result.data)
    // Store the result as a data URL so it survives reloads and can be cached.
    return (await toDataUrl(url, signal)) ?? url
  },
}
