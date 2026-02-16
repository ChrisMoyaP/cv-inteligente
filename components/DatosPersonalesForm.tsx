"use client"

import { CV } from "@/types/cv"

interface Props {
  cv: CV
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  errors: Record<string, string>
  onMejorarResumen: () => void
}

export default function DatosPersonalesForm({
  cv,
  handleChange,
  errors,
  onMejorarResumen,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Datos Personales</h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Nombre completo</label>
        <input
          type="text"
          name="nombre"
          value={cv.nombre}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={cv.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={cv.telefono}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />
        {errors.telefono && (
          <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Resumen profesional</label>
        <textarea
          name="resumen"
          value={cv.resumen}
          onChange={handleChange}
          rows={4}
          className="w-full border p-3 rounded-xl"
        />
        <button
          type="button"
          onClick={onMejorarResumen}
          className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded"
        >
          Mejorar con IA
        </button>
        {errors.resumen && (
          <p className="text-red-600 text-sm mt-1">{errors.resumen}</p>
        )}
      </div>
    </div>
  )
}
