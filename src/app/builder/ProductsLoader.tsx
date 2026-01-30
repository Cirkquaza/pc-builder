'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useProducts, Component } from './useProducts';
import { motion } from 'framer-motion';

interface ProductsLoaderProps {
  categories: string[];
  children: (data: {
    products: Record<string, Component[]>;
    loading: boolean;
    error: string | null;
  }) => ReactNode;
}

export function ProductsLoader({ categories, children }: ProductsLoaderProps) {
  const [allProducts, setAllProducts] = useState<Record<string, Component[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAllCategories() {
      setLoading(true);
      const results: Record<string, Component[]> = {};
      let hasError = false;

      for (const category of categories) {
        try {
          const response = await fetch(`/api/products?category=${category}&limit=10`);
          
          if (!response.ok) {
            throw new Error(`Failed to load ${category}`);
          }

          const data = await response.json();

          if (data.success && data.products) {
            results[category] = data.products.map((p: any) => ({
              ...p,
              specs: p.specs || extractSpecs(p.name),
              link: p.url,
              reason: p.reason || generateReason(p, category),
            }));
          } else {
            // Use fallback for this category
            results[category] = getFallbackProducts(category);
          }
        } catch (err) {
          console.error(`Error loading ${category}:`, err);
          hasError = true;
          results[category] = getFallbackProducts(category);
        }
      }

      setAllProducts(results);
      setError(hasError ? 'Neki proizvodi nisu uÄŤitani iz API-ja' : null);
      setLoading(false);
    }

    loadAllCategories();
  }, [categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-300 text-lg">Učitavanje proizvoda...</p>
          <p className="text-gray-500 text-sm mt-2">Dohvaćam podatke iz BigBang-a</p>
        </div>
      </div>
    );
  }

  return <>{children({ products: allProducts, loading, error })}</>;
}

function extractSpecs(name: string): string {
  const specs: string[] = [];

  // CPU/GPU cores, threads, frequency
  const coreMatch = name.match(/(\d+C\/\d+T)/i);
  if (coreMatch) specs.push(coreMatch[1]);

  const ghzMatch = name.match(/(\d+(?:\.\d+)?\s*GHz)/i);
  if (ghzMatch) specs.push(ghzMatch[1]);

  // RAM
  const gbMatch = name.match(/(\d+GB)/i);
  if (gbMatch) specs.push(gbMatch[1]);

  const ddrMatch = name.match(/(DDR\d+)/i);
  if (ddrMatch) specs.push(ddrMatch[1]);

  const mhzMatch = name.match(/(\d+MHz)/i);
  if (mhzMatch) specs.push(mhzMatch[1]);

  // Storage
  const tbMatch = name.match(/(\d+TB)/i);
  if (tbMatch) specs.push(tbMatch[1]);

  const storageTypeMatch = name.match(/(NVMe|PCIe|SATA|SSD)/i);
  if (storageTypeMatch) specs.push(storageTypeMatch[1]);

  // PSU
  const wattMatch = name.match(/(\d+W)/i);
  if (wattMatch) specs.push(wattMatch[1]);

  const certMatch = name.match(/(80\+\s*(?:Bronze|Silver|Gold|Platinum|Titanium))/i);
  if (certMatch) specs.push(certMatch[1]);

  return specs.length > 0 ? specs.join(', ') : 'Detaljne spec na linku';
}

function generateReason(product: any, category: string): string {
  const price = product.finalPrice || product.price;
  
  if (price < 100) return 'BudĹľet opcija - odliÄŤan poÄŤetak';
  if (price < 300) return 'Solidan balans cijene i performansi';
  if (price < 600) return 'High-end performanse';
  return 'Premium - vrhunska klasa';
}

const bigBangSearch = (name: string) => `https://www.bigbang.hr/proizvodi/?search_q=${encodeURIComponent(name)}`;

