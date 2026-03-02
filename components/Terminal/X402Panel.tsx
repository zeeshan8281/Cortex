'use client'
import type { X402Flow } from '@/types'

// Deterministic mock hourly volumes — realistic shape (quiet at night, peak midday)
const HOURLY_VOLUMES = [
  3200, 2800, 2100, 1900, 1700, 2100,
  4200, 8100, 12400, 15600, 18200, 21000,
  19800, 22100, 24500, 23200, 21800, 19600,
  16400, 13200, 10800, 8600, 6400, 5200,
]

const W = 200
const BAR_H = 32
const CHART_H = 40
const SLOT = W / 24
const BAR_W = Math.max(2, SLOT - 1.5)

function HourlyChart() {
  const now  = new Date().getHours()
  const maxV = Math.max(...HOURLY_VOLUMES)

  return (
    <svg
      viewBox={`0 0 ${W} ${CHART_H}`}
      width="100%"
      height={CHART_H}
      style={{ display: 'block' }}
    >
      {/* Bars */}
      {HOURLY_VOLUMES.map((v, i) => {
        const bh      = (v / maxV) * BAR_H
        const x       = i * SLOT + (SLOT - BAR_W) / 2
        const y       = CHART_H - 8 - bh
        const isCur   = i === now
        const fill    = isCur ? '#00d084' : i < now ? '#005a66' : '#1e1e1e'
        const opacity = isCur ? 1 : i < now ? 0.9 : 0.4

        return (
          <rect
            key={i}
            x={x.toFixed(1)} y={y.toFixed(1)}
            width={BAR_W.toFixed(1)} height={bh.toFixed(1)}
            fill={fill} fillOpacity={opacity}
          />
        )
      })}

      {/* X axis tick labels: 00, 06, 12, 18, now */}
      {[0, 6, 12, 18].map(h => (
        <text
          key={h}
          x={(h * SLOT + SLOT / 2).toFixed(1)}
          y={CHART_H - 1}
          textAnchor="middle"
          fill="#4a4a4a"
          fontSize="6.5"
          fontFamily="inherit"
        >
          {String(h).padStart(2, '0')}
        </text>
      ))}
      {/* "NOW" label under current hour */}
      <text
        x={(now * SLOT + SLOT / 2).toFixed(1)}
        y={CHART_H - 1}
        textAnchor="middle"
        fill="#00d084"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="inherit"
      >
        NOW
      </text>

      {/* Max volume label */}
      <text
        x={W - 2} y={CHART_H - 8 - BAR_H + 7}
        textAnchor="end"
        fill="#4a4a4a"
        fontSize="6.5"
        fontFamily="inherit"
      >
        ${(maxV / 1000).toFixed(0)}K
      </text>
    </svg>
  )
}

function fmtAmount(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

export default function X402Panel({
  flows, total, trend7d = 34, largest = 2300,
}: {
  flows: X402Flow[]
  total: number
  trend7d?: number
  largest?: number
}) {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>x402 FLOW</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>${(total / 1000).toFixed(0)}K</span>
          <span className="dim" style={{ fontSize: 9 }}>1hr</span>
          <div className="live-dot" />
          <span className="kbd">X</span>
        </div>
      </div>

      <div className="panel-body" style={{ padding: '2px 6px' }}>
        {/* Hourly volume chart */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 8, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: 2 }}>
            24H VOLUME
          </div>
          <HourlyChart />
        </div>

        <hr className="divider" />

        {/* Flow list */}
        {flows.map((f, i) => (
          <div key={i} className="data-row" style={{ fontSize: 10, alignItems: 'center' }}>
            <span style={{
              flex: 1, flexShrink: 1, color: 'var(--text)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
            }}>
              {f.from}
            </span>
            <span className="dim" style={{ fontSize: 8, margin: '0 3px', flexShrink: 0 }}>→</span>
            <span style={{
              flex: 1, flexShrink: 1, color: 'var(--text-dim)', fontSize: 9,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
            }}>
              {f.to}
            </span>
            <span style={{
              display: 'inline-block',
              width: Math.round(f.barWidth * 0.4),
              height: 5, background: 'var(--cyan-dim)',
              verticalAlign: 'middle', marginLeft: 4, flexShrink: 0,
            }} />
            <span style={{ marginLeft: 5, color: 'var(--cyan)', fontWeight: 600, flexShrink: 0 }}>
              {fmtAmount(f.amount)}
            </span>
          </div>
        ))}

        <hr className="divider" />
        <div style={{ display: 'flex', gap: 12, fontSize: 9 }}>
          <span>
            <span className="mid">7d </span>
            <span className={trend7d >= 0 ? 'green' : 'red'}>{trend7d >= 0 ? '▲' : '▼'} {Math.abs(trend7d)}%</span>
          </span>
          <span>
            <span className="mid">largest </span>
            <span className="bright">${(largest / 1000).toFixed(1)}K</span>
          </span>
        </div>
      </div>
    </div>
  )
}
