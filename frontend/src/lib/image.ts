/**
 * Reads an image file, scales it down and returns a JPEG data URL.
 * Keeps mock photos small enough for localStorage.
 */
export async function fileToResizedDataUrl(file: File, maxSide = 900, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas is not available in this browser')
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    bitmap.close()
  }
}

/** Fetches an image (URL or data URL) and returns it as a data URL, or null if that fails. */
export async function toDataUrl(source: string, signal?: AbortSignal): Promise<string | null> {
  if (source.startsWith('data:')) return source
  try {
    const response = await fetch(source, { signal })
    if (!response.ok) return null
    const blob = await response.blob()
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}
