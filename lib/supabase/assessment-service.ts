import { createClient } from './client'
import type { AssessmentState, DimensionScore, UserRegistration } from '@/lib/assessment-types'

// Map local confidence levels to database enum
function mapConfidenceLevel(confidence: 'low' | 'medium' | 'high'): 'low' | 'medium' | 'high' {
  return confidence
}

// Map local flag types to database flag types
type FlagType = 
  | 'repetitive_answers'
  | 'fast_answering'
  | 'inconsistent_pattern'
  | 'ambiguity_detected'
  | 'low_quality_response'
  | 'extreme_response_time'
  | 'pattern_detected'

interface DatabaseDimension {
  id: number
  dimension_name: string
  pole_a: string
  pole_b: string
  category: string
}

// Mapping from local dimension IDs to database dimension names
const LOCAL_TO_DB_DIMENSION_MAP: Record<string, string> = {
  'apertura-preservacion': 'Apertura-Preservación',
  'modificacion-acomodacion': 'Modificación-Acomodación',
  'individualismo-proteccion': 'Individualismo-Protección',
  'extraversion-introversion': 'Extraversión-Introversión',
  'sensacion-intuicion': 'Sensación-Intuición',
  'pensamiento-sentimiento': 'Pensamiento-Sentimiento',
  'sistematizacion-innovacion': 'Sistematización-Innovación',
  'retraimiento-comunicatividad': 'Retraimiento-Comunicatividad',
  'vacilacion-firmeza': 'Vacilación-Firmeza',
  'discrepancia-conformismo': 'Discrepancia-Conformismo',
  'sometimiento-control': 'Sometimiento-Control',
  'insatisfaccion-concordancia': 'Insatisfacción-Concordancia'
}

// Cache dimensions mapping (local ID -> database dimension)
let dimensionsCache: Map<string, DatabaseDimension> | null = null

export async function getDimensionsMapping(): Promise<Map<string, DatabaseDimension>> {
  if (dimensionsCache) return dimensionsCache

  const supabase = createClient()
  const { data, error } = await supabase
    .from('dimensions')
    .select('*')

  if (error) {
    console.error('Error fetching dimensions:', error)
    throw error
  }

  // Create reverse mapping: db dimension_name -> dimension record
  const dbDimensionsByName = new Map<string, DatabaseDimension>()
  for (const dim of data || []) {
    dbDimensionsByName.set(dim.dimension_name, dim)
  }

  // Build cache using local IDs as keys
  dimensionsCache = new Map()
  for (const [localId, dbName] of Object.entries(LOCAL_TO_DB_DIMENSION_MAP)) {
    const dbDim = dbDimensionsByName.get(dbName)
    if (dbDim) {
      dimensionsCache.set(localId, dbDim)
    }
  }

  return dimensionsCache
}

// Get database dimension by local ID
export function getDbDimensionIdByLocalId(
  localDimId: string, 
  mapping: Map<string, DatabaseDimension>
): number | null {
  const dbDim = mapping.get(localDimId)
  return dbDim ? dbDim.id : null
}

// Create a user in the database
export async function createUser(registration: UserRegistration): Promise<string> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: registration.nombre,
      age: registration.edad > 0 ? registration.edad : null,
      email: registration.email || null
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data.id
}

// Create a test session
export async function createTestSession(userId: string): Promise<string> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      user_id: userId,
      status: 'in_progress',
      total_questions_answered: 0,
      total_validation_questions: 0
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating test session:', error)
    throw error
  }

  return data.id
}

// Save an individual answer
export async function saveAnswer(
  sessionId: string,
  dimensionDbId: number,
  questionNumber: number,
  questionText: string,
  answer: boolean,
  inferredPole: string,
  confidenceAfterAnswer: number,
  responseTimeMs: number,
  wasValidation: boolean
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('answers')
    .insert({
      session_id: sessionId,
      dimension_id: dimensionDbId,
      question_number: questionNumber,
      question_text: questionText,
      answer_boolean: answer,
      inferred_pole: inferredPole,
      confidence_after_answer: confidenceAfterAnswer,
      response_time_ms: responseTimeMs,
      was_validation_question: wasValidation
    })

  if (error) {
    console.error('Error saving answer:', error)
    throw error
  }
}

