"use client"

interface Props {
  habilidades: string[]
  agregarHabilidad: (habilidad: string) => void
  eliminarHabilidad: (index: number) => void
}

import { useState } from "react"

export default function HabilidadesForm({
  habilidades,
  agregarHabilidad,
  eliminarHabilidad
}: Props) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault()
      agregarHabilidad(input.trim())
      setInput("")
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mt-6 mb-2">
        Habilidades
      </h2>

      <input
        type="text"
        placeholder="Escribe una habilidad y presiona Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border p-3 rounded-xl mb-3"
      />

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
              className="text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}