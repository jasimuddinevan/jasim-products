import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { writeStaticProducts } from '@/lib/static-products';
import type { Product } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { synced: false, error: error.message },
        { status: 502 }
      );
    }

    const products = (data as Product[]) || [];
    writeStaticProducts(products);

    return NextResponse.json({
      synced: true,
      count: products.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { synced: false, error: 'Sync failed' },
      { status: 500 }
    );
  }
}
