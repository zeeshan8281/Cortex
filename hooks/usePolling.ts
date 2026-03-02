'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export function usePolling<T>(url: string, intervalMs: number, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const poll = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (mountedRef.current) {
        setData(json)
        setError(null)
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : 'fetch error')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [url])

  useEffect(() => {
    mountedRef.current = true
    poll()
    const id = setInterval(poll, intervalMs)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [poll, intervalMs])

  return { data, loading, error }
}
