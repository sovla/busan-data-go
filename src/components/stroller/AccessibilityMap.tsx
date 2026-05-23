'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { getStationGrade, GRADE_COLORS } from '@/lib/stroller-grade';

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

interface AccessibilityMapProps {
  stations: MetroStation[];
  roads: PedestrianRoad[];
  onSelectStation: (station: MetroStation) => void;
}

function getAccessibilityColor(station: MetroStation): string {
  return GRADE_COLORS[getStationGrade(station)];
}

function getLineNumber(line: string): string {
  const m = line.match(/(\d)/);
  return m ? m[1] : '●';
}

function makeMarkerIcon(color: string, lineNum: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="13" fill="${color}" stroke="white" stroke-width="2.5"/>
      <text x="16" y="21" text-anchor="middle" font-size="13" fill="white" font-family="sans-serif" font-weight="bold">${lineNum}</text>
    </svg>
  `)}`;
}

const BUSAN_STATION_COORDS: Record<string, [number, number]> = {
  // 1호선
  '다대포해수욕장': [35.0485, 128.9666], '다대포항': [35.0535, 128.9687],
  '낫개': [35.0627, 128.9718], '신장림': [35.0723, 128.9753], '장림': [35.0823, 128.9785],
  '동매': [35.0893, 128.9815], '신평': [35.0963, 128.9852], '하단': [35.1048, 128.9892],
  '당리': [35.1083, 128.9954], '사하': [35.1063, 129.0002], '괴정': [35.1050, 129.0075],
  '대티': [35.1053, 129.0118], '서대신': [35.1048, 129.0177], '동대신': [35.1047, 129.0237],
  '토성': [35.1032, 129.0199], '자갈치': [35.0968, 129.0269], '남포': [35.0984, 129.0299],
  '중앙': [35.1020, 129.0322], '부산역': [35.1143, 129.0415], '초량': [35.1192, 129.0416],
  '좌천': [35.1230, 129.0437], '범일': [35.1342, 129.0529], '범내골': [35.1480, 129.0545],
  '서면': [35.1574, 129.0596], '부전': [35.1605, 129.0605], '양정': [35.1745, 129.0690],
  '시청': [35.1703, 129.0753], '연산': [35.1940, 129.0820], '교대': [35.2016, 129.0706],
  '동래': [35.2057, 129.0764], '명륜': [35.2094, 129.0769],
  '온천장': [35.2175, 129.0828], '부산대': [35.2310, 129.0840], '부산대학교': [35.2310, 129.0840],
  '장전': [35.2256, 129.0844], '구서': [35.2430, 129.0855], '두실': [35.2530, 129.0870],
  '남산': [35.2380, 129.0900], '범어사': [35.2495, 129.0835], '노포': [35.2628, 129.0907],
  // 2호선
  '장산': [35.1799, 129.2141], '중동': [35.1783, 129.2010],
  '해운대': [35.1637, 129.1635], '동백': [35.1587, 129.1531],
  '벡스코': [35.1694, 129.1298], '센텀시티': [35.1693, 129.1297],
  '민락': [35.1618, 129.1230], '수영': [35.1577, 129.1136],
  '광안': [35.1530, 129.1090], '금련산': [35.1788, 129.1017], '남천': [35.1520, 129.1050],
  '경성대·부경대': [35.1440, 129.1010], '대연': [35.1377, 129.0934], '못골': [35.1275, 129.0870],
  '지게골': [35.1180, 129.0820], '문현': [35.1105, 129.0690],
  '국제금융센터·부산은행': [35.1047, 129.0601],
  '전포': [35.1480, 129.0590], '동천': [35.1480, 129.0565],
  '부암': [35.1380, 129.0420], '가야': [35.1450, 129.0320],
  '동의대': [35.1380, 129.0150], '개금': [35.1400, 129.0095],
  '냉정': [35.1420, 129.0030], '주례': [35.1470, 128.9960],
  '감전': [35.1540, 128.9890], '사상': [35.1523, 128.9922],
  '덕포': [35.1546, 128.9790], '모덕': [35.1559, 128.9680], '모라': [35.1600, 128.9576],
  '구남': [35.1500, 128.9730], '구명': [35.1540, 128.9650],
  '덕천': [35.2050, 128.9930], '수정': [35.1380, 129.0565],
  '화명': [35.2180, 128.9950], '율리': [35.2250, 128.9850],
  '동원': [35.2350, 128.9800], '금곡': [35.2420, 128.9740],
  '호포': [35.2500, 128.9700], '증산': [35.2680, 128.9820],
  '부산대양산캠퍼스': [35.2760, 128.9750], '남양산': [35.3000, 128.9800],
  '양산': [35.3350, 129.0200],
  // 3호선
  '망미': [35.1730, 129.1170], '배산': [35.1840, 129.1110],
  '물만골': [35.1970, 129.0950],
  '거제': [35.1880, 129.0680], '종합운동장': [35.1778, 129.0610],
  '사직': [35.1941, 129.0668], '미남': [35.1920, 129.0680],
  '만덕': [35.2100, 129.0280], '남산정': [35.2050, 129.0180],
  '숙등': [35.2000, 129.0080],
  // 4호선
  '수안': [35.2060, 129.0810], '낙민': [35.2010, 129.0840],
  '충렬사': [35.1980, 129.0860], '명장': [35.1950, 129.0920],
  '서동': [35.1920, 129.0980], '금사': [35.1880, 129.1020],
  '반여농산물시장': [35.1880, 129.1100], '석대': [35.1900, 129.1180],
  '영산대': [35.1920, 129.1250], '윗반송': [35.1950, 129.1300],
  '고촌': [35.2060, 129.1100], '안평': [35.2120, 129.1020],
  // 기타
  '연지': [35.1630, 129.0650], '부산진': [35.1540, 129.0620],
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
      const baseName = station.station_name.replace(/\(\d\)$/, '');
      const hardcoded = BUSAN_STATION_COORDS[station.station_name] ?? BUSAN_STATION_COORDS[baseName];
      const lat = hardcoded?.[0] ?? station.lat;
      const lng = hardcoded?.[1] ?? station.lng;
      if (!lat || !lng) return;

      const color = getAccessibilityColor(station);
      const lineNum = getLineNumber(station.line);
      const marker = new maps.Marker({
        position: new maps.LatLng(lat, lng),
        map,
        title: `${station.station_name}역 (${station.line})`,
        icon: {
          url: makeMarkerIcon(color, lineNum),
          size: new maps.Size(32, 32),
          anchor: new maps.Point(16, 16),
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
