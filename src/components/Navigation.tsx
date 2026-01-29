'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

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
          
          <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-2">
              {status === 'authenticated' ? (
                <>
                  <span className="text-sm text-gray-300 hidden sm:inline">
                    {session.user?.name || session.user?.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 rounded-lg font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all"
                  >
                    Odjava
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800 transition-all"
                  >
                    Prijava
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 rounded-lg font-medium bg-cyan-400 text-gray-900 hover:bg-cyan-300 transition-all"
                  >
                    Registracija
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
