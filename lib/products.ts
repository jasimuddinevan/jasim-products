import { getSupabase } from './supabase';
import { getAdminSession } from './admin-auth';
import type { Product, ProductInsert, ProductUpdate } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSessionHeader(): string {
  const session = getAdminSession();
  if (!session) return '';
  return JSON.stringify({
    email: session.email,
    isAuthenticated: session.isAuthenticated,
    expiresAt: session.expiresAt,
  });
}

async function edgeFetch(method: string, body: unknown, productId?: string): Promise<Response> {
  const url = productId
    ? `${supabaseUrl}/functions/v1/manage-products/${productId}`
    : `${supabaseUrl}/functions/v1/manage-products`;

  return fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'x-admin-session': getSessionHeader(),
    },
    body: JSON.stringify(body),
  });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product | null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(
  product: ProductInsert
): Promise<Product | null> {
  try {
    const res = await edgeFetch('POST', product);
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  updates: ProductUpdate
): Promise<Product | null> {
  try {
    const res = await edgeFetch('PUT', updates, id);
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await edgeFetch('DELETE', {}, id);
    return res.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return (data as Product[]) || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
