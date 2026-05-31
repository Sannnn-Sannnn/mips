'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { AssessmentState, DimensionScore, ConfidenceLevel, UserRegistration } from '@/lib/assessment-types'
import { 
  dimensions, 
  getPrimaryQuestionsForDimension, 
  getAllQuestionsForDimension,
  getQuestionById
} from '@/lib/assessment-data'
import {
  createUser,
  createTestSession,
  saveAnswer,
  completeTestSession,
  getDimensionsMapping,
  getDbDimensionIdByLocalId
} from '@/lib/supabase/assessment-service'

// Configuration
const CONFIG = {
  fixedQuestionsPerDimension: 5,  // Fixed 5 questions per pole versus (60 total)
  maxQuestionsPerDimension: 8,    // Maximum 8 if medium confidence needs resolution
  highConfidenceRatio: 0.70,      // 70% or more = high confidence
  mediumConfidenceRatio: 0.50,    // 50% or more = medium confidence
  fastAnswerMs: 800,
  fastAnswerLimit: 15,
  repetitiveLimit: 8
}

function calculateConfidence(poleACount: number, poleBCount: number): ConfidenceLevel {
  const total = poleACount + poleBCount
  if (total < 3) return 'low'
  
  const maxPole = Math.max(poleACount, poleBCount)
  const ratio = maxPole / total
  
  if (ratio >= CONFIG.highConfidenceRatio) return 'high'
  if (ratio >= CONFIG.mediumConfidenceRatio) return 'medium'
  return 'low'
}

// Check if dimension needs more questions to reach high confidence
function needsMoreQuestions(confidence: ConfidenceLevel, totalAsked: number): boolean {
  // Only check after fixed questions have been asked
  if (totalAsked < CONFIG.fixedQuestionsPerDimension) return false
  // Don't add more if at maximum
  if (totalAsked >= CONFIG.maxQuestionsPerDimension) return false
  // Add more if confidence is NOT high (medium or low)
  return confidence !== 'high'
}

// Build initial question queue: exactly 5 fixed questions per dimension (60 total), interleaved
function buildInitialQuestionQueue(): number[] {
  const queue: number[] = []
  
  // Group primary questions (core + validation) by dimension
  // Each dimension MUST have at least 5 questions
  const questionsByDimension = new Map<string, number[]>()
  for (const dim of dimensions) {
    const primaryQs = getPrimaryQuestionsForDimension(dim.id)
    // Take up to 5 questions for the fixed phase
    questionsByDimension.set(dim.id, primaryQs.slice(0, CONFIG.fixedQuestionsPerDimension).map(q => q.id))
  }
  
  // Interleave: ask 1 question from each dimension in rotation
  for (let round = 0; round < CONFIG.fixedQuestionsPerDimension; round++) {
    for (const dim of dimensions) {
      const dimQuestions = questionsByDimension.get(dim.id)
      if (dimQuestions && dimQuestions[round] !== undefined) {
        queue.push(dimQuestions[round])
      }
    }
  }
  
  return queue
}

function initializeDimensionScores(): Record<string, DimensionScore> {
  const scores: Record<string, DimensionScore> = {}
  for (const dim of dimensions) {
    scores[dim.id] = {
      dimensionId: dim.id,
      poleACount: 0,
      poleBCount: 0,
      confidence: 'low',
      questionsAsked: [],
      answers: [],
      needsSessionReview: false
    }
  }
  return scores
}

// Database session info
interface DbSession {
  userId: string
  sessionId: string
  startTime: number
}

