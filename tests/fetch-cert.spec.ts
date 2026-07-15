import { describe, it, expect } from 'vitest'
import { fetchLiveCert } from '../src/fetch-cert.js'

// Network test — gated so CI without egress skips it. Run locally with RUN_NET=1.
const net = process.env.RUN_NET === '1' ? describe : describe.skip
net('fetchLiveCert (network)', () => {
  it('fetches a leaf DER from a public host', async () => {
    const r = await fetchLiveCert('example.com')
    expect(r.leafDer.length).toBeGreaterThan(100)
    expect(r.chainDer.length).toBeGreaterThanOrEqual(1)
  })
})
