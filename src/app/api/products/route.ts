import { NextRequest, NextResponse } from 'next/server';

// Mapiranje kategorija PC komponenti na BigBang category_id
const CATEGORY_MAP: Record<string, string> = {
  cpu: '593', // Procesori
  gpu: '594', // Grafičke kartice
  ram: '595', // RAM memorija
  motherboard: '592', // Matične ploče
  storage: '597', // SSD diskovi
  ssd: '597', // SSD diskovi
  hdd: '598', // HDD diskovi
  case: '599', // Kućišta
  psu: '600', // Napajanja
  cooling: '601', // Hlađenje
  monitor: '5000029054', // Monitori (ako treba)
};

interface BigBangProduct {
  id: string;
  title: string;
  basic_price_custom: number;
  discount_percent_custom?: number;
  url_without_domain: string;
  main_image_upload_path: string;
  manufacturer_title: string;
  category_title: string;
  available_qty: number;
  short_description?: string;
}

interface BigBangResponse {
  success: boolean;
  data: {
    items: BigBangProduct[];
    meta_data: any;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'cpu';
  const limit = parseInt(searchParams.get('limit') || '10');

  const categoryId = CATEGORY_MAP[category];

  if (!categoryId) {
    return NextResponse.json(
      { error: 'Unknown category', category },
      { status: 400 }
    );
  }

  try {
    // Probaj sa direktnim requestom - bez response_fields
    const payload = {
      category_id: parseInt(categoryId),
      limit: Math.min(limit, 50),
    };

    const response = await fetch(
      'https://www.bigbang.hr/api/nuxtapi/catalog/products/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.bigbang.hr/',
        },
        body: JSON.stringify(payload),
      }
    );

    // Log za debug
    if (!response.ok) {
      const text = await response.text();
      console.error(`BigBang API error ${response.status}:`, text.substring(0, 200));
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data?.items || data.data.items.length === 0) {
      throw new Error('No items returned');
    }

    // Formatiraj proizvode
    const products = data.data.items.map((item: any) => ({
      id: item.id || Math.random().toString(),
      name: item.title || 'Unknown',
      price: parseFloat(item.basic_price_custom) || 0,
      discount: parseFloat(item.discount_percent_custom) || 0,
      finalPrice:
        parseFloat(item.basic_price_custom) *
        (1 - (parseFloat(item.discount_percent_custom) || 0) / 100),
      url: item.url_without_domain
        ? `https://www.bigbang.hr${item.url_without_domain}`
        : 'https://www.bigbang.hr',
      image: item.main_image_upload_path
        ? `https://www.bigbang.hr${item.main_image_upload_path}`
        : '',
      brand: item.manufacturer_title || 'Unknown',
      category: item.category_title || category,
      inStock: (item.available_qty || 0) > 0,
      stock: item.available_qty || 0,
      description: item.short_description || '',
    }));

    return NextResponse.json({
      success: true,
      category,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(`[${category}] Error:`, error);
    // Vrati prazan niz umjesto greške, client će koristiti fallback
    return NextResponse.json({
      success: false,
      category,
      count: 0,
      products: [],
    });
  }
}
