import type { H3Event } from 'h3'

const buckets = new Map<string, number[]>()

/**
 * Simple in-memory sliding-window rate limiter (per IP + key).
 * Good enough for a single-instance portfolio; use a shared store (KV/Redis) if scaled out.
 */
export function enforceRateLimit(event: H3Event, key: string, limit: number, windowMs: number) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const id = `${key}:${ip}`
  const now = Date.now()
  const hits = (buckets.get(id) || []).filter(t => now - t < windowMs)

  if (hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - hits[0]!)) / 1000)
    setResponseHeader(event, 'Retry-After', retryAfter)
    throw createError({ statusCode: 429, message: 'Too many requests. Please wait a moment and try again.' })
  }

  hits.push(now)
  buckets.set(id, hits)

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some(t => now - t < windowMs)) buckets.delete(k)
  }
}
