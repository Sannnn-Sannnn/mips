-- Temporal metrics for the MIPS module.
-- Apply this in Supabase if any of these columns are missing.

ALTER TABLE test_sessions
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

ALTER TABLE answers
  ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id);
