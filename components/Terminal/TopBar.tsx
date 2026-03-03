'use client'
import type { TopBarData } from '@/types'

export interface TopBarStatus { live: number; total: number }

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function TopBar({ data, dataStatus, onStatusClick }: {
  data: TopBarData
  dataStatus?: TopBarStatus
  onStatusClick?: () => void
}) {
  const teeColor = data.teeStatus === 'LIVE' ? 'var(--green)' : data.teeStatus === 'DEGRADED' ? 'var(--amber)' : 'var(--red)'
  const aGDPUp = data.aGDPChange >= 0

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 8px',
      height: '100%',
      background: 'var(--bg)',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.04em',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <span style={{ color: 'var(--text-bright)', marginRight: 14, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
        CORTEX
      </span>

      {/* TEE Status */}
      <span style={{ marginRight: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: teeColor, display: 'inline-block', animation: 'pulse 2s infinite' }} />
        <span style={{ color: teeColor, fontSize: 10 }}>TEE:{data.teeStatus}</span>
      </span>

      {/* EigenDA blob chip */}
      {data.blobRef && (
        <a
          href={`https://blobs.eigenda.xyz/blobs/${data.blobRef}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: 16,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '1px 6px',
            background: 'rgba(138,43,226,0.15)',
            color: '#b06fef',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          title={`EigenDA blob: ${data.blobRef}`}
        >
          DA:{data.blobRef.replace(/^mock:/, '').slice(0, 8)}
        </a>
      )}

      <span style={{ color: 'var(--border-bright)', marginRight: 16 }}>│</span>

      {/* Agents */}
      <span style={{ marginRight: 16 }}>
        <span className="mid">AGENTS </span>
        <span className="bright">{fmt(data.totalAgents)}</span>
      </span>

      {/* aGDP */}
      <span style={{ marginRight: 16 }}>
        <span className="mid">aGDP </span>
        <span className={aGDPUp ? 'green' : 'red'}>
          {aGDPUp ? '▲' : '▼'} ${fmt(data.aGDP)}M
        </span>
        <span className="dim" style={{ fontSize: 9 }}> ({aGDPUp ? '+' : ''}{data.aGDPChange.toFixed(1)}%)</span>
      </span>

      {/* AAI-50 */}
      <span style={{ marginRight: 16 }}>
        <span className="mid">AAI-50 </span>
        <span className={data.aai50Change >= 0 ? 'green' : 'red'}>
          {fmt(data.aai50, 1)}
        </span>
        <span className="dim" style={{ fontSize: 9 }}> ({data.aai50Change >= 0 ? '+' : ''}{data.aai50Change.toFixed(1)}%)</span>
      </span>

      <span style={{ color: 'var(--border-bright)', marginRight: 16 }}>│</span>

      {/* ETH */}
      <span style={{ marginRight: 14 }}>
        <span className="mid">ETH </span>
        <span className="bright">${fmt(data.ethPrice)}</span>
      </span>

      {/* VIRTUAL */}
      <span style={{ marginRight: 14 }}>
        <span className="mid">VIRTUAL </span>
        <span className="bright">${data.virtualPrice.toFixed(2)}</span>
      </span>

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      {/* Keyboard hints */}
      <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {['A·AAI', 'R·ARS', 'X·x402', 'D·DeFAI', 'V·Verify', '>·CMD'].map(hint => (
          <span key={hint} style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{hint}</span>
        ))}
      </span>

      {/* Data status chip */}
      {dataStatus && (
        <span
          onClick={onStatusClick}
          style={{
            marginLeft: 10,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '1px 6px',
            cursor: 'pointer',
            flexShrink: 0,
            background: dataStatus.live === dataStatus.total ? 'var(--green-dim)' : dataStatus.live > 0 ? 'var(--amber-dim)' : 'var(--red-dim)',
            color:      dataStatus.live === dataStatus.total ? 'var(--green)'     : dataStatus.live > 0 ? 'var(--amber)'     : 'var(--red)',
          }}
          title="Click to check data sources"
        >
          LIVE {dataStatus.live}/{dataStatus.total}
        </span>
      )}
    </div>
  )
}
