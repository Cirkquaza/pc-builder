import { NextRequest, NextResponse } from 'next/server'

// Primjer integracije sa prodavačima
// Trebat će da implementiraš stvarne API pozive ili web scraping

interface ProductAvailability {
  store: string
  available: boolean
  price?: number
  url: string
}

// Verified working retailers - only established major shops
const RETAILERS = [
  { name: 'Nabava.net', domain: 'nabava.net', searchUrl: 'https://www.nabava.net/?s=' },
  { name: 'ADM.hr', domain: 'adm.hr', searchUrl: 'https://www.adm.hr/search?q=' },
  { name: 'eKupi.hr', domain: 'ekupi.hr', searchUrl: 'https://www.ekupi.hr/search?q=' },
  { name: 'BigBang.hr', domain: 'bigbang.hr', searchUrl: 'https://www.bigbang.hr/pretraga?q=' },
  { name: 'Instar', domain: 'instar-informatika.hr', searchUrl: 'https://www.instar-informatika.hr/search?q=' },
  { name: 'Svijet Medija', domain: 'svijet-medija.hr', searchUrl: 'https://www.svijet-medija.hr/search?q=' },
  { name: 'Amazon.de', domain: 'amazon.de', searchUrl: 'https://www.amazon.de/s?k=' },
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
        available: true,
        url: searchUrl
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
