import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cvSchema } from "@/lib/cvSchema"
import { ZodError } from "zod"

type Params = { params: Promise<{ uuid: string }> }

export async function GET(_req: Request, { params }: Params) {
    try {
        const { uuid } = await params

        const rows = await sql`
            SELECT * FROM cvs WHERE user_uuid = ${uuid}
        `

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "CV no encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: rows[0] })

    } catch (error: unknown) {
        console.error("GET /api/cv/[uuid]:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: Params) {
    try {
        const { uuid } = await params
        const body = await req.json()

        const existing = await sql`
            SELECT id FROM cvs WHERE user_uuid = ${uuid}
        `

        if (existing.length === 0) {
            return NextResponse.json(
                { error: "CV no encontrado" },
                { status: 404 }
            )
        }

        const validated = cvSchema.parse(body)

        const experienciasJson = JSON.stringify(validated.experiencias)
        const educacionJson = JSON.stringify(validated.educacion)
        const habilidadesJson = JSON.stringify(validated.habilidades)

        const result = await sql`
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
            WHERE user_uuid = ${uuid}
            RETURNING *
        `

        return NextResponse.json({ data: result[0] })

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string> = {}
            error.issues.forEach((err) => {
                formattedErrors[err.path.join(".")] = err.message
            })
            return NextResponse.json({ errors: formattedErrors }, { status: 400 })
        }

        console.error("PUT /api/cv/[uuid]:", error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}
