'use client'

import type { Question } from '@/lib/assessment-types'
import { Button } from '@/components/ui/button'

interface QuestionScreenProps {
  question: Question
  questionNumber: number
  estimatedRemaining: number
  progressPercentage: number
  onAnswer: (answer: 'V' | 'F') => void
}

export function QuestionScreen({ 
  question, 
  questionNumber, 
  estimatedRemaining,
  progressPercentage,
  onAnswer 
}: QuestionScreenProps) {
  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-background rounded-lg border border-border p-6">
        <h1 className="text-xl font-semibold text-foreground mb-1">
          Personalidad y Estilos
        </h1>
        <p className="text-muted-foreground text-sm mb-4">
          MIPS - Inventario de Millon
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="text-muted-foreground text-sm">
            Lea cada frase y decida si describe o no su forma de ser.
          </p>
        </div>

        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progreso</span>
          <span className="text-primary font-medium">{progressPercentage}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          ~{estimatedRemaining} preguntas restantes
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-background rounded-lg border border-border p-6">
        {/* Question number */}
        <div className="flex items-center gap-2 mb-4">
          <div className="size-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">{questionNumber}</span>
          </div>
          <span className="text-muted-foreground text-sm">respondidas</span>
        </div>

        {/* Question text */}
        <p className="text-foreground text-lg mb-8 leading-relaxed">
          {question.text}
        </p>

        {/* Answer buttons - TRUE/FALSE */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-14 text-base font-medium hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            onClick={() => onAnswer('V')}
          >
            Verdadero
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 text-base font-medium hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-600 transition-colors"
            onClick={() => onAnswer('F')}
          >
            Falso
          </Button>
        </div>
      </div>

      {/* Help footer */}
      <div className="bg-background rounded-lg border border-border px-6 py-4">
        <p className="text-xs text-muted-foreground text-center">
          Responda con su primera impresion. No hay respuestas correctas o incorrectas.
        </p>
      </div>
    </div>
  )
}