// Update test session progress
export async function updateSessionProgress(
  sessionId: string,
  totalQuestionsAnswered: number,
  totalValidationQuestions: number
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('test_sessions')
    .update({
      total_questions_answered: totalQuestionsAnswered,
      total_validation_questions: totalValidationQuestions
    })
    .eq('id', sessionId)

  if (error) {
    console.error('Error updating session progress:', error)
    throw error
  }
}

// Complete the test session with results
export async function completeTestSession(
  sessionId: string,
  state: AssessmentState,
  durationSeconds: number,
  dimensionsMapping: Map<string, DatabaseDimension>
): Promise<void> {
  const supabase = createClient()
  
  // Determine overall confidence
  const confidenceCounts = { low: 0, medium: 0, high: 0 }
  for (const score of Object.values(state.dimensionScores)) {
    confidenceCounts[score.confidence]++
  }
  const overallConfidence = confidenceCounts.high >= 8 ? 'high' : 
                            confidenceCounts.low >= 4 ? 'low' : 'medium'

  // Build adaptive summary
  const adaptiveSummary = {
    totalQuestions: state.totalQuestionsAnswered,
    flags: state.flags,
    dimensionResults: Object.entries(state.dimensionScores).map(([dimId, score]) => ({
      dimensionId: dimId,
      poleACount: score.poleACount,
      poleBCount: score.poleBCount,
      confidence: score.confidence,
      needsReview: score.needsSessionReview
    }))
  }

  // Update session as completed
  const { error: sessionError } = await supabase
    .from('test_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      total_questions_answered: state.totalQuestionsAnswered,
      overall_confidence: overallConfidence,
      duration_seconds: durationSeconds,
      adaptive_summary: adaptiveSummary
    })
    .eq('id', sessionId)

  if (sessionError) {
    console.error('Error completing session:', sessionError)
    throw sessionError
  }

  // Save dimension results
  for (const [dimId, score] of Object.entries(state.dimensionScores)) {
    const dbDim = dimensionsMapping.get(dimId)
    if (!dbDim) continue

    const dominantPole = score.poleACount >= score.poleBCount ? dbDim.pole_a : dbDim.pole_b
    const oppositePole = score.poleACount >= score.poleBCount ? dbDim.pole_b : dbDim.pole_a

    const { error: resultError } = await supabase
      .from('dimension_results')
      .insert({
        session_id: sessionId,
        dimension_id: dbDim.id,
        dominant_pole: dominantPole,
        opposite_pole: oppositePole,
        confidence_level: mapConfidenceLevel(score.confidence),
        total_questions: score.questionsAsked.length,
        validation_questions: score.answers.filter((_, i) => i >= 5).length,
        ambiguity_detected: score.confidence === 'low',
        inconsistency_detected: score.needsSessionReview || false
      })

    if (resultError) {
      console.error('Error saving dimension result:', resultError)
      // Continue with other dimensions
    }
  }

  // Save flags
  const flagsToSave: { type: FlagType; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }[] = []
  
  if (state.flags.lowQuality) {
    flagsToSave.push({
      type: 'fast_answering',
      severity: 'medium',
      description: 'Many answers were given very quickly'
    })
  }
  if (state.flags.repetitivePattern) {
    flagsToSave.push({
      type: 'repetitive_answers',
      severity: 'medium',
      description: 'Repetitive answering pattern detected'
    })
  }
  if (state.flags.ambivalence) {
    flagsToSave.push({
      type: 'ambiguity_detected',
      severity: 'low',
      description: 'Ambivalence detected in multiple dimensions'
    })
  }
  if (state.flags.inconsistency) {
    flagsToSave.push({
      type: 'inconsistent_pattern',
      severity: 'low',
      description: 'Additional validation questions were needed'
    })
  }
  if (state.flags.highImpressionManagement) {
    flagsToSave.push({
      type: 'pattern_detected',
      severity: 'high',
      description: 'High tendency to respond in socially desirable ways'
    })
  }

  for (const flag of flagsToSave) {
    const { error: flagError } = await supabase
      .from('flags')
      .insert({
        session_id: sessionId,
        flag_type: flag.type,
        severity: flag.severity,
        description: flag.description
      })

    if (flagError) {
      console.error('Error saving flag:', flagError)
      // Continue with other flags
    }
  }
}
