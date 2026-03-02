'use client'
import { useState } from 'react'
import type { ARSAgent } from '@/types'

const labelColor: Record<ARSAgent['label'], string> = {
  STRONG:   'var(--green)',
  GOOD:     'var(--cyan)',
  MEDIUM:   'var(--amber)',
  LOW:      'var(--red)',
  CRITICAL: 'var(--red)',
}

function ScoreBar({ value }: { value: number }) {
  const filled = Math.min(10, Math.max(0, Math.round(value / 100)))
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: -1 }}>
      <span style={{ color: 'var(--cyan)' }}>{'█'.repeat(filled)}</span>
      <span style={{ color: 'var(--border-bright)' }}>{'░'.repeat(10 - filled)}</span>
    </span>
  )
}

const breakdownLabels: [keyof ARSAgent['breakdown'], string][] = [
  ['framework', 'Framework  '],
  ['incidents', 'Incidents  '],
  ['onchain',   'On-chain   '],
  ['capital',   'Capital    '],
  ['devRep',    'Dev rep    '],
  ['x402',      'x402 rel.  '],
  ['poaa',      'PoAA score '],
  ['age',       'Age        '],
]

export default function ARSPanel({ agents }: { agents: ARSAgent[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>AGENT RISK SCORE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: 'var(--cyan)' }}>TEE-ATTESTED</span>
          <span className="kbd">R</span>
        </div>
      </div>
      <div className="panel-body">
        {agents.map(a => (
          <div key={a.id} style={{ marginBottom: 3 }}>
            {/* Agent header row */}
            <div
              className="data-row"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            >
              <span className="bright" style={{ width: 72, flexShrink: 0, fontWeight: 600 }}>{a.name}</span>
              <span style={{ width: 32, flexShrink: 0, color: 'var(--text-mid)', fontSize: 10 }}>{a.score}</span>
              <ScoreBar value={a.score} />
              <span style={{ marginLeft: 6, color: labelColor[a.label], fontSize: 10, fontWeight: 700 }}>{a.label}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: 9 }}>{expanded === a.id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded breakdown */}
            {expanded === a.id && (
              <div style={{ paddingLeft: 6, paddingTop: 2, borderLeft: '1px solid var(--border-bright)', marginLeft: 4, marginTop: 1 }}>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>
                  {a.framework} {a.audited ? <span className="green">✓ audited</span> : <span className="amber">✗ unaudited</span>}
                  {' · '}{a.incidents === 0 ? <span className="green">0 incidents</span> : <span className="red">{a.incidents} incidents</span>}
                </div>
                {breakdownLabels.map(([key, label]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                    <span style={{ fontSize: 9, color: 'var(--text-dim)', width: 80, flexShrink: 0 }}>├─ {label}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-mid)', width: 28, textAlign: 'right', flexShrink: 0 }}>{a.breakdown[key]}</span>
                    <div style={{ width: `${a.breakdown[key]}px`, maxWidth: 80, height: 4, background: 'var(--cyan-dim)', flexShrink: 0 }} />
                  </div>
                ))}
                <div style={{ marginTop: 2, display: 'flex', gap: 10 }}>
                  <span className="verify-link">FULL REPORT</span>
                  <span className="verify-link">VERIFY TEE</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <hr className="divider" />
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 4 }}>
          Computed in EigenCompute TEE · Scores not editable by creator
        </div>
        <span className="verify-link" style={{ marginTop: 4, display: 'block' }}>VERIFY ALL → eigencloud.xyz</span>
      </div>
    </div>
  )
}
