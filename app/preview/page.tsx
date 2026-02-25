"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { CV } from "@/types/cv"
import Link from "next/link"
import { PDFDownloadLink } from "@react-pdf/renderer"
import ThemeToggle from "@/components/ThemeToggle"
import CVDocument from "@/components/pdf/CVDocument"
import CVModerno from "@/components/pdf/CVModerno"
import CVElegante from "@/components/pdf/CVElegante"
import CVCreativo from "@/components/pdf/CVCreativo"
import CVCompacto from "@/components/pdf/CVCompacto"

// PDFViewer usa APIs del browser — importar solo en cliente
const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Cargando previsualización…
            </div>
        )
    }
)

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
            <main className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="text-center">
                    <p className="mb-4 dark:text-gray-300">No hay CV guardado.</p>
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
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-4">

                {/* Barra superior de navegación */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-5 text-sm">
                        <Link href="/" className="text-gray-500 dark:text-gray-400 hover:underline">
                            ← Inicio
                        </Link>
                        <Link href="/crear" className="text-blue-600 hover:underline">
                            Volver a editar
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <PDFDownloadLink
                            document={documentoSeleccionado}
                            fileName={`CV-${plantilla}.pdf`}
                        >
                            {({ loading }) => (
                                <button
                                    className="bg-black dark:bg-white text-white dark:text-black text-sm px-5 py-2 rounded-lg hover:opacity-80 transition flex items-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Generando…
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                            Descargar — {plantillaActual.nombre}
                                        </>
                                    )}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>

                {/* Panel principal */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">

                    {/* Selector de plantillas */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            Plantilla seleccionada: <span className="text-gray-800 dark:text-gray-200">{plantillaActual.nombre}</span>
                            <span className="ml-2 font-normal normal-case text-gray-400 dark:text-gray-500">— {plantillaActual.descripcion}</span>
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                            {PLANTILLAS.map((p) => {
                                const seleccionada = plantilla === p.id
                                return (
                                    <label
                                        key={p.id}
                                        className={`cursor-pointer rounded-lg border-2 overflow-hidden transition ${
                                            seleccionada
                                                ? "border-black dark:border-white shadow"
                                                : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
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
                                        {/* Miniatura — siempre fondo blanco para que la preview sea fiel al PDF */}
                                        <div className="h-20 bg-white overflow-hidden border-b border-gray-100 dark:border-gray-600">
                                            {p.preview}
                                        </div>
                                        {/* Pie */}
                                        <div
                                            className={`px-2 py-1.5 flex items-center justify-between text-xs transition ${
                                                seleccionada
                                                    ? "bg-black text-white"
                                                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                            }`}
                                        >
                                            <span className="font-medium truncate">{p.nombre}</span>
                                            {seleccionada && (
                                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    {/* Previsualización PDF en tiempo real */}
                    {/* key={plantilla} fuerza re-montaje al cambiar plantilla → PDF se regenera */}
                    <div className="bg-gray-50 dark:bg-gray-700 [&>iframe]:border-0" style={{ height: "780px" }}>
                        <PDFViewer
                            key={plantilla}
                            width="100%"
                            height="780"
                        >
                            {documentoSeleccionado}
                        </PDFViewer>
                    </div>

                </div>

            </div>
        </main>
    )
}
