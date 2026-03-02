'use client'
import { useState, useEffect, useRef } from 'react'
import type { Attestation } from '@/types'

export function useAttestationStream(maxItems = 8) {
  const [attestations, setAttestations] = useState<Attestation[]>([])
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    function connect() {
      const es = new EventSource('/api/attestations/stream')
      esRef.current = es

      es.onmessage = (e) => {
        try {
          const a: Attestation = JSON.parse(e.data)
          setAttestations(prev => [a, ...prev].slice(0, maxItems))
        } catch {
          // ignore malformed events
        }
      }

      es.onerror = () => {
        es.close()
        // Reconnect after 5s
        setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      esRef.current?.close()
    }
  }, [maxItems])

  return attestations
}
