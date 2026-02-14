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

export default function ExperienciaForm({
    experiencias,
    agregarExperiencia,
    eliminarExperiencia,
    handleExperienciaChange,
    errors
}: Props) {
    return (
        <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">
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
                        className="border p-4 rounded-xl mb-4 space-y-2"
                    >
                        <input
                            type="text"
                            placeholder="Empresa"
                            value={exp.empresa}
                            onChange={(e) =>
                                handleExperienciaChange(index, "empresa", e.target.value)
                            }
                            className={`w-full border p-2 rounded ${empresaError ? "border-red-500" : ""
                                }`}
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
                            className={`w-full border p-2 rounded ${cargoError ? "border-red-500" : ""
                                }`}
                        />
                        {cargoError && (
                            <p className="text-red-600 text-sm">{cargoError}</p>
                        )}

                        <div className="flex gap-4">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1">
                                    Fecha de inicio
                                </label>
                                <input
                                    type="date"
                                    value={exp.fechaInicio}
                                    onChange={(e) =>
                                        handleExperienciaChange(index, "fechaInicio", e.target.value)
                                    }
                                    className={`border p-2 rounded ${fechaInicioError ? "border-red-500" : ""
                                        }`}
                                />
                                {fechaInicioError && (
                                    <p className="text-red-600 text-sm">
                                        {fechaInicioError}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col w-full">
                                <label className="text-sm font-medium mb-1">
                                    Fecha de término
                                </label>
                                <input
                                    type="date"
                                    disabled={exp.actual}
                                    value={exp.fechaFin}
                                    onChange={(e) =>
                                        handleExperienciaChange(index, "fechaFin", e.target.value)
                                    }
                                    className={`border p-2 rounded ${fechaFinError ? "border-red-500" : ""
                                        } ${exp.actual ? "bg-gray-100" : ""}`}
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
                                <label className="text-sm">Trabajo actual</label>
                            </div>
                        </div>

                        <textarea
                            placeholder="Descripción"
                            value={exp.descripcion}
                            onChange={(e) =>
                                handleExperienciaChange(index, "descripcion", e.target.value)
                            }
                            className={`w-full border p-2 rounded ${descripcionError ? "border-red-500" : ""
                                }`}
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
                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
                + Agregar experiencia
            </button>
        </div>
    )
}