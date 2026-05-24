'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Script from 'next/script';
import { Facility, FacilityType } from '@/types/facility';
import { FacilityMap } from '@/components/map/FacilityMap';
import { FacilityFilter } from '@/components/map/FacilityFilter';
import { MapPin, Phone, Navigation, X, List, Baby, Puzzle, HeartPulse, GraduationCap, Stethoscope, Shield, UtensilsCrossed, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

const ALL_TYPES: FacilityType[] = ['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital', 'atopy_school', 'meal_store'];

const TYPE_ICONS: Record<FacilityType, LucideIcon> = {
  nursing_room: Baby,
  kids_cafe: Puzzle,
  postpartum: HeartPulse,
  daycare: GraduationCap,
  hospital: Stethoscope,
  atopy_school: Shield,
  meal_store: UtensilsCrossed,
};

const TYPE_LABELS: Record<FacilityType, string> = {
  nursing_room: '수유실', kids_cafe: '키즈카페', postpartum: '산후조리원',
  daycare: '어린이집', hospital: '병원', atopy_school: '안심학교', meal_store: '급식가맹점',
};
const TYPE_COLORS: Record<FacilityType, string> = {
  nursing_room: '#FF6B6B', kids_cafe: '#4ECDC4', postpartum: '#9B59B6',
  daycare: '#2ECC71', hospital: '#F39C12', atopy_school: '#3B82F6', meal_store: '#EC4899',
};

type ViewMode = 'map' | 'list';

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [radius, setRadius] = useState('3000');
  const [naverLoaded, setNaverLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [userLocation, setUserLocation] = useState({ lat: 35.1796, lng: 129.0756 });
  const [locationReady, setLocationReady] = useState(false);
  const [locationFallback, setLocationFallback] = useState(false);
  const [mapMoved, setMapMoved] = useState(false);
  const [pendingCenter, setPendingCenter] = useState<{ lat: number; lng: number } | null>(null);
  const mapPanRef = useRef<((lat: number, lng: number) => void) | null>(null);
  const handleMapPanReady = useCallback((fn: (lat: number, lng: number) => void) => {
    mapPanRef.current = fn;
  }, []);

  const handleCenterChanged = useCallback((newLat: number, newLng: number) => {
    setPendingCenter({ lat: newLat, lng: newLng });
    setMapMoved(true);
  }, []);

  const handleSearchHere = useCallback(() => {
    if (!pendingCenter) return;
    setUserLocation(pendingCenter);
    setMapMoved(false);
    setPendingCenter(null);
  }, [pendingCenter]);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationReady(true);
        },
        () => {
          setLocationFallback(true);
          setLocationReady(true);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationFallback(true);
      setLocationReady(true);
    }
    const param = new URLSearchParams(window.location.search).get('type');
    if (param) {
      const requested = param.split(',').filter((t) => (ALL_TYPES as string[]).includes(t)) as FacilityType[];
      setSelectedTypes(requested.length > 0 ? requested : ALL_TYPES);
    } else {
      setSelectedTypes(ALL_TYPES);
    }
  }, []);

  const fetchFacilities = useCallback(async () => {
    if (!locationReady || selectedTypes.length === 0) {
      if (selectedTypes.length === 0) setFacilities([]);
      return;
    }
    const types = selectedTypes.join(',');
    const res = await fetch(
      `/api/facilities?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${radius}&types=${types}`
    );
    const data = await res.json();
    setFacilities(data.facilities ?? []);
  }, [selectedTypes, radius, userLocation, locationReady]);

  useEffect(() => { fetchFacilities(); }, [fetchFacilities]);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<FacilityType, number>> = {};
    for (const f of facilities) {
      counts[f.type] = (counts[f.type] ?? 0) + 1;
    }
    return counts;
  }, [facilities]);

  const radiusLabel = useMemo(() => {
    const m = parseInt(radius, 10);
    return m >= 1000 ? `${m / 1000}km` : `${m}m`;
  }, [radius]);

  const formatDistance = (m: number) => m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;

  const handleListItemClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setViewMode('map');
    if (mapPanRef.current) {
      mapPanRef.current(facility.lat, facility.lng);
    }
  };

  const renderList = (animate: boolean) => {
    if (facilities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-[#9CA3AF]" />
          </div>
          <p className="text-sm font-medium text-[#1A1A1A]">검색 반경에 시설이 없어요</p>
          <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">반경을 더 넓히거나<br/>필터를 추가해보세요</p>
        </div>
      );
    }
    const sorted = [...facilities].sort((a, b) => {
      const da = a.distance_m ?? Number.MAX_SAFE_INTEGER;
      const db = b.distance_m ?? Number.MAX_SAFE_INTEGER;
      return da - db;
    });
    const display = sorted.slice(0, 50);
    return (
      <div className="divide-y divide-[#F3F4F6]">
        {display.map((f, idx) => {
          const Icon = TYPE_ICONS[f.type];
          const isSelected = selectedFacility?.id === f.id;
          const item = (
            <button
              key={f.id}
              onClick={() => handleListItemClick(f)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all hover:bg-[#F8F8F8] active:scale-[0.98] ${isSelected ? 'bg-[#F8F8F8]' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TYPE_COLORS[f.type]}15` }}>
                <Icon className="h-4 w-4" style={{ color: TYPE_COLORS[f.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1A1A1A] truncate">{f.name}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ color: TYPE_COLORS[f.type], backgroundColor: `${TYPE_COLORS[f.type]}15` }}>
                    {TYPE_LABELS[f.type]}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{f.address}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {f.distance_m !== undefined && f.distance_m !== null && (
                    <span className="text-[11px] font-semibold text-[#FF6B6B]">{formatDistance(f.distance_m)}</span>
                  )}
                  {f.phone && <span className="text-[11px] text-[#9CA3AF]">{f.phone}</span>}
                </div>
              </div>
              <Navigation className="h-3.5 w-3.5 text-[#9CA3AF] flex-shrink-0" />
            </button>
          );
          if (animate) {
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02, duration: 0.2 }}>
                {item}
              </motion.div>
            );
          }
          return <div key={f.id}>{item}</div>;
        })}
        {sorted.length > 50 && (
          <div className="text-center py-3 text-[11px] text-[#9CA3AF]">
            가까운 50개만 표시 중 (전체 {sorted.length}건)
          </div>
        )}
      </div>
    );
  };

  const handleDirections = (facility: Facility) => {
    const url = `https://map.naver.com/v5/directions/-/-/-/transit?c=${facility.lng},${facility.lat},15,0,0,0,dh`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="flex bg-[#F8F8F8]" style={{ height: "calc(100dvh - 56px)" }}>

        {/* 데스크탑: 왼쪽 사이드바 리스트 (md 이상에서만) */}
        <div className="hidden md:flex md:flex-col md:w-[380px] md:border-r md:border-[#F3F4F6] bg-white">
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#F3F4F6]">
            <h1 className="text-lg font-bold text-[#1A1A1A]">주변 시설</h1>
            <span className="text-xs text-[#9CA3AF]">{facilities.length}개</span>
          </div>
          <div className="px-4 py-3 border-b border-[#F3F4F6]">
            <FacilityFilter selectedTypes={selectedTypes} onTypesChange={setSelectedTypes} radius={radius} onRadiusChange={setRadius} typeCounts={typeCounts} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderList(false)}
          </div>
          <div className="px-4 py-2 border-t border-[#F3F4F6] text-[10px] text-[#9CA3AF] leading-relaxed">
            📊 부산광역시 공공데이터 11종 37,826건 · data.busan.go.kr
          </div>
        </div>

        {/* 지도 영역 (항상 표시 on desktop, 모바일은 viewMode에 따라) */}
        <div className={`flex-1 relative ${viewMode === 'list' ? 'hidden md:block' : ''}`}>
          {/* 모바일 필터 오버레이 */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-3 pb-2 md:hidden">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2.5 shadow-sm border border-[#F3F4F6]">
              <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-gray-100">
                <span className="text-[11px] font-medium text-[#9CA3AF]">내 위치 반경 {radiusLabel}</span>
                <span className="text-xs font-bold text-[#1A1A1A]">{facilities.length}<span className="text-[10px] font-normal text-[#9CA3AF] ml-0.5">개 시설</span></span>
              </div>
              <FacilityFilter selectedTypes={selectedTypes} onTypesChange={setSelectedTypes} radius={radius} onRadiusChange={setRadius} typeCounts={typeCounts} />
            </div>
          </div>

          {locationFallback && (
            <div className="absolute top-[72px] md:top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-[#1A1A1A]/80 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
                📍 부산시청 기준으로 표시합니다
              </div>
            </div>
          )}

          {naverLoaded ? (
            <FacilityMap
              facilities={facilities}
              onSelectFacility={setSelectedFacility}
              userLocation={userLocation}
              radiusMeters={parseInt(radius, 10)}
              onMapPanReady={handleMapPanReady}
              onCenterChanged={handleCenterChanged}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F8F8F8]">
              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] animate-pulse" />
            </div>
          )}

          {/* 이 지역에서 검색하기 버튼 */}
          <AnimatePresence>
            {mapMoved && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={handleSearchHere}
                className="absolute top-[130px] md:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 h-10 px-5 rounded-full bg-white text-[#1A1A1A] text-xs font-semibold shadow-lg border border-[#E5E7EB] active:scale-95 transition-transform hover:bg-[#F8F8F8]"
              >
                <Search className="w-3.5 h-3.5 text-[#FF6B6B]" />
                이 지역에서 검색하기
              </motion.button>
            )}
          </AnimatePresence>

          {/* 모바일 리스트 보기 버튼 */}
          <button
            onClick={() => setViewMode('list')}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 md:hidden flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#1A1A1A] text-white text-xs font-medium shadow-lg active:scale-95 transition-transform"
          >
            <List className="w-3.5 h-3.5" />
            목록 · {facilities.length}
          </button>

          {/* 선택된 시설 하단 카드 */}
          <AnimatePresence>
            {selectedFacility && (() => {
              const Icon = TYPE_ICONS[selectedFacility.type];
              return (
                <motion.div
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 200, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="absolute bottom-4 left-4 right-4 z-10 md:bottom-6 md:left-auto md:right-6 md:w-[340px]"
                >
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#F3F4F6]">
                    <button onClick={() => setSelectedFacility(null)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F8F8F8] flex items-center justify-center">
                      <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    </button>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TYPE_COLORS[selectedFacility.type]}15` }}>
                        <Icon className="h-4 w-4" style={{ color: TYPE_COLORS[selectedFacility.type] }} />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-bold text-[#1A1A1A] line-clamp-2">{selectedFacility.name}</span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{ color: TYPE_COLORS[selectedFacility.type], backgroundColor: `${TYPE_COLORS[selectedFacility.type]}15` }}>
                            {TYPE_LABELS[selectedFacility.type]}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-1 truncate">{selectedFacility.address}</p>
                        {selectedFacility.distance_m && (
                          <span className="text-xs text-[#FF6B6B] font-medium mt-0.5 inline-block">{formatDistance(selectedFacility.distance_m)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {selectedFacility.phone && (
                        <a href={`tel:${selectedFacility.phone}`} className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#F8F8F8] text-xs font-medium text-[#6B7280] active:scale-95 transition-transform">
                          <Phone className="w-3.5 h-3.5" /> 전화
                        </a>
                      )}
                      <button onClick={() => handleDirections(selectedFacility)} className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#03C75A] text-xs font-medium text-white active:scale-95 transition-transform">
                        <Navigation className="w-3.5 h-3.5" /> 길찾기
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* 모바일 리스트 뷰 (md 미만에서만) */}
        {viewMode === 'list' && (
          <div className="flex-1 flex flex-col md:hidden">
            <div className="h-12 bg-white border-b border-[#F3F4F6] px-4 flex items-center justify-between">
              <h1 className="text-lg font-bold text-[#1A1A1A]">주변 시설</h1>
              <button onClick={() => setViewMode('map')} className="flex items-center gap-1 h-8 px-3 rounded-full bg-[#1A1A1A] text-white text-xs font-medium active:scale-95 transition-transform">
                <MapPin className="w-3 h-3" /> 지도
              </button>
            </div>
            <div className="px-4 py-3">
              <FacilityFilter selectedTypes={selectedTypes} onTypesChange={setSelectedTypes} radius={radius} onRadiusChange={setRadius} typeCounts={typeCounts} />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-20">
              {renderList(true)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
