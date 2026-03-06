'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function BetaPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [telegram, setTelegram] = useState('')
  const [status,   setStatus]   = useState<Status>('idle')
  const [errMsg,   setErrMsg]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    const res = await fetch('/api/beta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, telegram }),
    })
    const data = await res.json()

    if (!res.ok) {
      setStatus('error')
      setErrMsg(data.error ?? 'unknown error')
    } else {
      setStatus('success')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #2a2a2a',
    color: '#e8e8e8',
    fontFamily: 'inherit',
    fontSize: 12,
    padding: '7px 10px',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 9,
    letterSpacing: '0.08em',
    color: '#4a4a4a',
    marginBottom: 4,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#4a4a4a', marginBottom: 8 }}>
            CORTEX
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#e8e8e8', letterSpacing: '0.04em', lineHeight: 1.2 }}>
            REQUEST BETA ACCESS
          </div>
          <div style={{ fontSize: 11, color: '#4a4a4a', marginTop: 8, lineHeight: 1.5 }}>
            Bloomberg Terminal for the AI Agent Economy.<br />
            Real-time intelligence. Zero noise.
          </div>
        </div>

        {status === 'success' ? (
          <div style={{
            border: '1px solid #006640',
            background: 'rgba(0,208,132,0.05)',
            padding: '20px 16px',
          }}>
            <div style={{ color: '#00d084', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>
              ✓ YOU'RE ON THE LIST
            </div>
            <div style={{ fontSize: 10, color: '#888', lineHeight: 1.6 }}>
              We'll reach out via email and Telegram when your access is ready.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <label style={labelStyle}>NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Satoshi Nakamoto"
                  required
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#00bcd4'}
                  onBlur={e  => e.currentTarget.style.borderColor = '#2a2a2a'}
                />
              </div>

              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = '#00bcd4'}
                  onBlur={e  => e.currentTarget.style.borderColor = '#2a2a2a'}
                />
              </div>

              <div>
                <label style={labelStyle}>TELEGRAM USERNAME</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    color: '#4a4a4a', fontSize: 12, pointerEvents: 'none',
                  }}>@</span>
                  <input
                    type="text"
                    value={telegram}
                    onChange={e => setTelegram(e.target.value.replace(/^@/, ''))}
                    placeholder="username"
                    required
                    style={{ ...inputStyle, paddingLeft: 22 }}
                    onFocus={e => e.currentTarget.style.borderColor = '#00bcd4'}
                    onBlur={e  => e.currentTarget.style.borderColor = '#2a2a2a'}
                  />
                </div>
              </div>

              {status === 'error' && (
                <div style={{ fontSize: 10, color: '#ff4444', letterSpacing: '0.04em' }}>
                  ERROR: {errMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '9px 0',
                  background: status === 'loading' ? '#111' : '#00d084',
                  color: status === 'loading' ? '#4a4a4a' : '#0a0a0a',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {status === 'loading' ? 'SUBMITTING...' : 'REQUEST ACCESS →'}
              </button>

            </div>
          </form>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, fontSize: 9, color: '#2a2a2a', letterSpacing: '0.06em' }}>
          CORTEX · POWERED BY EIGENCOMPUTE TEE · DATA ANCHORED ON EIGENDA
        </div>
      </div>
    </div>
  )
}
