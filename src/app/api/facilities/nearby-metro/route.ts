import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '35.1796');
  const lng = parseFloat(searchParams.get('lng') || '129.0756');
  const radius = parseFloat(searchParams.get('radius') || '3000');

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('nearby_metro_stations', {
    lat,
    lng,
    radius_m: radius,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stations: data ?? [], total: data?.length ?? 0 });
}
