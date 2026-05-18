"use client";

import { useState } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";
import { BenefitForm } from "@/components/benefits/BenefitForm";
import { BenefitResult } from "@/components/benefits/BenefitResult";
import { AIAnalysis } from "@/components/benefits/AIAnalysis";
import { Heart } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { AnimatePresence, motion } from "framer-motion";

function SkeletonCards() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gray-100 h-32 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-gray-100 h-48 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

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
    <PageTransition>
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
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkeletonCards />
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <BenefitResult benefits={results} searched={searched} />
                  {searched && results.length > 0 && userContext && (
                    <div className="mt-6">
                      <AIAnalysis benefits={results} userContext={userContext} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
    </PageTransition>
  );
}
