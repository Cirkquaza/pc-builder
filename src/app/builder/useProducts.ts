import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  finalPrice: number;
  url: string;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  stock: number;
  description: string;
}

export interface Component extends Product {
  specs: string;
  link: string;
  reason?: string;
  isAffordable?: boolean;
}

interface UseProductsResult {
  products: Component[];
  loading: boolean;
  error: string | null;
}

export function useProducts(category: string, limit: number = 10): UseProductsResult {
  const [products, setProducts] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products?category=${category}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!isMounted) return;

        if (data.success && data.products) {
          // Transformiraj u Component format
          const transformedProducts: Component[] = data.products.map((p: Product) => ({
            ...p,
            specs: extractSpecs(p.name, p.description),
            link: p.url,
            reason: generateReason(p, category),
          }));

          setProducts(transformedProducts);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
          console.error('Error loading products:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [category, limit]);

  return { products, loading, error };
}

// Helper funkcija za ekstrakciju specifikacija iz naziva
function extractSpecs(name: string, description: string): string {
  // Izdvoji bitne informacije iz naziva
  const specs: string[] = [];

  // CPU: broj jezgri, frekvencija
  if (name.match(/\d+C\/\d+T/i)) {
    const match = name.match(/(\d+C\/\d+T)/i);
    if (match) specs.push(match[1]);
  }
  if (name.match(/\d+(\.\d+)?\s*GHz/i)) {
    const match = name.match(/(\d+(?:\.\d+)?\s*GHz)/i);
    if (match) specs.push(match[1]);
  }

  // RAM: kapacitet i brzina
  if (name.match(/\d+GB/i)) {
    const match = name.match(/(\d+GB)/i);
    if (match) specs.push(match[1]);
  }
  if (name.match(/DDR\d+/i)) {
    const match = name.match(/(DDR\d+)/i);
    if (match) specs.push(match[1]);
  }
  if (name.match(/\d+MHz/i)) {
    const match = name.match(/(\d+MHz)/i);
    if (match) specs.push(match[1]);
  }

  // GPU: VRAM
  if (name.match(/\d+GB\s*(GDDR\d+)?/i)) {
    const match = name.match(/(\d+GB(?:\s*GDDR\d+)?)/i);
    if (match) specs.push(match[1]);
  }

  // Storage: kapacitet i tip
  if (name.match(/\d+TB/i)) {
    const match = name.match(/(\d+TB)/i);
    if (match) specs.push(match[1]);
  }
  if (name.match(/NVMe|PCIe|SATA/i)) {
    const match = name.match(/(NVMe|PCIe|SATA)/i);
    if (match) specs.push(match[1]);
  }

  // PSU: wattage i certifikat
  if (name.match(/\d+W/i)) {
    const match = name.match(/(\d+W)/i);
    if (match) specs.push(match[1]);
  }
  if (name.match(/80\+\s*(Bronze|Silver|Gold|Platinum|Titanium)/i)) {
    const match = name.match(/(80\+\s*(?:Bronze|Silver|Gold|Platinum|Titanium))/i);
    if (match) specs.push(match[1]);
  }

  return specs.length > 0 ? specs.join(', ') : 'Detaljne specifikacije na linku';
}

// Helper funkcija za generiranje preporuke
function generateReason(product: Product, category: string): string {
  const priceRange = getPriceRange(product.finalPrice);

  const reasons: Record<string, Record<string, string>> = {
    cpu: {
      budget: 'Odličan odnos cijene i performansi za svakodnevne potrebe',
      mid: 'Solidan gaming procesor sa odličnim multi-threading performansama',
      high: 'Vrhunske performanse za gaming i kreativni rad',
      premium: 'Top tier - najmoćniji procesori na tržištu',
    },
    gpu: {
      budget: 'Idealan za 1080p gaming',
      mid: 'Odlično za 1440p gaming sa visokim postavkama',
      high: 'Vrhunske performanse za 4K gaming',
      premium: 'Ekstremne performanse - najbolji od najboljih',
    },
    ram: {
      budget: 'Osnovna količina memorije za gaming',
      mid: 'Odličan balans kapaciteta i brzine',
      high: 'Velika količina brzog RAM-a za zahtjevne zadatke',
      premium: 'Maksimalna količina za profesionalne aplikacije',
    },
    motherboard: {
      budget: 'Osnovna matična ploča sa potrebnim funkcijama',
      mid: 'Dobra osnova sa modernim funkcijama',
      high: 'Premium funkcije i odlična proširivost',
      premium: 'Top tier - sve što ti treba i više',
    },
    ssd: {
      budget: 'Brz NVMe storage za OS i glavne programe',
      mid: 'Odličan balans kapaciteta i brzine',
      high: 'Vrhunske brzine i velikan kapacitet',
      premium: 'Maksimalne performanse - najbrži SSD-ovi',
    },
    psu: {
      budget: 'Pouzdano napajanje za osnovne sisteme',
      mid: 'Kvalitetno napajanje sa dobrim certifikatom',
      high: 'Premium napajanje sa visokom efikasnošću',
      premium: 'Top tier - maksimalna snaga i efikasnost',
    },
    case: {
      budget: 'Funkcionalno kućište sa dobrom ventilacijom',
      mid: 'Odličan dizajn i lako upravljanje kablovima',
      high: 'Premium materijali i izvrsna cirkulacija zraka',
      premium: 'Showcase dizajn - savršeno za pokazivanje komponenti',
    },
  };

  return reasons[category]?.[priceRange] || 'Kvalitetan proizvod u svojoj klasi';
}

function getPriceRange(price: number): string {
  if (price < 100) return 'budget';
  if (price < 300) return 'mid';
  if (price < 600) return 'high';
  return 'premium';
}
