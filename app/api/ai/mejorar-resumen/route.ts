import OpenAI from "openai"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

// -------------------------------------------------------------------
// Rate limiter en memoria — reemplazar "identifier" por userId
// cuando se agregue autenticación
// -------------------------------------------------------------------
const LIMITE_REQUESTS = 5
const VENTANA_MS = 10 * 60 * 1000 // 10 minutos

interface Bucket {
    count: number
    resetAt: number
}

const buckets = new Map<string, Bucket>()

function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeg: number } {
    const ahora = Date.now()
    const bucket = buckets.get(identifier)

    if (!bucket || ahora >= bucket.resetAt) {
        buckets.set(identifier, { count: 1, resetAt: ahora + VENTANA_MS })
        return { allowed: true, retryAfterSeg: 0 }
    }

    if (bucket.count >= LIMITE_REQUESTS) {
        const retryAfterSeg = Math.ceil((bucket.resetAt - ahora) / 1000)
        return { allowed: false, retryAfterSeg }
    }

    bucket.count++
    return { allowed: true, retryAfterSeg: 0 }
}

// -------------------------------------------------------------------

export async function POST(req: Request) {
    try {
        // Identificador: IP actual — cambiar a userId cuando haya auth
        const headersList = await headers()
        const ip =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            headersList.get("x-real-ip") ??
            "unknown"

        const { allowed, retryAfterSeg } = checkRateLimit(ip)

        if (!allowed) {
            const minutos = Math.ceil(retryAfterSeg / 60)
            return NextResponse.json(
                {
                    error: `Límite alcanzado. Puedes volver a mejorar tu resumen en ${minutos} minuto${minutos !== 1 ? "s" : ""}.`
                },
                {
                    status: 429,
                    headers: { "Retry-After": String(retryAfterSeg) }
                }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY no configurada" },
                { status: 500 }
            )
        }

        const { resumen } = await req.json()

        if (!resumen) {
            return NextResponse.json(
                { error: "Resumen vacío" },
                { status: 400 }
            )
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Eres un experto en redacción de currículums profesionales. Mejora el siguiente resumen haciéndolo más impactante, claro y orientado a resultados."
                },
                {
                    role: "user",
                    content: resumen
                }
            ]
        })

        const improved = completion.choices[0]?.message?.content ?? ""

        return NextResponse.json({ improved })

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error IA"
        console.error("IA ERROR:", error)

        return NextResponse.json(
            { error: message },
            { status: 500 }
        )
    }
}
