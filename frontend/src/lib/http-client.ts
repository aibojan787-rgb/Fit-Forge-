import { apiBaseUrl } from '@/lib/api-config'

// Small HTTP client for the future backend. Mock APIs do not use it yet.
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpRequestOptions = {
  method?: HttpMethod
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

export async function httpRequest(path: string, options: HttpRequestOptions = {}): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (!response.ok) {
    throw new HttpError(response.status, `Request failed with status ${response.status}`)
  }
  if (response.status === 204) {
    return undefined
  }
  return response.json()
}
