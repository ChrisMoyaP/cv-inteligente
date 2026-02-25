"use client"

import { CV } from "@/types/cv"

interface Props {
  cv: CV
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  errors: Record<string, string>
  onMejorarResumen: () => void
  isMejorandoResumen: boolean
  mejorarResumenError: string | null
}

const inputClass = "w-full border p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"

export default function DatosPersonalesForm({
  cv,
  handleChange,
  errors,
  onMejorarResumen,
  isMejorandoResumen,
  mejorarResumenError,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">Datos Personales</h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">Nombre completo</label>
        <input
          type="text"
          name="nombre"
          value={cv.nombre}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={cv.email}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={cv.telefono}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.telefono && (
          <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">
          Ubicación <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          name="ubicacion"
          value={cv.ubicacion}
          onChange={handleChange}
          placeholder="Ej: Santiago, Chile"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">
          LinkedIn / Portfolio <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span>
        </label>
        <input
          type="url"
          name="linkedin"
          value={cv.linkedin}
          onChange={handleChange}
          placeholder="Ej: https://linkedin.com/in/tu-perfil"
          className={`${inputClass} ${errors.linkedin ? "border-red-500" : ""}`}
        />
        {errors.linkedin && (
          <p className="text-red-600 text-sm mt-1">{errors.linkedin}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 dark:text-gray-300">Resumen profesional</label>
        <textarea
          name="resumen"
          value={cv.resumen}
          onChange={handleChange}
          rows={4}
          className={inputClass}
        />
        <button
          type="button"
          onClick={onMejorarResumen}
          disabled={isMejorandoResumen || !cv.resumen}
          className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isMejorandoResumen ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mejorando...
            </>
          ) : (
            "Mejorar con IA"
          )}
        </button>
        {mejorarResumenError && (
          <p className="text-red-600 text-sm mt-1">{mejorarResumenError}</p>
        )}
        {errors.resumen && (
          <p className="text-red-600 text-sm mt-1">{errors.resumen}</p>
        )}
      </div>
    </div>
  )
}
