"use client";

import { useState } from "react";
import { BenefitMatchRequest } from "@/types/benefit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Baby, MapPin, Wallet, Heart } from "lucide-react";
import BusanDistrictMap from "./BusanDistrictMap";

const DISTRICTS = [
  "중구", "서구", "동구", "영도구", "부산진구", "동래구",
  "남구", "북구", "해운대구", "사하구", "금정구", "강서구",
  "연제구", "수영구", "사상구", "기장군",
];

const CHILD_AGE_OPTIONS = [
  { label: "0세", value: 0 },
  { label: "1세", value: 1 },
  { label: "2세", value: 2 },
  { label: "3~5세", values: [3, 4, 5] },
  { label: "6세 이상", value: 6 },
];

interface BenefitFormProps {
  onSearch: (request: BenefitMatchRequest) => void;
}

function BabyIcon({ filled, size = 32 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="12" r="6" fill={filled ? "#FF6B6B" : "#E5E7EB"} />
      <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={filled ? "#FF6B6B" : "#E5E7EB"} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="11" r="1" fill="white" />
      <circle cx="18" cy="11" r="1" fill="white" />
      <path d="M14 14c.5.5 3.5.5 4 0" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BenefitForm({ onSearch }: BenefitFormProps) {
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyWeek, setPregnancyWeek] = useState(20);
  const [district, setDistrict] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [selectedAges, setSelectedAges] = useState<number[]>([]);
  const [incomeLevel, setIncomeLevel] = useState("middle");

  function getVals(option: (typeof CHILD_AGE_OPTIONS)[number]): number[] {
    if ("values" in option && option.values !== undefined) return option.values;
    if ("value" in option && option.value !== undefined) return [option.value];
    return [];
  }

  function toggleAge(option: (typeof CHILD_AGE_OPTIONS)[number]) {
    const vals = getVals(option);
    setSelectedAges((prev) => {
      const allSelected = vals.every((v) => prev.includes(v));
      if (allSelected) return prev.filter((a) => !vals.includes(a));
      return [...new Set([...prev, ...vals])];
    });
  }

  function isAgeChecked(option: (typeof CHILD_AGE_OPTIONS)[number]) {
    return getVals(option).every((v) => selectedAges.includes(v));
  }

  function handleSubmit() {
    onSearch({
      pregnancy_week: isPregnant ? pregnancyWeek : null,
      district,
      children_count: childrenCount,
      children_ages: selectedAges,
      income_level: incomeLevel,
    });
  }

  const trimester = pregnancyWeek <= 12 ? "초기" : pregnancyWeek <= 27 ? "중기" : "후기";

  return (
    <Card className="rounded-2xl border border-[#F3F4F6] shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#1A1A1A]">내 조건 입력하기</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 임신 여부 + 주수 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Heart className="h-4 w-4 text-[#FF6B6B]" />
            임신 정보
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isPregnant}
              onClick={() => setIsPregnant((v) => !v)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                isPregnant ? "bg-[#FF6B6B]" : "bg-[#E5E7EB]"
              }`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                isPregnant ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
            <span className={`text-sm font-medium ${isPregnant ? "text-[#FF6B6B]" : "text-[#9CA3AF]"}`}>
              {isPregnant ? "임신 중" : "임신 아님"}
            </span>
          </div>

          {isPregnant && (
            <div className="bg-white rounded-xl border border-[#F3F4F6] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1A1A1A]">{pregnancyWeek}주</span>
                <span className="text-xs text-[#FF6B6B] font-medium bg-[#FFF0F0] px-2 py-0.5 rounded-full">{trimester}</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={pregnancyWeek}
                onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                className="w-full h-2 bg-[#F3F4F6] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF6B6B] [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-[10px] text-[#9CA3AF]">
                <span>1주</span>
                <span>12주</span>
                <span>27주</span>
                <span>40주</span>
              </div>
            </div>
          )}
        </div>

        {/* 거주 구군 — 버튼 그리드 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <MapPin className="h-4 w-4 text-[#FF6B6B]" />
            거주 구군
          </div>
          <BusanDistrictMap selected={district} onSelect={setDistrict} />
          {district && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-[#F3F4F6] px-4 py-2.5">
              <span className="text-sm font-semibold text-[#1A1A1A]">{district}</span>
              <button type="button" onClick={() => setDistrict("")} className="text-xs text-[#9CA3AF] hover:text-[#6B7280]">변경</button>
            </div>
          )}
        </div>

        {/* 자녀 수 — SVG 아이콘 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Baby className="h-4 w-4 text-[#FF6B6B]" />
            자녀 수
          </div>
          <div className="flex items-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setChildrenCount(n)}
                className={`flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all active:scale-95 ${
                  childrenCount === n ? "bg-[#FFF0F0]" : "hover:bg-[#F8F8F8]"
                }`}
              >
                {n === 0 ? (
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    <span className="text-xs text-[#9CA3AF]">-</span>
                  </div>
                ) : (
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(n, 3) }).map((_, i) => (
                      <BabyIcon key={i} filled={childrenCount === n} size={n > 2 ? 24 : 28} />
                    ))}
                    {n > 3 && <span className="text-xs text-[#FF6B6B] font-bold ml-1 self-center">+{n - 3}</span>}
                  </div>
                )}
                <span className={`text-[11px] font-medium ${
                  childrenCount === n ? "text-[#FF6B6B]" : "text-[#9CA3AF]"
                }`}>
                  {n === 0 ? "없음" : n === 5 ? "5+" : `${n}명`}
                </span>
              </button>
            ))}
          </div>

          {childrenCount > 0 && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-medium text-[#6B7280]">자녀 연령 (중복 선택)</label>
              <div className="flex flex-wrap gap-2">
                {CHILD_AGE_OPTIONS.map((option) => (
                  <label
                    key={option.label}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs cursor-pointer transition-colors ${
                      isAgeChecked(option)
                        ? "bg-[#FFF0F0] border-[#FF6B6B]/30 text-[#1A1A1A] font-medium"
                        : "bg-white border-[#F3F4F6] text-[#6B7280] hover:border-[#E5E7EB]"
                    }`}
                  >
                    <Checkbox
                      checked={isAgeChecked(option)}
                      onCheckedChange={() => toggleAge(option)}
                      className="h-3.5 w-3.5"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 소득 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Wallet className="h-4 w-4 text-[#FF6B6B]" />
            우리 가족 월 소득
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: "low", label: "200만원 이하", sub: "더 많은 혜택 대상" },
              { value: "middle", label: "200~500만원", sub: "대부분의 혜택 대상" },
              { value: "high", label: "500만원 이상", sub: "기본 혜택 대상" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIncomeLevel(opt.value)}
                className={`flex items-center justify-between h-14 px-4 rounded-xl border text-left transition-all active:scale-[0.98] ${
                  incomeLevel === opt.value
                    ? "bg-white border-[#FF6B6B] ring-1 ring-[#FF6B6B]"
                    : "bg-white border-[#F3F4F6] hover:border-[#E5E7EB]"
                }`}
              >
                <div>
                  <p className={`text-sm font-semibold ${incomeLevel === opt.value ? "text-[#FF6B6B]" : "text-[#1A1A1A]"}`}>{opt.label}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{opt.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  incomeLevel === opt.value ? "border-[#FF6B6B]" : "border-[#E5E7EB]"
                }`}>
                  {incomeLevel === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full h-12 rounded-xl bg-[#FF6B6B] hover:bg-[#e85d5d] text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          onClick={handleSubmit}
        >
          <Heart className="mr-2 h-4 w-4" />
          혜택 찾기
        </Button>
      </CardContent>
    </Card>
  );
}