export function useSimpleAssessment() {
  const [state, setState] = useState<AssessmentState>({
    user: null,
    isRegistered: false,
    questionQueue: [],
    usedQuestionIds: new Set<number>(),
    currentQuestionId: null,
    dimensionScores: initializeDimensionScores(),
    completedDimensions: [],
    flags: {
      ambivalence: false,
      inconsistency: false,
      lowQuality: false,
      repetitivePattern: false,
      highImpressionManagement: false
    },
    isComplete: false,
    totalQuestionsAnswered: 0,
    estimatedRemaining: 60, // 12 dimensions x 5 questions (minimum)
    lastAnswerTime: null,
    fastAnswerCount: 0,
    sameOptionCount: 0,
    lastOption: null,
    impressionManagementCount: 0
  })

  const [isStarted, setIsStarted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  
  const pendingDisambiguationRef = useRef<Map<string, number>>(new Map())
  const dbSessionRef = useRef<DbSession | null>(null)
  const dimensionsMappingRef = useRef<Map<string, { id: number; dimension_name: string; pole_a: string; pole_b: string; category: string }> | null>(null)

  // Initialize dimensions mapping on mount
  useEffect(() => {
    getDimensionsMapping()
      .then(mapping => {
        dimensionsMappingRef.current = mapping
      })
      .catch(err => {
        console.error('Failed to load dimensions mapping:', err)
      })
  }, [])

  const getCurrentQuestion = useCallback(() => {
    if (state.currentQuestionId === null) return null
    return getQuestionById(state.currentQuestionId) || null
  }, [state.currentQuestionId])

  const registerUser = useCallback(async (registration: UserRegistration) => {
    setIsSaving(true)
    setDbError(null)
    
    try {
      // Create user in database
      const userId = await createUser(registration)
      
      // Update state
      setState(prev => ({
        ...prev,
        user: registration,
        isRegistered: true
      }))
      
      // Store user ID for later session creation
      dbSessionRef.current = {
        userId,
        sessionId: '', // Will be set when assessment starts
        startTime: 0
      }
    } catch (err) {
      console.error('Failed to register user:', err)
      setDbError('No se pudo guardar el registro. Los datos se guardaran localmente.')
      // Still allow the user to proceed
      setState(prev => ({
        ...prev,
        user: registration,
        isRegistered: true
      }))
    } finally {
      setIsSaving(false)
    }
  }, [])

  const startAssessment = useCallback(async () => {
    const initialQueue = buildInitialQuestionQueue()
    const firstQuestionId = initialQueue[0]
    const remainingQueue = initialQueue.slice(1)
    
    setIsSaving(true)
    
    try {
      // Create test session in database
      if (dbSessionRef.current?.userId) {
        const sessionId = await createTestSession(dbSessionRef.current.userId)
        dbSessionRef.current.sessionId = sessionId
        dbSessionRef.current.startTime = Date.now()
      }
    } catch (err) {
      console.error('Failed to create test session:', err)
      // Continue without database - will save at the end
    } finally {
      setIsSaving(false)
    }
    
    setState(prev => ({
      ...prev,
      questionQueue: remainingQueue,
      usedQuestionIds: new Set([firstQuestionId]),
      currentQuestionId: firstQuestionId,
      dimensionScores: initializeDimensionScores(),
      completedDimensions: [],
      isComplete: false,
      totalQuestionsAnswered: 0,
      estimatedRemaining: initialQueue.length
    }))
    setIsStarted(true)
    pendingDisambiguationRef.current = new Map()
  }, [])

  const answerQuestion = useCallback(async (answer: 'V' | 'F') => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return

    const now = Date.now()
    const answerTime = state.lastAnswerTime ? now - state.lastAnswerTime : Infinity
    const isFastAnswer = answerTime < CONFIG.fastAnswerMs
    const isSameOption = state.lastOption === answer

    // Get current dimension score
    const dimensionId = currentQuestion.dimensionId
    const prevScore = state.dimensionScores[dimensionId]
    
    // Calculate new counts
    let newPoleACount = prevScore.poleACount
    let newPoleBCount = prevScore.poleBCount
    
    // Determine which pole this answer supports
    let inferredPole = ''
    if (answer === 'V') {
      if (currentQuestion.trueIndicates === 'poleA') {
        newPoleACount++
        inferredPole = 'poleA'
      } else {
        newPoleBCount++
        inferredPole = 'poleB'
      }
    } else {
      if (currentQuestion.trueIndicates === 'poleA') {
        newPoleBCount++
        inferredPole = 'poleB'
      } else {
        newPoleACount++
        inferredPole = 'poleA'
      }
    }

    const newQuestionsAsked = [...prevScore.questionsAsked, currentQuestion.id]
    const newAnswers = [...prevScore.answers, {
      questionId: currentQuestion.id,
      answer,
      timestamp: now
    }]
    const newConfidence = calculateConfidence(newPoleACount, newPoleBCount)

    // Save answer to database (fire and forget for better UX)
    if (dbSessionRef.current?.sessionId && dimensionsMappingRef.current) {
      const dbDimId = getDbDimensionIdByLocalId(dimensionId, dimensionsMappingRef.current)
      if (dbDimId) {
        saveAnswer(
          dbSessionRef.current.sessionId,
          dbDimId,
          state.totalQuestionsAnswered + 1,
          currentQuestion.text,
          answer === 'V',
          inferredPole,
          newPoleACount / (newPoleACount + newPoleBCount) || 0,
          answerTime < Infinity ? answerTime : 0,
          currentQuestion.priority === 'validation' || currentQuestion.priority === 'disambiguation'
        ).catch(err => console.error('Failed to save answer:', err))
      }
    }

    // Check if we've reached max questions and still don't have high confidence
    const questionsAskedForDim = newQuestionsAsked.length
    const reachedMaxWithoutHighConfidence = 
      questionsAskedForDim >= CONFIG.maxQuestionsPerDimension && newConfidence !== 'high'

    const newDimensionScore: DimensionScore = {
      dimensionId,
      poleACount: newPoleACount,
      poleBCount: newPoleBCount,
      confidence: newConfidence,
      questionsAsked: newQuestionsAsked,
      answers: newAnswers,
      needsSessionReview: reachedMaxWithoutHighConfidence
    }

    // Update quality flags
    const newFastCount = isFastAnswer ? state.fastAnswerCount + 1 : state.fastAnswerCount
    const newSameCount = isSameOption ? state.sameOptionCount + 1 : 1
    
    // Track impression management
    let newIMCount = state.impressionManagementCount
    if (currentQuestion.isImpressionManagement && answer === 'V') {
      newIMCount++
    }

    // Build new question queue
    let newQueue = [...state.questionQueue]
    const newUsedIds = new Set(state.usedQuestionIds)
    newUsedIds.add(currentQuestion.id)

    // Check if this dimension needs more questions to reach high confidence
    if (needsMoreQuestions(newConfidence, questionsAskedForDim)) {
      // Only add if we haven't already scheduled all additional questions for this dimension
      const alreadyScheduled = pendingDisambiguationRef.current.get(dimensionId) || 0
      const maxAdditional = CONFIG.maxQuestionsPerDimension - CONFIG.fixedQuestionsPerDimension
      
      if (alreadyScheduled < maxAdditional) {
        // Get all unused questions from this dimension (any priority)
        const availableQs = getAllQuestionsForDimension(dimensionId)
          .filter(q => !newUsedIds.has(q.id))
        
        if (availableQs.length > 0) {
          // Add 1 additional question to try to reach high confidence
          newQueue.push(availableQs[0].id)
          pendingDisambiguationRef.current.set(dimensionId, alreadyScheduled + 1)
        }
      }
    }

    // Remove any used question IDs from queue (safety check)
    newQueue = newQueue.filter(id => !newUsedIds.has(id))

    // Get next question
    const nextQuestionId = newQueue[0] || null
    const remainingQueue = newQueue.slice(1)

    // Check if assessment is complete
    const isComplete = nextQuestionId === null

    // Calculate flags
    const updatedScores = {
      ...state.dimensionScores,
      [dimensionId]: newDimensionScore
    }
    
    // Ambivalence: more than 4 dimensions with low confidence after fixed questions
    const lowConfidenceCount = Object.values(updatedScores)
      .filter(s => s.questionsAsked.length >= CONFIG.fixedQuestionsPerDimension && s.confidence === 'low').length
    
    // Inconsistency: check if any dimension has received additional questions (medium confidence requiring more)
    const hasInconsistency = pendingDisambiguationRef.current.size > 0

    const newState: AssessmentState = {
      ...state,
      questionQueue: remainingQueue,
      usedQuestionIds: newUsedIds,
      currentQuestionId: nextQuestionId,
      dimensionScores: updatedScores,
      isComplete,
      totalQuestionsAnswered: state.totalQuestionsAnswered + 1,
      estimatedRemaining: Math.max(0, remainingQueue.length + (nextQuestionId ? 1 : 0)),
      lastAnswerTime: now,
      fastAnswerCount: newFastCount,
      sameOptionCount: newSameCount,
      lastOption: answer,
      impressionManagementCount: newIMCount,
      flags: {
        lowQuality: newFastCount >= CONFIG.fastAnswerLimit,
        repetitivePattern: newSameCount >= CONFIG.repetitiveLimit,
        ambivalence: lowConfidenceCount >= 4,
        inconsistency: hasInconsistency,
        highImpressionManagement: newIMCount >= 5
      }
    }

    setState(newState)

    // If complete, save final results to database
    if (isComplete && dbSessionRef.current?.sessionId && dimensionsMappingRef.current) {
      const durationSeconds = Math.round((Date.now() - dbSessionRef.current.startTime) / 1000)
      completeTestSession(
        dbSessionRef.current.sessionId,
        newState,
        durationSeconds,
        dimensionsMappingRef.current
      ).catch(err => console.error('Failed to complete session:', err))
    }
  }, [state, getCurrentQuestion])

  const resetAssessment = useCallback(() => {
    setState({
      user: null,
      isRegistered: false,
      questionQueue: [],
      usedQuestionIds: new Set<number>(),
      currentQuestionId: null,
      dimensionScores: initializeDimensionScores(),
      completedDimensions: [],
      flags: {
        ambivalence: false,
        inconsistency: false,
        lowQuality: false,
        repetitivePattern: false,
        highImpressionManagement: false
      },
      isComplete: false,
      totalQuestionsAnswered: 0,
      estimatedRemaining: 60, // 12 dimensions x 5 fixed questions
      lastAnswerTime: null,
      fastAnswerCount: 0,
      sameOptionCount: 0,
      lastOption: null,
      impressionManagementCount: 0
    })
    setIsStarted(false)
    setDbError(null)
    pendingDisambiguationRef.current = new Map()
    dbSessionRef.current = null
  }, [])

  // Calculate progress percentage
  // Sum all additional questions scheduled due to medium confidence
  let additionalQuestions = 0
  pendingDisambiguationRef.current.forEach((count) => {
    additionalQuestions += count
  })
  const totalExpected = 60 + additionalQuestions // 12 dimensions x 5 fixed + additional for medium confidence
  const progressPercentage = state.totalQuestionsAnswered > 0
    ? Math.min(100, Math.round((state.totalQuestionsAnswered / totalExpected) * 100))
    : 0

  return {
    state,
    isStarted,
    isSaving,
    dbError,
    registerUser,
    startAssessment,
    answerQuestion,
    resetAssessment,
    getCurrentQuestion,
    progressPercentage,
    totalDimensions: dimensions.length
  }
}
