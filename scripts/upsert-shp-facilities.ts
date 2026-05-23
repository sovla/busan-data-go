/**
 * upsert-shp-facilities.ts
 * SHP→CSV 변환된 파일을 읽어 Supabase facilities 테이블에 적재합니다.
 * 각 type 전체를 DELETE 후 INSERT (멱등성 보장).
 * 실행: npx tsx scripts/upsert-shp-facilities.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ── env 로드 (.env.local) ─────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.+)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
if (!supabaseUrl || !supabaseKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY 환경변수 없음');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// ── CSV 파싱 유틸 ─────────────────────────────────────────────────────────────

/** UTF-8 BOM 제거 후 파일 읽기 */
function readCsv(filePath: string): string {
  const raw = fs.readFileSync(filePath);
  const isBom = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf;
  return isBom ? raw.slice(3).toString('utf-8') : raw.toString('utf-8');
}

/** CSV 한 줄을 파싱 (큰따옴표 내 쉼표 처리) */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur.trim()); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

/** CSV 전체를 헤더+레코드 배열로 파싱 */
function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
    rows.push(row);
  }
  return rows;
}

// ── 공통 타입 ─────────────────────────────────────────────────────────────────

type FacilityRecord = {
  type: string;
  name: string;
  address?: string | null;
  road_address?: string | null;
  phone?: string | null;
  district?: string | null;
  location?: string | null;
  metadata?: Record<string, unknown>;
  source?: string;
};

const BATCH = 100;

// ── Supabase 적재 ─────────────────────────────────────────────────────────────

async function loadType(facilityType: string, records: FacilityRecord[]): Promise<void> {
  // 기존 레코드 전체 삭제
  const { error: delErr } = await supabase
    .from('facilities')
    .delete()
    .eq('type', facilityType);
  if (delErr) {
    console.error(`  ${facilityType} 삭제 실패:`, delErr.message);
    return;
  }

  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const chunk = records.slice(i, i + BATCH);
    const { error } = await supabase.from('facilities').insert(chunk);
    if (error) {
      console.error(`  ${facilityType} 청크 ${i} 실패:`, error.message);
      return;
    }
    inserted += chunk.length;
  }
  console.log(`${facilityType}: ${inserted}건 적재 완료`);
}

// ── 1. 수유실 nursing_room ────────────────────────────────────────────────────
// Header: 연번,시도,시군구,기관명,주소,구분,용도,상태,위도,경도,X,Y

async function processNursingRooms(): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'raw', 'nursing_room', 'nursing_rooms_with_coords.csv');
  const rows = parseCsv(readCsv(filePath));
  const records: FacilityRecord[] = [];

  for (const row of rows) {
    const name = row['기관명']?.trim();
    if (!name) continue;

    const lat = parseFloat(row['위도'] ?? '');
    const lng = parseFloat(row['경도'] ?? '');
    if (!lat || !lng || lat === 0 || lng === 0) continue;

    records.push({
      type: 'nursing_room',
      name,
      address: row['주소']?.trim() || null,
      district: row['시군구']?.trim() || null,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      metadata: {
        구분: row['구분']?.trim() || null,
        용도: row['용도']?.trim() || null,
        상태: row['상태']?.trim() || null,
      },
      source: 'nursing_rooms_with_coords.csv',
    });
  }

  await loadType('nursing_room', records);
}

// ── 2. 키즈카페 kids_cafe ─────────────────────────────────────────────────────
// Header: gugun,cafe_nm,road_nm,tel_no,lat,lng,data_date,X,Y

async function processKidsCafes(): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'raw', 'kids_cafe', 'kids_cafes_with_coords.csv');
  const rows = parseCsv(readCsv(filePath));
  const records: FacilityRecord[] = [];

  for (const row of rows) {
    const name = row['cafe_nm']?.trim();
    if (!name) continue;

    const lat = parseFloat(row['lat'] ?? '');
    const lng = parseFloat(row['lng'] ?? '');
    if (!lat || !lng || lat === 0 || lng === 0) continue;

    const rawGugun = row['gugun']?.trim() ?? '';
    // "부산광역시 해운대구" → "해운대구"
    const district = rawGugun.replace(/^부산광역시\s+/, '').trim() || null;

    const rawPhone = row['tel_no']?.trim() ?? '';
    const phone = rawPhone && rawPhone !== '-' ? rawPhone : null;

    records.push({
      type: 'kids_cafe',
      name,
      address: row['road_nm']?.trim() || null,
      phone,
      district,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      source: 'kids_cafes_with_coords.csv',
    });
  }

  await loadType('kids_cafe', records);
}

// ── 3. 아토피 안심학교 atopy_school ──────────────────────────────────────────
// Header: num,center_nam,school_nam,school_add,lat,lng,X,Y

async function processAtopySchools(): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'raw', 'atopy_school', 'atopy_schools_with_coords.csv');
  const rows = parseCsv(readCsv(filePath));
  const records: FacilityRecord[] = [];

  for (const row of rows) {
    const name = row['school_nam']?.trim();
    if (!name) continue;

    const lat = parseFloat(row['lat'] ?? '');
    const lng = parseFloat(row['lng'] ?? '');
    if (!lat || !lng || lat === 0 || lng === 0) continue;

    const address = row['school_add']?.trim() || null;
    const districtMatch = address?.match(/부산광역시\s+(\S+[구군])/);
    const district = districtMatch ? districtMatch[1] : null;

    records.push({
      type: 'atopy_school',
      name,
      address,
      district,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      metadata: {
        center_nam: row['center_nam']?.trim() || null,
      },
      source: 'atopy_schools_with_coords.csv',
    });
  }

  await loadType('atopy_school', records);
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== upsert-shp-facilities 시작 ===');
  await processNursingRooms();
  await processKidsCafes();
  await processAtopySchools();
  console.log('=== 완료 ===');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
