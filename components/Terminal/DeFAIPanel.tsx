'use client'
import type { DeFAIProtocol } from '@/types'

const trendIcon = (t: DeFAIProtocol['trend']) => t === 'up' ? '▲' : t === 'down' ? '▼' : '─'
const trendColor = (t: DeFAIProtocol['trend']) => t === 'up' ? 'var(--green)' : t === 'down' ? 'var(--red)' : 'var(--text-mid)'

function fmtAUM(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function DeFAIPanel({ protocols }: { protocols: DeFAIProtocol[] }) {
  const totalAUM = protocols.reduce((s, p) => s + p.aum, 0)

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>DeFAI LIVE YIELDS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--text-mid)', fontSize: 9 }}>AUM {fmtAUM(totalAUM)}</span>
          <div className="live-dot" />
          <span className="kbd">D</span>
        </div>
      </div>
      <div className="panel-body">
        {/* Header */}
        <div style={{ display: 'flex', gap: 0, fontSize: 9, color: 'var(--text-dim)', marginBottom: 2, letterSpacing: '0.06em' }}>
          <span style={{ width: 96 }}>PROTOCOL</span>
          <span style={{ width: 48 }}>APY</span>
          <span style={{ width: 56 }}>AUM</span>
          <span>TREND</span>
        </div>

        {protocols.map(p => (
          <div key={p.name} className="data-row" style={{ fontSize: 11 }}>
            <span style={{ width: 96, flexShrink: 0, color: 'var(--text)' }}>{p.name}</span>
            <span style={{
              width: 48, flexShrink: 0, fontWeight: 600,
              color: p.apy >= 8 ? 'var(--green)' : p.apy >= 4 ? 'var(--cyan)' : 'var(--text-mid)'
            }}>
              {p.apy.toFixed(1)}%
            </span>
            <span style={{ width: 56, flexShrink: 0, color: 'var(--text-mid)', fontSize: 10 }}>
              {fmtAUM(p.aum)}
            </span>
            <span style={{ color: trendColor(p.trend), fontSize: 10 }}>
              {trendIcon(p.trend)}
            </span>
          </div>
        ))}

        <hr className="divider" />

        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
          178+ protocols via Orbit integration · Agent-managed positions only
        </div>
        <span className="verify-link" style={{ display: 'block', marginTop: 3 }}>ALL 178 PROTOCOLS</span>
      </div>
    </div>
  )
}
