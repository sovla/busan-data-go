"use client";

import { Benefit } from "@/types/benefit";
import { BenefitCard } from "./BenefitCard";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Clock } from "lucide-react";

interface BenefitResultProps {
  benefits: Benefit[];
  searched: boolean;
}

function formatAmount(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만원`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만원`;
  return `${value.toLocaleString()}원`;
}

function isImmediatelyApplicable(benefit: Benefit): boolean {
  const easyProviders = ["정부(보건복지부)", "보건소"];
  const hasSimpleApply =
    benefit.how_to_apply.includes("주민센터") ||
    benefit.how_to_apply.includes("복지로") ||
    benefit.how_to_apply.includes("정부24") ||
    benefit.how_to_apply.includes("보건소");
  return easyProviders.includes(benefit.provider) || hasSimpleApply;
}

export function BenefitResult({ benefits, searched }: BenefitResultProps) {
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center mb-4">
          <Heart className="h-6 w-6 text-[#FF6B6B]" />
        </div>
        <p className="text-base font-medium text-gray-700">
          맞춤 혜택을 찾아드릴게요
        </p>
        <p className="text-sm text-gray-400 mt-1">
          조건을 입력하면 맞춤 혜택을 찾아드려요
        </p>
      </div>
    );
  }

  if (benefits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Heart className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-base font-medium text-gray-700">
          매칭된 혜택이 없어요
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          조건을 변경하여 다시 검색해 보세요.
        </p>
      </div>
    );
  }

  const totalMonthly = benefits
    .filter((b) => b.amount.includes("월"))
    .reduce((sum, b) => sum + b.amountValue, 0);

  const totalOneTime = benefits
    .filter((b) => !b.amount.includes("월") && b.amountValue > 0)
    .reduce((sum, b) => sum + b.amountValue, 0);

  const annualEstimate = totalMonthly * 12 + totalOneTime;

  const immediateCount = benefits.filter(isImmediatelyApplicable).length;
  const conditionalCount = benefits.length - immediateCount;

  return (
    <div className="space-y-6">
      {/* 총 수혜 금액 요약 카드 */}
      <div className="rounded-2xl bg-[#FFF8F0] border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-[#FF6B6B]" />
              <p className="text-sm font-medium text-gray-700">매칭 완료</p>
            </div>
            {annualEstimate > 0 && (
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                연간 약{" "}
                <span className="text-[#FF6B6B]">
                  {formatAmount(annualEstimate)}
                </span>{" "}
                수혜 가능
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              {totalMonthly > 0 && (
                <span>
                  월 정기:{" "}
                  <strong className="text-foreground">
                    {formatAmount(totalMonthly)}/월
                  </strong>
                </span>
              )}
              {totalOneTime > 0 && (
                <span>
                  일시 지원:{" "}
                  <strong className="text-foreground">
                    {formatAmount(totalOneTime)}
                  </strong>
                </span>
              )}
            </div>
            {/* 즉시 신청 / 조건 확인 Badge */}
            <div className="flex gap-2 mt-3">
              {immediateCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                  <Zap className="h-3 w-3" />
                  즉시 신청 가능 {immediateCount}개
                </span>
              )}
              {conditionalCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 text-xs font-medium">
                  <Clock className="h-3 w-3" />
                  조건 확인 필요 {conditionalCount}개
                </span>
              )}
            </div>
          </div>
          <Badge className="shrink-0 bg-[#FF6B6B] hover:bg-[#FF6B6B] text-white text-sm px-3 py-1">
            {benefits.length}개 혜택 매칭
          </Badge>
        </div>
      </div>

      {/* 혜택 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </div>
  );
}
