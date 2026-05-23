'use client';

import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import { AccessibilityMap } from '@/components/stroller/AccessibilityMap';
import { StationDetail } from '@/components/stroller/StationDetail';
import { AccessibilityLegend } from '@/components/stroller/AccessibilityLegend';
import { Navigation } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { getStationGrade } from '@/lib/stroller-grade';

interface MetroStation {
  id: number;
  line: string;
  station_name: string;
  nursing_room: number;
  elevator_inner: number;
  elevator_outer: number;
  wheelchair_lift: number;
  escalator: number;
  outer_ramp: number;
  location: string;
  lat?: number;
  lng?: number;
}

interface PedestrianRoad {
  id: number;
  name: string;
  district: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  distance_m: number;
  road_width: number;
}

export default function StrollerPage() {
  const [stations, setStations] = useState<MetroStation[]>([]);
  const [roads, setRoads] = useState<PedestrianRoad[]>([]);
  const [selectedStation, setSelectedStation] = useState<MetroStation | null>(null);
  const [naverLoaded, setNaverLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/stroller/stations')
      .then((r) => r.json())
      .then((d) => setStations(d.stations ?? []));

    fetch('/api/stroller/roads')
      .then((r) => r.json())
      .then((d) => setRoads(d.roads ?? []));
  }, []);

  const stats = useMemo(() => {
    let safe = 0, normal = 0, caution = 0;
    for (const s of stations) {
      const grade = getStationGrade(s);
      if (grade === 'safe') safe++;
      else if (grade === 'normal') normal++;
      else caution++;
    }
    return { safe, normal, caution };
  }, [stations]);

  return (
    <PageTransition>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
        <div className="bg-white border-b border-[#F3F4F6] z-10 flex-shrink-0">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E6FAF5] flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-[#4ECDC4]" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[#1A1A1A]">유모차 길 안내</h1>
                <p className="text-[10px] text-[#9CA3AF] -mt-0.5">부산 도시철도 {stations.length}개 역 접근성 · 보행자우선도로 {roads.length}개</p>
              </div>
            </div>
          </div>
          <div className="px-4 pb-3 flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-[#F0FDF4] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#2ECC71]">{stats.safe}</p>
              <p className="text-[10px] text-[#6B7280]">안전</p>
            </div>
            <div className="flex-1 rounded-xl bg-[#FFF7ED] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#F39C12]">{stats.normal}</p>
              <p className="text-[10px] text-[#6B7280]">보통</p>
            </div>
            <div className="flex-1 rounded-xl bg-[#FFF0F0] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#FF6B6B]">{stats.caution}</p>
              <p className="text-[10px] text-[#6B7280]">주의</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {naverLoaded ? (
            <AccessibilityMap
              stations={stations}
              roads={roads}
              onSelectStation={setSelectedStation}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mb-3" />
              <p className="text-gray-400 text-sm">지도를 불러오는 중...</p>
            </div>
          )}

          <div className="absolute top-3 left-3 z-10 w-52 animate-[fadeIn_0.4s_ease-out]">
            <AccessibilityLegend />
          </div>
        </div>

        <StationDetail
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      </div>
    </PageTransition>
  );
}
