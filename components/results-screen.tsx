'use client'

import { useState, useMemo } from 'react'
import type { AssessmentState, DimensionCategory, DimensionScore } from '@/lib/assessment-types'
import { dimensions, getQuestionById } from '@/lib/assessment-data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RefreshCw, ChevronLeft, User, AlertCircle } from 'lucide-react'
import { calculateDurationSeconds } from '@/lib/assessment-timing'

interface ResultsScreenProps {
  state: AssessmentState
  onReset: () => void
}

const categoryLabels: Record<DimensionCategory, string> = {
  'Metas Motivacionales': 'Metas Motivacionales',
  'Modos Cognitivos': 'Modos Cognitivos',
  'Conductas Interpersonales': 'Conductas Interpersonales'
}

const categoryColors: Record<DimensionCategory, string> = {
  'Metas Motivacionales': 'text-emerald-600',
  'Modos Cognitivos': 'text-sky-600',
  'Conductas Interpersonales': 'text-violet-600'
}

function getTendencyLabel(score: DimensionScore, dimension: typeof dimensions[0]): { label: string; pole: 'A' | 'B' | 'mixed' } {
  const total = score.poleACount + score.poleBCount
  if (total === 0) return { label: 'Sin datos', pole: 'mixed' }
  
  const poleARatio = score.poleACount / total
  
  // With 4 questions: 3+ same direction = clear tendency
  // 75% or more = clear pole A, 25% or less = clear pole B
  if (poleARatio >= 0.65) return { label: dimension.poleA.name, pole: 'A' }
  if (poleARatio <= 0.35) return { label: dimension.poleB.name, pole: 'B' }
  return { label: 'Mixto', pole: 'mixed' }
}

