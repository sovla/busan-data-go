/**
 * upsert-benefits.ts
 * benefits-data.ts의 15건 데이터를 Supabase benefits 테이블에 적재합니다.
 *
 * 실행 전 필수: supabase/migrations/004_dongbaek_benefits.sql을 Supabase SQL Editor에서 실행
 * 실행: npx tsx scripts/upsert-benefits.ts
 */

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

// ── benefits 데이터 (benefits-data.ts 동일 15건, DB 스키마에 맞게 변환) ──────────
interface BenefitRow {
  title: string;
  category: string;
  provider: string;
  amount: string;
  amount_value: number;
  description: string;
  how_to_apply: string;
  url: string;
  eligibility: Record<string, unknown>;
  exclusion_group: string | null;
  exclude_when_pregnant: boolean;
}

const BENEFITS: BenefitRow[] = [
  {
    title: '첫만남이용권',
    category: '출산지원',
    provider: '정부(보건복지부)',
    amount: '200만원',
    amount_value: 2000000,
    description: '출생아 1인당 200만원의 바우처를 지급합니다. 출생 후 1년 이내 신청 가능하며 국민행복카드로 지원됩니다.',
    how_to_apply: '읍면동 주민센터 또는 복지로 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '출산장려금 (둘째)',
    category: '출산지원',
    provider: '부산시',
    amount: '50만원',
    amount_value: 500000,
    description: '둘째 아이 출산 시 부산시에서 50만원을 지원합니다.',
    how_to_apply: '출생신고 후 거주지 구군청에 신청',
    url: 'https://www.busan.go.kr',
    eligibility: { pregnancy: false, min_children: 2 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '출산장려금 (셋째 이상)',
    category: '출산지원',
    provider: '부산시',
    amount: '150만원',
    amount_value: 1500000,
    description: '셋째 이상 출산 시 부산시에서 150만원을 지원합니다.',
    how_to_apply: '출생신고 후 거주지 구군청에 신청',
    url: 'https://www.busan.go.kr',
    eligibility: { pregnancy: false, min_children: 3 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '부모급여 (0세)',
    category: '양육지원',
    provider: '정부(보건복지부)',
    amount: '월 100만원',
    amount_value: 1000000,
    description: '만 0세(0~11개월) 아동을 양육하는 가정에 월 100만원을 지급합니다.',
    how_to_apply: '읍면동 주민센터 또는 복지로/정부24 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1, child_ages: [0] },
    exclusion_group: 'parent_allowance',
    exclude_when_pregnant: false,
  },
  {
    title: '부모급여 (1세)',
    category: '양육지원',
    provider: '정부(보건복지부)',
    amount: '월 50만원',
    amount_value: 500000,
    description: '만 1세(12~23개월) 아동을 양육하는 가정에 월 50만원을 지급합니다.',
    how_to_apply: '읍면동 주민센터 또는 복지로/정부24 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1, child_ages: [1] },
    exclusion_group: 'parent_allowance',
    exclude_when_pregnant: false,
  },
  {
    title: '아동수당',
    category: '양육지원',
    provider: '정부(보건복지부)',
    amount: '월 10만원',
    amount_value: 100000,
    description: '만 8세 미만 아동에게 월 10만원을 지급합니다. 소득 제한 없이 지원됩니다.',
    how_to_apply: '읍면동 주민센터 또는 복지로/정부24 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1, max_child_age: 7 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '영아수당',
    category: '양육지원',
    provider: '정부(보건복지부)',
    amount: '월 30만원',
    amount_value: 300000,
    description: '만 0~1세 영아를 가정에서 양육 시 월 30만원을 지원합니다. (어린이집 미이용 가정 대상)',
    how_to_apply: '읍면동 주민센터 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1, child_ages: [0, 1] },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '전면 무상보육 (3~5세)',
    category: '보육지원',
    provider: '정부(교육부)',
    amount: '월 13.7만원',
    amount_value: 137000,
    description: '3~5세 유아는 누리과정에 따라 어린이집/유치원 이용 시 월 13.7만원 보육료를 지원받습니다.',
    how_to_apply: '해당 어린이집 또는 유치원에 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1, child_ages: [3, 4, 5] },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '임산부 교통비 지원',
    category: '임산부지원',
    provider: '부산시',
    amount: '월 7만원',
    amount_value: 70000,
    description: '임신 중인 임산부에게 대중교통 이용을 위한 교통비를 월 7만원 지원합니다.',
    how_to_apply: '거주지 구군 보건소 또는 정부24 신청',
    url: 'https://www.busan.go.kr',
    eligibility: { pregnancy: true },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '산후조리비 지원',
    category: '임산부지원',
    provider: '부산시',
    amount: '50만원',
    amount_value: 500000,
    description: '출산 후 산후조리원 이용 비용을 50만원 지원합니다.',
    how_to_apply: '출산 후 거주지 구군 보건소 신청',
    url: 'https://www.busan.go.kr',
    eligibility: { pregnancy: false, min_children: 1 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '산모신생아 건강관리서비스',
    category: '임산부지원',
    provider: '정부(보건복지부)',
    amount: '바우처 지원',
    amount_value: 0,
    description: '출산 가정에 건강관리사를 파견하여 산모와 신생아를 돌봐주는 서비스입니다. 소득 수준에 따라 본인부담금이 다릅니다.',
    how_to_apply: '임신 40일 이후 복지로 또는 주민센터 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { pregnancy: false, min_children: 1 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '임산부 건강관리 (무료 산전검사)',
    category: '임산부지원',
    provider: '보건소',
    amount: '무료',
    amount_value: 0,
    description: '임신 확인 후 보건소에서 산전검사(혈액검사, 초음파 등)를 무료로 받을 수 있습니다.',
    how_to_apply: '거주지 관할 보건소 방문',
    url: 'https://www.busan.go.kr',
    eligibility: { pregnancy: true },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '난임시술비 지원',
    category: '임산부지원',
    provider: '정부(보건복지부)',
    amount: '최대 110만원/회',
    amount_value: 1100000,
    description: '난임 진단을 받은 부부에게 체외수정 등 난임 시술비를 지원합니다. 소득 기준에 따라 지원 금액이 다릅니다.',
    how_to_apply: '난임 진단 후 거주지 보건소 또는 복지로 신청',
    url: 'https://www.bokjiro.go.kr',
    eligibility: { income_level: 'middle' },
    exclusion_group: null,
    exclude_when_pregnant: true,
  },
  {
    title: '다자녀 가구 지원',
    category: '다자녀지원',
    provider: '부산시',
    amount: '다양한 혜택',
    amount_value: 0,
    description: '셋째 이상 자녀를 둔 가정은 문화시설 무료 이용, 공공요금 감면 등 다양한 다자녀 혜택을 받을 수 있습니다.',
    how_to_apply: '다자녀 행복카드 발급 후 혜택 이용',
    url: 'https://www.busan.go.kr',
    eligibility: { min_children: 3 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
  {
    title: '공공임대주택 우선 배정',
    category: '주거지원',
    provider: 'LH/부산시',
    amount: '우선 배정',
    amount_value: 0,
    description: '자녀 수에 따라 공공임대주택 신청 시 가점을 받거나 우선 배정 혜택을 받을 수 있습니다.',
    how_to_apply: 'LH 청약센터 또는 부산시 공공주택 공고 확인 후 신청',
    url: 'https://apply.lh.or.kr',
    eligibility: { min_children: 2 },
    exclusion_group: null,
    exclude_when_pregnant: false,
  },
];

// ── 컬럼 존재 여부 확인 ───────────────────────────────────────────────────────
async function checkColumns(): Promise<boolean> {
  const { data, error } = await supabase.from('benefits').select('*').limit(1);
  if (error) {
    console.error('❌ benefits 테이블 조회 실패:', error.message);
    return false;
  }
  if (data && data.length > 0) {
    const row = data[0];
    const missing = ['amount_value', 'exclusion_group', 'exclude_when_pregnant'].filter(
      (col) => !(col in row)
    );
    if (missing.length > 0) {
      console.error('❌ benefits 테이블에 다음 컬럼이 없습니다:', missing.join(', '));
      console.log('\n먼저 Supabase SQL Editor에서 아래 파일의 SQL을 실행하세요:');
      console.log('  supabase/migrations/004_dongbaek_benefits.sql');
      console.log('\nSupabase Dashboard: https://supabase.com/dashboard/project/ugntwimaggpcigvalvrs/sql');
      return false;
    }
  }
  return true;
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('benefits upsert 시작...');

  // 컬럼 확인
  const ok = await checkColumns();
  if (!ok) process.exit(1);

  // 전체 삭제
  const { error: delError } = await supabase.from('benefits').delete().neq('id', 0);
  if (delError) {
    console.error('❌ 기존 데이터 삭제 실패:', delError.message);
    process.exit(1);
  }
  console.log('기존 benefits 데이터 삭제 완료');

  // 15건 INSERT
  const { data, error: insertError } = await supabase.from('benefits').insert(BENEFITS).select('id');
  if (insertError) {
    console.error('❌ INSERT 실패:', insertError.message);
    process.exit(1);
  }

  console.log(`✅ benefits: ${data?.length}건 적재 완료`);
}

main().catch(console.error);
