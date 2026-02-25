"use client"

import { CV } from "@/types/cv"

interface Props {
    cv: CV
}

export default function CvPreview({ cv }: Props) {

    const experienciasOrdenadas = [...cv.experiencias].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    const educacionOrdenada = [...cv.educacion].sort((a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )

    function calcularAniosTotales(experiencias: typeof cv.experiencias) {
        // Merge de intervalos para no contar solapamientos doble
        const intervalos = experiencias
            .filter((exp) => exp.fechaInicio)
            .map((exp) => ({
                inicio: new Date(exp.fechaInicio).getTime(),
                fin: (exp.actual ? new Date() : new Date(exp.fechaFin)).getTime(),
            }))
            .filter((i) => i.fin > i.inicio)
            .sort((a, b) => a.inicio - b.inicio)

        const merged: { inicio: number; fin: number }[] = []
        for (const intervalo of intervalos) {
            const ultimo = merged[merged.length - 1]
            if (ultimo && intervalo.inicio <= ultimo.fin) {
                ultimo.fin = Math.max(ultimo.fin, intervalo.fin)
            } else {
                merged.push({ ...intervalo })
            }
        }

        const totalMs = merged.reduce((acc, i) => acc + (i.fin - i.inicio), 0)
        const totalMeses = Math.floor(totalMs / (1000 * 60 * 60 * 24 * 30.44))
        const anios = Math.floor(totalMeses / 12)
        const meses = totalMeses % 12

        return { anios, meses }
    }

    const experienciaTotal = calcularAniosTotales(cv.experiencias)

    function formatearFecha(fecha: string) {
        if (!fecha) return ""

        return new Date(fecha).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long"
        })
    }

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold">{cv.nombre}</h1>
                <p>{cv.email}</p>
                <p>{cv.telefono}</p>
                {cv.ubicacion && <p>{cv.ubicacion}</p>}
                {cv.linkedin && (
                    <a
                        href={cv.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        {cv.linkedin}
                    </a>
                )}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Resumen</h2>
                <p>{cv.resumen}</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Experiencia</h2>
                {experienciaTotal.anios > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                        Experiencia total: {experienciaTotal.anios} años {experienciaTotal.meses} meses
                    </p>
                )}
                {experienciasOrdenadas.map((exp, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">
                            {exp.cargo} - {exp.empresa}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatearFecha(exp.fechaInicio)} -{" "}
                            {exp.actual ? "Actualidad" : formatearFecha(exp.fechaFin)}
                        </p>
                        <p>{exp.descripcion}</p>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Educación</h2>
                {educacionOrdenada.map((edu, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">
                            {edu.titulo} - {edu.institucion}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatearFecha(edu.fechaInicio)} -{" "}
                            {edu.actual ? "En curso" : formatearFecha(edu.fechaFin)}
                        </p>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                    {cv.habilidades.map((hab, index) => (
                        <span
                            key={index}
                            className="bg-gray-800 text-white px-3 py-1 rounded-full"
                        >
                            {hab}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}
