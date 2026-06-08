export type ConfidenceLevel = 'low' | 'medium' | 'high'

export type QuestionPriority = 'core' | 'validation' | 'disambiguation'

export interface Question {
  id: number
  text: string
  dimensionId: string
  /** Which pole this question measures when answered TRUE */
  trueIndicates: 'poleA' | 'poleB'
  priority: QuestionPriority
  isImpressionManagement?: boolean
}

export type DimensionCategory = 'Metas Motivacionales' | 'Modos Cognitivos' | 'Conductas Interpersonales'

export interface DimensionPole {
  id: string
  name: string
  description: string
}

export interface Dimension {
  id: string
  name: string
  category: DimensionCategory
  poleA: DimensionPole
  poleB: DimensionPole
}

export interface DimensionScore {
  dimensionId: string
  poleACount: number
  poleBCount: number
  confidence: ConfidenceLevel
  questionsAsked: number[]
  answers: {
    questionId: number
    answer: 'V' | 'F'
    timestamp: number
    responseTimeMs: number
  }[]
  /** Flag when max questions reached but confidence still not high - needs session review */
  needsSessionReview?: boolean
}

export interface UserRegistration {
  nombre: string
  edad: number
  email?: string
}

export interface AssessmentState {
  // Registration
  user: UserRegistration | null
  isRegistered: boolean
  
  // Question management
  questionQueue: number[] // IDs of questions to ask
  usedQuestionIds: Set<number>
  currentQuestionId: number | null
  
  // Dimension tracking
  dimensionScores: Record<string, DimensionScore>
  completedDimensions: string[]
  
  // Flags
  flags: {
    ambivalence: boolean
    inconsistency: boolean
    lowQuality: boolean
    repetitivePattern: boolean
    highImpressionManagement: boolean
  }
  
  // Progress
  isComplete: boolean
  totalQuestionsAnswered: number
  estimatedRemaining: number
  moduleStartedAt: number | null
  moduleCompletedAt: number | null
  currentQuestionStartedAt: number | null
  
  // Quality metrics
  lastAnswerTime: number | null
  fastAnswerCount: number
  sameOptionCount: number
  lastOption: 'V' | 'F' | null
  impressionManagementCount: number
}

export interface ChatMessage {
  id: string
  type: 'system' | 'question' | 'user-answer' | 'feedback' | 'block-closure' | 'registration'
  content: string
  questionId?: number
  timestamp: number
}
