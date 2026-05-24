'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Facility, FacilityType } from '@/types/facility';
import { Locate } from 'lucide-react';

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (container: HTMLElement, options: NaverMapOptions) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: NaverMarkerOptions) => NaverMarker;
        InfoWindow: new (options: NaverInfoWindowOptions) => NaverInfoWindow;
        Point: new (x: number, y: number) => NaverPoint;
        Circle: new (options: NaverCircleOptions) => NaverCircle;
        Event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface NaverCircleOptions {
  map: NaverMap;
  center: NaverLatLng;
  radius: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  fillColor?: string;
  fillOpacity?: number;
}

interface NaverCircle {
  setMap: (map: NaverMap | null) => void;
  setRadius: (radius: number) => void;
  setCenter: (center: NaverLatLng) => void;
}

interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
}

interface NaverMap {
  setCenter: (latlng: NaverLatLng) => void;
  getCenter: () => NaverLatLng;
  setZoom: (zoom: number) => void;
}

interface NaverLatLng {
  lat: () => number;
  lng: () => number;
}

interface NaverMarkerIcon {
  content: string;
  anchor: NaverPoint;
}

interface NaverPoint {
  x: number;
  y: number;
}

interface NaverMarkerOptions {
  position: NaverLatLng;
  map: NaverMap;
  title?: string;
  icon?: NaverMarkerIcon;
}

interface NaverMarker {
  setMap: (map: NaverMap | null) => void;
}

interface NaverInfoWindowOptions {
  content: string;
}

interface NaverInfoWindow {
  open: (map: NaverMap, marker: NaverMarker) => void;
  close: () => void;
}

const TYPE_COLORS: Record<FacilityType, string> = {
  nursing_room: '#FF6B6B',
  kids_cafe: '#4ECDC4',
  postpartum: '#9B59B6',
  daycare: '#2ECC71',
  hospital: '#F39C12',
  atopy_school: '#3B82F6',
  meal_store: '#EC4899',
};

const TYPE_SVG_ICONS: Record<FacilityType, string> = {
  nursing_room: `<path d="M10,6 L10,16 Q10,18 12,18 L14,18 Q16,18 16,16 L16,11 L18,9 L16,9 L16,6 Q16,4 14,4 L12,4 Q10,4 10,6Z" fill="white" opacity="0.9"/>`,
  kids_cafe: `<path d="M8,8 L18,8 L18,18 L8,18Z M10,10 L10,12 L12,12 L12,10Z M14,10 L14,12 L16,12 L16,10Z M10,14 L10,16 L12,16 L12,14Z M14,14 L14,16 L16,16 L16,14Z" fill="white" opacity="0.9"/>`,
  postpartum: `<path d="M13,7 C13,7 18,10 18,14 C18,17 15.5,19 13,19 C10.5,19 8,17 8,14 C8,10 13,7 13,7Z" fill="white" opacity="0.9"/>`,
  daycare: `<circle cx="13" cy="9" r="3" fill="white" opacity="0.9"/><path d="M8,18 Q8,14 13,14 Q18,14 18,18" fill="white" opacity="0.9"/>`,
  hospital: `<path d="M11,7 L15,7 L15,11 L19,11 L19,15 L15,15 L15,19 L11,19 L11,15 L7,15 L7,11 L11,11Z" fill="white" opacity="0.9"/>`,
  atopy_school: `<path d="M13,6 L13,10 M11,8 L15,8 M8,12 L18,12 L18,20 L8,20Z" stroke="white" stroke-width="1.5" fill="none" opacity="0.9"/>`,
  meal_store: `<path d="M9,8 L9,18 M13,8 L13,13 L11,18 M17,8 L17,13 Q17,15 15,15 L15,18" stroke="white" stroke-width="1.5" fill="none" opacity="0.9"/>`,
};

const RADIUS_ZOOM: Record<number, number> = {
  500: 16,
  1000: 15,
  3000: 13,
  5000: 12,
};

interface FacilityMapProps {
  facilities: Facility[];
  onSelectFacility: (facility: Facility) => void;
  userLocation?: { lat: number; lng: number };
  radiusMeters?: number;
  onMapPanReady?: (panFn: (lat: number, lng: number) => void) => void;
  onCenterChanged?: (lat: number, lng: number) => void;
}

