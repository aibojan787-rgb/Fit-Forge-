/** Small, fast, non-cryptographic hash (FNV-1a). Used only for cache keys. */
export function fingerprint(parts: readonly string[]): string {
  let hash = 0x811c9dc5
  for (const part of parts) {
    for (let index = 0; index < part.length; index++) {
      hash ^= part.charCodeAt(index)
      hash = Math.imul(hash, 0x01000193)
    }
    hash ^= 0x1f
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
