import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '35.1796');
  const lng = parseFloat(searchParams.get('lng') || '129.0756');
  const radius = parseFloat(searchParams.get('radius') || '5000');
  const typesParam = searchParams.get('types');
  const types = typesParam ? typesParam.split(',') : null;

  const supabase = await createClient();
  const results: unknown[] = [];

  const facilityTypes = types?.filter(t => t !== 'meal_store') ?? null;
  const includeMealStore = !types || types.includes('meal_store');

  if (!facilityTypes || facilityTypes.length > 0) {
    const { data } = await supabase.rpc('nearby_facilities', {
      lat,
      lng,
      radius_m: radius,
      facility_types: facilityTypes && facilityTypes.length > 0 ? facilityTypes : null,
    });
    if (data) results.push(...data);
  }

  if (includeMealStore) {
    const { data: mealData } = await supabase.rpc('nearby_meal_stores', {
      lat,
      lng,
      radius_m: radius,
    });
    if (mealData) {
      results.push(...mealData.map((m: Record<string, unknown>) => ({
        ...m,
        type: 'meal_store',
        metadata: {},
      })));
    }
  }

  return NextResponse.json({ facilities: results, total: results.length });
}
