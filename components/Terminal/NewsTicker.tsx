'use client'
import { useEffect, useRef, useState } from 'react'
import type { NewsItem } from '@/lib/sources/rss'

const SOURCE_COLORS: Record<string, string> = {
  'CoinTelegraph': 'var(--amber)',
  'CoinDesk':      'var(--cyan)',
  'Decrypt':       'var(--purple)',
  'The Defiant':   'var(--green)',
  'The Block':     'var(--blue)',
  'Blockworks':    'var(--text-mid)',
}

export default function NewsTicker({ items }: { items: NewsItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  // Duplicate items so the scroll loops seamlessly
  const displayed = [...items, ...items]

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const total = el.scrollWidth / 2  // half = one full set

    let x = 0
    let raf: number

    function tick() {
      if (!paused) {
        x += 0.6
        if (x >= total) x = 0
        if (el) el.style.transform = `translateX(-${x}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [items, paused])

  if (!items.length) return null

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        cursor: 'default',
        userSelect: 'none',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Label */}
      <div style={{
        flexShrink: 0,
        padding: '0 8px',
        fontSize: 9,
        fontWeight: 700,
        color: 'var(--bg)',
        background: 'var(--amber)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
      }}>
        NEWS
      </div>

      {/* Scrolling track */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            height: '100%',
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {displayed.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
              {/* Source tag */}
              <span style={{
                fontSize: 8,
                fontWeight: 700,
                color: SOURCE_COLORS[item.source] ?? 'var(--text-dim)',
                marginRight: 5,
                letterSpacing: '0.06em',
              }}>
                {item.source.toUpperCase()}
              </span>
              {/* Headline */}
              <a
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 10,
                  color: 'var(--text)',
                  textDecoration: 'none',
                  marginRight: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--cyan)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
              >
                {item.title}
              </a>
              {/* Separator */}
              <span style={{ color: 'var(--border-bright)', margin: '0 20px', fontSize: 9 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Pause indicator */}
      {paused && (
        <div style={{
          flexShrink: 0,
          padding: '0 8px',
          fontSize: 9,
          color: 'var(--text-dim)',
        }}>
          ‖ PAUSED
        </div>
      )}
    </div>
  )
}
