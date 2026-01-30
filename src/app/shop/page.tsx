'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductsLoader } from '../builder/ProductsLoader'
import { Component } from '../builder/useProducts'

const CATEGORIES = [
  'cpu',
  'gpu',
  'ram',
  'motherboard',
  'storage',
  'psu',
  'case',
  'monitor',
  'cooling',
  'hdd',
  'laptop',
  'peripherals',
]

export default function ShopPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white px-4 pb-16 pt-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold"
          >
            🛒 Big Bang proizvodi na našoj stranici
          </motion.h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Pregledaj dostupne komponente, filtriraj pretragom i klikni \"Kupi na Big Bang\" za direktan odlazak na proizvod.
          </p>
          <div className="max-w-2xl mx-auto">
            <label className="block text-left text-sm text-gray-400 mb-2">Pretraži po imenu ili brandu</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="npr. Ryzen 5 5600 ili Gigabyte"
              className="w-full rounded-xl border border-cyan-500/40 bg-gray-900 px-4 py-3 text-lg text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </header>

        <ProductsLoader categories={CATEGORIES}>
          {({ products, loading, error }) => {
            const allProducts: Component[] = CATEGORIES.flatMap((cat) => products[cat] || [])
            const filtered = !query.trim()
              ? allProducts
              : allProducts.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase()))

            return (
              <div className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-orange-500/60 bg-orange-500/15 px-4 py-4 text-sm text-orange-200 space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="font-semibold">Podaci nisu live</p>
                        <p className="text-orange-100 text-xs mt-1">{error} – prikazujem fallback podatke sa primjerima cijena.</p>
                        <p className="text-orange-100 text-xs mt-1">Za live cijene i dostupnost, <strong>kupi direktno na Big Bang-u</strong> preko "Kupi na Big Bang" dugmeta.</p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-400">
                  Prikazujem {filtered.length} proizvoda (kategorije: {CATEGORIES.join(', ')}).
                </p>

                <AnimatePresence>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item, idx) => (
                      <motion.div
                        key={`${item.category}-${item.id}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: idx * 0.02 }}
                        className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gray-900/70 shadow-lg"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-cyan-300/80">{item.category}</p>
                              <h3 className="text-xl font-bold leading-snug">{item.brand} {item.name}</h3>
                            </div>
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-contain rounded-lg bg-gray-800"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-800/80 flex items-center justify-center text-gray-500 text-xs">
                                N/A
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-400 line-clamp-2">{item.specs || 'Detalji na linku'}</p>

                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-cyan-400">{item.finalPrice?.toLocaleString('hr-HR') ?? item.price?.toLocaleString('hr-HR')} €</p>
                            {item.discount > 0 && (
                              <span className="text-xs rounded-full bg-green-500/20 px-2 py-1 text-green-300">-{item.discount}%</span>
                            )}
                          </div>

                          <a
                            href={item.url || item.link || 'https://www.bigbang.hr'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-500"
                          >
                            🛒 Kupi na Big Bang
                            <span className="transition group-hover:translate-x-1">→</span>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>

                {filtered.length === 0 && !loading && (
                  <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-8 text-center text-gray-300">
                    Nema rezultata za upit “{query}”. Pokušaj drugi naziv ili brand.
                  </div>
                )}
              </div>
            )
          }}
        </ProductsLoader>
      </div>
    </div>
  )
}
