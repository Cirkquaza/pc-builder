import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'PC Builder - Sastavi svoj računar',
  description: 'Jednostavno sastavite svoj idealan računar sa provjerom kompatibilnosti',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className="min-h-screen bg-gray-950">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-950 border-t border-yellow-500/20 text-gray-300 py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 PC Builder. Sva prava zadržana.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
