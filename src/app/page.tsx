'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      id: 1,
      icon: '🖥️',
      title: 'Odabir komponenti',
      description: 'Širok izbor najnovijih komponenti od vodećih proizvođača'
    },
    {
      id: 2,
      icon: '✅',
      title: 'Provjera kompatibilnosti',
      description: 'Automatska provjera kompatibilnosti svih odabranih komponenti'
    },
    {
      id: 3,
      icon: '💰',
      title: 'Praćenje cijene',
      description: 'Prikaz ukupne cijene sistema u realnom vremenu'
    },
    {
      id: 4,
      icon: '⚡',
      title: 'Procjena napajanja',
      description: 'Automatski proračun potrebne snage napajanja'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero sekcija */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl text-white shadow-2xl border border-cyan-400/30">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Dobrodošli u PC Builder
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
          Sastavite svoj idealan računar uz pomoć napredne provjere kompatibilnosti
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/builder" className="btn-primary bg-cyan-400 text-gray-900 hover:bg-cyan-300 transform hover:scale-105">
            Počni gradnju
          </Link>
          <Link href="/shop" className="btn-primary bg-green-400 text-gray-900 hover:bg-green-300 transform hover:scale-105">
            Online kupovina
          </Link>
          <Link href="/info" className="btn-secondary bg-blue-900 hover:bg-blue-800 text-white border-2 border-cyan-400/50">
            Saznaj više
          </Link>
        </div>
      </section>

      {/* Video Tutorial sekcija */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl p-12 shadow-lg border border-slate-700/50">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">
          🎓 Pomoć pri sklapanju PC-a
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-2xl p-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
            <div className="w-full h-full bg-slate-900 rounded-[10px] overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/qkr07CutHrU"
                title="Kako sklopiti računar - Vodič za početnike"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-300 mt-6">
          Pogledaj detaljan video vodič kako pravilno sklopiti komponente računara
        </p>
      </section>

      {/* Features sekcija */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
          Zašto koristiti PC Builder?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`card cursor-pointer transform transition-all ${
                hoveredCard === feature.id ? 'scale-105' : 'scale-100'
              }`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kako funkcionira sekcija */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 rounded-2xl p-12 shadow-lg border border-cyan-400/30">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
          Kako funkcionira?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Odaberi komponente</h3>
            <p className="text-gray-300">
              Pretraži i odaberi željene komponente iz naše baze
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Provjeri kompatibilnost</h3>
            <p className="text-gray-300">
              Sistem automatski provjerava kompatibilnost komponenti
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-100">Spremi konfiguraciju</h3>
            <p className="text-gray-300">
              Spremi ili podijeli svoju PC konfiguraciju
            </p>
          </div>
        </div>
      </section>

      {/* CTA sekcija */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 rounded-2xl text-white border border-cyan-400/30">
        <h2 className="text-3xl font-bold mb-4">
          Spreman za gradnju svog PC-a?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Počni odmah i sastavi računar svojih snova!
        </p>
        <Link href="/builder" className="btn-primary bg-cyan-400 hover:bg-cyan-300 text-gray-900">
          Počni sada
        </Link>
      </section>
    </div>
  )
}
