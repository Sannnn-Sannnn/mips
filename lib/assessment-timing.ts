export function getCurrentTimestamp(now: () => number = Date.now): number {
  return now()
}

export function toIsoTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

export function calculateResponseTimeMs(
  questionStartedAt: number | null | undefined,
  answeredAt: number
): number {
  if (questionStartedAt == null) return 0
  return Math.max(0, answeredAt - questionStartedAt)
}

export function calculateDurationSeconds(
  moduleStartedAt: number | null | undefined,
  moduleCompletedAt: number
): number {
  if (moduleStartedAt == null) return 0
  return Math.round(Math.max(0, moduleCompletedAt - moduleStartedAt) / 1000)
}
