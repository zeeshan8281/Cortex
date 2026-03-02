// RSS feed parser — no dependencies, plain fetch + regex

export interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
  isoDate: string
}

const FEEDS: { url: string; source: string }[] = [
  { url: 'https://cointelegraph.com/rss',                              source: 'CoinTelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',            source: 'CoinDesk'      },
  { url: 'https://decrypt.co/feed',                                    source: 'Decrypt'       },
  { url: 'https://thedefiant.io/feed',                                 source: 'The Defiant'   },
  { url: 'https://www.theblock.co/rss.xml',                            source: 'The Block'     },
  { url: 'https://blockworks.co/feed',                                 source: 'Blockworks'    },
]

function stripCDATA(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function parseItems(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? []

  for (const block of itemBlocks) {
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const linkMatch  = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
                    ?? block.match(/<guid[^>]*>(https?:\/\/[\s\S]*?)<\/guid>/i)
    const dateMatch  = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)

    const title = titleMatch ? stripCDATA(titleMatch[1]) : ''
    const link  = linkMatch  ? stripCDATA(linkMatch[1])  : ''
    const pub   = dateMatch  ? stripCDATA(dateMatch[1])  : ''

    if (!title || title.length < 5) continue

    let isoDate = ''
    try { isoDate = pub ? new Date(pub).toISOString() : '' } catch { isoDate = '' }

    items.push({ title, link, source, pubDate: pub, isoDate })
  }

  return items
}

async function fetchFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'CORTEX/1.0 RSS Reader', Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseItems(xml, source)
  } catch {
    return []
  }
}

export async function fetchAllNews(limit = 30): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(f => fetchFeed(f.url, f.source)))

  const all: NewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }

  // Sort newest first, deduplicate by title similarity
  const sorted = all
    .filter(i => i.isoDate)
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate))

  // Simple dedupe: drop items where first 40 chars of title match another
  const seen = new Set<string>()
  const deduped: NewsItem[] = []
  for (const item of sorted) {
    const key = item.title.slice(0, 40).toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(item)
    }
  }

  return deduped.slice(0, limit)
}
