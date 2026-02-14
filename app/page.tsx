import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white shadow-xl rounded-3xl p-12 text-center max-w-xl w-full">

        <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Generador de CV Inteligente
        </h1>

        <p className="text-gray-700 text-lg mb-10 leading-relaxed">
          Crea tu currículum profesional optimizado con inteligencia artificial.
        </p>

        <Link
          href="/crear"
          className="inline-block bg-black text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-800 transition duration-300 shadow-md"
        >
          Crear mi CV
        </Link>

      </div>
    </main>
  )
}