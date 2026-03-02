'use client'
import type { TuringSpread } from '@/types'

// Diverging bar: negative fills left from center, positive fills right
function DivergingBar({ spread, maxSpread }: { spread: number; maxSpread: number }) {
  const pct = Math.min(100, (Math.abs(spread) / maxSpread) * 100)
  const up  = spread >= 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 11 }}>
      {/* Left (contracting) side */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', height: 7 }}>
        {!up && (
          <div style={{ width: `${pct}%`, height: 7, background: '#661111' }} />
        )}
      </div>
      {/* Center line */}
      <div style={{ width: 1, height: 13, background: '#2a2a2a', flexShrink: 0 }} />
      {/* Right (expanding) side */}
      <div style={{ flex: 1, height: 7 }}>
        {up && (
          <div style={{ width: `${pct}%`, height: 7, background: '#006640' }} />
        )}
      </div>
    </div>
  )
}

export default function TuringSpreadPanel({ data }: { data: TuringSpread[] }) {
  const maxSpread = Math.max(...data.map(d => Math.abs(d.spread)), 1)

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>TURING SPREAD</span>
        <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>agent vs base model</span>
      </div>

      <div className="panel-body">
        {/* Axis label row */}
        <div style={{
          display: 'flex',
          fontSize: 8,
          color: 'var(--text-dim)',
          letterSpacing: '0.05em',
          marginBottom: 3,
          paddingBottom: 3,
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ width: 42, flexShrink: 0 }}>AGENT</span>
          <div style={{ flex: 1, display: 'flex' }}>
            <span style={{ flex: 1, textAlign: 'right', color: 'var(--red)', opacity: 0.6 }}>◀ CONTRACTING</span>
            <span style={{ width: 1 }} />
            <span style={{ flex: 1, color: 'var(--green)', opacity: 0.6 }}>EXPANDING ▶</span>
          </div>
          <span style={{ width: 30, textAlign: 'right', flexShrink: 0 }}>SPRD</span>
        </div>

        {/* Rows */}
        {data.map(row => {
          const up    = row.spread >= 0
          const color = up ? 'var(--green)' : 'var(--red)'
          const sign  = row.spreadTrend >= 0 ? '+' : ''

          return (
            <div key={row.agent} style={{ marginBottom: 6 }}>
              {/* Agent + model name */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <span style={{ width: 42, flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'var(--text-bright)' }}>
                  {row.agent}
                </span>
                <div style={{ flex: 1 }}>
                  <DivergingBar spread={row.spread} maxSpread={maxSpread} />
                </div>
                <span style={{ width: 30, textAlign: 'right', flexShrink: 0, fontWeight: 700, fontSize: 11, color }}>
                  {up ? '+' : ''}{row.spread}
                </span>
              </div>
              {/* Sub-row: model name + weekly delta */}
              <div style={{ display: 'flex', fontSize: 9, color: 'var(--text-dim)', paddingLeft: 42 }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.baseModel}
                </span>
                <span style={{ color, fontWeight: 600, marginLeft: 4 }}>
                  {sign}{row.spreadTrend.toFixed(1)} /wk
                </span>
              </div>
            </div>
          )
        })}

        <hr className="divider" />
        <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
          Spread = agent score − model baseline · expanding = genuine edge
        </div>
      </div>
    </div>
  )
}
