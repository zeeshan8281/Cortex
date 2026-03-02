'use client'
import { useEffect, useState } from 'react'
import type { Attestation } from '@/types'

function sha256sim(s: string): string {
  // deterministic fake hash derived from string (display only)
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(16).padStart(8, '0').repeat(4).slice(0, 32)
}

export default function ReceiptModal({
  attestation,
  onClose,
}: {
  attestation: Attestation
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const inputHash  = sha256sim(attestation.agent + attestation.action)
  const outputHash = sha256sim(attestation.hash + attestation.sig)
  const enclave    = `enclave #${attestation.sig.split(':')[1] ?? '0000'}`

  const receipt = {
    agent:     attestation.agent,
    action:    attestation.action,
    type:      attestation.type,
    chain:     attestation.chain,
    timestamp: attestation.timestamp,
    inputHash: `sha256:${inputHash}`,
    outputHash:`sha256:${outputHash}`,
    enclave,
    kmsSig:    attestation.sig,
    value:     attestation.value,
    txHash:    attestation.hash,
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(receipt, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${attestation.hash}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-bright)',
          width: 540,
          fontFamily: 'inherit',
          fontSize: 11,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '6px 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: 'var(--cyan)' }}>
            PROOF OF COMPUTATION RECEIPT
          </span>
          <span onClick={onClose} style={{ color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>✕</span>
        </div>

        {/* Body */}
        <div style={{ padding: '8px 10px' }}>
          {[
            ['AGENT',      receipt.agent],
            ['ACTION',     receipt.action],
            ['TYPE',       receipt.type],
            ['CHAIN',      receipt.chain],
            ['TIMESTAMP',  receipt.timestamp],
            ['VALUE',      receipt.value != null ? `$${receipt.value}` : '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '2px 0', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.06em', width: 82, flexShrink: 0 }}>{k}</span>
              <span style={{ color: 'var(--text-bright)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}

          <hr className="divider" style={{ margin: '6px 0' }} />

          {[
            ['TX HASH',     `0x${receipt.txHash}`],
            ['INPUT HASH',  receipt.inputHash],
            ['OUTPUT HASH', receipt.outputHash],
            ['ENCLAVE',     receipt.enclave],
            ['KMS SIG',     receipt.kmsSig],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, padding: '2px 0', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: 9, letterSpacing: '0.06em', width: 82, flexShrink: 0 }}>{k}</span>
              <span style={{ color: 'var(--text-mid)', fontFamily: 'inherit', fontSize: 10, wordBreak: 'break-all' }}>{v}</span>
            </div>
          ))}

          <hr className="divider" style={{ margin: '6px 0' }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                background: 'none', border: '1px solid var(--border-bright)',
                color: copied ? 'var(--green)' : 'var(--cyan)',
                fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
                padding: '2px 8px', letterSpacing: '0.06em',
              }}
            >
              {copied ? '✓ COPIED' : 'COPY JSON'}
            </button>
            <button
              onClick={handleDownload}
              style={{
                background: 'none', border: '1px solid var(--border-bright)',
                color: 'var(--text-mid)',
                fontFamily: 'inherit', fontSize: 9, cursor: 'pointer',
                padding: '2px 8px', letterSpacing: '0.06em',
              }}
            >
              DOWNLOAD .JSON
            </button>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
