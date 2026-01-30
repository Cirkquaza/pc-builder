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
  monitor: '5000029054', // Monitori
  laptop: '560', // Laptopi
  peripherals: '700', // Periferije (miš, tastatura, itd)
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
    // Vratiti prazan odgovor umjesto 400 greške - fallback će se koristiti
    return NextResponse.json({
      success: false,
      category,
      products: [],
    });
  }

  try {
    // Payload sa mode: 'widget' - originalni format koji je radio
    const payload: any = {
      mode: 'widget',
      related_widget_data: {
        category_id: categoryId,
      },
      only_available: true,
      limit: Math.min(parseInt(searchParams.get('limit') || '10'), 50),
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
      ],
      lang: 'hr',
    };

    const proxyUrl = process.env.BIGBANG_PROXY_URL;
    const proxyToken = process.env.BIGBANG_PROXY_TOKEN;

    const response = await fetch(
      proxyUrl || 'https://www.bigbang.hr/api/nuxtapi/catalog/products/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(proxyToken ? { Authorization: `Bearer ${proxyToken}` } : {}),
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`BigBang API error ${response.status}:`, text.substring(0, 200));
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
