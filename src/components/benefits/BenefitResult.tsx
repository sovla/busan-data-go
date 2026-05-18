"use client";

import { Benefit } from "@/types/benefit";
import { BenefitCard } from "./BenefitCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface BenefitResultProps {
  benefits: Benefit[];
  searched: boolean;
}

function formatAmount(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만원`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만원`;
  return `${value.toLocaleString()}원`;
}

export function BenefitResult({ benefits, searched }: BenefitResultProps) {
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-rose-200 bg-rose-50/30 text-center px-6">
        <div className="text-5xl mb-4">🍀</div>
        <p className="text-base font-medium text-rose-700">
          맞춤 혜택을 찾아드릴게요
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          조건을 입력하면 AI가 맞춤 혜택을 찾아드려요
        </p>
      </div>
    );
  }

  if (benefits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-base font-medium text-foreground">
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

  return (
    <div className="space-y-6">
      {/* 총 수혜 금액 요약 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-violet-50 border border-rose-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-rose-500" />
              <p className="text-sm font-medium text-rose-700">AI 매칭 완료</p>
            </div>
            {annualEstimate > 0 && (
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                연간 약{" "}
                <span className="text-rose-600">
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
          </div>
          <Badge className="shrink-0 bg-rose-500 hover:bg-rose-500 text-white text-sm px-3 py-1">
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
