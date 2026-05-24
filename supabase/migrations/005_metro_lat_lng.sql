ALTER TABLE metro_accessibility ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE metro_accessibility ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

CREATE OR REPLACE FUNCTION get_metro_stations()
RETURNS TABLE(
  id bigint, line text, station_name text, nursing_room boolean,
  elevator_inner integer, elevator_outer integer, wheelchair_lift integer,
  escalator integer, outer_ramp integer,
  lat double precision, lng double precision
) AS $$
  SELECT m.id, m.line, m.station_name, m.nursing_room,
    m.elevator_inner, m.elevator_outer, m.wheelchair_lift, m.escalator, m.outer_ramp,
    m.lat, m.lng
  FROM metro_accessibility m
  WHERE m.lat IS NOT NULL
  ORDER BY m.line, m.id;
$$ LANGUAGE sql STABLE;
