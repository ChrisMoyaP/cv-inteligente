"use client"

import { useState, useEffect, useRef } from "react"
import { CV, Experiencia, Educacion } from "@/types/cv"
import ExperienciaForm from "@/components/ExperienciaForm"
import DatosPersonalesForm from "@/components/DatosPersonalesForm"
import EstudiosForm from "@/components/EstudiosForm"
import HabilidadesForm from "@/components/HabilidadesForm"
import { useRouter } from "next/navigation"

const initialCv: CV = {
  nombre: "",
  email: "",
  telefono: "",
  ubicacion: "",
  linkedin: "",
  resumen: "",
  experiencias: [],
  educacion: [],
  habilidades: [],
}

export default function CrearCV() {
  const [cv, setCv] = useState<CV>(initialCv)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMejorandoResumen, setIsMejorandoResumen] = useState(false)
  const [mejorarResumenError, setMejorarResumenError] = useState<string | null>(null)
  const [autoGuardado, setAutoGuardado] = useState(false)
  const isFirstLoad = useRef(true)
  const router = useRouter()

  // Cargar CV desde localStorage al montar, con migración de campos nuevos
  useEffect(() => {
    const storedCv = localStorage.getItem("cv-inteligente:v1")
    if (storedCv) {
      const stored = JSON.parse(storedCv)
      setCv({
        ...initialCv,
        ...stored,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        educacion: (stored.educacion || []).map((edu: any) => ({
          actual: false,
          ...edu,
        } as Educacion)),
      })
    }
  }, [])

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCv({
      ...cv,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/cv/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cv),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors(result.errors || {})
        return
      }

      localStorage.setItem("cv-inteligente:v1", JSON.stringify(cv))
      router.push("/preview")
    } catch {
      setErrors({ general: "Error inesperado. Por favor intenta de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const agregarExperiencia = () => {
    setCv({
      ...cv,
      experiencias: [
        ...cv.experiencias,
        {
          empresa: "",
          cargo: "",
          fechaInicio: "",
          fechaFin: "",
          descripcion: "",
          actual: false,
        },
      ],
    })
  }

  const handleExperienciaChange = (
    index: number,
    field: keyof Experiencia,
    value: string | boolean,
  ) => {
    const nuevasExperiencias = [...cv.experiencias]

    if (field === "actual" && value === true) {
      nuevasExperiencias.forEach((exp, i) => {
        if (i !== index) exp.actual = false
      })
    }

    nuevasExperiencias[index] = {
      ...nuevasExperiencias[index],
      [field]: value,
    }

    setCv({ ...cv, experiencias: nuevasExperiencias })
  }

  const eliminarExperiencia = (index: number) => {
    setCv({
      ...cv,
      experiencias: cv.experiencias.filter((_, i) => i !== index),
    })
  }

  const agregarEducacion = () => {
    setCv({
      ...cv,
      educacion: [
        ...cv.educacion,
        {
          institucion: "",
          titulo: "",
          fechaInicio: "",
          fechaFin: "",
          actual: false,
        },
      ],
    })
  }

  const handleEducacionChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const nuevasEducaciones = [...cv.educacion]
    nuevasEducaciones[index] = {
      ...nuevasEducaciones[index],
      [field]: value,
    }
    setCv({ ...cv, educacion: nuevasEducaciones })
  }

  const eliminarEducacion = (index: number) => {
    setCv({
      ...cv,
      educacion: cv.educacion.filter((_, i) => i !== index),
    })
  }

  const agregarHabilidad = (habilidad: string) => {
    if (cv.habilidades.includes(habilidad)) return
    setCv({ ...cv, habilidades: [...cv.habilidades, habilidad] })
  }

  const eliminarHabilidad = (index: number) => {
    setCv({
      ...cv,
      habilidades: cv.habilidades.filter((_, i) => i !== index),
    })
  }

  const resetCv = () => {
    const confirmacion = confirm("¿Estás seguro de crear un nuevo CV?")
    if (!confirmacion) return

    localStorage.removeItem("cv-inteligente:v1")
    setCv(initialCv)
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
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Crear Currículum</h1>
          {autoGuardado && (
            <span className="text-xs text-gray-400">Guardado automáticamente</span>
          )}
        </div>

        {errors.general && (
          <p className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
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
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-xl">
              💡 <strong>Recomendación:</strong> Tu CV no tiene experiencia laboral ni estudios. Agregar al menos uno de los dos hará tu perfil más completo. No es obligatorio para continuar.
            </div>
          )}

          <HabilidadesForm
            habilidades={cv.habilidades}
            agregarHabilidad={agregarHabilidad}
            eliminarHabilidad={eliminarHabilidad}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl transition text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-80"}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Validando...
              </span>
            ) : (
              "Guardar CV"
            )}
          </button>

          <button
            type="button"
            onClick={resetCv}
            className="w-full mt-3 bg-red-600 text-white py-3 rounded-xl hover:opacity-80 transition"
          >
            Nuevo CV
          </button>
        </form>
      </div>
    </main>
  )
}
