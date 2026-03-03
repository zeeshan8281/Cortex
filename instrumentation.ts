// Next.js instrumentation hook — runs once at server startup (not in edge runtime)
// Posts a snapshot to EigenDA immediately, then every 5 minutes.
// Uses NEXT_PUBLIC_APP_URL so it works in both dev and EigenCompute.

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const postSnapshot = async () => {
    try {
      await fetch(`${base}/api/snapshot`, {
        method: 'POST',
        signal: AbortSignal.timeout(15_000),
      })
    } catch {
      // Silent — proxy may not be up yet; next tick will retry
    }
  }

  // Small delay on first run so the Next.js server is fully ready
  setTimeout(() => {
    postSnapshot()
    setInterval(postSnapshot, 5 * 60_000)
  }, 5_000)
}
