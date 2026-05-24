-- benefits 테이블 컬럼 추가
ALTER TABLE benefits ADD COLUMN IF NOT EXISTS amount_value INTEGER DEFAULT 0;
ALTER TABLE benefits ADD COLUMN IF NOT EXISTS exclusion_group TEXT;
ALTER TABLE benefits ADD COLUMN IF NOT EXISTS exclude_when_pregnant BOOLEAN DEFAULT false;

-- dongbaek_stores 테이블 생성
CREATE TABLE IF NOT EXISTS dongbaek_stores (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dongbaek_category ON dongbaek_stores(category);
CREATE INDEX IF NOT EXISTS idx_dongbaek_district ON dongbaek_stores(district);
ALTER TABLE dongbaek_stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON dongbaek_stores FOR SELECT USING (true);
