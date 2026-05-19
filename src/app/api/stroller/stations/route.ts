import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_metro_stations');

  if (error) {
    const { data: fallback } = await supabase
      .from('metro_accessibility')
      .select('*');
    return NextResponse.json({ stations: fallback ?? [] });
  }

  return NextResponse.json({ stations: data ?? [] });
}
