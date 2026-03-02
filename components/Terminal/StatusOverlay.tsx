'use client'
import { useState, useEffect } from 'react'

interface SourceStatus {
  name: string
  keyEnv: string | null
  keyPresent: boolean
  reachable: boolean
  valid: boolean
  sampleValue: string
  latencyMs: number
  error: string | null
  mode: 'LIVE' | 'MOCK'
}

interface StatusData {
  summary: { live: number; mock: number; total: number }
  sources: SourceStatus[]
  checkedAt: string
}

export function useDataStatus() {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch('/api/status', { cache: 'no-store' })
      const d: StatusData = await res.json()
      setStatus(d)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  return { status, loading, refresh }
}

export default function StatusOverlay({
  status, loading, onClose, onRefresh,
}: {
  status: StatusData | null
  loading: boolean
  onClose: () => void
  onRefresh: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          width: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          fontFamily: 'inherit',
          fontSize: 11,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '6px 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-bright)' }}>
            DATA SOURCE STATUS
          </span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {status && (
              <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>
                checked {new Date(status.checkedAt).toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              style={{
                background: 'none', border: '1px solid var(--border-bright)',
                color: loading ? 'var(--text-dim)' : 'var(--cyan)',
                fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
                padding: '2px 6px', letterSpacing: '0.06em',
              }}
            >
              {loading ? 'CHECKING…' : '⟳ RECHECK'}
            </button>
            <span
              onClick={onClose}
              style={{ color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}
            >✕</span>
          </div>
        </div>

        {/* Summary */}
        {status && (
          <div style={{
            padding: '5px 10px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', gap: 16, fontSize: 10,
          }}>
            <span><span style={{ color: 'var(--green)', fontWeight: 700 }}>{status.summary.live}</span><span className="dim"> live</span></span>
            <span><span style={{ color: 'var(--amber)', fontWeight: 700 }}>{status.summary.mock}</span><span className="dim"> mock/fallback</span></span>
            <span className="dim">of {status.summary.total} sources</span>
          </div>
        )}

        {/* Sources table */}
        {loading && !status && (
          <div style={{ padding: '20px 10px', color: 'var(--text-dim)', textAlign: 'center' }}>
            checking all sources…
          </div>
        )}

        {status?.sources.map(s => (
          <div
            key={s.name}
            style={{
              padding: '5px 10px',
              borderBottom: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '140px 48px 1fr',
              gap: 10,
              alignItems: 'start',
            }}
          >
            {/* Name */}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-bright)' }}>{s.name}</div>
              {s.keyEnv && (
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>
                  {s.keyEnv}{' '}
                  {s.keyPresent
                    ? <span style={{ color: 'var(--green)' }}>✓ set</span>
                    : <span style={{ color: 'var(--amber)' }}>✗ missing</span>}
                </div>
              )}
              {!s.keyEnv && (
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>no key needed</div>
              )}
            </div>

            {/* Mode badge */}
            <div>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                padding: '1px 5px',
                background: s.mode === 'LIVE' ? 'var(--green-dim)' : 'var(--amber-dim)',
                color:      s.mode === 'LIVE' ? 'var(--green)'     : 'var(--amber)',
              }}>
                {s.mode}
              </span>
            </div>

            {/* Result */}
            <div>
              {s.valid && (
                <div style={{ color: 'var(--text)', fontSize: 10 }}>{s.sampleValue}</div>
              )}
              {s.error && (
                <div style={{ color: 'var(--red)', fontSize: 9 }}>⚠ {s.error}</div>
              )}
              {s.reachable && (
                <div style={{ color: 'var(--text-dim)', fontSize: 9, marginTop: 1 }}>
                  {s.latencyMs}ms
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ padding: '6px 10px', fontSize: 9, color: 'var(--text-dim)' }}>
          ESC or click outside to close · Sources without keys fall back to mock data automatically
        </div>
      </div>
    </div>
  )
}
