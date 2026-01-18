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
  { name: 'Links.hr', domain: 'links.hr', searchUrl: 'https://links.hr/hr/pretraga?q=' },
  { name: 'Nabava.net', domain: 'nabava.net', searchUrl: 'https://nabava.net/?s=' },
  { name: 'ADM.hr', domain: 'adm.hr', searchUrl: 'https://adm.hr/search?q=' },
  { name: 'eKupi.hr', domain: 'ekupi.hr', searchUrl: 'https://ekupi.hr/search?q=' },
  { name: 'Jagnje.com', domain: 'jagnje.com', searchUrl: 'https://jagnje.com/search?q=' },
  { name: 'Centarzona.com', domain: 'centarzona.com', searchUrl: 'https://centarzona.com/pretraga?q=' },
  { name: 'Nix.hr', domain: 'nix.hr', searchUrl: 'https://nix.hr/search?q=' },
  { name: 'PC kuća', domain: 'pckuca.hr', searchUrl: 'https://pckuca.hr/search?q=' },
  { name: 'F.hr', domain: 'f.hr', searchUrl: 'https://f.hr/pretraga?q=' },
  { name: 'Hub.hr', domain: 'hub.hr', searchUrl: 'https://hub.hr/search?q=' },
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