function getFallbackProducts(category: string): Component[] {
  const fallbacks: Record<string, Component[]> = {
    cpu: [
      { id: '1', name: 'Ryzen 5 5600', brand: 'AMD', price: 139, finalPrice: 139, specs: '6C/12T, 4.4GHz', link: bigBangSearch('Ryzen 5 5600'), url: bigBangSearch('Ryzen 5 5600'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Ryzen+5+5600', category: 'CPU', inStock: true, stock: 5, discount: 0, description: '', reason: 'Idealan za poÄŤetni gaming' },
      { id: '2', name: 'Ryzen 7 7800X3D', brand: 'AMD', price: 439, finalPrice: 439, specs: '8C/16T, 5.0GHz + 3D V-Cache', link: bigBangSearch('Ryzen 7 7800X3D'), url: bigBangSearch('Ryzen 7 7800X3D'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Ryzen+7+7800X3D', category: 'CPU', inStock: true, stock: 3, discount: 0, description: '', reason: 'Najbolji gaming procesor' },
    ],
    gpu: [
      { id: '1', name: 'RTX 3050', brand: 'NVIDIA', price: 259, finalPrice: 259, specs: '8GB GDDR6', link: bigBangSearch('RTX 3050'), url: bigBangSearch('RTX 3050'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=RTX+3050', category: 'GPU', inStock: true, stock: 10, discount: 0, description: '', reason: 'Entry-level gaming' },
      { id: '2', name: 'RTX 4060 Ti', brand: 'NVIDIA', price: 429, finalPrice: 429, specs: '8GB GDDR6X + DLSS 3', link: bigBangSearch('RTX 4060 Ti'), url: bigBangSearch('RTX 4060 Ti'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=RTX+4060+Ti', category: 'GPU', inStock: true, stock: 7, discount: 0, description: '', reason: 'OdliÄŤan za 1440p gaming' },
    ],
    ram: [
      { id: '1', name: 'Corsair Vengeance 16GB', brand: 'Corsair', price: 53, finalPrice: 53, specs: 'DDR4 3200MHz', link: bigBangSearch('Corsair Vengeance 16GB DDR4 3200'), url: bigBangSearch('Corsair Vengeance 16GB DDR4 3200'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Vengeance+16GB', category: 'RAM', inStock: true, stock: 15, discount: 0, description: '', reason: 'Pouzdana memorija' },
      { id: '2', name: 'Corsair Vengeance 32GB', brand: 'Corsair', price: 119, finalPrice: 119, specs: 'DDR5 6000MHz', link: bigBangSearch('Corsair Vengeance 32GB DDR5 6000'), url: bigBangSearch('Corsair Vengeance 32GB DDR5 6000'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Vengeance+32GB', category: 'RAM', inStock: true, stock: 10, discount: 0, description: '', reason: 'Moderna DDR5' },
    ],
    motherboard: [
      { id: '1', name: 'B550 GAMING PLUS', brand: 'MSI', price: 119, finalPrice: 119, specs: 'AMD AM4, DDR4, PCIe 4.0', link: bigBangSearch('MSI B550 Gaming Plus'), url: bigBangSearch('MSI B550 Gaming Plus'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=B550+Gaming+Plus', category: 'Motherboard', inStock: true, stock: 8, discount: 0, description: '', reason: 'OdliÄŤan balans funkcija' },
      { id: '2', name: 'B650 AORUS ELITE', brand: 'Gigabyte', price: 199, finalPrice: 199, specs: 'AMD AM5, DDR5, PCIe 5.0', link: bigBangSearch('Gigabyte B650 AORUS Elite'), url: bigBangSearch('Gigabyte B650 AORUS Elite'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=B650+AORUS+Elite', category: 'Motherboard', inStock: true, stock: 5, discount: 0, description: '', reason: 'Moderna platforma sa DDR5' },
    ],
    storage: [
      { id: '1', name: 'WD Blue SN580 1TB', brand: 'WD', price: 66, finalPrice: 66, specs: 'NVMe Gen4, 4150MB/s', link: bigBangSearch('WD Blue SN580 1TB'), url: bigBangSearch('WD Blue SN580 1TB'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=WD+SN580+1TB', category: 'SSD', inStock: true, stock: 20, discount: 0, description: '', reason: 'Solidan NVMe SSD' },
      { id: '2', name: 'Samsung 980 PRO 1TB', brand: 'Samsung', price: 106, finalPrice: 106, specs: 'NVMe Gen4, 7000MB/s', link: bigBangSearch('Samsung 980 PRO 1TB'), url: bigBangSearch('Samsung 980 PRO 1TB'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=980+PRO+1TB', category: 'SSD', inStock: true, stock: 15, discount: 0, description: '', reason: 'Premium SSD' },
    ],
    psu: [
      { id: '1', name: 'Corsair CX650', brand: 'Corsair', price: 66, finalPrice: 66, specs: '650W, 80+ Bronze', link: bigBangSearch('Corsair CX650'), url: bigBangSearch('Corsair CX650'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Corsair+CX650', category: 'PSU', inStock: true, stock: 12, discount: 0, description: '', reason: 'Pouzdano napajanje' },
      { id: '2', name: 'Seasonic Focus GX-750', brand: 'Seasonic', price: 106, finalPrice: 106, specs: '750W, 80+ Gold', link: bigBangSearch('Seasonic Focus GX-750'), url: bigBangSearch('Seasonic Focus GX-750'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Focus+GX-750', category: 'PSU', inStock: true, stock: 8, discount: 0, description: '', reason: 'Kvalitetno Gold napajanje' },
    ],
    case: [
      { id: '1', name: 'NZXT H510', brand: 'NZXT', price: 79, finalPrice: 79, specs: 'ATX, MinimalistiÄŤki dizajn', link: bigBangSearch('NZXT H510'), url: bigBangSearch('NZXT H510'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=NZXT+H510', category: 'Case', inStock: true, stock: 6, discount: 0, description: '', reason: 'ÄŚist dizajn' },
      { id: '2', name: 'Corsair 4000D Airflow', brand: 'Corsair', price: 106, finalPrice: 106, specs: 'ATX, OdliÄŤna ventilacija', link: bigBangSearch('Corsair 4000D Airflow'), url: bigBangSearch('Corsair 4000D Airflow'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Corsair+4000D', category: 'Case', inStock: true, stock: 10, discount: 0, description: '', reason: 'Izvrsna cirkulacija' },
    ],
    monitor: [
      { id: '1', name: 'LG 27" UltraGear', brand: 'LG', price: 229, finalPrice: 229, specs: '27", 144Hz, IPS', link: bigBangSearch('LG UltraGear 27'), url: bigBangSearch('LG UltraGear 27'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=LG+27%22', category: 'Monitor', inStock: true, stock: 6, discount: 0, description: '', reason: 'Gaming monitor' },
      { id: '2', name: 'Samsung Odyssey G5', brand: 'Samsung', price: 249, finalPrice: 249, specs: '27", 144Hz, VA', link: bigBangSearch('Samsung Odyssey G5'), url: bigBangSearch('Samsung Odyssey G5'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Odyssey+G5', category: 'Monitor', inStock: true, stock: 5, discount: 0, description: '', reason: 'Zakrivljeni monitor' },
    ],
    cooling: [
      { id: '1', name: 'Cooler Master Hyper 212', brand: 'Cooler Master', price: 35, finalPrice: 35, specs: 'Air cooler', link: bigBangSearch('Cooler Master Hyper 212'), url: bigBangSearch('Cooler Master Hyper 212'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Hyper+212', category: 'Cooling', inStock: true, stock: 12, discount: 0, description: '', reason: 'Pouzdano hlađenje' },
      { id: '2', name: 'NZXT Kraken 240', brand: 'NZXT', price: 139, finalPrice: 139, specs: 'AIO 240mm', link: bigBangSearch('NZXT Kraken 240'), url: bigBangSearch('NZXT Kraken 240'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Kraken+240', category: 'Cooling', inStock: true, stock: 6, discount: 0, description: '', reason: 'AIO hlađenje' },
    ],
    hdd: [
      { id: '1', name: 'Seagate Barracuda 2TB', brand: 'Seagate', price: 59, finalPrice: 59, specs: '3.5", 7200RPM', link: bigBangSearch('Seagate Barracuda 2TB'), url: bigBangSearch('Seagate Barracuda 2TB'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=Seagate+2TB', category: 'HDD', inStock: true, stock: 14, discount: 0, description: '', reason: 'Veliki kapacitet' },
      { id: '2', name: 'WD Blue 1TB', brand: 'WD', price: 45, finalPrice: 45, specs: '3.5", 7200RPM', link: bigBangSearch('WD Blue 1TB'), url: bigBangSearch('WD Blue 1TB'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=WD+Blue+1TB', category: 'HDD', inStock: true, stock: 10, discount: 0, description: '', reason: 'Pouzdan disk' },
    ],
    laptop: [
      { id: '1', name: 'Lenovo IdeaPad 5', brand: 'Lenovo', price: 629, finalPrice: 629, specs: 'Ryzen 5, 16GB RAM, 512GB SSD', link: bigBangSearch('Lenovo IdeaPad 5'), url: bigBangSearch('Lenovo IdeaPad 5'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=IdeaPad+5', category: 'Laptop', inStock: true, stock: 4, discount: 0, description: '', reason: 'Odličan za posao' },
      { id: '2', name: 'ASUS TUF Gaming', brand: 'ASUS', price: 899, finalPrice: 899, specs: 'RTX 4060, 16GB RAM', link: bigBangSearch('ASUS TUF Gaming'), url: bigBangSearch('ASUS TUF Gaming'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=ASUS+TUF', category: 'Laptop', inStock: true, stock: 3, discount: 0, description: '', reason: 'Gaming laptop' },
    ],
    peripherals: [
      { id: '1', name: 'Logitech G Pro X', brand: 'Logitech', price: 99, finalPrice: 99, specs: 'Gaming headset', link: bigBangSearch('Logitech G Pro X'), url: bigBangSearch('Logitech G Pro X'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=G+Pro+X', category: 'Peripherals', inStock: true, stock: 9, discount: 0, description: '', reason: 'Kvalitetan zvuk' },
      { id: '2', name: 'Razer DeathAdder V2', brand: 'Razer', price: 49, finalPrice: 49, specs: 'Gaming mouse', link: bigBangSearch('Razer DeathAdder V2'), url: bigBangSearch('Razer DeathAdder V2'), image: 'https://dummyimage.com/160x160/0f172a/00e3ff&text=DeathAdder', category: 'Peripherals', inStock: true, stock: 20, discount: 0, description: '', reason: 'Ergonomski miš' },
    ],
  };

  return fallbacks[category] || [];
}

