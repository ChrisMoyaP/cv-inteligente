"use client"

import { useState, useEffect } from "react"
import { CV, Educacion } from "@/types/cv"
import CVFormBase from "@/components/CVFormBase"
import { getUserUuid } from "@/lib/userUuid"

const initialCv: CV = {
  nombre: "", email: "", telefono: "", ubicacion: "",
  linkedin: "", resumen: "", experiencias: [], educacion: [], habilidades: [],
}

export default function CrearCV() {
  const [initialData, setInitialData] = useState<CV | null>(null)

  // Cargar CV: primero intenta desde DB (si hay user_uuid), si no desde localStorage
  useEffect(() => {
    const load = async () => {
      const storedUuid = localStorage.getItem("user_uuid")

      if (storedUuid) {
        try {
          const res = await fetch(`/api/cv/${storedUuid}`)
          if (res.ok) {
            const { data } = await res.json()
            setInitialData({
              nombre: data.nombre ?? "",
              email: data.email ?? "",
              telefono: data.telefono ?? "",
              ubicacion: data.ubicacion ?? "",
              linkedin: data.linkedin ?? "",
              resumen: data.resumen ?? "",
              experiencias: data.experiencias ?? [],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              educacion: (data.educacion ?? []).map((edu: any) => ({ actual: false, ...edu } as Educacion)),
              habilidades: data.habilidades ?? [],
            })
            return
          }
        } catch {
          // Fall through to localStorage
        }
      }

      const storedCv = localStorage.getItem("cv-inteligente:v1")
      if (storedCv) {
        const stored = JSON.parse(storedCv)
        setInitialData({
          ...initialCv,
          ...stored,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          educacion: (stored.educacion || []).map((edu: any) => ({ actual: false, ...edu } as Educacion)),
        })
      } else {
        setInitialData(initialCv)
      }
    }

    load()
  }, [])

  const onSave = async (cv: CV): Promise<{ ok: boolean; errorMessage?: string }> => {
    const userUuid = getUserUuid()
    const res = await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userUuid, ...cv }),
    })
    if (!res.ok) return { ok: false, errorMessage: "Error al guardar en la nube. Inténtalo de nuevo." }
    return { ok: true }
  }

  if (!initialData) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Cargando...</span>
      </main>
    )
  }

  return (
    <CVFormBase
      initialData={initialData}
      title="Crear Currículum"
      submitLabel="Guardar CV"
      showReset
      onSave={onSave}
    />
  )
}
