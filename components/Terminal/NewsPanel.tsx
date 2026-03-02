'use client'
import type { NewsItem } from '@/lib/sources/rss'

const SOURCE_COLORS: Record<string, string> = {
  'CoinTelegraph': 'var(--amber)',
  'CoinDesk':      'var(--cyan)',
  'Decrypt':       'var(--purple)',
  'The Defiant':   'var(--green)',
  'The Block':     'var(--blue)',
  'Blockworks':    'var(--text-mid)',
}

function timeAgo(isoDate: string): string {
  if (!isoDate) return ''
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000
  if (diff < 60)   return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function NewsPanel({ items }: { items: NewsItem[] }) {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>NEWS FEED</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>
            {items.length} stories
          </span>
          <div className="live-dot" />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
        {items.length === 0 && (
          <div style={{ padding: '8px 8px', color: 'var(--text-dim)', fontSize: 10 }}>
            Loading…
          </div>
        )}
        {items.map((item, i) => (
          <a
            key={i}
            href={item.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                padding: '5px 8px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Source */}
              <div style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.07em',
                color: SOURCE_COLORS[item.source] ?? 'var(--text-dim)',
                marginBottom: 2,
              }}>
                {item.source.toUpperCase()}
              </div>

              {/* Headline */}
              <div style={{
                fontSize: 11,
                color: 'var(--text-bright)',
                lineHeight: 1.35,
                marginBottom: 3,
              }}>
                {item.title}
              </div>

              {/* Time */}
              <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>
                {timeAgo(item.isoDate)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
