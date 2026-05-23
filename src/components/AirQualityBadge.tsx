"use client";

import { useEffect, useState } from "react";

type AirStatus = "good" | "normal" | "bad" | "verybad";

interface AirData {
  pm10: number;
  pm25: number;
  status: AirStatus;
  station: string;
  timestamp: string;
}

const STATUS_CONFIG: Record<
  AirStatus,
  { label: string; emoji: string; color: string; guide: string }
> = {
  good: {
    label: "좋음",
    emoji: "😊",
    color: "#10b981",
    guide: "영유아 외출 좋은 날이에요",
  },
  normal: {
    label: "보통",
    emoji: "🙂",
    color: "#f59e0b",
    guide: "짧은 외출은 괜찮아요",
  },
  bad: {
    label: "나쁨",
    emoji: "😷",
    color: "#ef4444",
    guide: "외출 주의 — 마스크 착용 권장",
  },
  verybad: {
    label: "매우나쁨",
    emoji: "⛔",
    color: "#7c2d12",
    guide: "영유아 외출 삼가세요",
  },
};

export default function AirQualityBadge() {
  const [data, setData] = useState<AirData | null>(null);

  useEffect(() => {
    fetch("/api/air-quality")
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) {
    return (
      <div className="mx-6 mb-3">
        <div className="rounded-xl px-4 py-2 bg-gray-50 animate-pulse h-[52px]" />
      </div>
    );
  }

  const cfg = STATUS_CONFIG[data.status];

  return (
    <div className="mx-6 mb-3">
      <div
        className="rounded-xl px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
      >
        <div>
          <p className="text-xs font-semibold" style={{ color: cfg.color }}>
            오늘 부산 대기질: {cfg.label} {cfg.emoji}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {cfg.guide} · PM10 {data.pm10}㎍/m³
          </p>
        </div>
        <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">
          {data.station}
        </span>
      </div>
    </div>
  );
}
