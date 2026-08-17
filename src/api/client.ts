// Thin fetch wrapper. Every service module goes through this, and nothing
// outside src/api and src/hooks should call fetch directly.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number
  errorCode: string
  detail: unknown
  constructor(message: string, status: number, errorCode: string, detail: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
    this.detail = detail
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Required by the ngrok free-tier tunnel this backend is currently
      // served through — without it, ngrok returns an HTML interstitial
      // instead of the real response. Harmless against a real deployed URL.
      'ngrok-skip-browser-warning': 'true',
    },
    ...options,
  })

  if (!res.ok) {
    // Uniform error shape per API_DOCUMENTATION.md §1: {error_code, message, detail}.
    // error_code is what callers should switch on, never the HTTP status alone.
    const body = await res.json().catch(() => null)
    throw new ApiError(body?.message ?? res.statusText, res.status, body?.error_code ?? 'unknown_error', body?.detail)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

function withQuery(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return path
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value))
  }
  const qs = query.toString()
  return qs ? `${path}?${qs}` : path
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) => request<T>(withQuery(path, params)),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
}
