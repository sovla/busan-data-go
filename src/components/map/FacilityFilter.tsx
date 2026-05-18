'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FacilityType } from '@/types/facility';

const FACILITY_TYPES: {
  type: FacilityType;
  label: string;
  emoji: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    type: 'nursing_room',
    label: '수유실',
    emoji: '🍼',
    activeClass: 'bg-rose-500 text-white border-rose-500 shadow-rose-200 shadow-sm',
    inactiveClass: 'bg-white text-rose-500 border-rose-300 hover:bg-rose-50',
  },
  {
    type: 'kids_cafe',
    label: '키즈카페',
    emoji: '🎪',
    activeClass: 'bg-violet-500 text-white border-violet-500 shadow-violet-200 shadow-sm',
    inactiveClass: 'bg-white text-violet-500 border-violet-300 hover:bg-violet-50',
  },
  {
    type: 'postpartum',
    label: '산후조리원',
    emoji: '🏥',
    activeClass: 'bg-sky-500 text-white border-sky-500 shadow-sky-200 shadow-sm',
    inactiveClass: 'bg-white text-sky-500 border-sky-300 hover:bg-sky-50',
  },
  {
    type: 'daycare',
    label: '어린이집',
    emoji: '🏫',
    activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-200 shadow-sm',
    inactiveClass: 'bg-white text-emerald-500 border-emerald-300 hover:bg-emerald-50',
  },
  {
    type: 'hospital',
    label: '병원',
    emoji: '⚕️',
    activeClass: 'bg-amber-500 text-white border-amber-500 shadow-amber-200 shadow-sm',
    inactiveClass: 'bg-white text-amber-500 border-amber-300 hover:bg-amber-50',
  },
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
        {FACILITY_TYPES.map(({ type, label, emoji, activeClass, inactiveClass }) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`
                inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                border transition-all duration-150 cursor-pointer select-none
                ${isSelected ? activeClass : inactiveClass}
              `}
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      <Select value={radius} onValueChange={(value) => value !== null && onRadiusChange(value)}>
        <SelectTrigger className="w-20 h-7 text-xs border-slate-200 rounded-full bg-white shrink-0">
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
