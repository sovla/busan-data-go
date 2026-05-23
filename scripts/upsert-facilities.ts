/**
 * upsert-facilities.ts
 * CSV 파일을 읽어 Supabase facilities 테이블에 upsert합니다.
 * 실행: npx tsx scripts/upsert-facilities.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ── env 로드 (.env.local) ─────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
if (!supabaseUrl || !supabaseKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY 환경변수 없음');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

// ── CSV 파싱 유틸 ─────────────────────────────────────────────────────────────

/** 파일을 UTF-8로 읽거나, 실패 시 iconv EUC-KR 변환 */
function readFileUtf8(filePath: string): string {
  try {
    const raw = fs.readFileSync(filePath);
    // BOM 제거
    const content = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf
      ? raw.slice(3).toString('utf-8')
      : raw.toString('utf-8');
    // 한글 깨짐 감지: EUC-KR 잔재 (0xed 이상 연속 비정상 시퀀스)
    if (content.includes('�') || /[\x80-\xff]/.test(content.slice(0, 200))) {
      throw new Error('garbled');
    }
    return content;
  } catch {
    return execSync(`iconv -f euc-kr -t utf-8 "${filePath}"`).toString('utf-8');
  }
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
function parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? ''; });
    rows.push(row);
  }
  return { headers, rows };
}

// ── 컬럼 자동 감지 ─────────────────────────────────────────────────────────────

function pick(row: Record<string, string>, ...candidates: string[]): string {
  for (const c of candidates) {
    if (row[c] !== undefined && row[c] !== '') return row[c];
  }
  return '';
}

function pickNum(row: Record<string, string>, ...candidates: string[]): number | null {
  const v = pick(row, ...candidates);
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

/** 파일명에서 구군명 추출 */
function districtFromFilename(filename: string): string {
  // "부산광역시_기장군_..." → "기장군"
  // "부산광역시 해운대구_..." → "해운대구"
  const m = filename.match(/부산광역시[_ ]([가-힣]+?)[_ \-]/);
  if (m) return m[1];
  // "부산광역시 남구_..." 형태
  const m2 = filename.match(/부산광역시[_ ]([가-힣]+)/);
  if (m2) return m2[1];
  return '';
}

/** 주소에서 구군 추출 (fallback) */
function districtFromAddress(address: string): string {
  const m = address.match(/부산광역시\s+([가-힣]+?[구군])/);
  return m ? m[1] : '';
}

// ── Supabase upsert 배치 ───────────────────────────────────────────────────────

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

async function upsertBatch(
  facilityType: string,
  district: string,
  records: FacilityRecord[],
  label: string,
) {
  if (records.length === 0) {
    console.log(`  ${label}: 0건 (건너뜀)`);
    return;
  }

  // 해당 type + district 기존 데이터 삭제
  const deleteQuery = supabase.from('facilities').delete().eq('type', facilityType);
  if (district) deleteQuery.eq('district', district);
  const { error: delErr } = await deleteQuery;
  if (delErr) {
    console.error(`  ${label} 삭제 실패:`, delErr.message);
    return;
  }

  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const chunk = records.slice(i, i + BATCH);
    const { error } = await supabase.from('facilities').insert(chunk);
    if (error) {
      console.error(`  ${label} 청크 ${i} 실패:`, error.message);
      return;
    }
    inserted += chunk.length;
  }
  console.log(`  ${label}: ${inserted}건 upsert 완료`);
}

// ── DAYCARE 처리 ──────────────────────────────────────────────────────────────

