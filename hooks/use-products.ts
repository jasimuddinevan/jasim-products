'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types/database';
import { getCachedProducts, setCachedProducts } from '@/lib/product-cache';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  fromCache: boolean;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (!cancelled) {
          if (res.ok && data.products?.length > 0) {
            setProducts(data.products);
            setCachedProducts(data.products);
            setFromCache(false);
          } else {
            const cached = getCachedProducts();
            setProducts(cached);
            setFromCache(cached.length > 0);
          }
        }
      } catch {
        if (!cancelled) {
          const cached = getCachedProducts();
          setProducts(cached);
          setFromCache(cached.length > 0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, isLoading, fromCache };
}
