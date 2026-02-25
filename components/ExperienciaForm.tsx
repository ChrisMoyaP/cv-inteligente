"use client"

import { Experiencia } from "@/types/cv"

interface Props {
    experiencias: Experiencia[]
    agregarExperiencia: () => void
    eliminarExperiencia: (index: number) => void
    handleExperienciaChange: (
        index: number,
        field: keyof Experiencia,
        value: string | boolean
    ) => void,
    errors: Record<string, string>
}

const inputClass = "w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
const inputDateClass = "border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"

export default function ExperienciaForm({
    experiencias,
    agregarExperiencia,
    eliminarExperiencia,
    handleExperienciaChange,
    errors
}: Props) {
    return (
        <div>
            <h2 className="text-lg font-semibold mt-6 mb-2 dark:text-white">
                Experiencia Laboral
            </h2>

            {experiencias.map((exp, index) => {
                const empresaError = errors[`experiencias.${index}.empresa`]
                const cargoError = errors[`experiencias.${index}.cargo`]
                const fechaInicioError = errors[`experiencias.${index}.fechaInicio`]
                const fechaFinError = errors[`experiencias.${index}.fechaFin`]
                const descripcionError = errors[`experiencias.${index}.descripcion`]

                return (
                    <div
                        key={index}
                        className="border dark:border-gray-700 p-4 rounded-xl mb-4 space-y-2"
                    >
                        <input
                            type="text"
                            placeholder="Empresa"
                            value={exp.empresa}
                            onChange={(e) =>
                                handleExperienciaChange(index, "empresa", e.target.value)
                            }
                            className={`${inputClass} ${empresaError ? "border-red-500" : ""}`}
                        />
                        {empresaError && (
                            <p className="text-red-600 text-sm">{empresaError}</p>
                        )}

                        <input
                            type="text"
                            placeholder="Cargo"
                            value={exp.cargo}
                            onChange={(e) =>
                                handleExperienciaChange(index, "cargo", e.target.value)
                            }
                            className={`${inputClass} ${cargoError ? "border-red-500" : ""}`}
                        />
                        {cargoError && (
                            <p className="text-red-600 text-sm">{cargoError}</p>
                        )}

                        <div className="flex gap-4">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Fecha de inicio
                                </label>
                                <input
                                    type="month"
                                    value={exp.fechaInicio}
                                    onChange={(e) =>
                                        handleExperienciaChange(index, "fechaInicio", e.target.value)
                                    }
                                    className={`${inputDateClass} ${fechaInicioError ? "border-red-500" : ""}`}
                                />
                                {fechaInicioError && (
                                    <p className="text-red-600 text-sm">
                                        {fechaInicioError}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Fecha de término
                                </label>
                                <input
                                    type="month"
                                    value={exp.fechaFin}
                                    onChange={(e) =>
                                        handleExperienciaChange(index, "fechaFin", e.target.value)
                                    }
                                    className={`${inputDateClass} ${fechaFinError ? "border-red-500" : ""}`}
                                />
                                {fechaFinError && (
                                    <p className="text-red-600 text-sm">
                                        {fechaFinError}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={exp.actual}
                                    onChange={(e) =>
                                        handleExperienciaChange(index, "actual", e.target.checked)
                                    }
                                />
                                <label className="text-sm dark:text-gray-300">Trabajo actual</label>
                            </div>
                        </div>

                        <textarea
                            placeholder="Descripción"
                            value={exp.descripcion}
                            onChange={(e) =>
                                handleExperienciaChange(index, "descripcion", e.target.value)
                            }
                            className={`${inputClass} ${descripcionError ? "border-red-500" : ""}`}
                        />
                        {descripcionError && (
                            <p className="text-red-600 text-sm">
                                {descripcionError}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => eliminarExperiencia(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            Eliminar
                        </button>
                    </div>
                )
            })}

            <button
                type="button"
                onClick={agregarExperiencia}
                className="bg-gray-800 dark:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
                + Agregar experiencia
            </button>
        </div>
    )
}
