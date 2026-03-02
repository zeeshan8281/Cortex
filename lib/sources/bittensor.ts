// Bittensor / TaoStats API — subnet completions, miner data
// Docs: https://taostats.io/api
const BASE = 'https://api.taostats.io/api'

function headers() {
  const h: Record<string, string> = { Accept: 'application/json' }
  if (process.env.BITTENSOR_API_KEY) h['Authorization'] = `Bearer ${process.env.BITTENSOR_API_KEY}`
  return h
}

export interface BittensorSubnet {
  netuid: number
  name: string
  description: string
  owner: string
  maxNeurons: number
  activeNeurons: number
  emission: number
  tempo: number
  difficulty: number
  totalValidators: number
  totalMiners: number
}

export interface BittensorMinerJob {
  uid: number
  hotkey: string
  coldkey: string
  netuid: number
  rank: number
  trust: number
  consensus: number
  incentive: number
  dividends: number
  emission: number
  stake: number
  lastUpdate: number
}

export interface BittensorNetworkStats {
  totalSubnets: number
  totalNeurons: number
  totalStake: number
  taoPrice: number
  blockNumber: number
  difficulty: number
}

export async function fetchNetworkStats(): Promise<BittensorNetworkStats> {
  // GET /api/neuron/latest
  const res = await fetch(`${BASE}/neuron/latest?format=json`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) throw new Error(`Bittensor stats ${res.status}`)
  const d = await res.json()

  return {
    totalSubnets:  Number(d.total_subnets ?? d.totalSubnets ?? 0),
    totalNeurons:  Number(d.total_neurons ?? d.totalNeurons ?? 0),
    totalStake:    Number(d.total_stake ?? d.totalStake ?? 0),
    taoPrice:      Number(d.price ?? 0),
    blockNumber:   Number(d.block ?? 0),
    difficulty:    Number(d.difficulty ?? 0),
  }
}

export async function fetchSubnet36(): Promise<BittensorSubnet | null> {
  // Subnet 36 = Web Agents subnet
  const res = await fetch(`${BASE}/subnet/latest/?netuid=36&format=json`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json()
  const d = json?.results?.[0] ?? json

  return {
    netuid:          36,
    name:            String(d.subnet_name ?? 'Web Agents'),
    description:     'Autonomous web automation agents',
    owner:           String(d.owner_hotkey ?? ''),
    maxNeurons:      Number(d.max_n ?? 256),
    activeNeurons:   Number(d.active ?? 0),
    emission:        Number(d.emission ?? 0),
    tempo:           Number(d.tempo ?? 360),
    difficulty:      Number(d.difficulty ?? 0),
    totalValidators: Number(d.validators ?? 0),
    totalMiners:     Number(d.miners ?? 0),
  }
}

export async function fetchSubnet36Jobs(limit = 5): Promise<BittensorMinerJob[]> {
  // Top miners on subnet 36 as proxy for "jobs completed"
  const res = await fetch(
    `${BASE}/neuron/latest/?netuid=36&limit=${limit}&order_by=-incentive&format=json`,
    { headers: headers(), cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Bittensor subnet36 ${res.status}`)
  const json = await res.json()
  const neurons = json?.results ?? json ?? []

  return neurons.map((n: Record<string, unknown>) => ({
    uid:        Number(n.uid ?? 0),
    hotkey:     String(n.hotkey ?? ''),
    coldkey:    String(n.coldkey ?? ''),
    netuid:     36,
    rank:       Number(n.rank ?? 0),
    trust:      Number(n.trust ?? 0),
    consensus:  Number(n.consensus ?? 0),
    incentive:  Number(n.incentive ?? 0),
    dividends:  Number(n.dividends ?? 0),
    emission:   Number(n.emission ?? 0),
    stake:      Number(n.stake ?? 0),
    lastUpdate: Number(n.last_update ?? 0),
  }))
}
