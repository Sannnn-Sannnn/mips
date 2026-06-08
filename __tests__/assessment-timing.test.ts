import { describe, expect, it } from 'vitest'
import {
  calculateDurationSeconds,
  calculateResponseTimeMs,
  getCurrentTimestamp,
  toIsoTimestamp
} from '@/lib/assessment-timing'

describe('assessment timing metrics', () => {
  it('calculates the response time for a question in milliseconds', () => {
    expect(calculateResponseTimeMs(1_000, 2_750)).toBe(1_750)
  })

  it('calculates the total module duration in rounded seconds', () => {
    expect(calculateDurationSeconds(1_000, 3_600)).toBe(3)
  })

  it('guards against negative durations', () => {
    expect(calculateResponseTimeMs(2_000, 1_000)).toBe(0)
    expect(calculateDurationSeconds(2_000, 1_000)).toBe(0)
  })

  it('creates deterministic timestamps for injectable clocks and ISO persistence', () => {
    const timestamp = getCurrentTimestamp(() => 1_700_000_000_000)

    expect(timestamp).toBe(1_700_000_000_000)
    expect(toIsoTimestamp(timestamp)).toBe('2023-11-14T22:13:20.000Z')
  })
})
