import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
    try {
        const { resumen } = await req.json()

        if (!resumen) {
            return NextResponse.json(
                { error: "Resumen vacío" },
                { status: 400 }
            )
        }

        console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY)

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

        const improved = completion.choices[0].message.content

        return NextResponse.json({ improved })

    } catch (error: any) {
        console.error("IA ERROR:", error)

        return NextResponse.json(
            { error: error?.message || "Error IA" },
            { status: 500 }
        )
    }
}