'use client';

import { FacilityType } from '@/types/facility';

const FACILITY_TYPES: { type: FacilityType; label: string; color: string }[] = [
  { type: 'nursing_room', label: '수유실', color: '#FF6B6B' },
  { type: 'kids_cafe', label: '키즈카페', color: '#4ECDC4' },
  { type: 'postpartum', label: '산후조리원', color: '#9B59B6' },
  { type: 'daycare', label: '어린이집', color: '#2ECC71' },
  { type: 'hospital', label: '병원', color: '#F39C12' },
  { type: 'atopy_school', label: '안심학교', color: '#3B82F6' },
  { type: 'meal_store', label: '급식가맹점', color: '#EC4899' },
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
  typeCounts?: Partial<Record<FacilityType, number>>;
}

const ALL_TYPES = FACILITY_TYPES.map((t) => t.type);

export function FacilityFilter({
  selectedTypes,
  onTypesChange,
  radius,
  onRadiusChange,
  typeCounts,
}: FacilityFilterProps) {
  const toggleType = (type: FacilityType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const allSelected = selectedTypes.length === ALL_TYPES.length;
  const handleToggleAll = () => {
    onTypesChange(allSelected ? [] : ALL_TYPES);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto -mx-1 px-1 scrollbar-hide">
        <div className="flex items-center gap-1.5 w-max">
          <button
            type="button"
            onClick={handleToggleAll}
            className={`
              inline-flex items-center h-8 px-3 rounded-full text-xs font-medium
              border transition-all duration-150 whitespace-nowrap
              active:scale-95
              ${allSelected
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A] hover:bg-gray-50'
              }
            `}
          >
            {allSelected ? '전체 해제' : '전체 선택'}
          </button>
          {FACILITY_TYPES.map(({ type, label, color }) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`
                  inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium
                  border transition-all duration-150 whitespace-nowrap
                  active:scale-95
                  ${isSelected
                    ? 'text-white border-transparent'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }
                `}
                style={isSelected ? { backgroundColor: color } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.85)' : color }}
                />
                {label}
                {typeCounts && typeCounts[type] !== undefined && (
                  <span
                    className={`ml-0.5 text-[10px] font-semibold ${isSelected ? 'text-white/90' : 'text-gray-400'}`}
                  >
                    {typeCounts[type]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
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
  );
}
