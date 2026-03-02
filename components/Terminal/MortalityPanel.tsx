'use client'
import type { MortalityData } from '@/types'

function Bar({ pct, max = 100, color = 'var(--red-dim)' }: { pct: number; max?: number; color?: string }) {
  const w = Math.round((pct / max) * 80)
  return <span style={{ display: 'inline-block', width: w, height: 6, background: color, verticalAlign: 'middle' }} />
}

export default function MortalityPanel({ data }: { data: MortalityData }) {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>AGENT MORTALITY</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>30d rolling</span>
        </div>
      </div>
      <div className="panel-body">
        {/* Deaths this month */}
        <div style={{ marginBottom: 3 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--red)' }}>{data.diedThisMonth.toLocaleString()}</span>
          <span className="mid" style={{ marginLeft: 6, fontSize: 9 }}>agents died this month</span>
        </div>

        {/* Cause of death */}
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2, letterSpacing: '0.06em' }}>CAUSE OF DEATH</div>
        {data.causes.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
            <span style={{ width: 130, fontSize: 10, color: 'var(--text)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.label}
            </span>
            <Bar pct={c.pct} color={c.pct > 30 ? 'var(--red-dim)' : 'var(--amber-dim)'} />
            <span style={{ fontSize: 10, color: 'var(--text-mid)', marginLeft: 2 }}>{c.pct}%</span>
          </div>
        ))}

        <hr className="divider" />

        {/* Lifespan by framework */}
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2, letterSpacing: '0.06em' }}>AVG LIFESPAN BY FRAMEWORK</div>
        {data.lifespanByFramework.map(f => (
          <div key={f.framework} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
            <span style={{ width: 72, fontSize: 10, color: 'var(--text)', flexShrink: 0 }}>{f.framework}</span>
            <Bar pct={f.days} max={f.maxDays} color='var(--cyan-dim)' />
            <span style={{ fontSize: 10, color: 'var(--text-mid)' }}>{f.days}d</span>
          </div>
        ))}

        <hr className="divider" />

        {/* Zombies */}
        <div style={{ marginBottom: 2 }}>
          <span className="amber" style={{ fontWeight: 600 }}>{data.zombies.toLocaleString()}</span>
          <span className="mid"> zombie agents · </span>
          <span className="amber">${(data.zombieValue / 1e6).toFixed(1)}M</span>
          <span className="mid"> locked</span>
        </div>

        {/* Survival at 90d */}
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2, letterSpacing: '0.06em' }}>SURVIVAL AT 90 DAYS</div>
        {data.survivalAt90.map(s => (
          <div key={s.ecosystem} className="data-row" style={{ fontSize: 10 }}>
            <span style={{ width: 88, color: 'var(--text)' }}>{s.ecosystem}</span>
            <Bar pct={s.pct} color={s.pct > 50 ? 'var(--green-dim)' : s.pct > 20 ? 'var(--amber-dim)' : 'var(--red-dim)'} />
            <span style={{ marginLeft: 4, color: s.pct > 50 ? 'var(--green)' : s.pct > 20 ? 'var(--amber)' : 'var(--red)' }}>
              {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
