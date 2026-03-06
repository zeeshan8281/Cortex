import type { NextConfig } from 'next'

// NEXT_STANDALONE=true is set in the Dockerfile build stage (EigenCompute/Docker deploys).
// Vercel does NOT set this, so output is undefined → Vercel's default serverless build.
const nextConfig: NextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : undefined,

  // When EIGENCOMPUTE_URL is set (Vercel env), proxy all /api/* calls to the TEE backend.
  // On EigenCompute itself this env is not set, so no rewrites — it handles its own routes.
  async rewrites() {
    const teeBase = process.env.EIGENCOMPUTE_URL
    if (!teeBase) return []
    return [
      {
        source: '/api/:path*',
        destination: `${teeBase}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
