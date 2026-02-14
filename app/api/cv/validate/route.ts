import { NextResponse } from "next/server"
import { cvSchema } from "@/lib/cvSchema"
import { ZodError } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const validatedData = cvSchema.parse(body)

        return NextResponse.json({
            message: "CV válido",
            data: validatedData
        })
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string> = {}

            error.issues.forEach((err) => {
                const field = err.path.join(".")
                formattedErrors[field] = err.message
            })

            return NextResponse.json(
                { errors: formattedErrors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { errors: { general: "Error inesperado" } },
            { status: 500 }
        )
    }
}