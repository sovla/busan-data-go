import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const supabase = await createClient();

  let query = supabase
    .from('dongbaek_stores')
    .select('id, name, category, district, address, phone')
    .order('id');

  if (category && category !== '전체') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stores: data ?? [] });
}
