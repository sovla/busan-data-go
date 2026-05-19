"use client";

import { Heart, MapPin, Baby } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  {
    icon: Heart,
    title: "내 맞춤 혜택 찾기",
    description: "나의 조건에 맞는 혜택 확인",
    query: "내 조건에 맞는 혜택 알려줘",
  },
  {
    icon: MapPin,
    title: "주변 수유실 찾기",
    description: "가까운 수유실 위치 안내",
    query: "근처 수유실 알려줘",
  },
  {
    icon: Baby,
    title: "출산 장려금 안내",
    description: "부산시 출산 지원금 정보",
    query: "부산 출산 장려금 알려줘",
  },
];

interface SuggestionCardsProps {
  onSelect: (query: string) => void;
}

export default function SuggestionCards({ onSelect }: SuggestionCardsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {suggestions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: idx * 0.1,
              duration: 0.35,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={() => onSelect(item.query)}
            className="flex flex-col items-start gap-2 min-w-[160px] rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8F0]">
              <Icon className="h-5 w-5 text-[#FF6B6B]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
