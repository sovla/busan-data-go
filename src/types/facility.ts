export type FacilityType = 'nursing_room' | 'kids_cafe' | 'postpartum' | 'daycare' | 'hospital' | 'atopy_school' | 'meal_store';

export interface Facility {
  id: number;
  type: FacilityType;
  name: string;
  address: string;
  road_address?: string;
  phone?: string;
  district: string;
  lat: number;
  lng: number;
  metadata: Record<string, unknown>;
  distance_m?: number;
}
