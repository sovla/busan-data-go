'use client';

import { FacilityType } from '@/types/facility';

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

  const radiusLabel = RADIUS_OPTIONS.find((o) => o.value === radius)?.label ?? '3km';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {FACILITY_TYPES.map(({ type, label }) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`
                inline-flex items-center h-8 px-3 rounded-full text-xs font-medium
                border transition-all duration-150 whitespace-nowrap
                active:scale-95
                ${isSelected
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#9CA3AF]'
                }
              `}
            >
              {label}
            </button>
          );
        })}
        <div className="flex items-center gap-1">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onRadiusChange(opt.value)}
              className={`
                h-7 px-2.5 rounded-full text-[11px] font-medium
                transition-all duration-150 active:scale-95
                ${radius === opt.value
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280]'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
