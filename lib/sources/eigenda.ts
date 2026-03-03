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
    const commitment = (await res.text()).trim()
    return commitment.length > 0 ? commitment : null
  } catch {
    return null
  }
}

export async function retrieveBlob(commitment: string): Promise<object | null> {
  try {
    const res = await fetch(`${PROXY}/get/${commitment}`, {
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
