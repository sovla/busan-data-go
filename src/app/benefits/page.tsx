"use client";

import { useState } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";
import { BenefitForm } from "@/components/benefits/BenefitForm";
import { BenefitResult } from "@/components/benefits/BenefitResult";
import { Sparkles } from "lucide-react";

export default function BenefitsPage() {
  const [results, setResults] = useState<Benefit[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSearch(request: BenefitMatchRequest) {
    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const matched = matchBenefits(request);
      setResults(matched);
      setSearched(true);
      setLoading(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/60 via-violet-50/30 to-background">
      {/* 헤더 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-400 to-violet-500 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-300/30 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80 tracking-wide">
              맘편한 부산
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI 맞춤 혜택 매칭
          </h1>
          <p className="text-white/80 text-sm max-w-md leading-relaxed">
            당신의 상황에 맞는 출산·육아 혜택을 AI가 찾아드립니다.
            <br />
            조건을 입력하면 부산시 전체 혜택 중 나에게 맞는 것만 골라드려요.
          </p>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <BenefitForm onSearch={handleSearch} />
          </div>
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-violet-200 bg-violet-50/40">
                <div className="relative mb-4">
                  <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-500 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-violet-500" />
                </div>
                <p className="text-sm font-medium text-violet-700">
                  AI가 혜택을 분석하고 있어요...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  잠시만 기다려 주세요
                </p>
              </div>
            ) : (
              <BenefitResult benefits={results} searched={searched} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
