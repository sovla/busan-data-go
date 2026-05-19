"use client";

import { useState } from "react";
import { BenefitMatchRequest } from "@/types/benefit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Baby, MapPin, Users, Wallet, Heart } from "lucide-react";

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

const STEPS = [
  { number: 1, label: "기본 정보" },
  { number: 2, label: "자녀 정보" },
  { number: 3, label: "소득" },
];

export function BenefitForm({ onSearch }: BenefitFormProps) {
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
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
    const vals = getVals(option);
    return vals.every((v) => selectedAges.includes(v));
  }

  function handleSubmit() {
    onSearch({
      pregnancy_week: isPregnant ? (pregnancyWeek ?? 1) : null,
      district,
      children_count: childrenCount,
      children_ages: selectedAges,
      income_level: incomeLevel,
    });
  }

  return (
    <Card className="rounded-2xl border border-[#F3F4F6] shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-[#1A1A1A]">내 조건 입력하기</CardTitle>
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-0 mt-3">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-[#FF6B6B] flex items-center justify-center text-white text-xs font-bold">
                  {step.number}
                </div>
                <span className="text-[10px] text-[#9CA3AF] mt-0.5 whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px w-8 bg-[#F3F4F6] mb-3 mx-1" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: 기본 정보 */}
        <div className="rounded-2xl bg-[#F8F8F8] border border-[#F3F4F6] p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Heart className="h-4 w-4 text-[#FF6B6B]" />
            <span>Step 1 · 기본 정보</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
              임신 여부
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isPregnant}
                onClick={() => {
                  setIsPregnant((v) => !v);
                  if (isPregnant) setPregnancyWeek(null);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isPregnant ? "bg-[#FF6B6B]" : "bg-input"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    isPregnant ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium">
                {isPregnant ? (
                  <span className="text-[#FF6B6B]">임신 중</span>
                ) : (
                  <span className="text-[#9CA3AF]">임신 아님</span>
                )}
              </span>
            </div>
            {isPregnant && (
              <Select
                value={pregnancyWeek?.toString() ?? ""}
                onValueChange={(v) => setPregnancyWeek(Number(v ?? ""))}
              >
                <SelectTrigger className="h-12 rounded-lg bg-white">
                  <SelectValue placeholder="임신 주수 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
                    <SelectItem key={week} value={week.toString()}>
                      {week}주
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              거주 구군
            </label>
            <Select value={district} onValueChange={(v) => setDistrict(v ?? "")}>
              <SelectTrigger className="h-12 rounded-lg bg-white">
                <SelectValue placeholder="구군 선택" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Step 2: 자녀 정보 */}
        <div className="rounded-2xl bg-[#F8F8F8] border border-[#F3F4F6] p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Baby className="h-4 w-4 text-[#FF6B6B]" />
            <span>Step 2 · 자녀 정보</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wide flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              자녀 수
            </label>
            <Select
              value={childrenCount.toString()}
              onValueChange={(v) => setChildrenCount(Number(v ?? "0"))}
            >
              <SelectTrigger className="h-12 rounded-lg bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n === 5 ? "5명 이상" : `${n}명`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {childrenCount > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                자녀 연령 (중복 선택)
              </label>
              <div className="flex flex-wrap gap-2">
                {CHILD_AGE_OPTIONS.map((option) => (
                  <label
                    key={option.label}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                      isAgeChecked(option)
                        ? "bg-[#FFF0F0] border-[#FF6B6B]/30 text-[#1A1A1A] font-medium"
                        : "bg-white border-[#F3F4F6] text-[#6B7280] hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      id={`age-${option.label}`}
                      checked={isAgeChecked(option)}
                      onCheckedChange={() => toggleAge(option)}
                      className="h-3 w-3"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: 소득 */}
        <div className="rounded-2xl bg-[#F8F8F8] border border-[#F3F4F6] p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
            <Wallet className="h-4 w-4 text-[#FF6B6B]" />
            <span>Step 3 · 소득 수준</span>
          </div>
          <Select value={incomeLevel} onValueChange={(v) => setIncomeLevel(v ?? "middle")}>
            <SelectTrigger className="h-12 rounded-lg bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">기초생활수급자 / 차상위</SelectItem>
              <SelectItem value="middle">중위소득 이하</SelectItem>
              <SelectItem value="high">소득 제한 없음</SelectItem>
            </SelectContent>
          </Select>
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
