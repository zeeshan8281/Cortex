'use client'
import type { TokenWatch } from '@/types'

function fmtPrice(p: number): string {
  if (p >= 100)  return p.toFixed(2)
  if (p >= 1)    return p.toFixed(3)
  if (p >= 0.01) return p.toFixed(4)
  return p.toFixed(5)
}

function fmtMcap(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`
  return `$${m.toFixed(0)}M`
}

export default function TokenWatchlistPanel({ tokens }: { tokens: TokenWatch[] }) {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>TOKEN WATCH</span>
        <div className="live-dot" />
      </div>

      <div className="panel-body">
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr 52px 52px',
          gap: 4,
          padding: '1px 0 3px',
          fontSize: 9,
          color: 'var(--text-dim)',
          letterSpacing: '0.06em',
          borderBottom: '1px solid var(--border)',
          marginBottom: 2,
        }}>
          <span>SYM</span>
          <span style={{ textAlign: 'right' }}>PRICE</span>
          <span style={{ textAlign: 'right' }}>24H</span>
          <span style={{ textAlign: 'right' }}>MCAP</span>
        </div>

        {tokens.map(t => {
          const up = t.change24h >= 0
          return (
            <div
              key={t.symbol}
              className="data-row"
              style={{ display: 'grid', gridTemplateColumns: '48px 1fr 52px 52px', gap: 4 }}
            >
              <span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: 11 }}>{t.symbol}</span>
              <span style={{ textAlign: 'right', color: 'var(--text-bright)', fontWeight: 600 }}>
                ${fmtPrice(t.price)}
              </span>
              <span style={{
                textAlign: 'right',
                color: up ? 'var(--green)' : 'var(--red)',
                fontWeight: 600,
              }}>
                {up ? '+' : ''}{t.change24h.toFixed(1)}%
              </span>
              <span style={{ textAlign: 'right', color: 'var(--text-mid)', fontSize: 10 }}>
                {fmtMcap(t.marketCapM)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
