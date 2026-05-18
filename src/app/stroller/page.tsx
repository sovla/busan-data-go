'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { AccessibilityMap } from '@/components/stroller/AccessibilityMap';
import { StationDetail } from '@/components/stroller/StationDetail';
import { AccessibilityLegend } from '@/components/stroller/AccessibilityLegend';
import { Badge } from '@/components/ui/badge';
import { Navigation } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

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

  return (
    <PageTransition>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onReady={() => setNaverLoaded(true)}
        strategy="afterInteractive"
      />
      <div className="flex flex-col h-screen">
        <div className="bg-white border-b border-gray-100 z-10 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E6FAF5] flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-[#4ECDC4]" />
              </div>
              <h1 className="text-base font-bold text-gray-900">
                유모차 길 안내
              </h1>
            </div>
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
              {stations.length}개 역 · {roads.length}개 도로
            </Badge>
          </div>
          <p className="text-xs text-gray-400 pl-9">부산 도시철도 접근성 + 보행자우선도로</p>
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
