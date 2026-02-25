"use client"

import { useEffect, useState } from "react"
import { CV } from "@/types/cv"
import Link from "next/link"
import CvPreview from "@/components/CVPreview"
import { PDFDownloadLink } from "@react-pdf/renderer"
import CVDocument from "@/components/pdf/CVDocument"
import CVModerno from "@/components/pdf/CVModerno"
import CVElegante from "@/components/pdf/CVElegante"
import CVCreativo from "@/components/pdf/CVCreativo"
import CVCompacto from "@/components/pdf/CVCompacto"

type Plantilla = "clasico" | "moderno" | "elegante" | "creativo" | "compacto"

interface PlantillaConfig {
    id: Plantilla
    nombre: string
    descripcion: string
    preview: React.ReactNode
}

const PLANTILLAS: PlantillaConfig[] = [
    {
        id: "clasico",
        nombre: "Clásico",
        descripcion: "Dos columnas, diseño limpio y tradicional",
        preview: (
            <div className="w-full h-full flex gap-1 p-2">
                <div className="w-[35%] flex flex-col gap-1">
                    <div className="h-2 bg-gray-800 rounded-sm w-3/4" />
                    <div className="h-1 bg-gray-300 rounded-sm w-full" />
                    <div className="h-1 bg-gray-300 rounded-sm w-2/3" />
                    <div className="mt-2 h-1 bg-gray-500 rounded-sm w-1/2" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-5/6" />
                    <div className="mt-2 h-1 bg-gray-500 rounded-sm w-1/2" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-2/3" />
                </div>
                <div className="w-px bg-gray-200 mx-1" />
                <div className="flex-1 flex flex-col gap-1">
                    <div className="h-1 bg-gray-500 rounded-sm w-1/2" />
                    <div className="h-1 bg-gray-800 rounded-sm w-3/4" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-5/6" />
                    <div className="mt-2 h-1 bg-gray-500 rounded-sm w-1/2" />
                    <div className="h-1 bg-gray-800 rounded-sm w-3/4" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                </div>
            </div>
        )
    },
    {
        id: "moderno",
        nombre: "Moderno",
        descripcion: "Columna única, header oscuro con nombre destacado",
        preview: (
            <div className="w-full h-full flex flex-col">
                <div className="bg-slate-800 px-2 py-2 flex flex-col gap-1">
                    <div className="h-2 bg-white rounded-sm w-2/3 opacity-90" />
                    <div className="flex gap-1 mt-1">
                        <div className="h-1 bg-slate-400 rounded-sm w-1/3" />
                        <div className="h-1 bg-slate-400 rounded-sm w-1/4" />
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-1 p-2">
                    <div className="h-1 bg-blue-400 rounded-sm w-1/3" />
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-5/6" />
                    <div className="mt-1 h-1 bg-blue-400 rounded-sm w-1/3" />
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="h-1 bg-gray-700 rounded-sm w-2/3" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="mt-1 h-1 bg-blue-400 rounded-sm w-1/3" />
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="flex gap-1 flex-wrap">
                        <div className="h-2 bg-slate-100 rounded w-8" />
                        <div className="h-2 bg-slate-100 rounded w-10" />
                        <div className="h-2 bg-slate-100 rounded w-7" />
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "elegante",
        nombre: "Elegante",
        descripcion: "Columna única, header centrado con separadores decorativos",
        preview: (
            <div className="w-full h-full flex flex-col items-center p-3 gap-1">
                <div className="h-2 bg-gray-800 rounded w-3/5" />
                <div className="w-full border-b border-gray-500 my-1" />
                <div className="flex gap-2 justify-center">
                    <div className="h-1 bg-gray-300 rounded w-8" />
                    <div className="h-1 bg-gray-300 rounded w-8" />
                    <div className="h-1 bg-gray-300 rounded w-6" />
                </div>
                <div className="flex items-center gap-1 w-full mt-2">
                    <div className="flex-1 border-b border-gray-200" />
                    <div className="h-1 bg-gray-400 rounded w-6" />
                    <div className="flex-1 border-b border-gray-200" />
                </div>
                <div className="h-1 bg-gray-200 rounded w-full" />
                <div className="h-1 bg-gray-200 rounded w-5/6" />
                <div className="flex items-center gap-1 w-full mt-1">
                    <div className="flex-1 border-b border-gray-200" />
                    <div className="h-1 bg-gray-400 rounded w-10" />
                    <div className="flex-1 border-b border-gray-200" />
                </div>
                <div className="h-1 bg-gray-700 rounded w-2/3" />
                <div className="h-1 bg-gray-200 rounded w-full" />
                <div className="h-1 bg-gray-200 rounded w-4/5" />
            </div>
        )
    },
    {
        id: "creativo",
        nombre: "Creativo",
        descripcion: "Barra lateral verde oscura con habilidades y perfil",
        preview: (
            <div className="w-full h-full flex">
                <div className="w-[35%] bg-teal-700 p-2 flex flex-col gap-1">
                    <div className="h-2 bg-white rounded-sm w-4/5 opacity-90" />
                    <div className="mt-2 h-px bg-teal-400 w-full" />
                    <div className="h-1 bg-teal-200 rounded-sm w-3/4 opacity-80" />
                    <div className="h-1 bg-teal-200 rounded-sm w-2/3 opacity-80" />
                    <div className="mt-1 h-px bg-teal-400 w-full" />
                    <div className="h-1 bg-teal-200 rounded-sm w-full opacity-60" />
                    <div className="h-1 bg-teal-200 rounded-sm w-5/6 opacity-60" />
                    <div className="mt-1 h-px bg-teal-400 w-full" />
                    <div className="h-2 bg-teal-600 rounded w-3/4" />
                    <div className="h-2 bg-teal-600 rounded w-1/2" />
                </div>
                <div className="flex-1 p-2 flex flex-col gap-1">
                    <div className="mt-3 h-1 bg-teal-700 rounded-sm w-1/2" />
                    <div className="h-px bg-green-100 w-full" />
                    <div className="h-1 bg-gray-700 rounded-sm w-3/4" />
                    <div className="h-1 bg-gray-200 rounded-sm w-full" />
                    <div className="h-1 bg-gray-200 rounded-sm w-5/6" />
                    <div className="mt-1 h-1 bg-teal-700 rounded-sm w-1/2" />
                    <div className="h-px bg-green-100 w-full" />
                    <div className="h-1 bg-gray-700 rounded-sm w-2/3" />
                </div>
            </div>
        )
    },
    {
        id: "compacto",
        nombre: "Compacto",
        descripcion: "Columna única densa, acento rojo, óptimo para una página",
        preview: (
            <div className="w-full h-full p-2 flex flex-col gap-1">
                <div className="flex justify-between items-end border-b-2 border-red-500 pb-1 mb-1">
                    <div className="h-2 bg-gray-800 rounded w-2/5" />
                    <div className="flex flex-col items-end gap-0.5">
                        <div className="h-1 bg-gray-300 rounded w-10" />
                        <div className="h-1 bg-gray-300 rounded w-8" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-0.5 h-3 bg-red-500 rounded-sm" />
                    <div className="h-1 bg-gray-600 rounded w-1/3" />
                </div>
                <div className="h-1 bg-gray-200 rounded w-full" />
                <div className="h-1 bg-gray-200 rounded w-5/6" />
                <div className="flex items-center gap-1 mt-1">
                    <div className="w-0.5 h-3 bg-red-500 rounded-sm" />
                    <div className="h-1 bg-gray-600 rounded w-2/5" />
                </div>
                <div className="h-1 bg-gray-700 rounded w-3/4" />
                <div className="h-1 bg-gray-200 rounded w-full" />
                <div className="h-1 bg-gray-200 rounded w-4/5" />
                <div className="flex items-center gap-1 mt-1">
                    <div className="w-0.5 h-3 bg-red-500 rounded-sm" />
                    <div className="h-1 bg-gray-600 rounded w-1/4" />
                </div>
                <div className="h-1 bg-gray-200 rounded w-full" />
            </div>
        )
    }
]

export default function PreviewPage() {
    const [cv, setCv] = useState<CV | null>(null)
    const [plantilla, setPlantilla] = useState<Plantilla>("clasico")

    useEffect(() => {
        const storedCv = localStorage.getItem("cv-inteligente:v1")
        if (storedCv) {
            setCv(JSON.parse(storedCv))
        }
    }, [])

    if (!cv) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">No hay CV guardado.</p>
                    <Link href="/crear" className="text-blue-600 underline">
                        Crear uno ahora
                    </Link>
                </div>
            </main>
        )
    }

    const documentoSeleccionado =
        plantilla === "moderno"  ? <CVModerno cv={cv} />  :
        plantilla === "elegante" ? <CVElegante cv={cv} /> :
        plantilla === "creativo" ? <CVCreativo cv={cv} /> :
        plantilla === "compacto" ? <CVCompacto cv={cv} /> :
        <CVDocument cv={cv} />

    const plantillaActual = PLANTILLAS.find(p => p.id === plantilla)!

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-6">

                <CvPreview cv={cv} />

                {/* Selector de plantilla */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Elige una plantilla para el PDF
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {PLANTILLAS.map((p) => {
                            const seleccionada = plantilla === p.id
                            return (
                                <label
                                    key={p.id}
                                    className={`cursor-pointer rounded-xl border-2 overflow-hidden transition ${
                                        seleccionada
                                            ? "border-black shadow-md"
                                            : "border-gray-200 hover:border-gray-400"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="plantilla"
                                        value={p.id}
                                        checked={seleccionada}
                                        onChange={() => setPlantilla(p.id)}
                                        className="sr-only"
                                    />

                                    {/* Miniatura */}
                                    <div className="h-32 bg-white border-b border-gray-100 overflow-hidden">
                                        {p.preview}
                                    </div>

                                    {/* Pie de tarjeta */}
                                    <div
                                        className={`px-3 py-2 flex items-center justify-between text-sm transition ${
                                            seleccionada ? "bg-black text-white" : "bg-gray-50 text-gray-700"
                                        }`}
                                    >
                                        <span className="font-medium">{p.nombre}</span>
                                        {seleccionada && (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{plantillaActual.descripcion}</p>
                </div>

                {/* Navegación y descarga */}
                <div className="text-center flex flex-col items-center gap-3">
                    <div className="flex gap-6">
                        <Link href="/" className="text-gray-500 hover:underline text-sm">
                            Inicio
                        </Link>
                        <Link href="/crear" className="text-blue-600 underline text-sm">
                            Volver a editar
                        </Link>
                    </div>
                    <PDFDownloadLink
                        document={documentoSeleccionado}
                        fileName={`CV-${plantilla}.pdf`}
                    >
                        {({ loading }) => (
                            <button className="mt-2 bg-black text-white px-6 py-2 rounded-lg hover:opacity-80 transition">
                                {loading ? "Generando PDF..." : `Descargar PDF — ${plantillaActual.nombre}`}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>

            </div>
        </main>
    )
}
