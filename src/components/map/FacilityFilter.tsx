'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FacilityType } from '@/types/facility';

const FACILITY_TYPES: { type: FacilityType; label: string; emoji: string }[] = [
  { type: 'nursing_room', label: '수유실', emoji: '🍼' },
  { type: 'kids_cafe', label: '키즈카페', emoji: '🎠' },
  { type: 'postpartum', label: '산후조리원', emoji: '🏥' },
  { type: 'daycare', label: '어린이집', emoji: '🏫' },
  { type: 'hospital', label: '병원', emoji: '💊' },
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
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-3">
        {FACILITY_TYPES.map(({ type, label, emoji }) => (
          <label
            key={type}
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <Checkbox
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => toggleType(type)}
              id={`filter-${type}`}
            />
            <span className="text-sm font-medium text-gray-700">
              {emoji} {label}
            </span>
          </label>
        ))}
      </div>
      <div className="ml-auto">
        <Select value={radius} onValueChange={(value) => value !== null && onRadiusChange(value)}>
          <SelectTrigger className="w-24 h-8 text-sm">
            <SelectValue placeholder="반경" />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
