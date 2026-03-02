import { fetchAllNews } from '@/lib/sources/rss'

export const dynamic = 'force-dynamic'

// Cache for 3 minutes server-side
let cache: { data: Awaited<ReturnType<typeof fetchAllNews>>; ts: number } | null = null
const CACHE_MS = 3 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_MS) {
    return Response.json(cache.data)
  }

  const news = await fetchAllNews(40)
  cache = { data: news, ts: Date.now() }
  return Response.json(news)
}
