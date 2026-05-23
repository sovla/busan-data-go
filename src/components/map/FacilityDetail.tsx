'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Facility, FacilityType } from '@/types/facility';
import { Phone, Navigation, MapPin, Info, Baby, Coffee, Heart, School, Stethoscope, Shield, UtensilsCrossed } from 'lucide-react';

const TYPE_LABELS: Record<FacilityType, string> = {
  nursing_room: '수유실',
  kids_cafe: '키즈카페',
  postpartum: '산후조리원',
  daycare: '어린이집',
  hospital: '병원',
  atopy_school: '안심학교',
  meal_store: '급식가맹점',
};

const TYPE_CONFIG: Record<FacilityType, { icon: React.ReactNode; color: string; bg: string }> = {
  nursing_room: {
    icon: <Baby className="w-5 h-5" />,
    color: '#FF6B6B',
    bg: '#FFF0F0',
  },
  kids_cafe: {
    icon: <Coffee className="w-5 h-5" />,
    color: '#4ECDC4',
    bg: '#F0FDFB',
  },
  postpartum: {
    icon: <Heart className="w-5 h-5" />,
    color: '#9B59B6',
    bg: '#F8F0FF',
  },
  daycare: {
    icon: <School className="w-5 h-5" />,
    color: '#2ECC71',
    bg: '#F0FFF4',
  },
  hospital: {
    icon: <Stethoscope className="w-5 h-5" />,
    color: '#F39C12',
    bg: '#FFF8E7',
  },
  atopy_school: {
    icon: <Shield className="w-5 h-5" />,
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  meal_store: {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    color: '#EC4899',
    bg: '#FDF2F8',
  },
};

const METADATA_LABELS: Record<string, string> = {
  floor: '층',
  hours: '운영시간',
  facilities: '편의시설',
  capacity: '정원',
  age_range: '이용연령',
  price: '이용요금',
  price_range: '가격대',
  cctv: 'CCTV',
  rating: '평점',
  type: '유형',
  specialty: '전문과',
  emergency: '응급실',
};

interface FacilityDetailProps {
  facility: Facility | null;
  onClose: () => void;
}

export function FacilityDetail({ facility, onClose }: FacilityDetailProps) {
  const handleCall = () => {
    if (facility?.phone) {
      window.location.href = `tel:${facility.phone}`;
    }
  };

  const handleDirections = () => {
    if (!facility) return;
    const url = `https://map.naver.com/v5/directions/-/-/-/transit?c=${facility.lng},${facility.lat},15,0,0,0,dh`;
    window.open(url, '_blank');
  };

  const renderMetadataValue = (key: string, value: unknown): string => {
    if (typeof value === 'boolean') return value ? '있음' : '없음';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  const config = facility ? TYPE_CONFIG[facility.type] : null;
  const metadataEntries = facility ? Object.entries(facility.metadata) : [];

  return (
    <Sheet open={!!facility} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] max-h-[72vh] overflow-y-auto p-0"
        style={{ transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {facility && config && (
          <>
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-gray-300" />
            </div>

            <div className="px-5 pt-3 pb-6">
              <SheetHeader className="pb-4 text-left">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium mb-1"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      {TYPE_LABELS[facility.type]}
                    </span>
                    <SheetTitle className="text-base font-semibold text-[#1A1A1A] leading-tight">
                      {facility.name}
                    </SheetTitle>
                  </div>
                </div>
              </SheetHeader>

              {/* 기본 정보 */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#9CA3AF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#1A1A1A] leading-snug text-sm">
                      {facility.road_address || facility.address}
                    </p>
                    {facility.district && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{facility.district}</p>
                    )}
                  </div>
                </div>

                {facility.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                    <p className="text-[#1A1A1A] text-sm">{facility.phone}</p>
                  </div>
                )}
              </div>

              {/* 메타데이터 */}
              {metadataEntries.length > 0 && (
                <div className="bg-[#F8F8F8] rounded-2xl p-3.5 mb-5 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      상세 정보
                    </span>
                  </div>
                  {metadataEntries.map(([key, value], index) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm transition-all duration-300"
                      style={{ transitionDelay: `${index * 40}ms` }}
                    >
                      <span className="text-[#6B7280]">
                        {METADATA_LABELS[key] ?? key}
                      </span>
                      <span className="text-[#1A1A1A] font-medium text-right max-w-[55%]">
                        {renderMetadataValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 하단 버튼 */}
              <div className="flex gap-2.5">
                {facility.phone && (
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-[#F3F4F6] text-[#6B7280] hover:bg-gray-50"
                  >
                    <Phone className="w-4 h-4" />
                    전화 걸기
                  </Button>
                )}
                <Button
                  onClick={handleDirections}
                  className="flex-1 gap-2 h-12 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: '#03C75A' }}
                >
                  <Navigation className="w-4 h-4" />
                  길찾기
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
