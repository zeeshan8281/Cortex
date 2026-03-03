'use client'
import { useState } from 'react'
import type { Attestation } from '@/types'
import ReceiptModal from './ReceiptModal'

const typeColor: Record<Attestation['type'], string> = {
  PoAA:      'var(--purple)',
  Virtuals:  'var(--blue)',
  Griffin:   'var(--cyan)',
  Orbit:     'var(--green)',
  Wayfinder: 'var(--amber)',
  EigenDA:   '#b06fef',
}

export default function AttestationPanel({ attestations }: { attestations: Attestation[] }) {
  const [receipt, setReceipt] = useState<Attestation | null>(null)

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>ATTESTATION STREAM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>click row for receipt</span>
          <div className="live-dot" />
        </div>
      </div>

      <div className="panel-body" style={{ padding: '2px 6px' }}>
        {attestations.map((a, i) => (
          <div
            key={i}
            onClick={() => setReceipt(a)}
            style={{
              marginBottom: 3, paddingBottom: 3,
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            className="new-row"
          >
            {/* Row 1 */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 10 }}>
              <span className="dim" style={{ flexShrink: 0 }}>{a.timestamp}</span>
              <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ color: typeColor[a.type], fontWeight: 600, flexShrink: 0, width: 64 }}>{a.type}</span>
              <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {a.agent}
              </span>
              {a.value && (
                <span style={{ color: 'var(--green)', flexShrink: 0, fontWeight: 600 }}>
                  +${a.value}
                </span>
              )}
            </div>
            {/* Row 2 */}
            <div style={{ display: 'flex', gap: 8, fontSize: 9, color: 'var(--text-dim)', paddingLeft: 72 }}>
              <span style={{ color: 'var(--text-mid)' }}>{a.action}</span>
              <span>hash:{a.hash}</span>
              <span>{a.sig}</span>
              <span className="cyan" style={{ marginLeft: 'auto' }}>{a.chain}</span>
            </div>
          </div>
        ))}

        <span className="verify-link">click any row to view full receipt</span>
      </div>

      {receipt && <ReceiptModal attestation={receipt} onClose={() => setReceipt(null)} />}
    </div>
  )
}
