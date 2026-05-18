"use client";

import { useState } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";
import { BenefitForm } from "@/components/benefits/BenefitForm";
import { BenefitResult } from "@/components/benefits/BenefitResult";
import { AIAnalysis } from "@/components/benefits/AIAnalysis";
import { Heart } from "lucide-react";

export default function BenefitsPage() {
  const [results, setResults] = useState<Benefit[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState<BenefitMatchRequest | null>(null);

  function handleSearch(request: BenefitMatchRequest) {
    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const matched = matchBenefits(request);
      setResults(matched);
      setUserContext(request);
      setSearched(true);
      setLoading(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-[#FFF8F0] flex items-center justify-center">
              <Heart className="h-4 w-4 text-[#FF6B6B]" />
            </div>
            <span className="text-sm font-medium text-gray-400">
              맘편한 부산
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            맞춤 혜택 찾기
          </h1>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            조건에 맞는 혜택을 찾아드려요.
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
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-72 rounded-2xl border border-dashed border-gray-200 bg-gray-50/40">
                <div className="relative mb-4">
                  <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#FF6B6B] animate-spin" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  혜택을 찾고 있어요...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  잠시만 기다려 주세요
                </p>
              </div>
            ) : (
              <>
                <BenefitResult benefits={results} searched={searched} />
                {searched && results.length > 0 && userContext && (
                  <AIAnalysis benefits={results} userContext={userContext} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
