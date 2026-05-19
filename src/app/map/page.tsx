'use client';

import { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import { Facility, FacilityType } from '@/types/facility';
import { FacilityMap } from '@/components/map/FacilityMap';
import { FacilityFilter } from '@/components/map/FacilityFilter';
import { FacilityDetail } from '@/components/map/FacilityDetail';
import { MapPin, Phone, Navigation, ChevronUp } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_TYPES: FacilityType[] = ['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital'];

const TYPE_LABELS: Record<FacilityType, string> = {
  nursing_room: '수유실', kids_cafe: '키즈카페', postpartum: '산후조리원',
  daycare: '어린이집', hospital: '병원',
};
const TYPE_COLORS: Record<FacilityType, string> = {
  nursing_room: '#FF6B6B', kids_cafe: '#4ECDC4', postpartum: '#9B59B6',
  daycare: '#2ECC71', hospital: '#F39C12',
};

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>(ALL_TYPES);
  const [radius, setRadius] = useState('3000');
  const [naverLoaded, setNaverLoaded] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 35.1796, lng: 129.0756 });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
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

  useEffect(() => { fetchFacilities(); }, [fetchFacilities]);

  const formatDistance = (m: number) => m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <PageTransition>
      <div className="flex flex-col h-[100dvh]">
        {/* 헤더 */}
        <div className="bg-white border-b border-[#F3F4F6] z-10">
          <div className="h-12 px-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#1A1A1A]">주변 시설</h1>
            <span className="text-xs text-[#9CA3AF]">{facilities.length}개 시설</span>
          </div>
          <div className="px-4 pb-3">
            <FacilityFilter
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              radius={radius}
              onRadiusChange={setRadius}
            />
          </div>
        </div>

        {/* 지도 영역 */}
        <div className={`relative transition-all duration-300 ${listExpanded ? 'h-[35vh]' : 'h-[55vh]'}`}>
          {naverLoaded ? (
            <FacilityMap
              facilities={facilities}
              selectedFacility={selectedFacility}
              onSelectFacility={setSelectedFacility}
              userLocation={userLocation}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F8F8F8]">
              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] animate-pulse" />
            </div>
          )}
        </div>

        {/* 시설 리스트 패널 */}
        <div className="flex-1 bg-white border-t border-[#F3F4F6] overflow-hidden flex flex-col">
          <button
            onClick={() => setListExpanded(!listExpanded)}
            className="flex items-center justify-center py-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronUp className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${listExpanded ? '' : 'rotate-180'}`} />
          </button>

          <div className="flex-1 overflow-y-auto px-4 pb-20">
            <AnimatePresence>
              {facilities.length === 0 ? (
                <div className="text-center py-8 text-[#9CA3AF] text-sm">
                  주변에 시설이 없습니다. 반경을 넓혀보세요.
                </div>
              ) : (
                <div className="space-y-1">
                  {facilities.slice(0, 30).map((f, idx) => (
                    <motion.button
                      key={f.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      onClick={() => setSelectedFacility(f)}
                      className={`w-full min-h-[72px] flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all hover:bg-[#F8F8F8] active:scale-[0.98] ${
                        selectedFacility?.id === f.id ? 'bg-[#F8F8F8] ring-1 ring-[#F3F4F6]' : ''
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${TYPE_COLORS[f.type]}15` }}
                      >
                        <MapPin className="h-4 w-4" style={{ color: TYPE_COLORS[f.type] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1A1A1A] truncate">{f.name}</span>
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              color: TYPE_COLORS[f.type],
                              backgroundColor: `${TYPE_COLORS[f.type]}15`,
                            }}
                          >
                            {TYPE_LABELS[f.type]}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{f.address}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {f.distance_m && (
                            <span className="text-[11px] text-[#FF6B6B] font-medium">
                              {formatDistance(f.distance_m)}
                            </span>
                          )}
                          {f.phone && (
                            <a
                              href={`tel:${f.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-0.5 text-[11px] text-[#9CA3AF] hover:text-[#FF6B6B]"
                            >
                              <Phone className="h-3 w-3" />
                              {f.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <Navigation className="h-3.5 w-3.5 text-[#9CA3AF] flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
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
