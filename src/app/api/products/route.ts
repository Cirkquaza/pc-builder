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
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const categoryId = CATEGORY_MAP[category];

  try {
    // Payload za BigBang API
    const payload: any = {
      mode: 'widget',
      related_widget_data: categoryId
        ? { category_id: categoryId }
        : { search_q: category },
      only_available: true,
      limit,
      always_to_limit: true,
      response_fields: [
        'id',
        'title',
        'basic_price_custom',
        'discount_percent_custom',
        'url_without_domain',
        'main_image_upload_path',
        'manufacturer_title',
        'category_title',
        'available_qty',
        'short_description',
        'other_images',
      ],
      lang: 'hr',
    };

    // Dodaj price filter ako postoji
    if (minPrice || maxPrice) {
      const priceRange = `${minPrice || '0'}-${maxPrice || '999999'}`;
      payload.related_widget_data.price = priceRange;
    }

    const response = await fetch(
      'https://www.bigbang.hr/api/nuxtapi/catalog/products/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        // Dodaj cache za performanse (5 min)
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`BigBang API error: ${response.status}`);
    }

    const data: BigBangResponse = await response.json();

    // Formatiraj proizvode za PC Builder
    const products = data.data.items.map((item) => ({
      id: item.id,
      name: item.title,
      price: item.basic_price_custom,
      discount: item.discount_percent_custom || 0,
      finalPrice: item.basic_price_custom * (1 - (item.discount_percent_custom || 0) / 100),
      url: `https://www.bigbang.hr${item.url_without_domain}`,
      image: `https://www.bigbang.hr${item.main_image_upload_path}`,
      brand: item.manufacturer_title,
      category: item.category_title,
      inStock: item.available_qty > 0,
      stock: item.available_qty,
      description: item.short_description || '',
    }));

    return NextResponse.json({
      success: true,
      category,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
