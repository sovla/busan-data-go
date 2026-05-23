import { createClient } from '@supabase/supabase-js';
import { HOSPITALS } from '../src/lib/hospitals-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log(`소스 종합병원: ${HOSPITALS.length}개`);

  console.log('기존 hospital 삭제 중...');
  const { error: deleteError } = await supabase
    .from('facilities')
    .delete()
    .eq('type', 'hospital');
  if (deleteError) {
    console.error('삭제 실패:', deleteError);
    process.exit(1);
  }

  const records = HOSPITALS.filter((h) => h.lat && h.lng).map((h) => ({
    type: 'hospital' as const,
    name: h.name,
    address: h.address,
    district: h.district,
    phone: h.phone,
    location: `SRID=4326;POINT(${h.lng} ${h.lat})`,
    metadata: {
      has_obstetrics: h.has_obstetrics,
      has_pediatrics: h.has_pediatrics,
      has_emergency: h.has_emergency,
    },
    source: 'hospitals.csv',
  }));

  console.log(`적재 대상: ${records.length}개`);
  const { error } = await supabase.from('facilities').insert(records);
  if (error) {
    console.error('적재 실패:', error.message);
    process.exit(1);
  }
  console.log(`✅ hospital ${records.length}개 적재 완료`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
