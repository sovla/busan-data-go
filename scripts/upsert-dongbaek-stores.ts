/**
 * upsert-dongbaek-stores.ts
 * src/lib/dongbaek-stores.ts의 DONGBAEK_STORES 배열을 Supabase dongbaek_stores 테이블에 적재합니다.
 *
 * 실행: npx tsx scripts/upsert-dongbaek-stores.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { DONGBAEK_STORES } from '../src/lib/dongbaek-stores';

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

const BATCH = 100;

async function main() {
  console.log('=== dongbaek_stores 적재 시작 ===');

  // 테이블 존재 여부 확인
  const { error: checkErr } = await supabase
    .from('dongbaek_stores')
    .select('id')
    .limit(1);

  if (checkErr) {
    if (
      checkErr.message.includes('does not exist') ||
      checkErr.message.includes('schema cache') ||
      checkErr.code === '42P01' ||
      checkErr.code === 'PGRST200'
    ) {
      console.error('dongbaek_stores 테이블이 없습니다.');
      console.error('Supabase SQL Editor(https://supabase.com/dashboard/project/ugntwimaggpcigvalvrs/sql)에서 아래 마이그레이션을 실행하세요:\n');
      console.error('────────────────────────────────────────────────');
      console.error(require('fs').readFileSync(require('path').join(process.cwd(), 'supabase/migrations/004_dongbaek_benefits.sql'), 'utf-8'));
      console.error('────────────────────────────────────────────────');
      console.error('\n실행 후 다시 npx tsx scripts/upsert-dongbaek-stores.ts 를 실행하세요.');
      process.exit(1);
    }
    console.error('테이블 확인 실패:', checkErr.message);
    process.exit(1);
  }

  // 기존 데이터 삭제
  console.log('기존 dongbaek_stores 데이터 삭제 중...');
  const { error: delErr } = await supabase
    .from('dongbaek_stores')
    .delete()
    .neq('id', 0);
  if (delErr) {
    console.error('삭제 실패:', delErr.message);
    process.exit(1);
  }

  // 배치 insert
  const records = DONGBAEK_STORES.map(({ id: _id, ...rest }) => rest);
  console.log(`${records.length}건 삽입 중...`);

  for (let i = 0; i < records.length; i += BATCH) {
    const chunk = records.slice(i, i + BATCH);
    const { error } = await supabase.from('dongbaek_stores').insert(chunk);
    if (error) {
      console.error(`  청크 ${i}~${i + chunk.length} 실패:`, error.message);
      process.exit(1);
    }
  }

  console.log(`dongbaek_stores: ${records.length}건 적재 완료`);
}

main().catch(e => {
  console.error('치명적 오류:', e);
  process.exit(1);
});