function getConfidenceLabel(confidence: 'low' | 'medium' | 'high'): string {
  switch (confidence) {
    case 'high': return 'Alta'
    case 'medium': return 'Media'
    case 'low': return 'Baja'
  }
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 seg'

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) return `${seconds} seg`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds} seg`
}

function formatResponseTime(responseTimeMs: number): string {
  if (responseTimeMs < 1000) return `${responseTimeMs} ms`
  return `${(responseTimeMs / 1000).toFixed(1)} seg`
}

function generateSummary(state: AssessmentState): string {
  const motivationalDims = dimensions.filter(d => d.category === 'Metas Motivacionales')
  const cognitiveDims = dimensions.filter(d => d.category === 'Modos Cognitivos')
  const interpersonalDims = dimensions.filter(d => d.category === 'Conductas Interpersonales')

  const getPatterns = (dims: typeof dimensions) => {
    const patterns: string[] = []
    for (const d of dims) {
      const score = state.dimensionScores[d.id]
      if (!score) continue
      const total = score.poleACount + score.poleBCount
      if (total === 0) continue
      const ratio = score.poleACount / total
      if (ratio >= 0.65) patterns.push(d.poleA.name.toLowerCase())
      else if (ratio <= 0.35) patterns.push(d.poleB.name.toLowerCase())
    }
    return patterns
  }

  const motivationalPatterns = getPatterns(motivationalDims)
  const cognitivePatterns = getPatterns(cognitiveDims)
  const interpersonalPatterns = getPatterns(interpersonalDims)

  let summary = 'Se observa un perfil con '

  if (motivationalPatterns.length > 0) {
    summary += `tendencias motivacionales orientadas hacia ${motivationalPatterns.slice(0, 2).join(' y ')}`
  } else {
    summary += 'tendencias motivacionales mixtas'
  }

  if (cognitivePatterns.length > 0) {
    summary += `. En lo cognitivo, preferencia por un estilo ${cognitivePatterns.slice(0, 2).join(' y ')}`
  } else {
    summary += '. En lo cognitivo, flexibilidad entre estilos'
  }

  if (interpersonalPatterns.length > 0) {
    summary += `. A nivel interpersonal, ${interpersonalPatterns.slice(0, 2).join(' y ')}`
  } else {
    summary += '. A nivel interpersonal, adaptabilidad contextual'
  }

  summary += '.'

  return summary
}

export function ResultsScreen({ state, onReset }: ResultsScreenProps) {
  const [showDetails, setShowDetails] = useState(false)

  const summary = useMemo(() => generateSummary(state), [state])
  const totalDurationSeconds = calculateDurationSeconds(state.moduleStartedAt, state.moduleCompletedAt ?? Date.now())
  const averageResponseSeconds = state.totalQuestionsAnswered > 0
    ? Math.round(totalDurationSeconds / state.totalQuestionsAnswered)
    : 0

  const groupedDimensions = {
    'Metas Motivacionales': dimensions.filter(d => d.category === 'Metas Motivacionales'),
    'Modos Cognitivos': dimensions.filter(d => d.category === 'Modos Cognitivos'),
    'Conductas Interpersonales': dimensions.filter(d => d.category === 'Conductas Interpersonales')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-foreground">Evaluacion MIPS</span>
          <div className="size-9 rounded-full border border-border flex items-center justify-center">
            <span className="text-sm text-muted-foreground">?</span>
          </div>
        </div>
      </header>

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <button 
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Nueva evaluacion
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-8 space-y-6">
        {/* User Info Card (if registered) */}
        {state.user && (
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{state.user.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {state.user.edad} años
                  {state.user.email && ` - ${state.user.email}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Header Card */}
        <div className="bg-background rounded-lg border border-border p-6">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            Resultados
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Material de apoyo para el orientador
          </p>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-foreground/90 text-sm leading-relaxed">
              {summary}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">Preguntas respondidas</p>
              <p className="text-sm font-semibold text-foreground">{state.totalQuestionsAnswered}</p>
            </div>
            <div className="rounded-lg border border-border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">Tiempo total</p>
              <p className="text-sm font-semibold text-foreground">{formatDuration(totalDurationSeconds)}</p>
            </div>
            <div className="rounded-lg border border-border bg-background px-3 py-2">
              <p className="text-xs text-muted-foreground">Promedio por pregunta</p>
              <p className="text-sm font-semibold text-foreground">{formatDuration(averageResponseSeconds)}</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_80px] gap-4 px-6 py-3 border-b border-border bg-muted/30">
            <span className="text-sm font-medium text-muted-foreground">Dimension</span>
            <span className="text-sm font-medium text-muted-foreground text-center">Tendencia</span>
            <span className="text-sm font-medium text-muted-foreground text-center">Confianza</span>
          </div>

          {/* Table Body */}
          {(Object.entries(groupedDimensions) as [DimensionCategory, typeof dimensions][]).map(([category, catDims]) => (
            <div key={category}>
              {/* Category Label */}
              <div className="px-6 py-2 bg-muted/20 border-b border-border">
                <span className={cn('text-xs font-semibold', categoryColors[category])}>
                  {categoryLabels[category]}
                </span>
              </div>

              {/* Dimensions */}
              {catDims.map((dimension) => {
                const score = state.dimensionScores[dimension.id]
                if (!score) return null

                const { label: tendency, pole } = getTendencyLabel(score, dimension)
                const confidence = getConfidenceLabel(score.confidence)

                return (
                  <div 
                    key={dimension.id}
                    className="grid grid-cols-[1fr_120px_80px] gap-4 px-6 py-3 border-b border-border last:border-0 items-center"
                  >
                    <div className="text-sm">
                      <span className="text-foreground">{dimension.poleA.name}</span>
                      <span className="text-muted-foreground mx-1">vs</span>
                      <span className="text-foreground">{dimension.poleB.name}</span>
                    </div>
                    <span className={cn(
                      'text-sm text-center font-medium',
                      pole === 'mixed' ? 'text-muted-foreground' : 'text-foreground'
                    )}>
                      {tendency}
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <span className={cn(
                        'text-xs text-center px-2 py-1 rounded-full',
                        score.confidence === 'high' && 'bg-emerald-500/10 text-emerald-600',
                        score.confidence === 'medium' && 'bg-amber-500/10 text-amber-600',
                        score.confidence === 'low' && 'bg-red-500/10 text-red-600'
                      )}>
                        {confidence}
                      </span>
                      {score.needsSessionReview && (
                        <span title="Requiere revision en sesion">
                          <AlertCircle className="size-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Dimensions that need session review */}
        {Object.values(state.dimensionScores).some(s => s.needsSessionReview) && (
          <div className="bg-destructive rounded-lg border border-destructive p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-destructive-foreground shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-destructive-foreground mb-2">
                  Dimensiones para explorar en sesion
                </h2>
                <p className="text-sm text-destructive-foreground mb-3 font-semibold">
                  Las siguientes dimensiones mostraron tendencias mixtas o variabilidad contextual despues de las preguntas de validacion. 
                  Esto no representa un error, sino una oportunidad para explorar en mayor profundidad durante la sesion:
                </p>
                <ul className="space-y-2">
                  {dimensions.filter(d => state.dimensionScores[d.id]?.needsSessionReview).map(dimension => {
                    const score = state.dimensionScores[dimension.id]
                    return (
                      <li key={dimension.id} className="text-sm text-destructive-foreground">
                        <span className="font-medium">{dimension.poleA.name} vs {dimension.poleB.name}</span>
                        <span className="text-destructive-foreground text-xs ml-2">
                          ({score?.questionsAsked.length || 0} preguntas, confianza {score?.confidence === 'medium' ? 'media' : 'baja'})
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quality Flags (if any) */}
        {(state.flags.ambivalence || state.flags.inconsistency || state.flags.lowQuality || state.flags.repetitivePattern || state.flags.highImpressionManagement) && (
          <div className="bg-background rounded-lg border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Notas sobre la evaluacion
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {state.flags.lowQuality && (
                <li>- Algunas respuestas fueron dadas muy rapidamente.</li>
              )}
              {state.flags.repetitivePattern && (
                <li>- Se detecto un patron repetitivo en las respuestas.</li>
              )}
              {state.flags.ambivalence && (
                <li>- Se observo ambivalencia en varias dimensiones, lo cual puede indicar flexibilidad contextual.</li>
              )}
              {state.flags.inconsistency && (
                <li>- Se aplicaron preguntas de validacion adicionales en algunas dimensiones para clarificar patrones de respuesta.</li>
              )}
              {state.flags.highImpressionManagement && (
                <li>- Alta tendencia a responder de manera socialmente deseable.</li>
              )}
            </ul>
          </div>
        )}

        {/* Show Details Toggle */}
        <div className="bg-background rounded-lg border border-border p-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {showDetails ? 'Ocultar respuestas individuales' : 'Ver respuestas individuales'}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-4">
              {dimensions.map((dimension) => {
                const score = state.dimensionScores[dimension.id]
                if (!score || score.answers.length === 0) return null

                return (
                  <div key={dimension.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <h4 className="font-medium text-foreground text-sm mb-2">
                      {dimension.poleA.name} vs {dimension.poleB.name}
                    </h4>
                    <div className="text-xs text-muted-foreground mb-2">
                      Puntaje: {dimension.poleA.name} ({score.poleACount}) | {dimension.poleB.name} ({score.poleBCount})
                    </div>
                    <div className="space-y-2">
                      {score.answers.map((answer, idx) => {
                        const question = getQuestionById(answer.questionId)
                        return (
                          <div key={answer.questionId} className="text-xs">
                            <p className="text-muted-foreground mb-0.5">
                              {idx + 1}. {question?.text}
                            </p>
                            <p className={cn(
                              'font-medium',
                              answer.answer === 'V' ? 'text-emerald-600' : 'text-rose-600'
                            )}>
                              {answer.answer === 'V' ? 'Verdadero' : 'Falso'}
                              <span className="ml-2 font-normal text-muted-foreground">
                                Tiempo: {formatResponseTime(answer.responseTimeMs)}
                              </span>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="size-4 mr-2" />
          Nueva evaluacion
        </Button>
      </main>
    </div>
  )
}
