/**
 * upsert-dongbaek-meal.ts
 * 동백전 가맹점 + 아동급식카드 가맹점을 Supabase에 적재합니다.
 *
 * 동백전:  data/raw/dongbaek/부산광역시_지역화폐(동백전) 가맹점 현황_20260424.csv
 *           → facilities 테이블, type='dongbaek_store'
 *           카테고리 컬럼 없음 → 가맹점명 키워드로 분류, 육아용품/의료/약국/식품/교육만 적재
 *
 * 아동급식카드: data/raw/meal_store/부산_아동급식카드_가맹점 v2(수정).csv
 *              → meal_card_stores 테이블 (id, name, address, phone, category, location, updated_at)
 *
 * 실행: npx tsx scripts/upsert-dongbaek-meal.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import iconv from 'iconv-lite';

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

// ── CSV 유틸 ──────────────────────────────────────────────────────────────────

/** 파일을 UTF-8로 읽거나 iconv-lite로 EUC-KR 변환 */
function readFileUtf8(filePath: string): string {
  const raw = fs.readFileSync(filePath);
  // BOM 제거
  const start = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf ? 3 : 0;
  const content = raw.slice(start).toString('utf-8');
  if (content.includes('�') || /[\x80-\xff]/.test(content.slice(0, 400))) {
    return iconv.decode(raw, 'euc-kr');
  }
  return content;
}

/** CSV 한 줄 파싱 (큰따옴표 내 쉼표 처리) */
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

/** CSV 전체 파싱 → 헤더 + 레코드 배열 */
function parseCsv(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]);
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    rows.push(parseCsvLine(lines[i]));
  }
  return { headers, rows };
}

/** 주소에서 구군 추출 */
function districtFromAddress(address: string): string {
  const m = address.match(/부산(?:광역시)?\s*([가-힣]+[구군])/);
  return m ? m[1] : '';
}

// ── 배치 insert 헬퍼 ──────────────────────────────────────────────────────────

const BATCH = 500;

async function insertBatch<T extends object>(
  table: string,
  rows: T[],
): Promise<void> {
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      console.error(`  [${table}] 청크 ${i}~${i + chunk.length} 실패:`, error.message);
      throw error;
    }
    if ((i + BATCH) % 5000 === 0 || i + BATCH >= rows.length) {
      console.log(`  → ${Math.min(i + BATCH, rows.length)} / ${rows.length} 삽입`);
    }
  }
}

// ── 동백전 카테고리 분류 ──────────────────────────────────────────────────────

type DongbaekCategory = '육아용품' | '의료' | '약국' | '식품' | '교육';

const CATEGORY_RULES: { category: DongbaekCategory; keywords: string[] }[] = [
  {
    category: '약국',
    keywords: ['약국', '약방', '팜', '드럭'],
  },
  {
    category: '의료',
    keywords: [
      '병원', '의원', '클리닉', '한의원', '한방', '치과', '안과', '이비인후과',
      '소아과', '산부인과', '정형외과', '내과', '외과', '피부과', '신경과',
      '정신과', '재활', '요양', '의료', '의학', '메디', '닥터', 'Dr.',
      '조리원', '산후', '분만',
    ],
  },
  {
    category: '육아용품',
    keywords: [
      '유아', '아동', '베이비', '맘', '임산부', '출산', '키즈', '어린이',
      '완구', '장난감', '유모차', '카시트', '기저귀', '분유', '이유식',
      '육아', '모유', '수유',
    ],
  },
  {
    category: '교육',
    keywords: [
      '학원', '교육', '어린이집', '유치원', '유아원', '놀이', '학습',
      '영어', '수학', '태권도', '체육', '미술', '음악', '피아노', '발레',
      '수영', '댄스', '독서', '논술', '과학', '코딩', '로봇',
    ],
  },
  {
    category: '식품',
    keywords: [
      '마트', '슈퍼', '편의점', '식품', '식재료', '반찬', '농산', '수산',
      '축산', '정육', '청과', '과일', '채소', '유기농', '친환경', '건강식품',
      '영양', '유제품', '우유', '두부', '김치', '떡', '빵', '베이커리',
      '제과', '시장',
    ],
  },
];

