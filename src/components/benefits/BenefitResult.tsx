"use client";

import { useEffect, useRef, useState } from "react";
import { Benefit } from "@/types/benefit";
import { BenefitCard } from "./BenefitCard";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BenefitResultProps {
  benefits: Benefit[];
  searched: boolean;
  isPregnant?: boolean;
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

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function BenefitResult({ benefits, searched, isPregnant = false }: BenefitResultProps) {
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-[#F3F4F6] bg-white text-center px-6">
        <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center mb-4">
          <Heart className="h-6 w-6 text-[#FF6B6B]" />
        </div>
        <p className="text-base font-medium text-[#1A1A1A]">
          맞춤 혜택을 찾아드릴게요
        </p>
        <p className="text-sm text-[#9CA3AF] mt-1">
          조건을 입력하면 맞춤 혜택을 찾아드려요
        </p>
      </div>
    );
  }

  if (benefits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-[#F3F4F6] bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
          <Heart className="h-6 w-6 text-[#9CA3AF]" />
        </div>
        <p className="text-base font-medium text-[#1A1A1A]">
          매칭된 혜택이 없어요
        </p>
        <p className="text-sm text-[#6B7280] mt-1">
          조건을 변경하여 다시 검색해 보세요.
        </p>
      </div>
    );
  }

  const summableBenefits = benefits.filter(
    (b) => !(isPregnant && b.eligibility.excludeWhenPregnant)
  );

  const dedupeByGroup = (items: Benefit[]): Benefit[] => {
    const groups = new Map<string, Benefit>();
    const ungrouped: Benefit[] = [];
    for (const b of items) {
      const g = b.eligibility.exclusionGroup;
      if (g) {
        const existing = groups.get(g);
        if (!existing || b.amountValue > existing.amountValue) groups.set(g, b);
      } else {
        ungrouped.push(b);
      }
    }
    return [...ungrouped, ...groups.values()];
  };

  const monthlyItems = dedupeByGroup(summableBenefits.filter((b) => b.amount.includes("월")));
  const oneTimeItems = dedupeByGroup(summableBenefits.filter((b) => !b.amount.includes("월") && b.amountValue > 0));

  const totalMonthly = monthlyItems.reduce((sum, b) => sum + b.amountValue, 0);
  const totalOneTime = oneTimeItems.reduce((sum, b) => sum + b.amountValue, 0);
  const annualEstimate = totalMonthly * 12 + totalOneTime;

  const immediateCount = benefits.filter(isImmediatelyApplicable).length;
  const conditionalCount = benefits.length - immediateCount;

  return <BenefitResultInner
    benefits={benefits}
    annualEstimate={annualEstimate}
    totalMonthly={totalMonthly}
    totalOneTime={totalOneTime}
    immediateCount={immediateCount}
    conditionalCount={conditionalCount}
  />;
}

function BenefitResultInner({
  benefits,
  annualEstimate,
  totalMonthly,
  totalOneTime,
  immediateCount,
  conditionalCount,
}: {
  benefits: Benefit[];
  annualEstimate: number;
  totalMonthly: number;
  totalOneTime: number;
  immediateCount: number;
  conditionalCount: number;
}) {
  const countedAnnual = useCountUp(annualEstimate);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 총 수혜 금액 요약 카드 */}
      <div className="rounded-2xl bg-[#FFF8F0] border border-[#F3F4F6] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-[#FF6B6B]" />
              <p className="text-sm font-medium text-[#6B7280]">매칭 완료</p>
            </div>
            {annualEstimate > 0 && (
              <p className="text-xl font-bold text-[#1A1A1A] leading-tight">
                연간 약{" "}
                <span className="text-[#FF6B6B]">
                  {formatAmount(countedAnnual)}
                </span>{" "}
                수혜 가능
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#6B7280]">
              {totalMonthly > 0 && (
                <span>
                  월 정기:{" "}
                  <strong className="text-[#1A1A1A]">
                    {formatAmount(totalMonthly)}/월
                  </strong>
                </span>
              )}
              {totalOneTime > 0 && (
                <span>
                  일시 지원:{" "}
                  <strong className="text-[#1A1A1A]">
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

      {/* 혜택 카드 목록 — stagger 진입 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {benefits.map((benefit) => (
          <motion.div key={benefit.id} variants={item}>
            <BenefitCard benefit={benefit} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
