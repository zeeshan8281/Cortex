'use client'
import { useState } from 'react'
import type { AAI50Entry, TopBarData, AAI50DataPoint } from '@/types'
import LineChart from './LineChart'

const dirIcon  = (d: AAI50Entry['direction']) => d === 'up' ? '▲' : d === 'down' ? '▼' : '─'
const dirColor = (d: AAI50Entry['direction']) => d === 'up' ? 'var(--green)' : d === 'down' ? 'var(--red)' : 'var(--text-mid)'

type Period = '7D' | '30D'

export default function AAI50Panel({
  entries,
  topBar,
  history,
}: {
  entries: AAI50Entry[]
  topBar: TopBarData
  history: AAI50DataPoint[]
}) {
  const [period, setPeriod] = useState<Period>('30D')

  const chartData = period === '7D' ? history.slice(-7) : history

  const up = topBar.aai50Change >= 0
  const changeColor = up ? 'var(--green)' : 'var(--red)'

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="panel-header" style={{ flexShrink: 0 }}>
        <span>AAI-50 INDEX</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {(['7D', '30D'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 9,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                padding: '0 3px',
                color: period === p ? 'var(--cyan)' : 'var(--text-dim)',
                fontWeight: period === p ? 700 : 400,
              }}
            >
              {p}
            </button>
          ))}
          <div className="live-dot" />
        </div>
      </div>

      {/* Value strip */}
      <div style={{
        padding: '4px 8px 2px',
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: changeColor, lineHeight: 1 }}>
          {topBar.aai50.toLocaleString('en-US', { minimumFractionDigits: 1 })}
        </span>
        <span style={{ fontSize: 9, color: changeColor }}>
          {up ? '+' : ''}{topBar.aai50Change.toFixed(1)}%
        </span>
        <span className="dim" style={{ fontSize: 9 }}>24h</span>
      </div>

      {/* Chart */}
      <div style={{ padding: '0 6px 2px', flexShrink: 0 }}>
        <LineChart data={chartData} width={220} height={72} />
      </div>

      <hr className="divider" style={{ margin: '0 6px 2px', flexShrink: 0 }} />

      {/* Agent list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 4px' }}>
        <div style={{
          fontSize: 8,
          color: 'var(--text-dim)',
          letterSpacing: '0.06em',
          padding: '1px 0 2px',
          display: 'grid',
          gridTemplateColumns: '16px 1fr 36px 46px',
          gap: 2,
        }}>
          <span>#</span>
          <span>NAME</span>
          <span style={{ textAlign: 'right' }}>SCORE</span>
          <span style={{ textAlign: 'right' }}>CHG</span>
        </div>

        {entries.map(e => (
          <div
            key={`${e.rank}-${e.ticker}`}
            className="data-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '16px 1fr 36px 46px',
              gap: 2,
              fontSize: 10,
            }}
          >
            <span className="dim">{e.rank}</span>
            <span
              className="bright"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}
            >
              {e.name}
            </span>
            <span style={{ textAlign: 'right', color: 'var(--text)' }}>
              {e.score.toLocaleString()}
            </span>
            <span style={{ textAlign: 'right', color: dirColor(e.direction), fontSize: 9 }}>
              {dirIcon(e.direction)} {Math.abs(e.change).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
