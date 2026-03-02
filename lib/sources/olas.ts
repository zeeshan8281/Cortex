// Olas / Autonolas — PoAA completions, agent registry
// Docs: https://docs.autonolas.network
// Subgraph: https://api.thegraph.com/subgraphs/name/autonolas/autonolas-registry-gnosis

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/autonolas/autonolas-registry-gnosis'
const REST_BASE = 'https://gateway.autonolas.tech/api/v1'

function headers() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.OLAS_API_KEY) h['Authorization'] = `Bearer ${process.env.OLAS_API_KEY}`
  return h
}

export interface OlasAttestation {
  id: string
  agentId: string
  agentAddress: string
  action: string
  score: number
  timestamp: number
  txHash: string
  chain: string
}

export interface OlasAgent {
  id: string
  agentId: string
  owner: string
  name: string
  description: string
  configHash: string
  timestamp: number
}

const POAA_QUERY = `
  query PoAACompletions($first: Int!, $skip: Int!) {
    checkpoints(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
      id
      contractAddress
      epoch
      blockTimestamp
      transactionHash
    }
  }
`

const AGENTS_QUERY = `
  query TopAgents($first: Int!) {
    agents(first: $first, orderBy: id, orderDirection: asc) {
      id
      agentId
      owner
      description
      configHash
      blockTimestamp
    }
  }
`

export async function fetchPoAACompletions(limit = 10): Promise<OlasAttestation[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: POAA_QUERY, variables: { first: limit, skip: 0 } }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Olas subgraph ${res.status}`)
  const json = await res.json()
  const checkpoints = json?.data?.checkpoints ?? []

  return checkpoints.map((c: Record<string, unknown>) => ({
    id:           String(c.id ?? ''),
    agentId:      String(c.contractAddress ?? ''),
    agentAddress: String(c.contractAddress ?? ''),
    action:       `poaa_checkpoint_epoch_${c.epoch}`,
    score:        Number(c.epoch ?? 0),
    timestamp:    Number(c.blockTimestamp ?? 0),
    txHash:       String(c.transactionHash ?? ''),
    chain:        'Gnosis',
  }))
}

export async function fetchAgentRegistry(limit = 50): Promise<OlasAgent[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: AGENTS_QUERY, variables: { first: limit } }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Olas agents ${res.status}`)
  const json = await res.json()
  const agents = json?.data?.agents ?? []

  return agents.map((a: Record<string, unknown>) => ({
    id:          String(a.id ?? ''),
    agentId:     String(a.agentId ?? ''),
    owner:       String(a.owner ?? ''),
    name:        String(a.description ?? a.id ?? ''),
    description: String(a.description ?? ''),
    configHash:  String(a.configHash ?? ''),
    timestamp:   Number(a.blockTimestamp ?? 0),
  }))
}
