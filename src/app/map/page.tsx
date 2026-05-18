'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { Facility, FacilityType } from '@/types/facility';
import { FacilityMap } from '@/components/map/FacilityMap';
import { FacilityFilter } from '@/components/map/FacilityFilter';
import { FacilityDetail } from '@/components/map/FacilityDetail';

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
        onLoad={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="flex flex-col h-screen">
        <div className="p-3 bg-white border-b z-10">
          <h1 className="text-lg font-bold text-gray-900 mb-2">맘편한 부산 시설 지도</h1>
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
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500 text-sm">지도를 불러오는 중...</p>
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
