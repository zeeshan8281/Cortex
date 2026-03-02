'use client'
import { useState, useMemo } from 'react'
import type { ActuarialRow } from '@/types'

const FW_ORDER = ['ElizaOS', 'G.A.M.E.', 'Custom']

function lossColor(pct: number): string {
  if (pct < 5)  return 'var(--green)'
  if (pct < 15) return 'var(--amber)'
  return 'var(--red)'
}

export default function ActuarialPanel({ rows }: { rows: ActuarialRow[] }) {
  const [capital, setCapital] = useState('')
  const [fw, setFw] = useState('ElizaOS')
  const [age, setAge] = useState('0-30d')
  const [audited, setAudited] = useState(false)

  const match = useMemo(() =>
    rows.find(r =>
      r.framework === fw &&
      r.ageBucket === age &&
      r.audited === audited
    ),
    [rows, fw, age, audited]
  )

  const capNum = parseFloat(capital.replace(/[^0-9.]/g, ''))

  const uniqueFws   = FW_ORDER.filter(f => rows.some(r => r.framework === f))
  const uniqueAges  = [...new Set(rows.map(r => r.ageBucket))]

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>ACTUARIAL TABLE</span>
        <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>expected loss by cohort</span>
      </div>

      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Table */}
        <div style={{ fontSize: 9, marginBottom: 4 }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 44px 22px 34px 34px 22px',
            gap: 2,
            padding: '1px 0 3px',
            color: 'var(--text-dim)',
            letterSpacing: '0.06em',
            borderBottom: '1px solid var(--border)',
            marginBottom: 2,
          }}>
            <span>FRAMEWORK</span>
            <span>AGE</span>
            <span style={{ textAlign: 'center' }}>AUD</span>
            <span style={{ textAlign: 'right' }}>30D%</span>
            <span style={{ textAlign: 'right' }}>90D%</span>
            <span style={{ textAlign: 'right', color: 'var(--text-dim)' }}>N</span>
          </div>

          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 44px 22px 34px 34px 22px',
                gap: 2,
                padding: '1px 0',
                fontSize: 10,
                borderBottom: '1px solid var(--border)',
                background: r.framework === fw && r.ageBucket === age && r.audited === audited
                  ? 'var(--bg-hover)'
                  : 'transparent',
              }}
            >
              <span style={{ color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.framework}
              </span>
              <span style={{ color: 'var(--text-mid)' }}>{r.ageBucket}</span>
              <span style={{ textAlign: 'center', color: r.audited ? 'var(--green)' : 'var(--text-dim)' }}>
                {r.audited ? '✓' : '—'}
              </span>
              <span style={{ textAlign: 'right', color: lossColor(r.loss30d), fontWeight: 600 }}>
                {r.loss30d.toFixed(1)}
              </span>
              <span style={{ textAlign: 'right', color: lossColor(r.loss90d), fontWeight: 600 }}>
                {r.loss90d.toFixed(1)}
              </span>
              <span style={{ textAlign: 'right', color: 'var(--text-dim)' }}>{r.n}</span>
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* Calculator */}
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 3, letterSpacing: '0.06em' }}>
          EXPECTED LOSS CALC
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
          {/* Framework select */}
          <select
            value={fw}
            onChange={e => setFw(e.target.value)}
            style={{
              background: 'var(--bg)', border: '1px solid var(--border-bright)',
              color: 'var(--text)', fontFamily: 'inherit', fontSize: 9,
              padding: '1px 3px', cursor: 'pointer',
            }}
          >
            {uniqueFws.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Age bucket */}
          <select
            value={age}
            onChange={e => setAge(e.target.value)}
            style={{
              background: 'var(--bg)', border: '1px solid var(--border-bright)',
              color: 'var(--text)', fontFamily: 'inherit', fontSize: 9,
              padding: '1px 3px', cursor: 'pointer',
            }}
          >
            {uniqueAges.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Audit */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', color: 'var(--text-mid)', fontSize: 9 }}>
            <input
              type="checkbox"
              checked={audited}
              onChange={e => setAudited(e.target.checked)}
              style={{ accentColor: 'var(--green)' }}
            />
            audited
          </label>

          {/* Capital input */}
          <input
            type="text"
            value={capital}
            onChange={e => setCapital(e.target.value)}
            placeholder="$amount"
            style={{
              background: 'var(--bg)', border: '1px solid var(--border-bright)',
              color: 'var(--text)', fontFamily: 'inherit', fontSize: 9,
              padding: '1px 4px', width: 60,
              outline: 'none',
            }}
          />
        </div>

        {/* Results */}
        {match && !isNaN(capNum) && capNum > 0 ? (
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border-bright)',
            padding: '4px 6px',
            fontSize: 10,
          }}>
            <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>30-day exp. loss</span>
              <span style={{ color: lossColor(match.loss30d), fontWeight: 700 }}>
                ${(capNum * match.loss30d / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-dim)', marginLeft: 4 }}>
                  ({match.loss30d.toFixed(1)}%)
                </span>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>90-day exp. loss</span>
              <span style={{ color: lossColor(match.loss90d), fontWeight: 700 }}>
                ${(capNum * match.loss90d / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text-dim)', marginLeft: 4 }}>
                  ({match.loss90d.toFixed(1)}%)
                </span>
              </span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 3 }}>
              n={match.n} historical agents · {match.audited ? 'audited' : 'unaudited'} cohort
            </div>
          </div>
        ) : match ? (
          <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
            Enter $ amount above to calculate expected loss
          </div>
        ) : (
          <div style={{ fontSize: 9, color: 'var(--amber)' }}>
            No data for this cohort
          </div>
        )}
      </div>
    </div>
  )
}
