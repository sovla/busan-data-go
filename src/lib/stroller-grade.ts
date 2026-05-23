export type StationGrade = 'safe' | 'normal' | 'caution';

export const GRADE_COLORS: Record<StationGrade, string> = {
  safe: '#2ECC71',
  normal: '#F39C12',
  caution: '#FF6B6B',
};

export const GRADE_LABELS: Record<StationGrade, string> = {
  safe: '유모차 이용이 편리합니다',
  normal: '엘리베이터가 있어 이용 가능합니다',
  caution: '엘리베이터가 부족하여 주의가 필요합니다',
};

interface StationLike {
  elevator_inner?: number | null;
  elevator_outer?: number | null;
  outer_ramp?: number | null;
}

export function getStationGrade(station: StationLike): StationGrade {
  const el = (station.elevator_inner ?? 0) + (station.elevator_outer ?? 0);
  if (el >= 4 && (station.outer_ramp ?? 0) >= 2) return 'safe';
  if (el >= 3) return 'normal';
  return 'caution';
}
