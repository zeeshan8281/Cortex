// EigenDA proxy client — wraps the eigenda-proxy REST sidecar
// POST {proxy}/put/   body: raw bytes → returns hex commitment
// GET  {proxy}/get/{commitment} → returns raw bytes
// All functions are silent-fail: returns null when proxy is unreachable
// so a missing sidecar never breaks the terminal.

const PROXY = process.env.EIGENDA_PROXY_URL ?? 'http://localhost:3100'

export async function disperseBlob(payload: object): Promise<string | null> {
  try {
    const body = JSON.stringify(payload)
    const res = await fetch(`${PROXY}/put/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body,
      signal: AbortSignal.timeout(30_000),   // dispersal can take up to 30s on Holesky
    })
    if (!res.ok) return null
    // Proxy returns raw binary commitment bytes — hex-encode for display/linking
    const buf = await res.arrayBuffer()
    if (buf.byteLength === 0) return null
    const hex = '0x' + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
    return hex
  } catch {
    return null
  }
}

export async function retrieveBlob(commitment: string): Promise<object | null> {
  try {
    // commitment is stored as hex (0x...) — pass it directly; proxy accepts hex-encoded commitment
    const res = await fetch(`${PROXY}/get/${encodeURIComponent(commitment)}`, {
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const text = await res.text()
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function proxyHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${PROXY}/health`, {
      signal: AbortSignal.timeout(3_000),
    })
    return res.ok
  } catch {
    return false
  }
}
