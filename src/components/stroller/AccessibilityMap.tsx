'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

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

interface AccessibilityMapProps {
  stations: MetroStation[];
  roads: PedestrianRoad[];
  onSelectStation: (station: MetroStation) => void;
}

function getAccessibilityColor(station: MetroStation): string {
  const totalElevators = (station.elevator_inner ?? 0) + (station.elevator_outer ?? 0);
  if (totalElevators >= 2 && (station.nursing_room ?? 0) >= 1) return '#10b981';
  if (totalElevators >= 1) return '#f59e0b';
  return '#f87171';
}

function makeMarkerIcon(color: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="11" fill="${color}" stroke="white" stroke-width="2.5"/>
      <text x="14" y="19" text-anchor="middle" font-size="12" fill="white" font-family="sans-serif" font-weight="bold">지</text>
    </svg>
  `)}`;
}

const BUSAN_STATION_COORDS: Record<string, [number, number]> = {
  '노포': [35.2628, 129.0907], '범어사': [35.2495, 129.0835], '온천장': [35.2359, 129.0828],
  '동래': [35.2168, 129.0827], '명륜': [35.2094, 129.0769], '교대': [35.2016, 129.0706],
  '부산대학교': [35.2310, 129.0840], '장전': [35.2256, 129.0844], '서면': [35.1574, 129.0596],
  '부산역': [35.1143, 129.0415], '범일': [35.1342, 129.0529], '좌천': [35.1230, 129.0437],
  '초량': [35.1192, 129.0416], '중앙': [35.1020, 129.0322], '자갈치': [35.0968, 129.0269],
  '남포': [35.0984, 129.0299], '토성': [35.1032, 129.0199], '동대신': [35.1047, 129.0120],
  '서대신': [35.1050, 128.9990], '괴정': [35.1050, 128.9850], '사상': [35.1523, 128.9922],
  '덕포': [35.1546, 128.9790], '모덕': [35.1559, 128.9680], '모라': [35.1600, 128.9576],
  '구포': [35.1970, 128.9894], '강서구청': [35.2120, 128.9790], '체육공원': [35.2248, 128.9755],
  '대저': [35.2395, 128.9713], '장산': [35.1799, 129.2141], '중동': [35.1783, 129.2010],
  '해운대': [35.1637, 129.1635], '동백': [35.1587, 129.1531], '벡스코': [35.1694, 129.1298],
  '센텀시티': [35.1693, 129.1297], '민락': [35.1618, 129.1230], '수영': [35.1577, 129.1136],
  '광안': [35.1530, 129.1090], '금련산': [35.1788, 129.1017], '남천': [35.1520, 129.1050],
  '경성대·부경대': [35.1440, 129.1010], '대연': [35.1377, 129.0934], '못골': [35.1275, 129.0870],
  '지게골': [35.1180, 129.0820], '문현': [35.1105, 129.0690], '국제금융센터·부산은행': [35.1047, 129.0601],
  '전포': [35.1480, 129.0590], '동천': [35.1480, 129.0565], '수정': [35.1380, 129.0565],
  '망미': [35.1730, 129.1170], '배산': [35.1840, 129.1110], '물만골': [35.1970, 129.0950],
  '연산': [35.1940, 129.0820], '거제': [35.1880, 129.0680], '종합운동장': [35.1778, 129.0610],
  '사직': [35.1941, 129.0668], '시청': [35.1703, 129.0753], '연지': [35.1630, 129.0650],
  '부산진': [35.1540, 129.0620],
};

export function AccessibilityMap({ stations, roads, onSelectStation }: AccessibilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maps = window.naver.maps as any;

    const map = new maps.Map(mapRef.current, {
      center: new maps.LatLng(35.1796, 129.0756),
      zoom: 12,
    });
    mapInstanceRef.current = map;

    stations.forEach((station) => {
      const coords = BUSAN_STATION_COORDS[station.station_name];
      if (!coords) return;

      const color = getAccessibilityColor(station);
      const marker = new maps.Marker({
        position: new maps.LatLng(coords[0], coords[1]),
        map,
        title: station.station_name,
        icon: {
          url: makeMarkerIcon(color),
          size: new maps.Size(28, 28),
          anchor: new maps.Point(14, 14),
        },
      });

      maps.Event.addListener(marker, 'click', () => {
        onSelectStation(station);
      });

      markersRef.current.push(marker);
    });

    roads.forEach((road) => {
      if (!road.start_lat || !road.start_lng || !road.end_lat || !road.end_lng) return;

      const polyline = new maps.Polyline({
        path: [
          new maps.LatLng(road.start_lat, road.start_lng),
          new maps.LatLng(road.end_lat, road.end_lng),
        ],
        map,
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      polylinesRef.current.forEach((p) => p.setMap(null));
      markersRef.current = [];
      polylinesRef.current = [];
    };
  }, [stations, roads, onSelectStation]);

  function handleCurrentLocation() {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maps = window.naver.maps as any;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapInstanceRef.current.setCenter(
        new maps.LatLng(pos.coords.latitude, pos.coords.longitude)
      );
    });
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <button
        onClick={handleCurrentLocation}
        className="absolute bottom-4 right-4 z-10 bg-white rounded-full shadow-md p-3 hover:bg-sky-50 transition-colors border border-sky-100"
        aria-label="현재 위치로 이동"
      >
        <MapPin className="w-5 h-5 text-sky-500" />
      </button>
    </div>
  );
}
