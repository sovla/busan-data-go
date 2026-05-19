"use client";

interface BusanDistrictMapProps {
  selected: string;
  onSelect: (district: string) => void;
}

const DISTRICTS: { name: string; path: string; labelX: number; labelY: number }[] = [
  { name: "강서구", path: "M30,80 L60,60 L80,70 L75,100 L55,110 L30,105Z", labelX: 52, labelY: 90 },
  { name: "북구", path: "M80,70 L110,55 L125,65 L120,85 L100,90 L75,100Z", labelX: 100, labelY: 78 },
  { name: "사상구", path: "M75,100 L100,90 L110,105 L95,120 L75,115Z", labelX: 90, labelY: 108 },
  { name: "사하구", path: "M55,110 L75,100 L75,115 L80,135 L60,150 L40,140Z", labelX: 62, labelY: 130 },
  { name: "금정구", path: "M125,65 L155,50 L170,65 L165,90 L140,95 L120,85Z", labelX: 145, labelY: 75 },
  { name: "동래구", path: "M120,85 L140,95 L145,110 L130,115 L110,105Z", labelX: 128, labelY: 102 },
  { name: "부산진구", path: "M100,90 L120,85 L130,115 L120,125 L110,105 L95,120Z", labelX: 112, labelY: 108 },
  { name: "연제구", path: "M130,115 L145,110 L155,120 L145,135 L130,130Z", labelX: 140, labelY: 123 },
  { name: "서구", path: "M80,135 L95,120 L110,130 L105,145 L90,148Z", labelX: 96, labelY: 138 },
  { name: "중구", path: "M90,148 L105,145 L112,155 L100,162 L88,158Z", labelX: 100, labelY: 154 },
  { name: "동구", path: "M105,145 L120,125 L130,130 L125,148 L112,155Z", labelX: 118, labelY: 140 },
  { name: "영도구", path: "M88,158 L100,162 L112,155 L120,170 L105,185 L85,178Z", labelX: 102, labelY: 172 },
  { name: "남구", path: "M125,148 L130,130 L145,135 L155,150 L140,160 L130,155Z", labelX: 138, labelY: 148 },
  { name: "수영구", path: "M155,120 L175,115 L180,135 L165,145 L155,150 L145,135Z", labelX: 163, labelY: 133 },
  { name: "해운대구", path: "M165,90 L200,75 L220,90 L210,120 L180,135 L175,115 L155,120 L145,110 L140,95Z", labelX: 185, labelY: 105 },
  { name: "기장군", path: "M170,65 L200,40 L235,35 L245,55 L230,80 L220,90 L200,75Z", labelX: 215, labelY: 62 },
];

export default function BusanDistrictMap({ selected, onSelect }: BusanDistrictMapProps) {
  return (
    <div className="w-full">
      <svg viewBox="10 25 250 175" className="w-full h-auto max-h-[200px]">
        {DISTRICTS.map((d) => {
          const isSelected = selected === d.name;
          return (
            <g key={d.name} onClick={() => onSelect(d.name)} className="cursor-pointer">
              <path
                d={d.path}
                fill={isSelected ? "#FF6B6B" : "#F3F4F6"}
                stroke="white"
                strokeWidth="1.5"
                className="transition-colors duration-150 hover:fill-[#FFD4D4]"
              />
              <text
                x={d.labelX}
                y={d.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[7px] font-medium pointer-events-none select-none ${
                  isSelected ? "fill-white" : "fill-[#6B7280]"
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
