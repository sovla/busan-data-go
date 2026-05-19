"use client";

import { useEffect, useState, useMemo } from "react";

interface Feature {
  type: string;
  properties: { name: string; code: string };
  geometry: { type: string; coordinates: number[][][][] };
}

interface GeoJSON {
  type: string;
  features: Feature[];
}

interface BusanDistrictMapProps {
  selected: string;
  onSelect: (district: string) => void;
}

function projectCoords(coords: number[][], bounds: { minX: number; minY: number; scaleX: number; scaleY: number }, width: number, height: number) {
  return coords.map(([lng, lat]) => {
    const x = (lng - bounds.minX) * bounds.scaleX;
    const y = height - (lat - bounds.minY) * bounds.scaleY;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function getCentroid(coords: number[][]): [number, number] {
  let sumX = 0, sumY = 0, count = 0;
  for (const [x, y] of coords) {
    sumX += x;
    sumY += y;
    count++;
  }
  return [sumX / count, sumY / count];
}

export default function BusanDistrictMap({ selected, onSelect }: BusanDistrictMapProps) {
  const [geojson, setGeojson] = useState<GeoJSON | null>(null);

  useEffect(() => {
    fetch("/busan-districts.json")
      .then((r) => r.json())
      .then(setGeojson);
  }, []);

  const { paths, viewBox } = useMemo(() => {
    if (!geojson) return { paths: [], viewBox: "0 0 300 250" };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const f of geojson.features) {
      for (const poly of f.geometry.coordinates) {
        for (const ring of poly) {
          for (const [lng, lat] of ring) {
            minX = Math.min(minX, lng);
            minY = Math.min(minY, lat);
            maxX = Math.max(maxX, lng);
            maxY = Math.max(maxY, lat);
          }
        }
      }
    }

    const padding = 25;
    const width = 340;
    const geoWidth = maxX - minX;
    const geoHeight = maxY - minY;
    const scale = (width - padding * 2) / geoWidth;
    const height = geoHeight * scale + padding * 2;

    const bounds = {
      minX: minX - padding / scale,
      minY: minY - padding / scale,
      scaleX: scale,
      scaleY: scale,
    };

    const result = geojson.features.map((f) => {
      const allCoords: string[][] = [];
      let largestRing: number[][] = [];
      let largestLen = 0;

      for (const poly of f.geometry.coordinates) {
        for (const ring of poly) {
          allCoords.push(ring.map(([lng, lat]) => {
            const x = (lng - bounds.minX) * bounds.scaleX;
            const y = height - (lat - bounds.minY) * bounds.scaleY;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }));
          if (ring.length > largestLen) {
            largestLen = ring.length;
            largestRing = ring;
          }
        }
      }

      const [cLng, cLat] = getCentroid(largestRing);
      const cx = (cLng - bounds.minX) * bounds.scaleX;
      const cy = height - (cLat - bounds.minY) * bounds.scaleY;

      const pathD = allCoords.map((pts) => `M${pts.join("L")}Z`).join(" ");

      return {
        name: f.properties.name,
        pathD,
        cx,
        cy,
      };
    });

    const mapCx = width / 2;
    const mapCy = height / 2;

    const labeled = result.map((d) => {
      const dx = d.cx - mapCx;
      const dy = d.cy - mapCy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const norm = dist === 0 ? { x: 0, y: -1 } : { x: dx / dist, y: dy / dist };
      const offset = 30;
      return {
        ...d,
        lx: d.cx + norm.x * offset,
        ly: d.cy + norm.y * offset,
      };
    });

    return { paths: labeled, viewBox: `-20 -15 ${width + 40} ${height + 30}` };
  }, [geojson]);

  if (!geojson) {
    return (
      <div className="w-full h-[320px] bg-[#F8F8F8] rounded-xl flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[#F3F4F6] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg viewBox={viewBox} className="w-full h-auto max-h-[320px]">
        {paths.map((d) => {
          const isSelected = selected === d.name;
          return (
            <g key={d.name} onClick={() => onSelect(d.name)} className="cursor-pointer">
              <path
                d={d.pathD}
                fill={isSelected ? "#FF6B6B" : "#E5E7EB"}
                stroke="white"
                strokeWidth="1.5"
                className="transition-colors duration-150 hover:fill-[#FFD4D4]"
              />
              <line x1={d.cx} y1={d.cy} x2={d.lx} y2={d.ly} stroke={isSelected ? "#FF6B6B" : "#D1D5DB"} strokeWidth="0.6" className="pointer-events-none" />
              <circle cx={d.cx} cy={d.cy} r="1.5" fill={isSelected ? "#FF6B6B" : "#D1D5DB"} className="pointer-events-none" />
              <text
                x={d.lx}
                y={d.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[6.5px] pointer-events-none select-none ${
                  isSelected ? "fill-[#FF6B6B] font-bold" : "fill-[#6B7280] font-medium"
                }`}
              >
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
