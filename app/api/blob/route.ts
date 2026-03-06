import { retrieveBlob } from '@/lib/sources/eigenda'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const commitment = searchParams.get('commitment')

  if (!commitment) {
    return Response.json({ error: 'missing commitment param' }, { status: 400 })
  }

  const data = await retrieveBlob(commitment)
  if (!data) {
    return Response.json({ error: 'blob not found or proxy unreachable' }, { status: 404 })
  }

  return Response.json({ commitment, data })
}
