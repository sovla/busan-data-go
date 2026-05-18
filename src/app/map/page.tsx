'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { Facility, FacilityType } from '@/types/facility';
import { FacilityMap } from '@/components/map/FacilityMap';
import { FacilityFilter } from '@/components/map/FacilityFilter';
import { FacilityDetail } from '@/components/map/FacilityDetail';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

const ALL_TYPES: FacilityType[] = ['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital'];

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>(ALL_TYPES);
  const [radius, setRadius] = useState('5000');
  const [naverLoaded, setNaverLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 35.1796,
    lng: 129.0756,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // 권한 거부 시 부산 시청 기본값 유지
        }
      );
    }
  }, []);

  const fetchFacilities = useCallback(async () => {
    const types = selectedTypes.join(',');
    const res = await fetch(
      `/api/facilities?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}&types=${types}`
    );
    const data = await res.json();
    setFacilities(data.facilities ?? []);
  }, [selectedTypes, radius, userLocation]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <PageTransition>
      <div className="flex flex-col h-screen">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-100 z-10 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FFF8F0] flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
              </div>
              <h1 className="text-base font-bold text-gray-900">
                주변 시설
              </h1>
            </div>
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
              주변 {facilities.length}개 시설
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mb-3 pl-9">내 주변 시설을 찾아보세요</p>
          <FacilityFilter
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            radius={radius}
            onRadiusChange={setRadius}
          />
        </div>

        <div className="flex-1 relative">
          {naverLoaded ? (
            <FacilityMap
              facilities={facilities}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mb-3" />
              <p className="text-gray-400 text-sm">지도를 불러오는 중...</p>
            </div>
          )}
        </div>

        <FacilityDetail
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      </div>
      </PageTransition>
    </>
  );
}
