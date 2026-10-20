export class TimeoutError extends Error {
  constructor(seconds: number) {
    super(`The service did not answer within ${seconds} seconds`)
    this.name = 'TimeoutError'
  }
}

type RetryOptions = {
  timeoutMs: number
  retries: number
  signal?: AbortSignal
}

/**
 * Runs a task with a timeout and retries. The timeout is enforced even when the task ignores
 * its AbortSignal. The task gets a fresh signal for each attempt.
 */
export async function withTimeoutAndRetry<T>(
  task: (signal: AbortSignal) => Promise<T>,
  { timeoutMs, retries, signal: parentSignal }: RetryOptions,
): Promise<T> {
  let lastError: unknown = new Error('No attempt was made')

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (parentSignal?.aborted) {
      throw new DOMException('Cancelled', 'AbortError')
    }

    const controller = new AbortController()
    const abortFromParent = () => controller.abort()
    parentSignal?.addEventListener('abort', abortFromParent)

    const timer = window.setTimeout(() => {
      controller.abort(new TimeoutError(Math.round(timeoutMs / 1000)))
    }, timeoutMs)

    try {
      return await raceWithAbort(task(controller.signal), controller.signal)
    } catch (error) {
      lastError = error
      if (parentSignal?.aborted) {
        throw error
      }
    } finally {
      window.clearTimeout(timer)
      parentSignal?.removeEventListener('abort', abortFromParent)
    }
  }

  throw lastError
}

function raceWithAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
    if (signal.aborted) {
      onAbort()
      return
    }
    signal.addEventListener('abort', onAbort, { once: true })
    promise.then(
      (value) => {
        signal.removeEventListener('abort', onAbort)
        resolve(value)
      },
      (error: unknown) => {
        signal.removeEventListener('abort', onAbort)
        reject(error)
      },
    )
  })
}

/** Turns any thrown value into a short, friendly reason for the UI. */
export function describeServiceError(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'the service took too long to answer'
  }
  if (error instanceof Error && /quota|exceeded|limit/i.test(error.message)) {
    return 'the free usage limit has been reached for now'
  }
  return 'the free service is unavailable right now'
}
