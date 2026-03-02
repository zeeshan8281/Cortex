'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'

const SUGGESTIONS = [
  'Show all agents with ARS > 800',
  'List DeFAI protocols with APY > 8%',
  'Show zombie agents with value > $100K',
  'Which agents use ElizaOS framework?',
  'Show Bittensor subnet 36 completions today',
  'What is the Turing Spread for AIXBT?',
  'Explain the x402 payment protocol',
  'Show agent mortality by framework',
]

interface LLMResponse {
  response?: string
  error?: string
  model?: string
}

export default function CommandBar() {
  const [input, setInput]       = useState('')
  const [history, setHistory]   = useState<string[]>([])
  const [histIdx, setHistIdx]   = useState(-1)
  const [suggestion, setSugg]   = useState('')
  const [response, setResponse] = useState<LLMResponse | null>(null)
  const [loading, setLoading]   = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  // Global '>' key focuses the bar
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (document.activeElement === ref.current) return
      if (e.key === '>' || e.key === '/') {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function submit(query: string) {
    const q = query.trim()
    if (!q) return
    setHistory(h => [q, ...h].slice(0, 20))
    setHistIdx(-1)
    setInput('')
    setSugg('')
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const json: LLMResponse = await res.json()
      setResponse(json)
    } catch {
      setResponse({ error: 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter')    { submit(input); return }
    if (e.key === 'ArrowUp')  {
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next); setInput(history[next] ?? '')
      return
    }
    if (e.key === 'ArrowDown') {
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next); setInput(next === -1 ? '' : history[next] ?? '')
      return
    }
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault(); setInput(suggestion); setSugg('')
      return
    }
    if (e.key === 'Escape') {
      ref.current?.blur()
      setResponse(null)
    }
  }

  function onInput(v: string) {
    setInput(v)
    if (v.length > 2) {
      const match = SUGGESTIONS.find(s => s.toLowerCase().startsWith(v.toLowerCase()))
      setSugg(match ?? '')
    } else {
      setSugg('')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Response card — floats above the bar */}
      {(response || loading) && (
        <div style={{
          position:    'absolute',
          bottom:      '100%',
          left:        0, right: 0,
          background:  'var(--bg-panel)',
          border:      '1px solid var(--border-bright)',
          borderBottom:'none',
          padding:     '8px 12px',
          fontSize:    11,
          color:       'var(--text)',
          maxHeight:   180,
          overflowY:   'auto',
          whiteSpace:  'pre-wrap',
          lineHeight:  1.5,
        }}>
          {loading && (
            <span style={{ color: 'var(--cyan)' }}>
              <span style={{ animation: 'blink 1s infinite' }}>█</span> thinking…
            </span>
          )}
          {response?.error && (
            <span style={{ color: 'var(--amber)' }}>⚠ {response.error}</span>
          )}
          {response?.response && (
            <>
              <span>{response.response}</span>
              {response.model && (
                <div style={{ marginTop: 4, color: 'var(--text-dim)', fontSize: 9 }}>
                  via {response.model} · ESC to dismiss
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        height:      '100%',
        minHeight:   32,
        display:     'flex',
        alignItems:  'center',
        padding:     '0 10px',
        borderTop:   '1px solid var(--border)',
        background:  'var(--bg)',
        gap:         6,
      }}>
        <span style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>›</span>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            ref={ref}
            value={input}
            onChange={e => onInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="natural language query across all panels…"
            style={{
              background:  'transparent',
              border:      'none',
              outline:     'none',
              color:       'var(--text-bright)',
              fontFamily:  'inherit',
              fontSize:    11,
              width:       '100%',
              caretColor:  'var(--cyan)',
            }}
          />
          {suggestion && input && (
            <span style={{
              position:   'absolute',
              left:       0, top: 0,
              color:      'var(--text-dim)',
              fontSize:   11,
              pointerEvents: 'none',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
              {input}<span>{suggestion.slice(input.length)}</span>
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {loading && <span style={{ color: 'var(--cyan)', fontSize: 9 }}>processing…</span>}
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>TAB autocomplete</span>
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>↑↓ history</span>
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>ENTER submit · ESC dismiss</span>
        </div>
      </div>
    </div>
  )
}
