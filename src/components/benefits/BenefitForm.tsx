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
import { Search } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">내 조건 입력하기</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-medium">임신 여부</label>
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
                isPregnant ? "bg-primary" : "bg-input"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  isPregnant ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm">{isPregnant ? "임신 중" : "임신 아님"}</span>
          </div>
          {isPregnant && (
            <Select
              value={pregnancyWeek?.toString() ?? ""}
              onValueChange={(v) => setPregnancyWeek(Number(v))}
            >
              <SelectTrigger>
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
          <label className="text-sm font-medium">거주 구군</label>
          <Select value={district} onValueChange={(v) => setDistrict(v ?? "")}>
            <SelectTrigger>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">자녀 수</label>
          <Select
            value={childrenCount.toString()}
            onValueChange={(v) => setChildrenCount(Number(v))}
          >
            <SelectTrigger>
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
            <label className="text-sm font-medium">자녀 연령 (중복 선택 가능)</label>
            <div className="flex flex-wrap gap-3">
              {CHILD_AGE_OPTIONS.map((option) => (
                <div key={option.label} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`age-${option.label}`}
                    checked={isAgeChecked(option)}
                    onCheckedChange={() => toggleAge(option)}
                  />
                  <label
                    htmlFor={`age-${option.label}`}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">소득 수준</label>
          <Select value={incomeLevel} onValueChange={(v) => setIncomeLevel(v ?? "")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">기초생활수급자 / 차상위</SelectItem>
              <SelectItem value="middle">중위소득 이하</SelectItem>
              <SelectItem value="high">소득 제한 없음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          <Search className="mr-2 h-4 w-4" />
          혜택 찾기
        </Button>
      </CardContent>
    </Card>
  );
}
