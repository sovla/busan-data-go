"use client";

import { Benefit } from "@/types/benefit";
import { ExternalLink } from "lucide-react";

interface BenefitCardProps {
  benefit: Benefit;
}

const CATEGORY_DOTS: Record<string, string> = {
  출산지원: "bg-rose-400",
  양육지원: "bg-violet-400",
  보육지원: "bg-violet-400",
  임산부지원: "bg-rose-400",
  다자녀지원: "bg-sky-400",
  주거지원: "bg-emerald-400",
};

export function BenefitCard({ benefit }: BenefitCardProps) {
  const dot = CATEGORY_DOTS[benefit.category] ?? "bg-gray-400";

  return (
    <button
      type="button"
      onClick={() => benefit.url && window.open(benefit.url, "_blank")}
      className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#F3F4F6] text-left transition-all hover:shadow-sm hover:border-[#E5E7EB] active:scale-[0.98]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
          <span className="text-[10px] text-[#9CA3AF] font-medium">{benefit.category}</span>
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A] leading-snug">{benefit.title}</p>
        <p className="text-base font-bold text-[#FF6B6B] mt-1">{benefit.amount}</p>
        <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2 leading-relaxed">{benefit.description}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-[#D1D5DB] flex-shrink-0 mt-1" />
    </button>
  );
}