function classifyDongbaek(name: string): DongbaekCategory | null {
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw.toLowerCase())) return rule.category;
    }
  }
  return null;
}

// ── 동백전 처리 ───────────────────────────────────────────────────────────────

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

async function processDongbaek() {
  console.log('\n[동백전 가맹점 dongbaek_store]');

  const filePath = path.join(
    process.cwd(),
    'data', 'raw', 'dongbaek',
    '부산광역시_지역화폐(동백전) 가맹점 현황_20260424.csv',
  );

  if (!fs.existsSync(filePath)) {
    console.error('  파일 없음:', filePath);
    return;
  }

  console.log('  CSV 읽는 중...');
  const content = readFileUtf8(filePath);
  const { headers, rows } = parseCsv(content);
  console.log(`  헤더: [${headers.join(', ')}]`);
  console.log(`  전체 행: ${rows.length.toLocaleString()}개`);

  // 헤더 인덱스 탐지
  const nameIdx = headers.findIndex(h => h.includes('가맹점') && (h.includes('명') || h.includes('이름')));
  const addrIdx = headers.findIndex(h => h.includes('주소'));
  const dateIdx = headers.findIndex(h => h.includes('기준일') || h.includes('일자'));

  if (nameIdx === -1 || addrIdx === -1) {
    console.error('  필수 컬럼(가맹점명, 주소) 미발견. 헤더:', headers);
    return;
  }

  // 카테고리 필터 적용
  const records: FacilityRecord[] = [];
  const categoryCount: Record<string, number> = {};
  let skipped = 0;

  for (const row of rows) {
    const name = row[nameIdx]?.trim() ?? '';
    if (!name) { skipped++; continue; }

    const category = classifyDongbaek(name);
    if (!category) { skipped++; continue; }

    const address = row[addrIdx]?.trim() ?? '';
    const district = districtFromAddress(address);
    const updatedAt = dateIdx >= 0 ? (row[dateIdx]?.trim() ?? null) : null;

    records.push({
      type: 'dongbaek_store',
      name,
      address,
      road_address: address,
      district: district || null,
      metadata: { category, updated_at: updatedAt },
      source: '부산광역시 지역화폐(동백전) 가맹점 현황',
    });

    categoryCount[category] = (categoryCount[category] ?? 0) + 1;
    if (records.length % 1000 === 0) {
      process.stdout.write(`\r  분류 중: ${records.length.toLocaleString()}건 매칭...`);
    }
  }
  console.log(`\r  분류 완료: ${records.length.toLocaleString()}건 매칭 (${skipped.toLocaleString()}건 스킵)`);
  console.log('  카테고리 분포:', JSON.stringify(categoryCount, null, 0));

  // 기존 데이터 전체 삭제
  console.log('  기존 dongbaek_store 삭제 중...');
  const { error: delErr } = await supabase
    .from('facilities')
    .delete()
    .eq('type', 'dongbaek_store');
  if (delErr) {
    console.error('  삭제 실패:', delErr.message);
    return;
  }

  // 배치 insert
  console.log(`  ${records.length.toLocaleString()}건 삽입 중...`);
  await insertBatch('facilities', records);
  console.log(`  동백전 완료: ${records.length.toLocaleString()}건`);
}

// ── 아동급식카드 처리 ─────────────────────────────────────────────────────────

type MealCardRecord = {
  name: string;
  address: string | null;
  phone: string | null;
  category: string | null;
  location: string | null;
  updated_at: string | null;
};

