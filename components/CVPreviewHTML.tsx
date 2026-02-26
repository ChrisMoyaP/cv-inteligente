"use client"

import { CV } from "@/types/cv"

type Plantilla = "clasico" | "moderno" | "elegante" | "creativo" | "compacto"

interface Props {
    cv: CV
    plantilla: Plantilla
}

function formatDate(fecha: string): string {
    if (!fecha) return ""
    if (/^\d{4}$/.test(fecha)) return fecha
    const [year, month] = fecha.split("-").map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString("es-CL", { year: "numeric", month: "short" })
}

export default function CVPreviewHTML({ cv, plantilla }: Props) {
    const experienciasOrdenadas = [...cv.experiencias]
        .filter(e => e.empresa || e.cargo)
        .sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))

    const educacionOrdenada = [...cv.educacion]
        .filter(e => e.institucion || e.titulo)
        .sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio))

    if (plantilla === "moderno") return <PreviewModerno cv={cv} experiencias={experienciasOrdenadas} educacion={educacionOrdenada} />
    if (plantilla === "elegante") return <PreviewElegante cv={cv} experiencias={experienciasOrdenadas} educacion={educacionOrdenada} />
    if (plantilla === "creativo") return <PreviewCreativo cv={cv} experiencias={experienciasOrdenadas} educacion={educacionOrdenada} />
    if (plantilla === "compacto") return <PreviewCompacto cv={cv} experiencias={experienciasOrdenadas} educacion={educacionOrdenada} />
    return <PreviewClasico cv={cv} experiencias={experienciasOrdenadas} educacion={educacionOrdenada} />
}

/* ─── Tipos internos ─── */
interface SectionProps {
    cv: CV
    experiencias: CV["experiencias"]
    educacion: CV["educacion"]
}

/* ══════════════════════════════════════════
   CLÁSICO — dos columnas (izq 30% / der 70%)
   ══════════════════════════════════════════ */