async function processDaycares() {
  console.log('\n[어린이집 daycare]');
  const dir = path.join(process.cwd(), 'data', 'raw', 'daycare');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const content = readFileUtf8(filePath);
    const { rows } = parseCsv(content);

    const district = districtFromFilename(filename) || '부산';
    const records: FacilityRecord[] = [];

    for (const row of rows) {
      const name = pick(row, '어린이집명', '시설명', '명칭', 'chctrNm');
      if (!name) continue;

      const address = pick(row, '주소', '소재지', '상세주소', '지번주소');
      const roadAddress = pick(row, '도로명주소', '소재지(도로명)', '영업소소재지(도로명)', 'dtlAddr');

      // 서구 파일은 영문 컬럼명
      const lat = pickNum(row, '위도', 'fcltLat', 'lat');
      const lng = pickNum(row, '경도', 'fcltLot', 'lng');

      const phone = pick(row, '전화번호', '어린이집전화번호', 'telno', 'fxno');
      const daycareType = pick(row, '어린이집유형', '어린이집유형구분', '어린이집 유형', 'chctrTypeNm', 'pvsnSrvcNm');
      const capacity = pickNum(row, '정원수', '정원', 'pscpCnt', 'cnppCnt');
      const staff = pickNum(row, '보육교직원수', '보육교직원 현원', 'nturEduStaffCnt');

      const effectiveDistrict = pick(row, '시군구명', 'sggNm') || district;

      records.push({
        type: 'daycare',
        name,
        address: address || roadAddress || null,
        road_address: roadAddress || null,
        phone: phone || null,
        district: effectiveDistrict,
        location: lat && lng ? `SRID=4326;POINT(${lng} ${lat})` : null,
        metadata: {
          daycare_type: daycareType || null,
          capacity: capacity ?? null,
          staff: staff ?? null,
        },
        source: filename,
      });
    }

    await upsertBatch('daycare', district, records, `daycare (${district}) [${filename}]`);
  }
}

// ── POSTPARTUM 처리 ───────────────────────────────────────────────────────────

async function processPostpartum() {
  console.log('\n[산후조리원 postpartum]');
  const dir = path.join(process.cwd(), 'data', 'raw', 'postpartum');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const content = readFileUtf8(filePath);
    const { rows } = parseCsv(content);

    const district = districtFromFilename(filename) || '부산';
    const records: FacilityRecord[] = [];

    for (const row of rows) {
      const name = pick(row, '영업소명', '산후조리원명', '산후조리원', '명칭', '원명');
      if (!name) continue;

      const address = pick(row, '영업소소재지', '주소', '지번주소');
      const roadAddress = pick(row, '영업소소재지(도로명)', '도로명주소');
      const phone = pick(row, '영업소전화번호', '전화번호', '연락처');
      const lat = pickNum(row, '위도');
      const lng = pickNum(row, '경도');

      const capacity = pickNum(row, '임산부정원수(명)', '임산부실 정원', '인원');
      const effectiveDistrict = pick(row, '구군명', '시군구명') || district;

      records.push({
        type: 'postpartum',
        name,
        address: address || roadAddress || null,
        road_address: roadAddress || null,
        phone: phone || null,
        district: effectiveDistrict,
        location: lat && lng ? `SRID=4326;POINT(${lng} ${lat})` : null,
        metadata: {
          capacity: capacity ?? null,
          category: pick(row, '업소구분', '업종') || '산후조리원',
        },
        source: filename,
      });
    }

    await upsertBatch('postpartum', district, records, `postpartum (${district}) [${filename}]`);
  }
}

// ── HOSPITAL 처리 ─────────────────────────────────────────────────────────────

async function processHospitals() {
  console.log('\n[병원 hospital]');
  const dir = path.join(process.cwd(), 'data', 'raw', 'hospital');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const content = readFileUtf8(filePath);
    const { rows } = parseCsv(content);

    const districtFromFile = districtFromFilename(filename);
    const records: FacilityRecord[] = [];

    for (const row of rows) {
      const name = pick(row, '의료기관명', '시설명');
      if (!name) continue;

      const roadAddress = pick(row, '도로명주소', '의료기관주소(도로명)', '의료기관주소');
      const address = roadAddress || pick(row, '주소');
      const phone = pick(row, '전화번호', '의료기관전화번호');
      const lat = pickNum(row, '위도');
      const lng = pickNum(row, '경도');
      const hospitalType = pick(row, '종별', '업종');

      const district = districtFromFile
        || districtFromAddress(address)
        || districtFromAddress(roadAddress);

      records.push({
        type: 'hospital',
        name,
        address: address || null,
        road_address: roadAddress || null,
        phone: phone || null,
        district: district || null,
        location: lat && lng ? `SRID=4326;POINT(${lng} ${lat})` : null,
        metadata: {
          hospital_type: hospitalType || null,
          beds: pickNum(row, '병상수') ?? null,
        },
        source: filename,
      });
    }

    const label = districtFromFile || '전체';
    await upsertBatch('hospital', districtFromFile, records, `hospital (${label}) [${filename}]`);
  }
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== upsert-facilities 시작 ===');
  await processDaycares();
  await processPostpartum();
  await processHospitals();
  console.log('\n=== 완료 ===');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
