"use client"

import dynamic from "next/dynamic"

// Динамический импорт компонента игры для избежания SSR проблем с Three.js
const DinosaurGame = dynamic(() => import("@/components/DinosaurGame"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Загрузка игры...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <DinosaurGame />
    </main>
  )
}
