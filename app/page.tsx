import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-12 text-center max-w-xl w-full">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          Generador de CV Inteligente
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg mb-10 leading-relaxed">
          Crea tu currículum profesional optimizado con inteligencia artificial.
        </p>

        <Link
          href="/crear"
          className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition duration-300 shadow-md"
        >
          Crear mi CV
        </Link>

      </div>
    </main>
  )
}
