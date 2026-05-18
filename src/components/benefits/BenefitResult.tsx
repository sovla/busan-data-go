"use client";

import { Benefit } from "@/types/benefit";
import { BenefitCard } from "./BenefitCard";

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
  if (!searched) return null;

  if (benefits.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          입력하신 조건에 맞는 혜택이 없습니다.
        </p>
        <p className="text-muted-foreground text-xs mt-1">
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

  return (
    <div className="mt-8">
      <div className="mb-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-sm font-medium text-foreground mb-1">
          총 {benefits.length}개의 혜택이 매칭되었습니다
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {totalMonthly > 0 && (
            <span>
              월 정기 지원:{" "}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </div>
  );
}
