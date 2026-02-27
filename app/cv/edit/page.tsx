"use client"

import { useState, useEffect } from "react"
import { CV, Educacion } from "@/types/cv"
import CVFormBase from "@/components/CVFormBase"
import { useRouter } from "next/navigation"

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "hace un momento"
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`
  const diffDays = Math.floor(diffHours / 24)
  return `hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: CV; uuid: string }
  | { status: "not-found" }

export default function EditarCV() {
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [updatedAt, setUpdatedAt] = useState("")
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const uuid = localStorage.getItem("user_uuid")
      if (!uuid) {
        setState({ status: "not-found" })
        return
      }

      try {
        const res = await fetch(`/api/cv/${uuid}`)
        if (!res.ok) {
          setState({ status: "not-found" })
          return
        }

        const { data } = await res.json()
        const cv: CV = {
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
        }

        setUpdatedAt(data.updated_at ?? "")
        setState({ status: "ready", data: cv, uuid })
      } catch {
        setState({ status: "not-found" })
      }
    }

    load()
  }, [])

  // Redirigir si no hay CV
  useEffect(() => {
    if (state.status !== "not-found") return
    const timer = setTimeout(() => router.replace("/"), 2000)
    return () => clearTimeout(timer)
  }, [state.status, router])

  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Cargando CV...</span>
      </main>
    )
  }

  if (state.status === "not-found") {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No tienes un CV guardado aún.<br />
          Redirigiendo...
        </p>
      </main>
    )
  }

  const onSave = async (cv: CV): Promise<{ ok: boolean; errorMessage?: string }> => {
    const res = await fetch(`/api/cv/${state.uuid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cv),
    })
    if (!res.ok) return { ok: false, errorMessage: "Error al actualizar. Inténtalo de nuevo." }
    const { data } = await res.json()
    setUpdatedAt(data.updated_at ?? "")
    return { ok: true }
  }

  return (
    <CVFormBase
      initialData={state.data}
      title="Editar Currículum"
      submitLabel="Actualizar CV"
      headerExtra={
        updatedAt ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Última actualización: {formatRelativeTime(updatedAt)}
          </p>
        ) : null
      }
      onSave={onSave}
    />
  )
}