async function processMealCard() {
  console.log('\n[아동급식카드 가맹점 meal_card_stores]');

  const filePath = path.join(
    process.cwd(),
    'data', 'raw', 'meal_store',
    '부산_아동급식카드_가맹점 v2(수정).csv',
  );

  if (!fs.existsSync(filePath)) {
    console.error('  파일 없음:', filePath);
    return;
  }

  console.log('  CSV 읽는 중 (EUC-KR 변환)...');
  const content = readFileUtf8(filePath);
  const { headers, rows } = parseCsv(content);
  console.log(`  헤더: [${headers.join(', ')}]`);
  console.log(`  전체 행: ${rows.length.toLocaleString()}개`);

  // 헤더 인덱스 탐지 — 컬럼: 데이터작성일자,가맹점명칭,사업자번호,도로명주소,지번주소,전화번호,업종,위도,경도,가맹점기준일자
  const colIdx = (candidates: string[]): number => {
    for (const c of candidates) {
      const i = headers.findIndex(h => h.includes(c));
      if (i >= 0) return i;
    }
    return -1;
  };

  const nameIdx   = colIdx(['가맹점명', '상호명', '명칭']);
  const roadIdx   = colIdx(['도로명주소', '도로명']);
  const jibunIdx  = colIdx(['지번주소', '지번']);
  const phoneIdx  = colIdx(['전화번호', '연락처']);
  const catIdx    = colIdx(['업종', '분류', '카테고리']);
  const latIdx    = colIdx(['위도', 'lat']);
  const lngIdx    = colIdx(['경도', 'lng', 'lon']);
  const dateIdx   = colIdx(['가맹점기준일자', '데이터작성일자', '기준일']);

  if (nameIdx === -1) {
    console.error('  가맹점명 컬럼 미발견. 헤더:', headers);
    return;
  }

  const records: MealCardRecord[] = [];
  let skipped = 0;

  for (const row of rows) {
    const name = row[nameIdx]?.trim() ?? '';
    if (!name) { skipped++; continue; }

    const address = roadIdx >= 0 ? (row[roadIdx]?.trim() || null)
      : (jibunIdx >= 0 ? (row[jibunIdx]?.trim() || null) : null);
    const phone    = phoneIdx >= 0 ? (row[phoneIdx]?.trim() || null) : null;
    const category = catIdx    >= 0 ? (row[catIdx]?.trim()   || null) : null;
    const updatedAt = dateIdx  >= 0 ? (row[dateIdx]?.trim()  || null) : null;

    let location: string | null = null;
    if (latIdx >= 0 && lngIdx >= 0) {
      const lat = parseFloat(row[latIdx] ?? '');
      const lng = parseFloat(row[lngIdx] ?? '');
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        location = `POINT(${lng} ${lat})`;
      }
    }

    records.push({ name, address, phone, category, location, updated_at: updatedAt });

    if (records.length % 1000 === 0) {
      process.stdout.write(`\r  파싱 중: ${records.length.toLocaleString()}건...`);
    }
  }
  console.log(`\r  파싱 완료: ${records.length.toLocaleString()}건 (${skipped}건 스킵)`);

  // 기존 데이터 전체 삭제
  console.log('  기존 meal_card_stores 삭제 중...');
  const { error: delErr } = await supabase
    .from('meal_card_stores')
    .delete()
    .neq('id', 0);  // DELETE all rows
  if (delErr) {
    console.error('  삭제 실패:', delErr.message);
    return;
  }

  // 배치 insert
  console.log(`  ${records.length.toLocaleString()}건 삽입 중...`);
  await insertBatch('meal_card_stores', records);
  console.log(`  아동급식카드 완료: ${records.length.toLocaleString()}건`);
}

// ── 실행 ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== 동백전 + 아동급식카드 가맹점 적재 시작 ===');
  const t0 = Date.now();

  await processDongbaek();
  await processMealCard();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n=== 완료 (${elapsed}s) ===`);
}

main().catch(e => {
  console.error('치명적 오류:', e);
  process.exit(1);
});
