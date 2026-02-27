import OpenAI from "openai"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { CV } from "@/types/cv"

// Rate limiter — 3 análisis por 15 minutos por IP
const LIMITE_REQUESTS = 3
const VENTANA_MS = 15 * 60 * 1000

interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function checkRateLimit(id: string): { allowed: boolean; retryAfterSeg: number } {
    const ahora = Date.now()
    const bucket = buckets.get(id)

    if (!bucket || ahora >= bucket.resetAt) {
        buckets.set(id, { count: 1, resetAt: ahora + VENTANA_MS })
        return { allowed: true, retryAfterSeg: 0 }
    }
    if (bucket.count >= LIMITE_REQUESTS) {
        return { allowed: false, retryAfterSeg: Math.ceil((bucket.resetAt - ahora) / 1000) }
    }
    bucket.count++
    return { allowed: true, retryAfterSeg: 0 }
}

function serializarCV(cv: CV): string {
    const lines: string[] = []
    lines.push(`NOMBRE: ${cv.nombre}`)
    if (cv.ubicacion) lines.push(`UBICACIÓN: ${cv.ubicacion}`)
    if (cv.resumen) lines.push(`\nRESUMEN PROFESIONAL:\n${cv.resumen}`)

    if (cv.experiencias?.length > 0) {
        lines.push("\nEXPERIENCIA LABORAL:")
        cv.experiencias.forEach(exp => {
            const hasta = exp.actual ? "Presente" : exp.fechaFin
            lines.push(`- ${exp.cargo} en ${exp.empresa} (${exp.fechaInicio} – ${hasta})`)
            if (exp.descripcion) lines.push(`  ${exp.descripcion}`)
        })
    }

    if (cv.educacion?.length > 0) {
        lines.push("\nEDUCACIÓN:")
        cv.educacion.forEach(edu => {
            const hasta = edu.actual ? "En curso" : edu.fechaFin
            lines.push(`- ${edu.titulo} en ${edu.institucion} (${edu.fechaInicio} – ${hasta})`)
        })
    }

    if (cv.habilidades?.length > 0) {
        lines.push(`\nHABILIDADES: ${cv.habilidades.join(", ")}`)
    }

    return lines.join("\n")
}

export async function POST(req: Request) {
    try {
        const headersList = await headers()
        const ip =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            headersList.get("x-real-ip") ??
            "unknown"

        const { allowed, retryAfterSeg } = checkRateLimit(ip)
        if (!allowed) {
            const minutos = Math.ceil(retryAfterSeg / 60)
            return NextResponse.json(
                { error: `Límite alcanzado. Puedes volver a analizar en ${minutos} minuto${minutos !== 1 ? "s" : ""}.` },
                { status: 429, headers: { "Retry-After": String(retryAfterSeg) } }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OPENAI_API_KEY no configurada" }, { status: 500 })
        }

        const body = await req.json()
        const { cv, oferta } = body as { cv: CV; oferta: string }

        if (!cv || !oferta?.trim()) {
            return NextResponse.json({ error: "Se requieren el CV y la oferta laboral" }, { status: 400 })
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `Eres un experto en recursos humanos y selección de personal. Analiza la compatibilidad entre el CV y la oferta laboral proporcionados.
Responde ÚNICAMENTE con un JSON válido con exactamente esta estructura:
{
  "porcentaje_compatibilidad": <número del 0 al 100>,
  "habilidades_match": [<habilidades del CV que coinciden con la oferta>],
  "habilidades_faltantes": [<habilidades que pide la oferta y el CV no tiene>],
  "sugerencias_experiencia": [<sugerencias concretas para mejorar la sección de experiencia>],
  "sugerencias_resumen": "<sugerencia para mejorar el resumen profesional>",
  "fortalezas": [<puntos fuertes del CV respecto a esta oferta>],
  "conclusion": "<conclusión general de la compatibilidad>"
}
Sé específico y constructivo. Usa el idioma español.`
                },
                {
                    role: "user",
                    content: `CV DEL CANDIDATO:\n${serializarCV(cv)}\n\n---\n\nOFERTA LABORAL:\n${oferta}`
                }
            ]
        })

        const raw = completion.choices[0]?.message?.content ?? "{}"
        const analisis = JSON.parse(raw)

        return NextResponse.json({ analisis })

    } catch (error: unknown) {
        console.error("POST /api/cv/comparar:", error)
        const message = error instanceof Error ? error.message : "Error al analizar"
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
