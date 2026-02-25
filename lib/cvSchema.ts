import { z } from "zod"

export const experienciaSchema = z.object({
  empresa: z.string().min(1, "Empresa obligatoria"),
  cargo: z.string().min(1, "Cargo obligatorio"),
  fechaInicio: z.string().min(1, "Fecha inicio obligatoria"),
  fechaFin: z.string(),
  descripcion: z.string().min(1, "Descripción obligatoria"),
  actual: z.boolean()
}).superRefine((data, ctx) => {

  if (!data.actual && !data.fechaFin) {
    ctx.addIssue({
      path: ["fechaFin"],
      message: "Fecha fin obligatoria si no es trabajo actual",
      code: "custom"
    })
  }

  if (!data.actual && data.fechaFin && data.fechaInicio) {
    if (new Date(data.fechaFin) < new Date(data.fechaInicio)) {
      ctx.addIssue({
        path: ["fechaFin"],
        message: "La fecha fin no puede ser menor que la de inicio",
        code: "custom"
      })
    }
  }
})

export const educacionSchema = z.object({
  institucion: z.string().min(1, "Institución obligatoria"),
  titulo: z.string().min(1, "Título obligatorio"),
  fechaInicio: z.string().min(1, "Fecha inicio obligatoria"),
  fechaFin: z.string(),
  actual: z.boolean().default(false)
}).superRefine((data, ctx) => {
  if (!data.actual && !data.fechaFin) {
    ctx.addIssue({
      path: ["fechaFin"],
      message: "Fecha fin obligatoria si no es estudio en progreso",
      code: "custom"
    })
  }

  if (!data.actual && data.fechaFin && data.fechaInicio) {
    if (new Date(data.fechaFin) < new Date(data.fechaInicio)) {
      ctx.addIssue({
        path: ["fechaFin"],
        message: "La fecha de término no puede ser menor que la de inicio",
        code: "custom"
      })
    }
  }
})

export const cvSchema = z.object({
  nombre: z.string().min(1, "Nombre obligatorio"),
  email: z.email({ message: "Email inválido" }),
  telefono: z.string().min(1, "Teléfono obligatorio"),
  ubicacion: z.string(),
  linkedin: z.string().refine(
    (val) => val === "" || /^https?:\/\/.+/.test(val),
    { message: "Debe ser una URL válida (ej: https://linkedin.com/in/usuario)" }
  ),
  resumen: z.string().min(1, "Resumen obligatorio"),
  experiencias: z.array(experienciaSchema),
  educacion: z.array(educacionSchema),
  habilidades: z.array(z.string())
})
