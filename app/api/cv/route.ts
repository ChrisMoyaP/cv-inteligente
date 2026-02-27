import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cvSchema } from "@/lib/cvSchema"
import { ZodError } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userUuid, ...cvData } = body

        if (!userUuid) {
            return NextResponse.json(
                { error: "userUuid requerido" },
                { status: 400 }
            )
        }

        const validated = cvSchema.parse(cvData)

        const experienciasJson = JSON.stringify(validated.experiencias)
        const educacionJson = JSON.stringify(validated.educacion)
        const habilidadesJson = JSON.stringify(validated.habilidades)

        const existing = await sql`
            SELECT id FROM cvs WHERE user_uuid = ${userUuid}
        `

        let result
        if (existing.length > 0) {
            result = await sql`
                UPDATE cvs SET
                    nombre      = ${validated.nombre},
                    email       = ${validated.email},
                    telefono    = ${validated.telefono},
                    ubicacion   = ${validated.ubicacion},
                    linkedin    = ${validated.linkedin},
                    resumen     = ${validated.resumen},
                    experiencias = ${experienciasJson}::jsonb,
                    educacion   = ${educacionJson}::jsonb,
                    habilidades = ${habilidadesJson}::jsonb,
                    updated_at  = NOW()
                WHERE user_uuid = ${userUuid}
                RETURNING *
            `
        } else {
            result = await sql`
                INSERT INTO cvs
                    (user_uuid, nombre, email, telefono, ubicacion, linkedin, resumen,
                     experiencias, educacion, habilidades)
                VALUES (
                    ${userUuid},
                    ${validated.nombre},
                    ${validated.email},
                    ${validated.telefono},
                    ${validated.ubicacion},
                    ${validated.linkedin},
                    ${validated.resumen},
                    ${experienciasJson}::jsonb,
                    ${educacionJson}::jsonb,
                    ${habilidadesJson}::jsonb
                )
                RETURNING *
            `
        }

        return NextResponse.json({ data: result[0] })

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string> = {}
            error.issues.forEach((err) => {
                formattedErrors[err.path.join(".")] = err.message
            })
            return NextResponse.json({ errors: formattedErrors }, { status: 400 })
        }

        console.error("POST /api/cv:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
