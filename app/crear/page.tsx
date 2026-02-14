"use client"

import { useState, useEffect } from "react"
import { CV } from "@/types/cv"
import ExperienciaForm from "@/components/ExperienciaForm"
import DatosPersonalesForm from "@/components/DatosPersonalesForm"
import EstudiosForm from "@/components/EstudiosForm"
import HabilidadesForm from "@/components/HabilidadesForm"
import { useRouter } from "next/navigation"
import { Experiencia } from "@/types/cv"

export default function CrearCV() {
    const initialCv: CV = {
        nombre: "",
        email: "",
        telefono: "",
        resumen: "",
        experiencias: [],
        educacion: [],
        habilidades: []
    }

    const [cv, setCv] = useState<CV>(initialCv)

    const router = useRouter()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const storedCv = localStorage.getItem("cv-inteligente:v1")

        if (storedCv) {
            setCv(JSON.parse(storedCv))
        }
    }, [])



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCv({
            ...cv,
            [e.target.name]: e.target.value
        })
    }

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setErrors({})
        setIsSubmitting(true)

        try {

            // ⏳ Simulación de espera para ver animación
            // await sleep(4000)
            const response = await fetch("/api/cv/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cv)
            })

            const result = await response.json()

            if (!response.ok) {
                setErrors(result.errors || {})
                setIsSubmitting(false)
                return
            }

            localStorage.setItem("cv-inteligente:v1", JSON.stringify(cv))

            router.push("/preview")

        } catch (error) {
            setErrors({ general: "Error inesperado" })
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
                    actual: false
                }
            ]
        })
    }

    const handleExperienciaChange = (
        index: number,
        field: keyof Experiencia,
        value: string | boolean
    ) => {
        const nuevasExperiencias = [...cv.experiencias]

        // 🔒 Si están marcando "actual"
        if (field === "actual" && value === true) {
            // Desmarcamos todas las demás
            nuevasExperiencias.forEach((exp, i) => {
                if (i !== index) {
                    exp.actual = false
                }
            })
        }

        nuevasExperiencias[index] = {
            ...nuevasExperiencias[index],
            [field]: value
        }

        setCv({
            ...cv,
            experiencias: nuevasExperiencias
        })
    }

    const eliminarExperiencia = (index: number) => {
        const nuevasExperiencias = cv.experiencias.filter(
            (_, i) => i !== index
        )

        setCv({
            ...cv,
            experiencias: nuevasExperiencias
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
                    fechaFin: ""
                }
            ]
        })
    }

    const handleEducacionChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const nuevasEducaciones = [...cv.educacion]
        nuevasEducaciones[index] = {
            ...nuevasEducaciones[index],
            [field]: value
        }

        setCv({
            ...cv,
            educacion: nuevasEducaciones
        })
    }

    const eliminarEducacion = (index: number) => {
        const nuevasEducaciones = cv.educacion.filter(
            (_, i) => i !== index
        )

        setCv({
            ...cv,
            educacion: nuevasEducaciones
        })
    }

    const agregarHabilidad = (habilidad: string) => {
        if (cv.habilidades.includes(habilidad)) return

        setCv({
            ...cv,
            habilidades: [...cv.habilidades, habilidad]
        })
    }

    const eliminarHabilidad = (index: number) => {
        const nuevasHabilidades = cv.habilidades.filter(
            (_, i) => i !== index
        )

        setCv({
            ...cv,
            habilidades: nuevasHabilidades
        })
    }

    const resetCv = () => {
        const confirmacion = confirm("¿Estás seguro de crear un nuevo CV?")

        if (!confirmacion) return

        localStorage.removeItem("cv-inteligente:v1")
        setCv(initialCv)
    }

    const handleMejorarResumen = async () => {
        if (!cv.resumen) return

        const response = await fetch("/api/ai/mejorar-resumen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ resumen: cv.resumen })
        })

        const result = await response.json()

        if (response.ok) {
            setCv({
                ...cv,
                resumen: result.improved
            })
        }
    }



    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Crear Currículum
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <DatosPersonalesForm
                        cv={cv}
                        handleChange={handleChange}
                        errors={errors}
                        onMejorarResumen={handleMejorarResumen}
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

                    <HabilidadesForm
                        habilidades={cv.habilidades}
                        agregarHabilidad={agregarHabilidad}
                        eliminarHabilidad={eliminarHabilidad}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-xl transition text-white${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "w-full bg-black text-white py-3 rounded-xl hover:opacity-80 transition"}`}
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