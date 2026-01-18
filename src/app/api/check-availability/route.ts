import { NextRequest, NextResponse } from 'next/server'

// Primjer integracije sa prodavačima
// Trebat će da implementiraš stvarne API pozive ili web scraping

interface ProductAvailability {
  store: string
  available: boolean
  price?: number
  url: string
  inStock?: number
}

// Dummy data - trebat će da zamjeniš sa stvarnim API pozivima
const RETAILERS = [
  { name: 'Informatika', domain: 'informatika.hr', searchUrl: 'https://informatika.hr/search?q=' },
  { name: 'Santa Domenica', domain: 'santadomenica.hr', searchUrl: 'https://santadomenica.hr/pretraga?q=' },
  { name: 'Links.hr', domain: 'links.hr', searchUrl: 'https://links.hr/hr/pretraga?q=' },
  { name: 'Nabava.net', domain: 'nabava.net', searchUrl: 'https://nabava.net/?s=' },
  { name: 'ADM.hr', domain: 'adm.hr', searchUrl: 'https://adm.hr/search?q=' },
  { name: 'eKupi.hr', domain: 'ekupi.hr', searchUrl: 'https://ekupi.hr/search?q=' },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const brand = searchParams.get('brand')
  const model = searchParams.get('model')

  if (!brand || !model) {
    return NextResponse.json(
      { error: 'Brand i model su obavezni' },
      { status: 400 }
    )
  }

  const searchTerm = `${brand} ${model}`
  const availability: ProductAvailability[] = []

  try {
    // Kreiraj search linkove za sve prodavače
    for (const retailer of RETAILERS) {
      const searchUrl = retailer.searchUrl + encodeURIComponent(searchTerm)
      
      availability.push({
        store: retailer.name,
        available: true, // U stvarnosti trebat će da checkuješ dostupnost
        url: searchUrl,
        inStock: Math.floor(Math.random() * 10) // Dummy data
      })
    }

    return NextResponse.json({
      component: searchTerm,
      results: availability,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri pretražavanju dostupnosti' },
      { status: 500 }
    )
  }
}
