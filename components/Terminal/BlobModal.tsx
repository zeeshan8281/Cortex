'use client'
import { useEffect, useState } from 'react'

interface SnapshotPayload {
  schemaVersion: string
  timestamp: string
  aGDP: number
  virtualPrice: number
  totalAgents: number
  aai50Index: number
  top10Agents: { name: string; ticker: string; arsScore: number; framework: string }[]
}

export default function BlobModal({
  commitment,
  onClose,
}: {
  commitment: string
  onClose: () => void
}) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [payload, setPayload] = useState<SnapshotPayload | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    setState('loading')
    fetch(`/api/blob?commitment=${encodeURIComponent(commitment)}`)
      .then(r => r.json())
      .then(d => {
        if (d.data) { setPayload(d.data as SnapshotPayload); setState('ok') }
        else setState('error')
      })
      .catch(() => setState('error'))
  }, [commitment])

  function handleCopy() {
    if (!payload) return
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // EigenExplorer link only works for real on-chain blobs (EigenCompute + Holesky proxy)
  // Locally we use --memstore so the commitment exists only in RAM
  const isOnChain = process.env.NEXT_PUBLIC_EIGENCOMPUTE_ATTESTED === 'true'
  const explorerUrl = isOnChain && !commitment.startsWith('mock:')
    ? `https://blobs.eigenda.xyz/blobs/${commitment}`
    : null

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid #b06fef',
          width: 560,
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
          background: 'rgba(138,43,226,0.1)',
        }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: '#b06fef' }}>
            EIGENDA STATE SNAPSHOT
          </span>
          <span onClick={onClose} style={{ color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>✕</span>
        </div>

        {/* Commitment */}
        <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.06em', marginBottom: 2 }}>BLOB COMMITMENT</div>
          <div style={{ color: '#b06fef', fontSize: 9, wordBreak: 'break-all', fontFamily: 'inherit' }}>
            {commitment}
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: 9, marginTop: 2 }}>
            {isOnChain ? 'EigenDA Holesky — on-chain' : 'local memstore — not dispersed to EigenDA network'}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '8px 10px' }}>
          {state === 'loading' && (
            <div style={{ color: 'var(--text-dim)', fontSize: 10, padding: '12px 0', textAlign: 'center' }}>
              retrieving blob from eigenda-proxy...
            </div>
          )}

          {state === 'error' && (
            <div style={{ color: 'var(--amber)', fontSize: 10, padding: '12px 0', textAlign: 'center' }}>
              blob not found — proxy may have restarted (memstore is ephemeral)
            </div>
          )}

          {state === 'ok' && payload && (
            <>
              {/* Key metrics */}
              {[
                ['SCHEMA',       payload.schemaVersion],
                ['TIMESTAMP',    payload.timestamp],
                ['aGDP',         `$${payload.aGDP.toLocaleString()}M`],
                ['VIRTUAL PRICE',`$${payload.virtualPrice.toFixed(4)}`],
                ['TOTAL AGENTS', payload.totalAgents.toLocaleString()],
                ['AAI-50 INDEX', payload.aai50Index.toFixed(1)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 10, padding: '2px 0', alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.06em', width: 100, flexShrink: 0 }}>{k}</span>
                  <span style={{ color: 'var(--text-bright)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <hr className="divider" style={{ margin: '6px 0' }} />

              {/* Top agents */}
              <div style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.06em', marginBottom: 4 }}>
                TOP AGENTS (at time of snapshot)
              </div>
              {payload.top10Agents.map((a, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '16px 80px 50px 1fr 60px', gap: 6, padding: '1px 0', fontSize: 10 }}>
                  <span style={{ color: 'var(--text-dim)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                  <span style={{ color: 'var(--text-mid)' }}>{a.ticker}</span>
                  <span style={{ color: 'var(--cyan)', fontSize: 9 }}>{a.framework}</span>
                  <span style={{ color: 'var(--green)', textAlign: 'right' }}>ARS {a.arsScore}</span>
                </div>
              ))}

              <hr className="divider" style={{ margin: '6px 0' }} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'none', border: '1px solid var(--border-bright)',
                    color: copied ? 'var(--green)' : '#b06fef',
                    fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
                    padding: '2px 8px', letterSpacing: '0.06em',
                  }}
                >
                  {copied ? '✓ COPIED' : 'COPY JSON'}
                </button>
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'none', border: '1px solid var(--border-bright)',
                      color: 'var(--text-mid)', fontFamily: 'inherit', fontSize: 9,
                      padding: '2px 8px', letterSpacing: '0.06em', textDecoration: 'none',
                    }}
                  >
                    VIEW ON EIGENEXPLORER ↗
                  </a>
                )}
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>ESC to close</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
