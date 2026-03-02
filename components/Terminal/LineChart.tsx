'use client'
import { useState, useCallback, useRef } from 'react'
import type { AAI50DataPoint } from '@/types'

// Catmull-Rom → cubic bezier spline through all points
function splinePath(pts: [number, number][]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
  }
  return d
}

interface Props {
  data: AAI50DataPoint[]
  width?: number
  height?: number
}

const PAD = { top: 6, right: 6, bottom: 18, left: 38 }
const GRAD_ID = 'aai50-area-grad'

export default function LineChart({ data, width = 200, height = 72 }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const chartW = width  - PAD.left - PAD.right
  const chartH = height - PAD.top  - PAD.bottom

  const values = data.map(d => d.value)
  const minV   = Math.min(...values)
  const maxV   = Math.max(...values)
  const range  = maxV - minV || 1
  // add 5% padding top/bottom so line doesn't clip
  const padPct = 0.08
  const lo     = minV - range * padPct
  const hi     = maxV + range * padPct

  const xOf = (i: number) => PAD.left + (i / (data.length - 1)) * chartW
  const yOf = (v: number) => PAD.top  + (1 - (v - lo) / (hi - lo)) * chartH

  const pts: [number, number][] = data.map((d, i) => [xOf(i), yOf(d.value)])

  const linePath  = splinePath(pts)
  const areaPath  = linePath
    + ` L ${pts[pts.length - 1][0].toFixed(2)} ${(PAD.top + chartH).toFixed(2)}`
    + ` L ${pts[0][0].toFixed(2)} ${(PAD.top + chartH).toFixed(2)} Z`

  const up    = data[data.length - 1].value >= data[0].value
  const color = up ? '#00d084' : '#ff4444'

  // Y-axis tick values (3 ticks)
  const yTicks = [minV, (minV + maxV) / 2, maxV]

  // Hover handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx   = (e.clientX - rect.left) * (width / rect.width) - PAD.left
    const idx  = Math.round((mx / chartW) * (data.length - 1))
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)))
  }, [chartW, data.length, width])

  const handleMouseLeave = useCallback(() => setHoverIdx(null), [])

  // Tooltip position
  const hd  = hoverIdx !== null ? data[hoverIdx] : null
  const hx  = hoverIdx !== null ? xOf(hoverIdx) : 0
  const hy  = hoverIdx !== null ? yOf(data[hoverIdx].value) : 0
  // flip tooltip to left when near right edge
  const tipOnLeft = hx > width * 0.55

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ display: 'block', cursor: 'crosshair', overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id={GRAD_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {yTicks.map((v, i) => {
        const y = yOf(v).toFixed(1)
        return (
          <g key={i}>
            <line
              x1={PAD.left} y1={y}
              x2={PAD.left + chartW} y2={y}
              stroke="#1e1e1e" strokeWidth="1"
            />
            <text
              x={PAD.left - 4} y={y}
              textAnchor="end" dominantBaseline="middle"
              fill="#4a4a4a" fontSize="7" fontFamily="inherit"
            >
              {Math.round(v)}
            </text>
          </g>
        )
      })}

      {/* X-axis labels (first and last date) */}
      <text
        x={PAD.left} y={height - 4}
        textAnchor="start" fill="#4a4a4a" fontSize="7" fontFamily="inherit"
      >
        {fmtDate(data[0].date)}
      </text>
      <text
        x={PAD.left + chartW} y={height - 4}
        textAnchor="end" fill="#4a4a4a" fontSize="7" fontFamily="inherit"
      >
        {fmtDate(data[data.length - 1].date)}
      </text>

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${GRAD_ID})`} />

      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Hover crosshair */}
      {hoverIdx !== null && hd && (
        <>
          {/* Vertical line */}
          <line
            x1={hx} y1={PAD.top}
            x2={hx} y2={PAD.top + chartH}
            stroke="#2a2a2a" strokeWidth="1" strokeDasharray="2 2"
          />

          {/* Dot */}
          <circle cx={hx} cy={hy} r={3} fill={color} stroke="#0a0a0a" strokeWidth="1.5" />

          {/* Tooltip box */}
          <g transform={`translate(${tipOnLeft ? hx - 68 : hx + 6}, ${Math.max(PAD.top, hy - 16)})`}>
            <rect
              width={62} height={24}
              fill="#0d0d0d" stroke="#2a2a2a" strokeWidth="1"
              rx="1"
            />
            <text x={6} y={9} fill="#888888" fontSize="7" fontFamily="inherit">
              {fmtDate(hd.date)}
            </text>
            <text x={6} y={19} fill={color} fontSize="9" fontWeight="700" fontFamily="inherit">
              {hd.value.toLocaleString('en-US', { minimumFractionDigits: 1 })}
            </text>
          </g>
        </>
      )}
    </svg>
  )
}
