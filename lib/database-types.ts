/**
 * Database Schema for MIPS Assessment
 * 
 * This file defines the structure for Supabase persistence.
 * Tables can be created using these type definitions as a guide.
 * 
 * Suggested Supabase tables:
 * - users: Basic user information
 * - test_sessions: Individual assessment sessions
 * - answers: Individual question responses
 * - dimension_results: Computed results per dimension
 */

export interface DbUser {
  id: string // UUID
  nombre: string
  edad: number
  email?: string
  created_at: string // ISO timestamp
}

export interface DbTestSession {
  id: string // UUID
  user_id: string // FK to users
  started_at: string // ISO timestamp
  completed_at?: string // ISO timestamp
  duration_seconds?: number
  total_questions_answered: number
  
  // Quality flags
  flag_low_quality: boolean
  flag_repetitive_pattern: boolean
  flag_ambivalence: boolean
  flag_inconsistency: boolean
  flag_high_impression_management: boolean
  
  // Metadata
  session_metadata?: {
    user_agent?: string
    estimated_duration_seconds?: number
  }
}

export interface DbAnswer {
  id: string // UUID
  session_id: string // FK to test_sessions
  question_id: number
  dimension_id: string
  answer: 'V' | 'F'
  timestamp: string // ISO timestamp
  response_time_ms?: number // Time taken to answer
}

export interface DbDimensionResult {
  id: string // UUID
  session_id: string // FK to test_sessions
  dimension_id: string
  
  // Scores
  pole_a_count: number
  pole_b_count: number
  dominant_pole: 'poleA' | 'poleB' | 'mixed'
  confidence: 'low' | 'medium' | 'high'
  
  // Metadata
  questions_asked: number
  questions_asked_ids: number[]
}

/**
 * SQL Schema for Supabase (for reference)
 * 
 * -- Users table
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   nombre TEXT NOT NULL,
 *   edad INTEGER NOT NULL,
 *   email TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Test sessions table
 * CREATE TABLE test_sessions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 *   started_at TIMESTAMPTZ DEFAULT NOW(),
 *   completed_at TIMESTAMPTZ,
 *   duration_seconds INTEGER,
 *   total_questions_answered INTEGER DEFAULT 0,
 *   flag_low_quality BOOLEAN DEFAULT FALSE,
 *   flag_repetitive_pattern BOOLEAN DEFAULT FALSE,
 *   flag_ambivalence BOOLEAN DEFAULT FALSE,
 *   flag_inconsistency BOOLEAN DEFAULT FALSE,
 *   flag_high_impression_management BOOLEAN DEFAULT FALSE,
 *   session_metadata JSONB
 * );
 * 
 * -- Answers table
 * CREATE TABLE answers (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
 *   question_id INTEGER NOT NULL,
 *   dimension_id TEXT NOT NULL,
 *   answer TEXT CHECK (answer IN ('V', 'F')),
 *   timestamp TIMESTAMPTZ DEFAULT NOW(),
 *   response_time_ms INTEGER
 * );
 * 
 * -- Dimension results table
 * CREATE TABLE dimension_results (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
 *   dimension_id TEXT NOT NULL,
 *   pole_a_count INTEGER NOT NULL,
 *   pole_b_count INTEGER NOT NULL,
 *   dominant_pole TEXT CHECK (dominant_pole IN ('poleA', 'poleB', 'mixed')),
 *   confidence TEXT CHECK (confidence IN ('low', 'medium', 'high')),
 *   questions_asked INTEGER NOT NULL,
 *   questions_asked_ids INTEGER[]
 * );
 * 
 * -- Indexes for performance
 * CREATE INDEX idx_test_sessions_user_id ON test_sessions(user_id);
 * CREATE INDEX idx_answers_session_id ON answers(session_id);
 * CREATE INDEX idx_dimension_results_session_id ON dimension_results(session_id);
 */

// Helper function to transform AssessmentState to database format
import type { AssessmentState } from './assessment-types'
import { calculateDurationSeconds } from './assessment-timing'

export function transformStateForPersistence(state: AssessmentState): {
  user: Omit<DbUser, 'id' | 'created_at'> | null
  session: Omit<DbTestSession, 'id' | 'user_id' | 'started_at'>
  answers: Omit<DbAnswer, 'id' | 'session_id'>[]
  dimensionResults: Omit<DbDimensionResult, 'id' | 'session_id'>[]
} {
  // Transform user
  const user = state.user ? {
    nombre: state.user.nombre,
    edad: state.user.edad,
    email: state.user.email
  } : null

  // Transform session
  const session: Omit<DbTestSession, 'id' | 'user_id' | 'started_at'> = {
    completed_at: state.moduleCompletedAt ? new Date(state.moduleCompletedAt).toISOString() : undefined,
    duration_seconds: state.moduleCompletedAt
      ? calculateDurationSeconds(state.moduleStartedAt, state.moduleCompletedAt)
      : undefined,
    total_questions_answered: state.totalQuestionsAnswered,
    flag_low_quality: state.flags.lowQuality,
    flag_repetitive_pattern: state.flags.repetitivePattern,
    flag_ambivalence: state.flags.ambivalence,
    flag_inconsistency: state.flags.inconsistency,
    flag_high_impression_management: state.flags.highImpressionManagement
  }

  // Transform answers
  const answers: Omit<DbAnswer, 'id' | 'session_id'>[] = []
  for (const [dimensionId, score] of Object.entries(state.dimensionScores)) {
    for (const answer of score.answers) {
      answers.push({
        question_id: answer.questionId,
        dimension_id: dimensionId,
        answer: answer.answer,
        timestamp: new Date(answer.timestamp).toISOString(),
        response_time_ms: answer.responseTimeMs
      })
    }
  }

  // Transform dimension results
  const dimensionResults: Omit<DbDimensionResult, 'id' | 'session_id'>[] = []
  for (const [dimensionId, score] of Object.entries(state.dimensionScores)) {
    const total = score.poleACount + score.poleBCount
    let dominantPole: 'poleA' | 'poleB' | 'mixed' = 'mixed'
    if (total > 0) {
      const ratio = score.poleACount / total
      if (ratio >= 0.7) dominantPole = 'poleA'
      else if (ratio <= 0.3) dominantPole = 'poleB'
    }

    dimensionResults.push({
      dimension_id: dimensionId,
      pole_a_count: score.poleACount,
      pole_b_count: score.poleBCount,
      dominant_pole: dominantPole,
      confidence: score.confidence,
      questions_asked: score.questionsAsked.length,
      questions_asked_ids: score.questionsAsked
    })
  }

  return { user, session, answers, dimensionResults }
}
