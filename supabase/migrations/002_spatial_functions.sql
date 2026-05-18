CREATE OR REPLACE FUNCTION nearby_facilities(
  lat double precision, lng double precision, radius_m double precision, facility_types text[] DEFAULT NULL
)
RETURNS TABLE(
  id bigint, type text, name text, address text, road_address text, phone text,
  district text, lat double precision, lng double precision, metadata jsonb, distance_m double precision
) AS $$
  SELECT f.id, f.type, f.name, f.address, f.road_address, f.phone, f.district,
    ST_Y(f.location::geometry) as lat, ST_X(f.location::geometry) as lng,
    f.metadata,
    ST_Distance(f.location, ST_MakePoint(lng, lat)::geography) as distance_m
  FROM facilities f
  WHERE ST_DWithin(f.location, ST_MakePoint(lng, lat)::geography, radius_m)
  AND (facility_types IS NULL OR f.type = ANY(facility_types))
  ORDER BY ST_Distance(f.location, ST_MakePoint(lng, lat)::geography)
  LIMIT 100;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION nearby_metro_stations(
  lat double precision, lng double precision, radius_m double precision DEFAULT 3000
)
RETURNS TABLE(
  id bigint, line text, station_name text, nursing_room boolean,
  elevator_inner integer, elevator_outer integer, wheelchair_lift integer,
  escalator integer, outer_ramp integer,
  lat double precision, lng double precision, distance_m double precision
) AS $$
  SELECT m.id, m.line, m.station_name, m.nursing_room,
    m.elevator_inner, m.elevator_outer, m.wheelchair_lift, m.escalator, m.outer_ramp,
    ST_Y(m.location::geometry), ST_X(m.location::geometry),
    ST_Distance(m.location, ST_MakePoint(lng, lat)::geography)
  FROM metro_accessibility m
  WHERE m.location IS NOT NULL
  AND ST_DWithin(m.location, ST_MakePoint(lng, lat)::geography, radius_m)
  ORDER BY ST_Distance(m.location, ST_MakePoint(lng, lat)::geography);
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION nearby_meal_stores(
  lat double precision, lng double precision, radius_m double precision DEFAULT 1000
)
RETURNS TABLE(
  id bigint, name text, address text, phone text, category text,
  lat double precision, lng double precision, distance_m double precision
) AS $$
  SELECT ms.id, ms.name, ms.address, ms.phone, ms.category,
    ST_Y(ms.location::geometry), ST_X(ms.location::geometry),
    ST_Distance(ms.location, ST_MakePoint(lng, lat)::geography)
  FROM meal_card_stores ms
  WHERE ms.location IS NOT NULL
  AND ST_DWithin(ms.location, ST_MakePoint(lng, lat)::geography, radius_m)
  ORDER BY ST_Distance(ms.location, ST_MakePoint(lng, lat)::geography)
  LIMIT 50;
$$ LANGUAGE sql STABLE;
