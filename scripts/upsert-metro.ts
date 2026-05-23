import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

// dotenv는 기본적으로 .env를 읽으므로 .env.local 명시 로드
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SECRET_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ────────────────────────────────────────────────────────────
// 유틸: CSV 파싱 (큰따옴표 안의 쉼표 처리 포함)
// ────────────────────────────────────────────────────────────
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(content: string): { headers: string[]; rows: string[][] } {
  // BOM 제거
  const cleaned = content.replace(/^﻿/, '');
  const lines = cleaned.split(/\r?\n/).filter((l) => l.trim() !== '');
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((l) => parseCsvLine(l));
  return { headers, rows };
}

function readUtf8OrEuckr(filepath: string): string {
  try {
    const raw = fs.readFileSync(filepath);
    // UTF-8 BOM 또는 일반 UTF-8 시도
    const text = raw.toString('utf-8');
    // 깨진 문자 휴리스틱: 한글이 제대로 안 읽히면 EUC-KR로 재시도
    if (/�/.test(text)) {
      return execSync(`iconv -f euc-kr -t utf-8 "${filepath}"`).toString('utf-8');
    }
    return text;
  } catch {
    return execSync(`iconv -f euc-kr -t utf-8 "${filepath}"`).toString('utf-8');
  }
}

// ────────────────────────────────────────────────────────────
// 1) metro_accessibility upsert
// ────────────────────────────────────────────────────────────
async function upsertMetro() {
  const filepath = path.join(
    process.cwd(),
    'data/raw/metro',
    '부산교통공사_역사 편의시설현황_20251231.csv',
  );

  let content: string;
  try {
    content = execSync(`iconv -f euc-kr -t utf-8 "${filepath}"`).toString('utf-8');
  } catch (e) {
    console.error('metro CSV iconv 실패:', e);
    process.exit(1);
  }

  const { headers, rows } = parseCsv(content);

  const idx = (name: string) => headers.indexOf(name);
  const iLine = idx('구분');
  const iStation = idx('역명');
  const iNursing = idx('유아수유실');
  const iLift = idx('휠체어리프트');
  const iElInner = idx('엘리베이터(내부)');
  const iElOuter = idx('엘리베이터(외부)');
  const iEsc = idx('에스컬레이터');
  const iRamp = idx('외부경사로');

  const records = rows
    .filter((r) => r[iLine] && r[iStation])
    .map((r) => ({
      line: r[iLine],
      station_name: r[iStation],
      nursing_room: parseInt(r[iNursing] ?? '0', 10) > 0,
      wheelchair_lift: parseInt(r[iLift] ?? '0', 10),
      elevator_inner: parseInt(r[iElInner] ?? '0', 10),
      elevator_outer: parseInt(r[iElOuter] ?? '0', 10),
      escalator: parseInt(r[iEsc] ?? '0', 10),
      outer_ramp: parseInt(r[iRamp] ?? '0', 10),
    }));

  if (records.length === 0) {
    console.error('metro_accessibility: 파싱된 레코드 없음. CSV 컬럼 확인 필요.');
    process.exit(1);
  }

  // 기존 전체 삭제 후 재삽입
  const { error: delError } = await supabase
    .from('metro_accessibility')
    .delete()
    .neq('id', 0);
  if (delError) {
    console.error('metro_accessibility 삭제 오류:', delError.message);
    process.exit(1);
  }

  // 배치 insert (100개씩)
  const BATCH = 100;
  let total = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase.from('metro_accessibility').insert(batch);
    if (error) {
      console.error(`metro_accessibility insert 오류 (batch ${i}~${i + BATCH - 1}):`, error.message);
      process.exit(1);
    }
    total += batch.length;
  }

  console.log(`metro_accessibility: ${total}건 upsert 완료`);
}

// ────────────────────────────────────────────────────────────
// 2) pedestrian_roads insert (delete-all + insert)
// ────────────────────────────────────────────────────────────
async function upsertPedestrianRoads() {
  const dir = path.join(process.cwd(), 'data/raw/pedestrian_road');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.csv'));

  if (files.length === 0) {
    console.error('pedestrian_road: CSV 파일을 찾을 수 없습니다.');
    process.exit(1);
  }

  const allRecords: object[] = [];

  for (const file of files) {
    const filepath = path.join(dir, file);
    const content = readUtf8OrEuckr(filepath);
    const { headers, rows } = parseCsv(content);

    const idx = (name: string) => headers.indexOf(name);
    const iName = idx('보행자우선도로명');
    const iDistrict = idx('시군구명');
    const iStartLat = idx('보행자우선도로시작점위도');
    const iStartLng = idx('보행자우선도로시작점경도');
    const iEndLat = idx('보행자우선도로종료점위도');
    const iEndLng = idx('보행자우선도로종료점경도');
    const iDist = idx('연장거리');
    const iWidth = idx('도로폭');
    const iSpeed = idx('자동차운행속도제한속도');

    for (const r of rows) {
      const startLat = parseFloat(r[iStartLat]);
      const startLng = parseFloat(r[iStartLng]);
      const endLat = parseFloat(r[iEndLat]);
      const endLng = parseFloat(r[iEndLng]);

      if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) continue;

      const distanceRaw = r[iDist];
      const widthRaw = r[iWidth];
      const speedRaw = r[iSpeed];

      allRecords.push({
        name: r[iName] ?? null,
        district: r[iDistrict] ?? null,
        start_lat: startLat,
        start_lng: startLng,
        end_lat: endLat,
        end_lng: endLng,
        start_point: `SRID=4326;POINT(${startLng} ${startLat})`,
        end_point: `SRID=4326;POINT(${endLng} ${endLat})`,
        distance_m: distanceRaw ? parseFloat(distanceRaw) : null,
        road_width: widthRaw ? parseFloat(widthRaw) : null,
        speed_limit: speedRaw ? parseInt(speedRaw, 10) : 30,
      });
    }
  }

  if (allRecords.length === 0) {
    console.error('pedestrian_roads: 파싱된 레코드 없음.');
    process.exit(1);
  }

  // 기존 전체 삭제
  const { error: delError } = await supabase
    .from('pedestrian_roads')
    .delete()
    .neq('id', 0); // 전체 삭제 트릭 (RLS 없을 때)
  if (delError) {
    console.error('pedestrian_roads 삭제 오류:', delError.message);
    process.exit(1);
  }

  // 배치 insert (200개씩)
  const BATCH = 200;
  let total = 0;
  for (let i = 0; i < allRecords.length; i += BATCH) {
    const batch = allRecords.slice(i, i + BATCH);
    const { error } = await supabase.from('pedestrian_roads').insert(batch);
    if (error) {
      console.error(`pedestrian_roads insert 오류 (batch ${i}~${i + BATCH - 1}):`, error.message);
      process.exit(1);
    }
    total += batch.length;
  }

  console.log(`pedestrian_roads: ${total}건 insert 완료`);
}

// ────────────────────────────────────────────────────────────
// main
// ────────────────────────────────────────────────────────────
async function main() {
  await upsertMetro();
  await upsertPedestrianRoads();
}

main().catch((e) => {
  console.error('오류:', e);
  process.exit(1);
});
