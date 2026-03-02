'use client'
import type { ConsensusData, ConsensusPrediction } from '@/types'

const signalColor = (s: string) =>
  s === 'BULLISH' ? '#00d084' : s === 'BEARISH' ? '#ff4444' : '#888888'

const agreementColor = (a: string) =>
  a === 'HIGH' ? 'var(--green)' : a === 'MODERATE' ? 'var(--amber)' : 'var(--red)'

// SVG dot plot showing where each agent's prediction falls on a number line
function PredictionPlot({ predictions, consensus }: { predictions: ConsensusPrediction[]; consensus: number }) {
  const W = 200
  const H = 52
  const PAD_X = 10
  const DOT_Y = 18
  const LINE_Y = 22
  const LABEL_Y = 36

  const values  = predictions.map(p => p.value)
  const minVal  = Math.min(...values)
  const maxVal  = Math.max(...values)
  const margin  = (maxVal - minVal) * 0.25 || 50
  const lo      = minVal - margin
  const hi      = maxVal + margin

  const xOf = (v: number) => PAD_X + ((v - lo) / (hi - lo)) * (W - PAD_X * 2)

  // Short label for each agent
  const shortName = (name: string) => name.split(' ')[0].slice(0, 6).toUpperCase()

  // Range band (from min to max prediction)
  const bandX = xOf(minVal)
  const bandW = xOf(maxVal) - xOf(minVal)
  const cx    = xOf(consensus)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Axis line */}
      <line x1={PAD_X} y1={LINE_Y} x2={W - PAD_X} y2={LINE_Y} stroke="#2a2a2a" strokeWidth="1" />

      {/* Range band */}
      <rect
        x={bandX} y={LINE_Y - 5}
        width={Math.max(0, bandW)} height={10}
        fill="#00d084" fillOpacity="0.08"
        stroke="#00d084" strokeOpacity="0.2" strokeWidth="0.5"
      />

      {/* Consensus vertical line */}
      <line x1={cx} y1={8} x2={cx} y2={LINE_Y + 6} stroke="#00d084" strokeWidth="1" strokeDasharray="2 2" />
      {/* Consensus label above */}
      <text x={cx} y={6} textAnchor="middle" fill="#00d084" fontSize="7" fontWeight="700" fontFamily="inherit">
        ◆
      </text>
      <text x={cx} y={H - 4} textAnchor="middle" fill="#00d084" fontSize="6.5" fontFamily="inherit">
        ${consensus.toLocaleString()}
      </text>

      {/* Agent dots + labels */}
      {predictions.map((p, i) => {
        const x   = xOf(p.value)
        const col = signalColor(p.signal)
        // stagger labels to avoid overlap
        const labelY = LABEL_Y + (i % 2 === 0 ? 0 : 9)

        return (
          <g key={p.agent}>
            {/* Tick drop line from dot to axis */}
            <line x1={x} y1={DOT_Y + 4} x2={x} y2={LINE_Y - 5} stroke={col} strokeWidth="0.5" strokeOpacity="0.4" />
            {/* Dot */}
            <circle
              cx={x} cy={DOT_Y}
              r={3.5}
              fill={col}
              fillOpacity={0.55 + p.confidence / 200}
              stroke={col}
              strokeWidth="1"
            />
            {/* Value */}
            <text x={x} y={DOT_Y - 6} textAnchor="middle" fill={col} fontSize="6.5" fontWeight="600" fontFamily="inherit">
              ${(p.value / 1000).toFixed(1)}K
            </text>
            {/* Agent name below axis */}
            <text x={x} y={labelY} textAnchor="middle" fill="#4a4a4a" fontSize="6.5" fontFamily="inherit">
              {shortName(p.agent)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function ConsensusPanel({ data }: { data: ConsensusData }) {
  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <span>CONSENSUS LAYER</span>
        <div className="live-dot" />
      </div>
      <div className="panel-body">
        {/* Question */}
        <div style={{ fontSize: 10, color: 'var(--amber)', marginBottom: 4, fontWeight: 600 }}>
          {data.question}
        </div>

        {/* Dot plot */}
        <div style={{ marginBottom: 4 }}>
          <PredictionPlot predictions={data.predictions} consensus={data.consensus} />
        </div>

        <hr className="divider" />

        {/* Predictions table */}
        {data.predictions.map(p => (
          <div key={p.agent} className="data-row" style={{ fontSize: 10 }}>
            <span style={{ width: 80, flexShrink: 0, color: 'var(--text)' }}>{p.agent}</span>
            <span style={{ width: 48, flexShrink: 0, color: 'var(--text-bright)', fontWeight: 600 }}>
              ${p.value.toLocaleString()}
            </span>
            <span style={{ width: 44, flexShrink: 0, color: 'var(--text-dim)', fontSize: 9 }}>
              {p.confidence}% conf
            </span>
            <span style={{ color: signalColor(p.signal), fontSize: 9, fontWeight: 600 }}>
              {p.signal === 'BULLISH' ? '▲' : p.signal === 'BEARISH' ? '▼' : '─'} {p.signal}
            </span>
          </div>
        ))}

        <hr className="divider" />

        {/* Consensus summary */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span className="mid" style={{ fontSize: 9 }}>Consensus</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>
            ${data.consensus.toLocaleString()}
          </span>
          <span style={{ fontSize: 9, color: agreementColor(data.agreementLevel), fontWeight: 600 }}>
            {data.agreementLevel} AGREE
          </span>
        </div>

        <hr className="divider" />

        {/* Historical accuracy */}
        <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>ACCURACY (n={data.n})</div>
        <div style={{ display: 'flex', gap: 10, fontSize: 9 }}>
          <span><span className="dim">±10% </span><span className="green">{data.historicalAccuracy10}%</span></span>
          <span><span className="dim">±5% </span><span className="amber">{data.historicalAccuracy5}%</span></span>
          <span><span className="dim">Brier </span><span className="cyan">{data.brierScore}</span></span>
        </div>
      </div>
    </div>
  )
}
