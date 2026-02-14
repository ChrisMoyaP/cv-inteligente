"use client"

import { CV } from "@/types/cv"

interface Props {
    cv: CV
}



export default function CvPreview({ cv }: Props) {

    const experienciasOrdenadas = [...cv.experiencias].sort((a, b) => {
        const fechaA = new Date(a.fechaInicio).getTime()
        const fechaB = new Date(b.fechaInicio).getTime()
        return fechaB - fechaA
    })

    function calcularAniosTotales(experiencias: typeof cv.experiencias) {
        let totalMeses = 0

        experiencias.forEach((exp) => {
            if (!exp.fechaInicio) return

            const inicio = new Date(exp.fechaInicio)
            const fin = exp.actual ? new Date() : new Date(exp.fechaFin)

            const diffMeses =
                (fin.getFullYear() - inicio.getFullYear()) * 12 +
                (fin.getMonth() - inicio.getMonth())

            if (diffMeses > 0) totalMeses += diffMeses
        })

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
                {cv.educacion.map((edu, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="font-semibold">
                            {edu.titulo} - {edu.institucion}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {edu.fechaInicio} - {edu.fechaFin}
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