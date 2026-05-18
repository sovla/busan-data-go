'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Facility, FacilityType } from '@/types/facility';
import { Phone, Navigation, MapPin, Clock, Info } from 'lucide-react';

const TYPE_LABELS: Record<FacilityType, string> = {
  nursing_room: '수유실',
  kids_cafe: '키즈카페',
  postpartum: '산후조리원',
  daycare: '어린이집',
  hospital: '병원',
};

const TYPE_CONFIG: Record<
  FacilityType,
  { emoji: string; barClass: string; badgeClass: string }
> = {
  nursing_room: {
    emoji: '🍼',
    barClass: 'bg-gradient-to-r from-rose-400 to-pink-400',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  kids_cafe: {
    emoji: '🎪',
    barClass: 'bg-gradient-to-r from-violet-400 to-purple-400',
    badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  postpartum: {
    emoji: '🏥',
    barClass: 'bg-gradient-to-r from-sky-400 to-blue-400',
    badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  daycare: {
    emoji: '🏫',
    barClass: 'bg-gradient-to-r from-emerald-400 to-green-400',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  hospital: {
    emoji: '⚕️',
    barClass: 'bg-gradient-to-r from-amber-400 to-orange-400',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
};

const METADATA_LABELS: Record<string, { label: string; icon: string }> = {
  floor: { label: '층', icon: '🏢' },
  hours: { label: '운영시간', icon: '🕐' },
  facilities: { label: '편의시설', icon: '✨' },
  capacity: { label: '정원', icon: '👶' },
  age_range: { label: '이용연령', icon: '📅' },
  price: { label: '이용요금', icon: '💰' },
  price_range: { label: '가격대', icon: '💰' },
  cctv: { label: 'CCTV', icon: '📹' },
  rating: { label: '평점', icon: '⭐' },
  type: { label: '유형', icon: '🏷️' },
  specialty: { label: '전문과', icon: '🩺' },
  emergency: { label: '응급실', icon: '🚨' },
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
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[72vh] overflow-y-auto p-0">
        {facility && config && (
          <>
            {/* 시설 유형별 컬러 바 */}
            <div className={`h-1.5 w-full rounded-t-2xl ${config.barClass}`} />

            <div className="px-5 pt-4 pb-6">
              <SheetHeader className="pb-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      className={`mb-1.5 text-xs font-medium border px-2 py-0.5 rounded-full ${config.badgeClass}`}
                    >
                      {TYPE_LABELS[facility.type]}
                    </Badge>
                    <SheetTitle className="text-lg font-bold text-slate-900 leading-tight">
                      {facility.name}
                    </SheetTitle>
                  </div>
                </div>
              </SheetHeader>

              {/* 기본 정보 */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-700 leading-snug">
                      {facility.road_address || facility.address}
                    </p>
                    {facility.district && (
                      <p className="text-xs text-slate-400 mt-0.5">{facility.district}</p>
                    )}
                  </div>
                </div>

                {facility.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-slate-700">{facility.phone}</p>
                  </div>
                )}
              </div>

              {/* 메타데이터 */}
              {metadataEntries.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-3.5 mb-5 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      상세 정보
                    </span>
                  </div>
                  {metadataEntries.map(([key, value]) => {
                    const meta = METADATA_LABELS[key];
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <span className="text-sm">{meta?.icon ?? '•'}</span>
                          <span>{meta?.label ?? key}</span>
                        </span>
                        <span className="text-slate-800 font-medium text-right max-w-[55%]">
                          {renderMetadataValue(key, value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 하단 버튼 */}
              <div className="flex gap-2.5">
                {facility.phone && (
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="flex-1 gap-2 h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Phone className="w-4 h-4" />
                    전화 걸기
                  </Button>
                )}
                <Button
                  onClick={handleDirections}
                  className="flex-1 gap-2 h-11 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white font-semibold shadow-sm shadow-green-200"
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
