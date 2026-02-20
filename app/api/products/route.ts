import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { products: [], fromCache: false, error: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json({
      products: (data as Product[]) || [],
      fromCache: false,
    });
  } catch {
    return NextResponse.json(
      { products: [], fromCache: false, error: 'Database unavailable' },
      { status: 502 }
    );
  }
}
