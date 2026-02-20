'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types/database';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  source: string;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (!cancelled) {
          setProducts(data.products || []);
          setSource(data.source || 'unknown');
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setSource('error');
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

  return { products, isLoading, source };
}
