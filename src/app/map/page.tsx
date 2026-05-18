'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { Facility, FacilityType } from '@/types/facility';
import { FacilityMap } from '@/components/map/FacilityMap';
import { FacilityFilter } from '@/components/map/FacilityFilter';
import { FacilityDetail } from '@/components/map/FacilityDetail';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const ALL_TYPES: FacilityType[] = ['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital'];

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>(ALL_TYPES);
  const [radius, setRadius] = useState('5000');
  const [naverLoaded, setNaverLoaded] = useState(false);

  const fetchFacilities = useCallback(async () => {
    const types = selectedTypes.join(',');
    const res = await fetch(
      `/api/facilities?lat=35.1796&lng=129.0756&radius=${radius}&types=${types}`
    );
    const data = await res.json();
    setFacilities(data.facilities ?? []);
  }, [selectedTypes, radius]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="flex flex-col h-screen">
        {/* 그라디언트 헤더 */}
        <div className="bg-gradient-to-r from-sky-100 via-pink-50 to-violet-100 border-b border-violet-100 z-10 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-violet-400 flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h1 className="text-base font-bold bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
                맘편한 부산
              </h1>
            </div>
            <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs font-medium px-2.5 py-1 rounded-full">
              주변 {facilities.length}개 시설
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mb-3 pl-9">AI가 추천하는 내 주변 시설</p>
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
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-violet-50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-violet-200 animate-pulse mb-3" />
              <p className="text-slate-400 text-sm">지도를 불러오는 중...</p>
            </div>
          )}
        </div>

        <FacilityDetail
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      </div>
    </>
  );
}
