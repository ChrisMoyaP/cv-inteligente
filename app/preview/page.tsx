"use client"

import { useEffect, useState } from "react"
import { CV } from "@/types/cv"
import Link from "next/link"
import CvPreview from "@/components/CVPreview"
import { PDFDownloadLink } from "@react-pdf/renderer"
import CVDocument from "@/components/pdf/CVDocument"

export default function PreviewPage() {
    const [cv, setCv] = useState<CV | null>(null)

    useEffect(() => {
        const storedCv = localStorage.getItem("cv-inteligente:v1")
        if (storedCv) {
            setCv(JSON.parse(storedCv))
        }
    }, [])

    if (!cv) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4">No hay CV guardado.</p>
                    <Link href="/crear" className="text-blue-600 underline">
                        Crear uno ahora
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-6">
                <CvPreview cv={cv} />

                <div className="text-center mt-6">
                    <Link
                        href="/crear"
                        className="text-blue-600 underline"
                    >
                        Volver a editar
                    </Link>
                    <PDFDownloadLink
                        document={<CVDocument cv={cv} />}
                        fileName="CV.pdf"
                    >
                        {({ loading }) => (
                            <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg">
                                {loading ? "Generando PDF..." : "Descargar PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>
        </main>
    )
}