import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type DaycareRow = {
  name: string;
  district: string;
  type: string;
  address: string;
  phone: string | null;
  capacity: number | null;
  staff: number | null;
  lat: number | null;
  lng: number | null;
  vehicle: string | null;
};

async function main() {
  const filepath = path.join(process.cwd(), 'data', 'processed', 'daycares.json');
  const rows: DaycareRow[] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  console.log(`소스 어린이집: ${rows.length}개`);

  console.log('기존 daycare 삭제 중...');
  const { error: deleteError } = await supabase
    .from('facilities')
    .delete()
    .eq('type', 'daycare');
  if (deleteError) {
    console.error('삭제 실패:', deleteError);
    process.exit(1);
  }

  const records = rows
    .filter((r) => r.lat && r.lng && r.name)
    .map((r) => ({
      type: 'daycare' as const,
      name: r.name,
      address: r.address,
      district: r.district,
      phone: r.phone,
      location: `SRID=4326;POINT(${r.lng} ${r.lat})`,
      metadata: {
        daycare_type: r.type,
        capacity: r.capacity,
        staff: r.staff,
        vehicle: r.vehicle,
      },
      source: 'daycares-all.xls',
    }));

  console.log(`적재 대상: ${records.length}개`);

  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const chunk = records.slice(i, i + BATCH);
    const { error } = await supabase.from('facilities').insert(chunk);
    if (error) {
      console.error(`청크 ${i}-${i + chunk.length} 실패:`, error.message);
      process.exit(1);
    }
    inserted += chunk.length;
    console.log(`  ${inserted}/${records.length}`);
  }

  console.log(`✅ daycare ${inserted}개 적재 완료`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
