// ETH + TAO — Binance public API (no key, no rate limit)
// VIRTUAL    — CoinGecko free tier (fallback to 0 if rate limited)

export interface CoinGeckoPrices {
  eth: number
  ethChange24h: number
  virtual: number
  virtualChange24h: number
  tao: number
  taoChange24h: number
}

async function fetchBinanceTicker(symbol: string): Promise<{ price: number; change24h: number }> {
  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
    { cache: 'no-store', signal: AbortSignal.timeout(5000) }
  )
  if (!res.ok) throw new Error(`Binance ${symbol} ${res.status}`)
  const d = await res.json()
  return {
    price:    parseFloat(d.lastPrice),
    change24h: parseFloat(d.priceChangePercent),
  }
}

async function fetchVirtualPrice(): Promise<{ price: number; change24h: number }> {
  const key  = process.env.COINGECKO_API_KEY
  const base = key ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3'
  const hdrs: HeadersInit = key ? { 'x-cg-pro-api-key': key } : {}
  const res = await fetch(
    `${base}/simple/price?ids=virtual-protocol&vs_currencies=usd&include_24hr_change=true`,
    { headers: hdrs, cache: 'no-store', signal: AbortSignal.timeout(5000) }
  )
  if (!res.ok) throw new Error(`CoinGecko VIRTUAL ${res.status}`)
  const d = await res.json()
  return {
    price:    d['virtual-protocol']?.usd             ?? 0,
    change24h:d['virtual-protocol']?.usd_24h_change  ?? 0,
  }
}

export async function fetchPrices(): Promise<CoinGeckoPrices> {
  const [eth, tao, virtual] = await Promise.allSettled([
    fetchBinanceTicker('ETHUSDT'),
    fetchBinanceTicker('TAOUSDT'),
    fetchVirtualPrice(),
  ])

  return {
    eth:             eth.status      === 'fulfilled' ? eth.value.price        : 0,
    ethChange24h:    eth.status      === 'fulfilled' ? eth.value.change24h    : 0,
    tao:             tao.status      === 'fulfilled' ? tao.value.price        : 0,
    taoChange24h:    tao.status      === 'fulfilled' ? tao.value.change24h    : 0,
    virtual:         virtual.status  === 'fulfilled' ? virtual.value.price    : 0,
    virtualChange24h:virtual.status  === 'fulfilled' ? virtual.value.change24h: 0,
  }
}
