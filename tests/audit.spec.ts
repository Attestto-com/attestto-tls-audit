import { describe, it, expect } from 'vitest'
import { classifyLeafDer } from '../src/audit.js'
import { readFileSync } from 'node:fs'

// classifyLeafDer is the pure (network-free) half of auditHost: parse + classify + sha256.
const der = new Uint8Array(readFileSync(new URL('./fixtures/leaf.der', import.meta.url)))

describe('classifyLeafDer', () => {
  it('parses + classifies a DER leaf and fills sha256', async () => {
    const c = await classifyLeafDer(der)
    expect(c.subjectCommonName.length).toBeGreaterThan(0)
    expect(c.ca.length).toBeGreaterThan(0)
    expect(['DV', 'OV', 'EV', 'unknown']).toContain(c.validationTier)
    expect(c.sha256).toMatch(/^[0-9a-f]{64}$/)
  })
})
