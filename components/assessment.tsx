'use client'

import { useSimpleAssessment } from '@/hooks/use-simple-assessment'
import { QuestionScreen } from './question-screen'
import { ResultsScreen } from './results-screen'
import { RegistrationForm } from './registration-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export function Assessment() {
  const { 
    state, 
    isStarted,
    isSaving,
    dbError,
    registerUser,
    startAssessment,
    answerQuestion,
    resetAssessment,
    getCurrentQuestion,
    progressPercentage
  } = useSimpleAssessment()

  // Results screen
  if (state.isComplete) {
    return <ResultsScreen state={state} onReset={resetAssessment} />
  }

  function Header() {
    return (
        <header className="bg-primary text-primary-foreground font-semibold border-b border-border px-4 py-3">
    <div className="max-w-3xl mx-auto flex items-center justify-between">
      Evaluacion MIPS
      <div className="size-9 rounded-full border-2 border-primary-foreground flex items-center justify-center">
        <span className="text-sm text-primary-foreground">?</span>
      </div>
    </div>
  </header>
)
  }

  // Registration screen (before starting)
  if (!state.isRegistered && !isStarted) {
    return (
      <div className="min-h-screen bg-background/30">
        {/* Header */}
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-8">
          {dbError && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">{dbError}</p>
            </div>
          )}
          <RegistrationForm 
            onRegister={(registration) => {
              registerUser(registration)
            }}
            onSkip={() => {
              // Skip registration but still mark as registered to proceed
              registerUser({ nombre: 'Anonimo', edad: 0 })
            }}
            isLoading={isSaving}
          />
        </main>
      </div>
    )
  }

  // Welcome / Start screen (after registration)
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <Header />

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-background rounded-lg border border-border p-6 md:p-8">
            {/* Greeting */}
            {state.user && state.user.nombre !== 'Anonimo' && (
              <p className="text-primary font-medium mb-4">
                Hola, {state.user.nombre}!
              </p>
            )}

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Personalidad y Estilos
            </h1>
            <p className="text-muted-foreground mb-6">
              MIPS - Inventario de Millon
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-foreground/80">
                Lea cada frase y decida si describe o no su forma de ser. 
                Responda <strong>Verdadero</strong> si la frase lo describe, 
                o <strong>Falso</strong> si no lo describe.
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Preguntas aproximadas</span>
                <span className="font-medium text-foreground">~60</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tiempo estimado</span>
                <span className="font-medium text-foreground">10-15 min</span>
              </div>
            </div>

            <Button 
              onClick={startAssessment}
              className="w-full"
              size="lg"
            >
              Comenzar evaluacion
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Assessment screen
  const currentQuestion = getCurrentQuestion()
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <Header />

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <button 
          onClick={resetAssessment}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Salir de la evaluacion
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-8">
        <QuestionScreen
          question={currentQuestion}
          questionNumber={state.totalQuestionsAnswered}
          estimatedRemaining={state.estimatedRemaining}
          progressPercentage={progressPercentage}
          onAnswer={answerQuestion}
        />
      </main>
    </div>
  )
}
