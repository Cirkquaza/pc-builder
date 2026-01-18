'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-gray-950 shadow-lg border-b border-cyan-400/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🖥️</span>
            <span className="text-xl font-bold text-cyan-400">PC Builder</span>
          </Link>
          
          <div className="flex space-x-1">
            <Link 
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/') 
                  ? 'bg-cyan-400 text-gray-900' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Početna
            </Link>
            <Link 
              href="/info"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/info') 
                  ? 'bg-cyan-400 text-gray-900' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Informacije
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
