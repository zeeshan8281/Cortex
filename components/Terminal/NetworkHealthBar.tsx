'use client'
import type { NetworkHealth } from '@/types'

function fmtGwei(g: number): string {
  if (g === 0) return '—'
  if (g < 0.01) return g.toFixed(4)
  if (g < 1)    return g.toFixed(3)
  return g.toFixed(1)
}

export default function NetworkHealthBar({ data }: { data: NetworkHealth }) {
  const { chains } = data

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 8px',
      height: '100%',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.05em',
      overflow: 'hidden',
    }}>
      <span style={{ color: 'var(--text-dim)', marginRight: 10 }}>GAS</span>

      {chains.map((c, i) => {
        const col = c.status === 'ok' ? 'var(--green)' : c.status === 'slow' ? 'var(--amber)' : 'var(--red)'
        return (
          <span key={c.chain} style={{ marginRight: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            {i > 0 && <span style={{ color: 'var(--border-bright)', marginRight: 14 }}>·</span>}
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: col, display: 'inline-block',
              flexShrink: 0,
            }} />
            <span style={{ color: 'var(--text-mid)' }}>{c.chain} </span>
            <span style={{ color: col }}>{fmtGwei(c.gasPriceGwei)} gwei</span>
          </span>
        )
      })}

      <span style={{ flex: 1 }} />

      <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>
        {chains.filter(c => c.status === 'ok').length}/{chains.length} chains nominal
      </span>
    </div>
  )
}
