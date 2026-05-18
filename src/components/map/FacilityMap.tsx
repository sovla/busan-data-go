'use client';

import { useEffect, useRef, useCallback } from 'react';
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
        Event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
}

interface NaverMap {
  setCenter: (latlng: NaverLatLng) => void;
  getCenter: () => NaverLatLng;
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

const TYPE_EMOJIS: Record<FacilityType, string> = {
  nursing_room: '🍼',
  kids_cafe: '🎪',
  postpartum: '🏥',
  daycare: '🏫',
  hospital: '⚕️',
};

const TYPE_COLORS: Record<FacilityType, string> = {
  nursing_room: '#FF6B6B',
  kids_cafe: '#4ECDC4',
  postpartum: '#9B59B6',
  daycare: '#2ECC71',
  hospital: '#F39C12',
};

interface FacilityMapProps {
  facilities: Facility[];
  selectedFacility: Facility | null;
  onSelectFacility: (facility: Facility) => void;
}

export function FacilityMap({ facilities, selectedFacility, onSelectFacility }: FacilityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const infoWindowRef = useRef<NaverInfoWindow | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !window.naver?.maps) return;

    const center = new window.naver.maps.LatLng(35.1796, 129.0756);
    mapRef.current = new window.naver.maps.Map(mapContainerRef.current, {
      center,
      zoom: 12,
    });
  }, []);

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
      const emoji = TYPE_EMOJIS[facility.type];
      const marker = new window.naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: facility.name,
        icon: {
          content: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:12px;">${emoji}</span></div>`,
          anchor: new window.naver.maps.Point(14, 14),
        },
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:7px 12px;font-size:13px;font-weight:600;color:#1e293b;border-radius:8px;">${TYPE_EMOJIS[facility.type]} ${facility.name}</div>`,
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindowRef.current) infoWindowRef.current.close();
        infoWindow.open(mapRef.current!, marker);
        infoWindowRef.current = infoWindow;
        onSelectFacility(facility);
      });

      markersRef.current.push(marker);
    });
  }, [facilities, onSelectFacility]);

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
        className="
          absolute bottom-6 right-4 z-10
          w-11 h-11 rounded-full
          bg-white border border-slate-200
          shadow-lg shadow-slate-200/80
          flex items-center justify-center
          text-slate-600 hover:text-sky-600
          hover:border-sky-300 hover:shadow-sky-100
          active:scale-95
          transition-all duration-150
        "
      >
        <Locate className="w-4 h-4" />
      </button>
    </div>
  );
}