export function FacilityMap({ facilities, onSelectFacility, userLocation, radiusMeters, onMapPanReady, onCenterChanged }: FacilityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const infoWindowRef = useRef<NaverInfoWindow | null>(null);
  const userMarkerRef = useRef<NaverMarker | null>(null);
  const radiusCircleRef = useRef<NaverCircle | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const onSelectRef = useRef(onSelectFacility);
  onSelectRef.current = onSelectFacility;
  const onCenterChangedRef = useRef(onCenterChanged);
  onCenterChangedRef.current = onCenterChanged;

  const lat = userLocation?.lat ?? 35.1796;
  const lng = userLocation?.lng ?? 129.0756;

  useEffect(() => {
    if (!mapContainerRef.current || !window.naver?.maps) return;

    const center = new window.naver.maps.LatLng(lat, lng);
    const zoom = RADIUS_ZOOM[radiusMeters ?? 3000] ?? 13;
    mapRef.current = new window.naver.maps.Map(mapContainerRef.current, {
      center,
      zoom,
    });
    setMapReady(true);

    if (onMapPanReady) {
      onMapPanReady((targetLat: number, targetLng: number) => {
        if (mapRef.current && window.naver?.maps) {
          mapRef.current.setCenter(new window.naver.maps.LatLng(targetLat, targetLng));
        }
      });
    }

    window.naver.maps.Event.addListener(mapRef.current, 'dragend', () => {
      if (!mapRef.current) return;
      const center = mapRef.current.getCenter();
      onCenterChangedRef.current?.(center.lat(), center.lng());
    });
  }, [lat, lng, onMapPanReady]);

  // 사용자 위치 마커 + 반경 원
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.naver?.maps) return;
    const position = new window.naver.maps.LatLng(lat, lng);

    if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    userMarkerRef.current = new window.naver.maps.Marker({
      position,
      map: mapRef.current,
      title: '내 위치',
      icon: {
        content: `<div style="width:22px;height:22px;border-radius:50%;background:#1E40AF;border:3px solid white;box-shadow:0 0 0 2px rgba(30,64,175,0.35), 0 2px 8px rgba(0,0,0,0.35);z-index:9999;"></div>`,
        anchor: new window.naver.maps.Point(11, 11),
      },
    });

    const targetZoom = RADIUS_ZOOM[radiusMeters ?? 3000] ?? 13;
    mapRef.current.setZoom(targetZoom);

    if (radiusCircleRef.current) radiusCircleRef.current.setMap(null);
    if (radiusMeters && radiusMeters > 0) {
      radiusCircleRef.current = new window.naver.maps.Circle({
        map: mapRef.current,
        center: position,
        radius: radiusMeters,
        strokeColor: '#94A3B8',
        strokeOpacity: 0.5,
        strokeWeight: 1.5,
        fillColor: '#94A3B8',
        fillOpacity: 0.06,
      });
    }
  }, [lat, lng, radiusMeters, mapReady]);

  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    facilities.forEach((facility) => {
      const position = new window.naver.maps.LatLng(facility.lat, facility.lng);
      const color = TYPE_COLORS[facility.type];
      const marker = new window.naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: facility.name,
        icon: {
          content: `<svg width="28" height="28" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="12" fill="${color}" stroke="white" stroke-width="2"/>${TYPE_SVG_ICONS[facility.type]}</svg>`,
          anchor: new window.naver.maps.Point(14, 14),
        },
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:7px 12px;font-size:13px;font-weight:600;color:#1A1A1A;border-radius:8px;">${facility.name}</div>`,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindowRef.current) infoWindowRef.current.close();
        infoWindow.open(mapRef.current!, marker);
        infoWindowRef.current = infoWindow;
        onSelectRef.current(facility);
        if (mapRef.current && window.naver?.maps) {
          mapRef.current.setCenter(new window.naver.maps.LatLng(facility.lat, facility.lng));
        }
      });

      markersRef.current.push(marker);
    });
  }, [facilities]);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current || !window.naver?.maps) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const latlng = new window.naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      mapRef.current!.setCenter(latlng);
    });
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      <button
        type="button"
        onClick={handleCurrentLocation}
        title="현재 위치로 이동"
        className="absolute bottom-6 right-4 z-10 w-11 h-11 rounded-full bg-white border border-[#F3F4F6] shadow-lg flex items-center justify-center text-[#6B7280] hover:text-[#FF6B6B] active:scale-95 transition-all duration-150"
      >
        <Locate className="w-5 h-5" />
      </button>
    </div>
  );
}
