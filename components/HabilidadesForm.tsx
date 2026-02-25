"use client"

import { useState } from "react"

const MAX_HABILIDADES = 20

interface Props {
  habilidades: string[]
  agregarHabilidad: (habilidad: string) => void
  eliminarHabilidad: (index: number) => void
}

export default function HabilidadesForm({
  habilidades,
  agregarHabilidad,
  eliminarHabilidad
}: Props) {
  const [input, setInput] = useState("")

  const cantidad = habilidades.length
  const lleno = cantidad >= MAX_HABILIDADES

  const colorContador =
    cantidad === MAX_HABILIDADES
      ? "text-red-500 font-semibold"
      : cantidad >= 15
      ? "text-orange-400"
      : "text-gray-400"

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "" && !lleno) {
      e.preventDefault()
      agregarHabilidad(input.trim())
      setInput("")
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mt-6 mb-2 dark:text-white flex items-center gap-2">
        Habilidades
        <span className={`text-sm font-normal ${colorContador}`}>
          ({cantidad}/{MAX_HABILIDADES})
        </span>
      </h2>

      <input
        type="text"
        placeholder={lleno ? "Límite alcanzado" : "Escribe una habilidad y presiona Enter"}
        value={input}
        disabled={lleno}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full border p-3 rounded-xl mb-1 transition dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
          lleno
            ? "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-200"
            : "border-gray-300 dark:bg-gray-700"
        }`}
      />

      {lleno && (
        <p className="text-xs text-red-500 mb-3">
          Alcanzaste el máximo de {MAX_HABILIDADES} habilidades. Elimina alguna para añadir otra.
        </p>
      )}

      {!lleno && <div className="mb-3" />}

      <div className="flex flex-wrap gap-2">
        {habilidades.map((hab, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{hab}</span>
            <button
              type="button"
              onClick={() => eliminarHabilidad(index)}
              className="text-sm hover:text-red-300 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
