import type { Product } from '@/types/database';

const CACHE_KEY = 'cached_products';
const CACHE_TIMESTAMP_KEY = 'cached_products_timestamp';

export function getCachedProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    return JSON.parse(cached) as Product[];
  } catch {
    return [];
  }
}

export function setCachedProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // storage full or unavailable
  }
}

export function getCacheTimestamp(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    return ts ? parseInt(ts, 10) : null;
  } catch {
    return null;
  }
}
