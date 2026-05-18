import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROCESSED_DIR = path.join(process.cwd(), 'data', 'processed');

function readJson(filename: string): unknown[] {
  const filepath = path.join(PROCESSED_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`파일 없음: ${filepath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

async function seedFacilities() {
  const facilityFiles: Array<{ file: string; type: string }> = [
    { file: 'nursing_rooms.json', type: 'nursing_room' },
    { file: 'kids_cafes.json', type: 'kids_cafe' },
    { file: 'postpartum_centers.json', type: 'postpartum_center' },
    { file: 'daycares.json', type: 'daycare' },
  ];

  for (const { file, type } of facilityFiles) {
    const rows = readJson(file) as Array<Record<string, unknown>>;
    if (rows.length === 0) continue;

    const records = rows.map((r) => ({
      type,
      name: r.name ?? r.시설명 ?? r.상호명 ?? '',
      address: r.address ?? r.지번주소 ?? r.주소 ?? null,
      road_address: r.road_address ?? r.도로명주소 ?? null,
      phone: r.phone ?? r.전화번호 ?? null,
      district: r.district ?? r.구 ?? r.자치구 ?? null,
      location:
        r.lat && r.lng
          ? `SRID=4326;POINT(${r.lng} ${r.lat})`
          : r.longitude && r.latitude
          ? `SRID=4326;POINT(${r.longitude} ${r.latitude})`
          : null,
      metadata: r.metadata ?? {},
      source: file,
    }));

    const { error } = await supabase.from('facilities').insert(records);
    if (error) {
      console.error(`facilities 삽입 실패 (${file}):`, error);
    } else {
      console.log(`facilities (${type}) ${records.length}건 삽입 완료`);
    }
  }
}

async function seedMetroAccessibility() {
  const rows = readJson('metro_accessibility.json') as Array<Record<string, unknown>>;
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    line: r.line ?? r.호선 ?? '',
    station_name: r.station_name ?? r.역명 ?? '',
    nursing_room: Boolean(r.nursing_room ?? r.수유실),
    elevator_inner: Number(r.elevator_inner ?? r.내부엘리베이터 ?? 0),
    elevator_outer: Number(r.elevator_outer ?? r.외부엘리베이터 ?? 0),
    wheelchair_lift: Number(r.wheelchair_lift ?? r.휠체어리프트 ?? 0),
    escalator: Number(r.escalator ?? r.에스컬레이터 ?? 0),
    outer_ramp: Number(r.outer_ramp ?? r.외부경사로 ?? 0),
    location:
      r.lat && r.lng
        ? `SRID=4326;POINT(${r.lng} ${r.lat})`
        : null,
  }));

  const { error } = await supabase.from('metro_accessibility').insert(records);
  if (error) {
    console.error('metro_accessibility 삽입 실패:', error);
  } else {
    console.log(`metro_accessibility ${records.length}건 삽입 완료`);
  }
}

async function seedPedestrianRoads() {
  const rows = readJson('pedestrian_roads.json') as Array<Record<string, unknown>>;
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    name: r.name ?? r.도로명 ?? null,
    district: r.district ?? r.구 ?? null,
    start_lat: Number(r.start_lat ?? r.시작위도 ?? 0),
    start_lng: Number(r.start_lng ?? r.시작경도 ?? 0),
    end_lat: Number(r.end_lat ?? r.종료위도 ?? 0),
    end_lng: Number(r.end_lng ?? r.종료경도 ?? 0),
    start_point:
      r.start_lat && r.start_lng
        ? `SRID=4326;POINT(${r.start_lng} ${r.start_lat})`
        : null,
    end_point:
      r.end_lat && r.end_lng
        ? `SRID=4326;POINT(${r.end_lng} ${r.end_lat})`
        : null,
    distance_m: r.distance_m ?? r.거리 ?? null,
    road_width: r.road_width ?? r.도로폭 ?? null,
    speed_limit: Number(r.speed_limit ?? r.제한속도 ?? 30),
  }));

  const { error } = await supabase.from('pedestrian_roads').insert(records);
  if (error) {
    console.error('pedestrian_roads 삽입 실패:', error);
  } else {
    console.log(`pedestrian_roads ${records.length}건 삽입 완료`);
  }
}

async function seedMealCardStores() {
  const rows = readJson('meal_card_stores.json') as Array<Record<string, unknown>>;
  if (rows.length === 0) return;

  const records = rows.map((r) => ({
    name: r.name ?? r.상호명 ?? '',
    address: r.address ?? r.주소 ?? null,
    phone: r.phone ?? r.전화번호 ?? null,
    category: r.category ?? r.업종 ?? null,
    location:
      r.lat && r.lng
        ? `SRID=4326;POINT(${r.lng} ${r.lat})`
        : null,
    updated_at: r.updated_at ?? r.기준일 ?? null,
  }));

  const { error } = await supabase.from('meal_card_stores').insert(records);
  if (error) {
    console.error('meal_card_stores 삽입 실패:', error);
  } else {
    console.log(`meal_card_stores ${records.length}건 삽입 완료`);
  }
}

async function main() {
  console.log('시설 데이터 시드 시작...');
  await seedFacilities();
  await seedMetroAccessibility();
  await seedPedestrianRoads();
  await seedMealCardStores();
  console.log('모든 시드 완료');
}

main();
