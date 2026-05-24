import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// ── env 로드 (.env.local) ──────────────────────────────────────────────────────
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
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SECRET_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SQL_PATH = path.join(process.cwd(), 'supabase/migrations/004_dongbaek_benefits.sql');

async function main() {
  let allOk = true;

  // 1. dongbaek_stores 테이블 존재 확인
  const { error: tableError } = await supabase.from('dongbaek_stores').select('id').limit(1);
  if (tableError?.message?.includes('does not exist') || tableError?.code === '42P01') {
    console.log('⚠️  dongbaek_stores 테이블이 없습니다.');
    allOk = false;
  } else if (tableError) {
    console.log('⚠️  dongbaek_stores 테이블 확인 중 오류:', tableError.message);
    allOk = false;
  } else {
    console.log('✅ dongbaek_stores 테이블 존재 확인');
  }

  // 2. benefits.amount_value 컬럼 존재 확인
  const { data: benefitRow, error: benefitError } = await supabase
    .from('benefits')
    .select('*')
    .limit(1);
  if (benefitError) {
    console.log('⚠️  benefits 테이블 조회 오류:', benefitError.message);
    allOk = false;
  } else if (benefitRow && benefitRow.length > 0 && !('amount_value' in benefitRow[0])) {
    console.log('⚠️  benefits 테이블에 amount_value 컬럼이 없습니다.');
    allOk = false;
  } else {
    console.log('✅ benefits.amount_value 컬럼 존재 확인');
  }

  // 3. benefits.exclusion_group 컬럼 존재 확인
  if (benefitRow && benefitRow.length > 0 && !('exclusion_group' in benefitRow[0])) {
    console.log('⚠️  benefits 테이블에 exclusion_group 컬럼이 없습니다.');
    allOk = false;
  } else if (!benefitError) {
    console.log('✅ benefits.exclusion_group 컬럼 존재 확인');
  }

  // 4. benefits.exclude_when_pregnant 컬럼 존재 확인
  if (benefitRow && benefitRow.length > 0 && !('exclude_when_pregnant' in benefitRow[0])) {
    console.log('⚠️  benefits 테이블에 exclude_when_pregnant 컬럼이 없습니다.');
    allOk = false;
  } else if (!benefitError) {
    console.log('✅ benefits.exclude_when_pregnant 컬럼 존재 확인');
  }

  if (!allOk) {
    console.log('\n아래 SQL을 Supabase SQL Editor에서 실행하세요:');
    console.log('https://supabase.com/dashboard → SQL Editor\n');
    console.log('─'.repeat(60));
    console.log(fs.readFileSync(SQL_PATH, 'utf-8'));
    console.log('─'.repeat(60));
    process.exit(1);
  }

  console.log('\n✅ 마이그레이션 확인 완료 - 테이블과 컬럼이 모두 존재합니다.');
}

main().catch(console.error);