function PreviewClasico({ cv, experiencias, educacion }: SectionProps) {
    return (
        <div className="bg-white text-gray-900 text-sm font-sans min-h-full">
            <div className="flex flex-col sm:flex-row">
                {/* Columna izquierda */}
                <div className="sm:w-[30%] p-6 sm:pr-5 space-y-5 border-b sm:border-b-0 sm:border-r border-gray-200">
                    <div>
                        <h1 className="text-lg font-bold leading-tight">{cv.nombre}</h1>
                        <div className="mt-2 space-y-0.5 text-xs text-gray-600">
                            <p>{cv.email}</p>
                            <p>{cv.telefono}</p>
                            {cv.ubicacion && <p>{cv.ubicacion}</p>}
                            {cv.linkedin && <p className="break-all">{cv.linkedin}</p>}
                        </div>
                    </div>
                    {cv.resumen && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Perfil</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{cv.resumen}</p>
                        </div>
                    )}
                    {cv.habilidades.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Habilidades</p>
                            <div className="flex flex-wrap gap-1">
                                {cv.habilidades.map((h, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{h}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Columna derecha */}
                <div className="sm:w-[70%] p-6 sm:pl-6 space-y-5">
                    {experiencias.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Experiencia</p>
                            <div className="space-y-4">
                                {experiencias.map((exp, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-sm">{exp.cargo}</p>
                                        <p className="text-xs text-gray-500">{exp.empresa}</p>
                                        <p className="text-xs text-gray-400 mb-1">
                                            {formatDate(exp.fechaInicio)} — {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}
                                        </p>
                                        {exp.descripcion && <p className="text-xs text-gray-700 leading-relaxed">{exp.descripcion}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {educacion.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Educación</p>
                            <div className="space-y-3">
                                {educacion.map((edu, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-sm">{edu.titulo}</p>
                                        <p className="text-xs text-gray-500">{edu.institucion}</p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(edu.fechaInicio)} — {edu.actual ? "En curso" : formatDate(edu.fechaFin)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   MODERNO — header oscuro + columna única
   ══════════════════════════════════════════ */
function PreviewModerno({ cv, experiencias, educacion }: SectionProps) {
    return (
        <div className="bg-white text-gray-900 text-sm font-sans min-h-full">
            {/* Header */}
            <div className="bg-slate-800 text-white px-6 py-5">
                <h1 className="text-xl font-bold">{cv.nombre}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-slate-300 text-xs">
                    <span>{cv.email}</span>
                    <span>{cv.telefono}</span>
                    {cv.ubicacion && <span>{cv.ubicacion}</span>}
                    {cv.linkedin && <span className="text-blue-400 break-all">{cv.linkedin}</span>}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
                {cv.resumen && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Perfil</p>
                        <div className="border-t border-gray-200 pt-2">
                            <p className="text-xs text-gray-700 leading-relaxed">{cv.resumen}</p>
                        </div>
                    </div>
                )}
                {experiencias.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Experiencia</p>
                        <div className="border-t border-gray-200 pt-2 space-y-4">
                            {experiencias.map((exp, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm">{exp.cargo}</p>
                                    <p className="text-xs text-slate-600">{exp.empresa} · {formatDate(exp.fechaInicio)} — {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}</p>
                                    {exp.descripcion && <p className="mt-1 text-xs text-gray-700 leading-relaxed">{exp.descripcion}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {educacion.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Educación</p>
                        <div className="border-t border-gray-200 pt-2 space-y-3">
                            {educacion.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm">{edu.titulo}</p>
                                    <p className="text-xs text-slate-600">{edu.institucion} · {formatDate(edu.fechaInicio)} — {edu.actual ? "En curso" : formatDate(edu.fechaFin)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {cv.habilidades.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Habilidades</p>
                        <div className="border-t border-gray-200 pt-2 flex flex-wrap gap-1.5">
                            {cv.habilidades.map((h, i) => (
                                <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{h}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   ELEGANTE — centrado, letras espaciadas
   ══════════════════════════════════════════ */
function EleganteDivider({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 my-3">
            <div className="flex-1 border-t border-gray-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{title}</p>
            <div className="flex-1 border-t border-gray-300" />
        </div>
    )
}

function PreviewElegante({ cv, experiencias, educacion }: SectionProps) {
    return (
        <div className="bg-white text-gray-900 text-sm font-sans min-h-full px-6 py-6">
            {/* Header centrado */}
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold tracking-[0.15em] uppercase">{cv.nombre}</h1>
                <div className="border-t border-gray-400 my-2" />
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    <span>{cv.email}</span>
                    {cv.telefono && <><span>·</span><span>{cv.telefono}</span></>}
                    {cv.ubicacion && <><span>·</span><span>{cv.ubicacion}</span></>}
                    {cv.linkedin && <><span>·</span><span className="break-all">{cv.linkedin}</span></>}
                </div>
            </div>

            {cv.resumen && (
                <>
                    <EleganteDivider title="Perfil" />
                    <p className="text-xs text-gray-700 leading-relaxed text-center">{cv.resumen}</p>
                </>
            )}
            {experiencias.length > 0 && (
                <>
                    <EleganteDivider title="Experiencia" />
                    <div className="space-y-4">
                        {experiencias.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-sm">{exp.cargo}</p>
                                    <p className="text-xs text-gray-400 ml-2 shrink-0">
                                        {formatDate(exp.fechaInicio)} — {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}
                                    </p>
                                </div>
                                <p className="text-xs italic text-gray-500">{exp.empresa}</p>
                                {exp.descripcion && <p className="mt-1 text-xs text-gray-700 leading-relaxed">{exp.descripcion}</p>}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {educacion.length > 0 && (
                <>
                    <EleganteDivider title="Educación" />
                    <div className="space-y-3">
                        {educacion.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-sm">{edu.titulo}</p>
                                    <p className="text-xs text-gray-400 ml-2 shrink-0">
                                        {formatDate(edu.fechaInicio)} — {edu.actual ? "En curso" : formatDate(edu.fechaFin)}
                                    </p>
                                </div>
                                <p className="text-xs italic text-gray-500">{edu.institucion}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {cv.habilidades.length > 0 && (
                <>
                    <EleganteDivider title="Habilidades" />
                    <p className="text-xs text-gray-700 text-center">{cv.habilidades.join("   ·   ")}</p>
                </>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════
   CREATIVO — sidebar teal + main blanco
   ══════════════════════════════════════════ */
function PreviewCreativo({ cv, experiencias, educacion }: SectionProps) {
    return (
        <div className="bg-white text-sm font-sans min-h-full flex flex-col sm:flex-row">
            {/* Sidebar */}
            <div className="sm:w-[33%] bg-teal-700 text-teal-50 p-5 space-y-5">
                <div>
                    <h1 className="text-base font-bold text-white leading-tight">{cv.nombre}</h1>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-500 pb-1 mb-2">Contacto</p>
                    <div className="space-y-0.5 text-xs text-teal-100">
                        <p>{cv.email}</p>
                        <p>{cv.telefono}</p>
                        {cv.ubicacion && <p>{cv.ubicacion}</p>}
                        {cv.linkedin && <p className="break-all">{cv.linkedin}</p>}
                    </div>
                </div>
                {cv.resumen && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-500 pb-1 mb-2">Perfil</p>
                        <p className="text-xs text-teal-100 leading-relaxed">{cv.resumen}</p>
                    </div>
                )}
                {cv.habilidades.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-500 pb-1 mb-2">Habilidades</p>
                        <div className="flex flex-wrap gap-1.5">
                            {cv.habilidades.map((h, i) => (
                                <span key={i} className="bg-teal-600 text-teal-100 text-xs px-2 py-0.5 rounded">{h}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido principal */}
            <div className="sm:w-[67%] p-5 space-y-5 text-gray-900">
                {experiencias.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-1">Experiencia</p>
                        <div className="border-t border-green-100 pt-2 space-y-4">
                            {experiencias.map((exp, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm">{exp.cargo}</p>
                                    <p className="text-xs text-gray-500">{exp.empresa} · {formatDate(exp.fechaInicio)} — {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}</p>
                                    {exp.descripcion && <p className="mt-1 text-xs text-gray-700 leading-relaxed">{exp.descripcion}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {educacion.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-1">Educación</p>
                        <div className="border-t border-green-100 pt-2 space-y-3">
                            {educacion.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm">{edu.titulo}</p>
                                    <p className="text-xs text-gray-500">{edu.institucion} · {formatDate(edu.fechaInicio)} — {edu.actual ? "En curso" : formatDate(edu.fechaFin)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════
   COMPACTO — acento rojo, columna densa
   ══════════════════════════════════════════ */
function CompactoSection({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 mt-4 mb-2">
            <div className="w-0.5 h-4 bg-red-600 rounded-sm shrink-0" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{title}</p>
        </div>
    )
}

function PreviewCompacto({ cv, experiencias, educacion }: SectionProps) {
    return (
        <div className="bg-white text-gray-900 text-sm font-sans min-h-full px-6 py-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b-2 border-red-600 pb-3 mb-3 gap-2">
                <h1 className="text-lg font-bold">{cv.nombre}</h1>
                <div className="text-xs text-gray-500 sm:text-right space-y-0.5">
                    <p>{cv.email}</p>
                    <p>{cv.telefono}</p>
                    {cv.ubicacion && <p>{cv.ubicacion}</p>}
                    {cv.linkedin && <p className="break-all">{cv.linkedin}</p>}
                </div>
            </div>

            {cv.resumen && (
                <>
                    <CompactoSection title="Perfil" />
                    <p className="text-xs text-gray-700 leading-relaxed">{cv.resumen}</p>
                </>
            )}
            {experiencias.length > 0 && (
                <>
                    <CompactoSection title="Experiencia" />
                    <div className="space-y-3">
                        {experiencias.map((exp, i) => (
                            <div key={i}>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                    <p className="font-semibold text-sm">{exp.cargo} · {exp.empresa}</p>
                                    <p className="text-xs text-gray-400 shrink-0">
                                        {formatDate(exp.fechaInicio)} — {exp.actual ? "Actualidad" : formatDate(exp.fechaFin)}
                                    </p>
                                </div>
                                {exp.descripcion && <p className="mt-0.5 text-xs text-gray-700 leading-relaxed">{exp.descripcion}</p>}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {educacion.length > 0 && (
                <>
                    <CompactoSection title="Educación" />
                    <div className="space-y-2">
                        {educacion.map((edu, i) => (
                            <div key={i} className="flex flex-wrap justify-between items-baseline gap-x-2">
                                <p className="font-semibold text-sm">{edu.titulo} · {edu.institucion}</p>
                                <p className="text-xs text-gray-400 shrink-0">
                                    {formatDate(edu.fechaInicio)} — {edu.actual ? "En curso" : formatDate(edu.fechaFin)}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {cv.habilidades.length > 0 && (
                <>
                    <CompactoSection title="Habilidades" />
                    <p className="text-xs text-gray-700">{cv.habilidades.join(" · ")}</p>
                </>
            )}
        </div>
    )
}
