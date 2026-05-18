CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE facilities (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  road_address TEXT,
  phone TEXT,
  district TEXT,
  location GEOGRAPHY(POINT, 4326),
  metadata JSONB DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_district ON facilities(district);

CREATE TABLE metro_accessibility (
  id BIGSERIAL PRIMARY KEY,
  line TEXT NOT NULL,
  station_name TEXT NOT NULL,
  nursing_room BOOLEAN DEFAULT false,
  elevator_inner INT DEFAULT 0,
  elevator_outer INT DEFAULT 0,
  wheelchair_lift INT DEFAULT 0,
  escalator INT DEFAULT 0,
  outer_ramp INT DEFAULT 0,
  location GEOGRAPHY(POINT, 4326)
);

CREATE TABLE pedestrian_roads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  district TEXT,
  start_lat DOUBLE PRECISION,
  start_lng DOUBLE PRECISION,
  end_lat DOUBLE PRECISION,
  end_lng DOUBLE PRECISION,
  start_point GEOGRAPHY(POINT, 4326),
  end_point GEOGRAPHY(POINT, 4326),
  distance_m NUMERIC,
  road_width NUMERIC,
  speed_limit INT DEFAULT 30
);

CREATE TABLE benefits (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  provider TEXT,
  eligibility JSONB DEFAULT '{}',
  amount TEXT,
  description TEXT,
  how_to_apply TEXT,
  url TEXT,
  embedding VECTOR(1536)
);

CREATE TABLE meal_card_stores (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  category TEXT,
  location GEOGRAPHY(POINT, 4326),
  updated_at DATE
);

-- RLS
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON facilities FOR SELECT USING (true);
ALTER TABLE metro_accessibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON metro_accessibility FOR SELECT USING (true);
ALTER TABLE pedestrian_roads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON pedestrian_roads FOR SELECT USING (true);
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON benefits FOR SELECT USING (true);
ALTER TABLE meal_card_stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON meal_card_stores FOR SELECT USING (true);
