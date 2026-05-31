'use client'

import { useState } from 'react'
import type { UserRegistration } from '@/lib/assessment-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RegistrationFormProps {
  onRegister: (registration: UserRegistration) => void
  onSkip: () => void
  isLoading?: boolean
}

export function RegistrationForm({ onRegister, onSkip, isLoading = false }: RegistrationFormProps) {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ nombre?: string; edad?: string }>({})

  const validate = () => {
    const newErrors: { nombre?: string; edad?: string } = {}
    
    if (!nombre.trim()) {
      newErrors.nombre = 'Ingresa tu nombre o apodo'
    }
    
    const edadNum = parseInt(edad, 10)
    if (!edad || isNaN(edadNum) || edadNum < 10 || edadNum > 100) {
      newErrors.edad = 'Ingresa una edad valida (10-100)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onRegister({
        nombre: nombre.trim(),
        edad: parseInt(edad, 10),
        email: email.trim() || undefined
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-background rounded-lg border border-border p-6">
        <h1 className="text-xl font-semibold text-foreground mb-1">
          Antes de comenzar
        </h1>
        <p className="text-muted-foreground text-sm">
          Algunos datos basicos para personalizar tu experiencia
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-background rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium">
              Nombre o apodo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Como quieres que te llamemos?"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={errors.nombre ? 'border-destructive' : ''}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre}</p>
            )}
          </div>

          {/* Edad */}
          <div className="space-y-2">
            <Label htmlFor="edad" className="text-sm font-medium">
              Edad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edad"
              type="number"
              placeholder="Tu edad"
              min="10"
              max="100"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className={errors.edad ? 'border-destructive' : ''}
            />
            {errors.edad && (
              <p className="text-xs text-destructive">{errors.edad}</p>
            )}
          </div>

          {/* Email (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email <span className="text-xs">(opcional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Para enviarte los resultados"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Continuar'}
          </Button>
        </form>
      </div>

      {/* Skip option */}
      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Prefiero continuar sin registrarme
        </button>
      </div>
    </div>
  )
}
