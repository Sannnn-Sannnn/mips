import { afterEach, describe, expect, it, vi } from 'vitest'

describe('Supabase client configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('does not create a client when public Supabase env vars are missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
    vi.resetModules()

    const { createClient, isSupabaseConfigured } = await import('@/lib/supabase/client')

    expect(isSupabaseConfigured()).toBe(false)
    expect(createClient()).toBeNull()
  })
})
