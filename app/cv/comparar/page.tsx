"use client"

import { useState, useEffect } from "react"
import { CV, Educacion } from "@/types/cv"
import { useRouter } from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"
import Link from "next/link"

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AnalisisResult {
    porcentaje_compatibilidad: number
    habilidades_match: string[]
    habilidades_faltantes: string[]
    sugerencias_experiencia: string[]
    sugerencias_resumen: string
    fortalezas: string[]
    conclusion: string
}

type LoadState =
    | { status: "loading" }
    | { status: "ready"; cv: CV; uuid: string }
    | { status: "no-cv" }

// ─── Indicador circular ────────────────────────────────────────────────────────

function CircularProgress({ value }: { value: number }) {
    const r = 52
    const circ = 2 * Math.PI * r
    const offset = circ - (value / 100) * circ
    const color = value >= 70 ? "#22c55e" : value >= 40 ? "#f59e0b" : "#ef4444"

    return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
            <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12"
                className="dark:stroke-gray-600" />
            <circle
                cx="70" cy="70" r={r} fill="none"
                stroke={color} strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
            <text x="70" y="65" textAnchor="middle" fontSize="26" fontWeight="700" fill={color}>
                {value}%
            </text>
            <text x="70" y="85" textAnchor="middle" fontSize="11" fill="#6b7280">
                compatibilidad
            </text>
        </svg>
    )
}

// ─── Chip de habilidad ─────────────────────────────────────────────────────────

function Chip({ label, variant }: { label: string; variant: "match" | "missing" }) {
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${variant === "match"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
            {variant === "match" ? "✓" : "✗"} {label}
        </span>
    )
}

// ─── Página ────────────────────────────────────────────────────────────────────

export default function CompararCV() {
    const [loadState, setLoadState] = useState<LoadState>({ status: "loading" })
    const [oferta, setOferta] = useState("")
    const [analisis, setAnalisis] = useState<AnalisisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const load = async () => {
            const uuid = localStorage.getItem("user_uuid")
            if (!uuid) { setLoadState({ status: "no-cv" }); return }

            try {
                const res = await fetch(`/api/cv/${uuid}`)
                if (!res.ok) { setLoadState({ status: "no-cv" }); return }

                const { data } = await res.json()
                const cv: CV = {
                    nombre: data.nombre ?? "",
                    email: data.email ?? "",
                    telefono: data.telefono ?? "",
                    ubicacion: data.ubicacion ?? "",
                    linkedin: data.linkedin ?? "",
                    resumen: data.resumen ?? "",
                    experiencias: data.experiencias ?? [],
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    educacion: (data.educacion ?? []).map((e: any) => ({ actual: false, ...e } as Educacion)),
                    habilidades: data.habilidades ?? [],
                }
                setLoadState({ status: "ready", cv, uuid })
            } catch {
                setLoadState({ status: "no-cv" })
            }
        }
        load()
    }, [])

    const handleAnalizar = async () => {
        if (loadState.status !== "ready" || !oferta.trim()) return
        setError(null)
        setAnalisis(null)
        setIsAnalyzing(true)

        try {
            const res = await fetch("/api/cv/comparar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cv: loadState.cv, oferta }),
            })
            const json = await res.json()
            if (!res.ok) { setError(json.error ?? "Error al analizar"); return }
            setAnalisis(json.analisis)
        } catch {
            setError("Error de conexión. Por favor intenta de nuevo.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    // ── Estado: cargando ──
    if (loadState.status === "loading") {
        return (
            <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Cargando CV...</span>
            </main>
        )
    }

    // ── Estado: sin CV ──
    if (loadState.status === "no-cv") {
        return (
            <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <p className="text-xl font-semibold dark:text-white">Primero debes crear tu CV</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Necesitás tener un CV guardado para poder compararlo con una oferta.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="mt-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-80 transition"
                    >
                        Ir al inicio
                    </button>
                </div>
            </main>
        )
    }

    // ── Estado: listo ──
    const { cv } = loadState
    const experienciaActual =
        cv.experiencias.find(e => e.actual) ?? cv.experiencias[0]

    return (
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white">Comparar con oferta</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Analizá qué tan compatible es tu CV con una oferta laboral
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Resumen del CV cargado */}
                    <div className="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                        <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0">
                            <span className="text-white dark:text-black text-sm font-bold">
                                {cv.nombre.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium dark:text-white text-sm truncate">{cv.nombre}</p>
                            {experienciaActual && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {experienciaActual.cargo} · {experienciaActual.empresa}
                                </p>
                            )}
                        </div>
                        <Link
                            href="/cv/edit"
                            className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 transition"
                        >
                            Editar CV
                        </Link>
                    </div>
                </div>

                {/* Textarea oferta */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                    <label className="block text-sm font-medium dark:text-white">
                        Descripción de la oferta laboral
                    </label>
                    <textarea
                        value={oferta}
                        onChange={e => setOferta(e.target.value)}
                        rows={10}
                        placeholder="Pega aquí la descripción de la oferta laboral..."
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm resize-y bg-white dark:bg-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleAnalizar}
                        disabled={isAnalyzing || !oferta.trim()}
                        className={`w-full py-3 rounded-xl transition text-white dark:text-black font-medium ${isAnalyzing || !oferta.trim()
                            ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-black dark:bg-white hover:opacity-80"
                            }`}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin" />
                                Analizando...
                            </span>
                        ) : "Analizar compatibilidad"}
                    </button>
                </div>

                {/* Resultados */}
                {analisis && (
                    <div className="space-y-4">

                        {/* Porcentaje */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
                            <CircularProgress value={analisis.porcentaje_compatibilidad} />
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                {analisis.conclusion}
                            </p>
                        </div>

                        {/* Habilidades */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                            <h2 className="font-semibold dark:text-white">Habilidades</h2>

                            {analisis.habilidades_match.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">
                                        Coinciden con la oferta
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {analisis.habilidades_match.map(h => (
                                            <Chip key={h} label={h} variant="match" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {analisis.habilidades_faltantes.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">
                                        Requeridas y no encontradas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {analisis.habilidades_faltantes.map(h => (
                                            <Chip key={h} label={h} variant="missing" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fortalezas */}
                        {analisis.fortalezas.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                                <h2 className="font-semibold dark:text-white mb-3">Fortalezas de tu perfil</h2>
                                <ul className="space-y-2">
                                    {analisis.fortalezas.map((f, i) => (
                                        <li key={i} className="flex gap-2 text-sm dark:text-gray-300">
                                            <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sugerencias experiencia */}
                        {analisis.sugerencias_experiencia.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                                <h2 className="font-semibold dark:text-white mb-3">Mejorá tu experiencia</h2>
                                <ul className="space-y-2">
                                    {analisis.sugerencias_experiencia.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-sm dark:text-gray-300">
                                            <span className="text-amber-500 shrink-0 mt-0.5">→</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Sugerencias resumen */}
                        {analisis.sugerencias_resumen && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                                <h2 className="font-semibold dark:text-white mb-2">Mejorá tu resumen profesional</h2>
                                <p className="text-sm dark:text-gray-300 leading-relaxed">
                                    {analisis.sugerencias_resumen}
                                </p>
                            </div>
                        )}

                        {/* Botón editar CV */}
                        <div className="text-center pb-4">
                            <Link
                                href="/cv/edit"
                                className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-80 transition text-sm font-medium"
                            >
                                Aplicar sugerencias en mi CV
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
