import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const benefits = [
  {
    title: '부산시 출산장려금',
    category: '출산',
    provider: '부산광역시',
    eligibility: {
      min_children: 1,
      residency: '부산광역시',
      pregnancy: false,
    },
    amount: '첫째 50만원, 둘째 100만원, 셋째 이상 300만원',
    description: '부산시에 주민등록을 두고 출산한 가정에 지급하는 출산장려금입니다.',
    how_to_apply: '출산 후 60일 이내 주민센터 방문 또는 복지로(www.bokjiro.go.kr) 온라인 신청',
    url: 'https://www.busan.go.kr',
  },
  {
    title: '전면 무상보육 (0~5세)',
    category: '보육',
    provider: '부산광역시',
    eligibility: {
      max_child_age: 5,
      income_level: '전체',
    },
    amount: '보육료 전액 지원',
    description: '소득과 관계없이 0~5세 자녀의 어린이집 보육료를 전액 지원합니다.',
    how_to_apply: '복지로 또는 주민센터에서 보육료 바우처 신청',
    url: 'https://www.bokjiro.go.kr',
  },
  {
    title: '부모급여',
    category: '양육',
    provider: '보건복지부',
    eligibility: {
      max_child_age: 1,
      income_level: '전체',
    },
    amount: '만 0세 월 100만원, 만 1세 월 50만원',
    description: '가정에서 아이를 직접 돌보는 부모에게 지급하는 급여입니다.',
    how_to_apply: '출생 후 60일 이내 주민센터 방문 또는 복지로 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
  },
  {
    title: '아동수당',
    category: '양육',
    provider: '보건복지부',
    eligibility: {
      max_child_age: 7,
      income_level: '전체',
    },
    amount: '월 10만원',
    description: '만 8세 미만 아동에게 지급하는 수당입니다.',
    how_to_apply: '주민센터 방문 또는 복지로 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
  },
  {
    title: '영아수당 (가정양육수당)',
    category: '양육',
    provider: '보건복지부',
    eligibility: {
      max_child_age: 1,
      home_care: true,
      income_level: '전체',
    },
    amount: '월 30만원',
    description: '어린이집·유치원 미이용 영아를 가정에서 돌볼 때 지급하는 수당입니다.',
    how_to_apply: '주민센터 방문 또는 복지로 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
  },
  {
    title: '첫만남이용권',
    category: '출산',
    provider: '보건복지부',
    eligibility: {
      min_children: 1,
      pregnancy: false,
    },
    amount: '첫째 200만원, 둘째 이상 300만원 (바우처)',
    description: '출생 아동에게 지급하는 국민행복카드 바우처입니다. 임신·출산 관련 용품 구매에 사용 가능합니다.',
    how_to_apply: '출생 후 1년 이내 주민센터 또는 복지로 신청',
    url: 'https://www.bokjiro.go.kr',
  },
  {
    title: '임산부 교통비 지원',
    category: '임신',
    provider: '부산광역시',
    eligibility: {
      pregnancy: true,
      residency: '부산광역시',
    },
    amount: '1인 40만원 (교통카드 충전)',
    description: '임신 중 대중교통 이용 비용을 지원합니다.',
    how_to_apply: '주민센터 또는 부산시 임산부 교통비 지원 누리집 신청',
    url: 'https://www.busan.go.kr',
  },
  {
    title: '산후조리비 지원',
    category: '출산',
    provider: '부산광역시',
    eligibility: {
      min_children: 1,
      residency: '부산광역시',
      income_level: '중위소득 150% 이하',
    },
    amount: '최대 100만원',
    description: '산후조리원 이용 비용을 지원합니다.',
    how_to_apply: '출산 후 6개월 이내 주민센터 방문 신청',
    url: 'https://www.busan.go.kr',
  },
  {
    title: '난임부부 시술비 지원',
    category: '임신',
    provider: '부산광역시',
    eligibility: {
      pregnancy: false,
      infertility: true,
      income_level: '기준 중위소득 180% 이하',
    },
    amount: '체외수정 최대 110만원, 인공수정 최대 30만원',
    description: '난임 진단을 받은 부부의 시술비를 지원합니다.',
    how_to_apply: '보건소 방문 신청',
    url: 'https://www.busan.go.kr',
  },
  {
    title: '다자녀 혜택 (3자녀 이상)',
    category: '양육',
    provider: '부산광역시',
    eligibility: {
      min_children: 3,
      residency: '부산광역시',
    },
    amount: '다자녀카드 발급 (교통·문화시설 할인)',
    description: '3자녀 이상 가정에 다자녀 우대카드를 발급하여 각종 공공시설 이용 할인 혜택을 제공합니다.',
    how_to_apply: '주민센터 방문 또는 부산시 누리집 온라인 신청',
    url: 'https://www.busan.go.kr',
  },
];

async function seedBenefits() {
  console.log('혜택 데이터 시드 시작...');

  const { data, error } = await supabase
    .from('benefits')
    .insert(benefits)
    .select();

  if (error) {
    console.error('시드 실패:', error);
    process.exit(1);
  }

  console.log(`혜택 데이터 ${data?.length}건 삽입 완료`);
}

seedBenefits();
