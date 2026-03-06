'use client'
import { useEffect, useState, useCallback } from 'react'
import { useTerminalData } from '@/hooks/useTerminalData'
import TopBar from './TopBar'
import NetworkHealthBar from './NetworkHealthBar'
import AAI50Panel from './AAI50Panel'
import MortalityPanel from './MortalityPanel'
import ARSPanel from './ARSPanel'
import ConsensusPanel from './ConsensusPanel'
import TokenWatchlistPanel from './TokenWatchlistPanel'
import TuringSpreadPanel from './TuringSpreadPanel'
import ActuarialPanel from './ActuarialPanel'
import X402Panel from './X402Panel'
import DeFAIPanel from './DeFAIPanel'
import AttestationPanel from './AttestationPanel'
import CommandBar from './CommandBar'
import NewsPanel from './NewsPanel'
import StatusOverlay, { useDataStatus } from './StatusOverlay'
import BlobModal from './BlobModal'

// Panel IDs mapped to keyboard keys
const PANEL_KEYS: Record<string, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9, '0': 10,
  'n': 11,
}

function focusStyle(id: number, focused: number): React.CSSProperties {
  return focused === id
    ? { outline: '1px solid var(--cyan)', outlineOffset: -1, zIndex: 2, position: 'relative' }
    : { position: 'relative' }
}

function KeyHint({ k }: { k: string }) {
  return (
    <span style={{
      position:   'absolute',
      top:        2,
      right:      4,
      fontSize:   8,
      color:      'var(--text-dim)',
      fontFamily: 'inherit',
      opacity:    0.5,
      pointerEvents: 'none',
    }}>{k}</span>
  )
}

export default function AppShell() {
  const data = useTerminalData()
  const { status, loading: statusLoading, refresh: refreshStatus } = useDataStatus()
  const [showStatus, setShowStatus] = useState(false)
  const [showBlob, setShowBlob] = useState(false)
  const [focusedPanel, setFocusedPanel] = useState(0)

  const handleKey = useCallback((e: KeyboardEvent) => {
    // Don't hijack input when command bar / any input is focused
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) return

    if (e.key === 'Escape') {
      setShowStatus(false)
      setShowBlob(false)
      setFocusedPanel(0)
      return
    }
    if (e.key === 's' || e.key === 'S') {
      setShowStatus(v => !v)
      return
    }
    const panelId = PANEL_KEYS[e.key]
    if (panelId !== undefined) {
      e.preventDefault()
      setFocusedPanel(p => p === panelId ? 0 : panelId)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 262px',
      gridTemplateRows: '24px 16px 1fr 1fr 28px',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--border)',
      gap: 1,
    }}>
      {/* Row 1: Top bar */}
      <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
        <TopBar
          data={data.topBar}
          dataStatus={status ? { live: status.summary.live, total: status.summary.total } : undefined}
          onStatusClick={() => setShowStatus(true)}
          onBlobClick={() => setShowBlob(true)}
        />
      </div>

      {/* Row 2: Network health bar */}
      <div style={{ gridColumn: '1 / -1', gridRow: '2' }}>
        <NetworkHealthBar data={data.network} />
      </div>

      {/* Row 3: AAI-50 | Mortality | ARS | Consensus | Token Watch */}
      <div style={{
        gridColumn: '1', gridRow: '3',
        display: 'grid',
        gridTemplateColumns: '260px 1fr 1fr 1fr 1fr',
        gap: 1,
        overflow: 'hidden',
      }}>
        <div style={focusStyle(1, focusedPanel)}><KeyHint k="1" /><AAI50Panel entries={data.aai50} topBar={data.topBar} history={data.aai50History} /></div>
        <div style={focusStyle(2, focusedPanel)}><KeyHint k="2" /><MortalityPanel data={data.mortality} /></div>
        <div style={focusStyle(3, focusedPanel)}><KeyHint k="3" /><ARSPanel agents={data.ars} /></div>
        <div style={focusStyle(4, focusedPanel)}><KeyHint k="4" /><ConsensusPanel data={data.consensus} /></div>
        <div style={focusStyle(5, focusedPanel)}><KeyHint k="5" /><TokenWatchlistPanel tokens={data.tokens} /></div>
      </div>

      {/* News column — spans rows 3 and 4 */}
      <div style={{ ...focusStyle(11, focusedPanel), gridColumn: '2', gridRow: '3 / 5', overflow: 'hidden' }}>
        <KeyHint k="n" />
        <NewsPanel items={data.news} />
      </div>

      {/* Row 4: Turing Spread | Actuarial | x402 | DeFAI | Attestation */}
      <div style={{
        gridColumn: '1', gridRow: '4',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gap: 1,
        overflow: 'hidden',
      }}>
        <div style={focusStyle(6, focusedPanel)}><KeyHint k="6" /><TuringSpreadPanel data={data.turingSpread} /></div>
        <div style={focusStyle(7, focusedPanel)}><KeyHint k="7" /><ActuarialPanel rows={data.actuarial} /></div>
        <div style={focusStyle(8, focusedPanel)}><KeyHint k="8" /><X402Panel flows={data.x402Flows} total={data.x402Total} trend7d={data.x402Trend7d} largest={data.x402Largest} /></div>
        <div style={focusStyle(9, focusedPanel)}><KeyHint k="9" /><DeFAIPanel protocols={data.yields} /></div>
        <div style={focusStyle(10, focusedPanel)}><KeyHint k="0" /><AttestationPanel attestations={data.attestations} /></div>
      </div>

      {/* Row 5: Command bar */}
      <div style={{ gridColumn: '1 / -1', gridRow: '5' }}>
        <CommandBar />
      </div>

      {showStatus && (
        <StatusOverlay
          status={status}
          loading={statusLoading}
          onClose={() => setShowStatus(false)}
          onRefresh={refreshStatus}
        />
      )}

      {showBlob && data.topBar.blobRef && (
        <BlobModal
          commitment={data.topBar.blobRef}
          onClose={() => setShowBlob(false)}
        />
      )}
    </div>
  )
}
