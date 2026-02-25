"use client"

import { Educacion } from "@/types/cv"

interface Props {
    educacion: Educacion[]
    agregarEducacion: () => void
    eliminarEducacion: (index: number) => void
    handleEducacionChange: (
        index: number,
        field: string,
        value: string | boolean
    ) => void
    errors: Record<string, string>
}

export default function EstudiosForm({
    educacion,
    agregarEducacion,
    eliminarEducacion,
    handleEducacionChange,
    errors
}: Props) {
    return (
        <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">
                Educación
            </h2>

            {educacion.map((edu, index) => {
                const institucionError = errors[`educacion.${index}.institucion`]
                const tituloError = errors[`educacion.${index}.titulo`]
                const fechaInicioError = errors[`educacion.${index}.fechaInicio`]
                const fechaFinError = errors[`educacion.${index}.fechaFin`]

                return (
                    <div
                        key={index}
                        className="border p-4 rounded-xl mb-4 space-y-2"
                    >
                        <input
                            type="text"
                            placeholder="Institución"
                            value={edu.institucion}
                            onChange={(e) =>
                                handleEducacionChange(index, "institucion", e.target.value)
                            }
                            className={`w-full border p-2 rounded ${institucionError ? "border-red-500" : ""}`}
                        />
                        {institucionError && (
                            <p className="text-red-600 text-sm">{institucionError}</p>
                        )}

                        <input
                            type="text"
                            placeholder="Título"
                            value={edu.titulo}
                            onChange={(e) =>
                                handleEducacionChange(index, "titulo", e.target.value)
                            }
                            className={`w-full border p-2 rounded ${tituloError ? "border-red-500" : ""}`}
                        />
                        {tituloError && (
                            <p className="text-red-600 text-sm">{tituloError}</p>
                        )}

                        <div className="flex gap-4">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1">
                                    Fecha de inicio
                                </label>
                                <input
                                    type="date"
                                    value={edu.fechaInicio}
                                    onChange={(e) =>
                                        handleEducacionChange(index, "fechaInicio", e.target.value)
                                    }
                                    className={`border p-2 rounded ${fechaInicioError ? "border-red-500" : ""}`}
                                />
                                {fechaInicioError && (
                                    <p className="text-red-600 text-sm">{fechaInicioError}</p>
                                )}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1">
                                    Fecha de término
                                </label>
                                <input
                                    type="date"
                                    disabled={edu.actual}
                                    value={edu.fechaFin}
                                    onChange={(e) =>
                                        handleEducacionChange(index, "fechaFin", e.target.value)
                                    }
                                    className={`border p-2 rounded ${fechaFinError ? "border-red-500" : ""} ${edu.actual ? "bg-gray-100" : ""}`}
                                />
                                {fechaFinError && (
                                    <p className="text-red-600 text-sm">{fechaFinError}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={edu.actual}
                                    onChange={(e) =>
                                        handleEducacionChange(index, "actual", e.target.checked)
                                    }
                                />
                                <label className="text-sm">En progreso</label>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => eliminarEducacion(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            Eliminar
                        </button>
                    </div>
                )
            })}

            <button
                type="button"
                onClick={agregarEducacion}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
                + Agregar Estudio
            </button>
        </div>
    )
}
