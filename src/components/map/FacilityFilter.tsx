'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FacilityType } from '@/types/facility';

const TYPE_COLORS: Record<FacilityType, { color: string; bg: string }> = {
  nursing_room: { color: '#FF6B6B', bg: '#FFF0F0' },
  kids_cafe: { color: '#4ECDC4', bg: '#F0FDFB' },
  postpartum: { color: '#9B59B6', bg: '#F8F0FF' },
  daycare: { color: '#2ECC71', bg: '#F0FFF4' },
  hospital: { color: '#F39C12', bg: '#FFF8E7' },
};

const FACILITY_TYPES: { type: FacilityType; label: string }[] = [
  { type: 'nursing_room', label: '수유실' },
  { type: 'kids_cafe', label: '키즈카페' },
  { type: 'postpartum', label: '산후조리원' },
  { type: 'daycare', label: '어린이집' },
  { type: 'hospital', label: '병원' },
];

const RADIUS_OPTIONS = [
  { value: '500', label: '500m' },
  { value: '1000', label: '1km' },
  { value: '3000', label: '3km' },
  { value: '5000', label: '5km' },
];

interface FacilityFilterProps {
  selectedTypes: FacilityType[];
  onTypesChange: (types: FacilityType[]) => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
}

export function FacilityFilter({
  selectedTypes,
  onTypesChange,
  radius,
  onRadiusChange,
}: FacilityFilterProps) {
  const toggleType = (type: FacilityType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5 flex-1">
        {FACILITY_TYPES.map(({ type, label }) => {
          const isSelected = selectedTypes.includes(type);
          const { color, bg } = TYPE_COLORS[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className="inline-flex items-center h-8 px-3 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer select-none active:scale-95"
              style={
                isSelected
                  ? { backgroundColor: color, color: '#fff', borderColor: color }
                  : { backgroundColor: bg, color: color, borderColor: color + '40' }
              }
            >
              {label}
            </button>
          );
        })}
      </div>
      <Select value={radius} onValueChange={(value) => value !== null && onRadiusChange(value)}>
        <SelectTrigger className="w-20 h-8 text-xs border-[#F3F4F6] rounded-full bg-white shrink-0">
          <SelectValue placeholder="반경" />
        </SelectTrigger>
        <SelectContent>
          {RADIUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
