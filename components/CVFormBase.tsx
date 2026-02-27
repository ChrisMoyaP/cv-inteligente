"use client"

import { useState, useEffect, useRef } from "react"
import { CV, Experiencia } from "@/types/cv"
import ExperienciaForm from "@/components/ExperienciaForm"
import DatosPersonalesForm from "@/components/DatosPersonalesForm"
import EstudiosForm from "@/components/EstudiosForm"
import HabilidadesForm from "@/components/HabilidadesForm"
import ThemeToggle from "@/components/ThemeToggle"
import { useRouter } from "next/navigation"

const emptyCV: CV = {
  nombre: "", email: "", telefono: "", ubicacion: "",
  linkedin: "", resumen: "", experiencias: [], educacion: [], habilidades: [],
}

interface Props {
  initialData: CV
  title: string
  submitLabel: string
  /** Contenido adicional debajo del título (ej: última actualización) */
  headerExtra?: React.ReactNode
  showReset?: boolean
  onSave: (cv: CV) => Promise<{ ok: boolean; errorMessage?: string }>
}

export default function CVFormBase({
  initialData,
  title,
  submitLabel,
  headerExtra,
  showReset = false,
  onSave,
}: Props) {
  const [cv, setCv] = useState<CV>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMejorandoResumen, setIsMejorandoResumen] = useState(false)
  const [mejorarResumenError, setMejorarResumenError] = useState<string | null>(null)
  const [autoGuardado, setAutoGuardado] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const isFirstLoad = useRef(true)
  const router = useRouter()

  // Auto-guardado con debounce de 1 segundo
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    setAutoGuardado(false)
    const timer = setTimeout(() => {
      localStorage.setItem("cv-inteligente:v1", JSON.stringify(cv))
      setAutoGuardado(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [cv])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCv({ ...cv, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSaveStatus(null)
    setIsSubmitting(true)

    try {
      // 1. Validar
      const validateRes = await fetch("/api/cv/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      })
      const validateResult = await validateRes.json()
      if (!validateRes.ok) {
        setErrors(validateResult.errors || {})
        return
      }

      // 2. Guardar vía handler del padre
      const result = await onSave(cv)
      if (!result.ok) {
        setSaveStatus({ type: "error", message: result.errorMessage ?? "Error al guardar. Inténtalo de nuevo." })
        return
      }

      // 3. Éxito
      localStorage.setItem("cv-inteligente:v1", JSON.stringify(cv))
      setSaveStatus({ type: "success", message: "CV guardado correctamente. Redirigiendo..." })
      setTimeout(() => router.push("/preview"), 800)
    } catch {
      setErrors({ general: "Error inesperado. Por favor intenta de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const agregarExperiencia = () => {
    setCv({
      ...cv,
      experiencias: [...cv.experiencias, {
        empresa: "", cargo: "", fechaInicio: "", fechaFin: "", descripcion: "", actual: false,
      }],
    })
  }

  const handleExperienciaChange = (index: number, field: keyof Experiencia, value: string | boolean) => {
    const nuevasExperiencias = [...cv.experiencias]
    if (field === "actual" && value === true) {
      nuevasExperiencias.forEach((exp, i) => { if (i !== index) exp.actual = false })
    }
    nuevasExperiencias[index] = { ...nuevasExperiencias[index], [field]: value }
    setCv({ ...cv, experiencias: nuevasExperiencias })
  }

  const eliminarExperiencia = (index: number) => {
    setCv({ ...cv, experiencias: cv.experiencias.filter((_, i) => i !== index) })
  }

  const agregarEducacion = () => {
    setCv({
      ...cv,
      educacion: [...cv.educacion, {
        institucion: "", titulo: "", fechaInicio: "", fechaFin: "", actual: false,
      }],
    })
  }

  const handleEducacionChange = (index: number, field: string, value: string | boolean) => {
    const nuevasEducaciones = [...cv.educacion]
    nuevasEducaciones[index] = { ...nuevasEducaciones[index], [field]: value }
    setCv({ ...cv, educacion: nuevasEducaciones })
  }

  const eliminarEducacion = (index: number) => {
    setCv({ ...cv, educacion: cv.educacion.filter((_, i) => i !== index) })
  }

  const agregarHabilidad = (habilidad: string) => {
    if (cv.habilidades.includes(habilidad)) return
    setCv({ ...cv, habilidades: [...cv.habilidades, habilidad] })
  }

  const eliminarHabilidad = (index: number) => {
    setCv({ ...cv, habilidades: cv.habilidades.filter((_, i) => i !== index) })
  }

  const resetCv = () => {
    if (!confirm("¿Estás seguro de limpiar el formulario?")) return
    localStorage.removeItem("cv-inteligente:v1")
    setCv(emptyCV)
  }

  const handleMejorarResumen = async () => {
    if (!cv.resumen || isMejorandoResumen) return
    setIsMejorandoResumen(true)
    setMejorarResumenError(null)
    try {
      const response = await fetch("/api/ai/mejorar-resumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumen: cv.resumen }),
      })
      const result = await response.json()
      if (!response.ok) {
        setMejorarResumenError(result.error || "Error al mejorar el resumen")
        return
      }
      setCv({ ...cv, resumen: result.improved })
    } catch {
      setMejorarResumenError("Error de conexión. Por favor intenta de nuevo.")
    } finally {
      setIsMejorandoResumen(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
            {headerExtra}
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            {autoGuardado && (
              <span className="text-xs text-gray-400 dark:text-gray-500">Guardado automáticamente</span>
            )}
            <ThemeToggle />
          </div>
        </div>

        {errors.general && (
          <p className="mb-4 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <DatosPersonalesForm
            cv={cv}
            handleChange={handleChange}
            errors={errors}
            onMejorarResumen={handleMejorarResumen}
            isMejorandoResumen={isMejorandoResumen}
            mejorarResumenError={mejorarResumenError}
          />

          <ExperienciaForm
            experiencias={cv.experiencias}
            agregarExperiencia={agregarExperiencia}
            eliminarExperiencia={eliminarExperiencia}
            handleExperienciaChange={handleExperienciaChange}
            errors={errors}
          />

          <EstudiosForm
            educacion={cv.educacion}
            agregarEducacion={agregarEducacion}
            eliminarEducacion={eliminarEducacion}
            handleEducacionChange={handleEducacionChange}
            errors={errors}
          />

          {cv.experiencias.length === 0 && cv.educacion.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-300 text-sm px-4 py-3 rounded-xl">
              💡 <strong>Recomendación:</strong> Tu CV no tiene experiencia laboral ni estudios. Agregar al menos uno de los dos hará tu perfil más completo. No es obligatorio para continuar.
            </div>
          )}

          <HabilidadesForm
            habilidades={cv.habilidades}
            agregarHabilidad={agregarHabilidad}
            eliminarHabilidad={eliminarHabilidad}
          />

          {saveStatus && (
            <p className={`text-sm p-3 rounded-xl ${saveStatus.type === "success" ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" : "text-red-600 bg-red-50 dark:bg-red-900/20"}`}>
              {saveStatus.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl transition text-white dark:text-black ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black dark:bg-white hover:opacity-80"}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></span>
                Guardando...
              </span>
            ) : (
              submitLabel
            )}
          </button>

          {showReset && (
            <button
              type="button"
              onClick={resetCv}
              className="w-full mt-3 bg-red-600 text-white py-3 rounded-xl hover:opacity-80 transition"
            >
              Limpiar Campos
            </button>
          )}
        </form>
      </div>
    </main>
  )
}
