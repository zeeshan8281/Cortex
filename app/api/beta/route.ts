import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(request: Request) {
  const { name, email, telegram } = await request.json()

  if (!name || !email || !telegram) {
    return Response.json({ error: 'missing fields' }, { status: 400 })
  }

  try {
    await pool.query(
      `INSERT INTO beta_signups (name, email, telegram) VALUES ($1, $2, $3)`,
      [name.trim(), email.trim().toLowerCase(), telegram.trim().replace(/^@/, '')]
    )
    return Response.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'db error'
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code: string }).code : ''
    if (code === '23505') {
      return Response.json({ error: 'already registered' }, { status: 409 })
    }
    return Response.json({ error: msg }, { status: 500 })
  }
}
