'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Facility, FacilityType } from '@/types/facility';
import { Phone, Navigation, X } from 'lucide-react';

const TYPE_LABELS: Record<FacilityType, string> = {
  nursing_room: '수유실',
  kids_cafe: '키즈카페',
  postpartum: '산후조리원',
  daycare: '어린이집',
  hospital: '병원',
};

const TYPE_COLORS: Record<FacilityType, string> = {
  nursing_room: 'bg-pink-100 text-pink-700',
  kids_cafe: 'bg-yellow-100 text-yellow-700',
  postpartum: 'bg-purple-100 text-purple-700',
  daycare: 'bg-blue-100 text-blue-700',
  hospital: 'bg-green-100 text-green-700',
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

  return (
    <Sheet open={!!facility} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh] overflow-y-auto">
        {facility && (
          <>
            <SheetHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={`mb-2 text-xs font-medium border-0 ${TYPE_COLORS[facility.type]}`}>
                    {TYPE_LABELS[facility.type]}
                  </Badge>
                  <SheetTitle className="text-lg font-bold text-gray-900 leading-tight">
                    {facility.name}
                  </SheetTitle>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">주소</p>
                <p>{facility.road_address || facility.address}</p>
                <p className="text-xs text-gray-400 mt-0.5">{facility.district}</p>
              </div>

              {facility.phone && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-800">전화번호</p>
                  <p>{facility.phone}</p>
                </div>
              )}

              {Object.keys(facility.metadata).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  {Object.entries(facility.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{METADATA_LABELS[key] || key}</span>
                      <span className="text-gray-800 font-medium">
                        {renderMetadataValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {facility.phone && (
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    전화걸기
                  </Button>
                )}
                <Button
                  onClick={handleDirections}
                  className="flex-1 gap-2 bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Navigation className="w-4 h-4" />
                  네이버 지도 길찾기
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
