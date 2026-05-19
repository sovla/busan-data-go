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
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#F3F4F6] h-24 animate-pulse" />
      <div className="grid grid-cols-1 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-[#F3F4F6] h-48 animate-pulse" />
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
    <main className="flex flex-col bg-[#F8F8F8]">
      {/* 헤더 */}
      <div className="h-14 bg-white border-b border-[#F3F4F6] flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-[#FFF8F0] flex items-center justify-center">
            <Heart className="h-4 w-4 text-[#FF6B6B]" />
          </div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">맞춤 혜택 찾기</h1>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 px-4 py-6 space-y-4 pb-[calc(56px+env(safe-area-inset-bottom))]">
        <BenefitForm onSearch={handleSearch} />

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
              className="space-y-4"
            >
              <BenefitResult benefits={results} searched={searched} />
              {searched && results.length > 0 && userContext && (
                <AIAnalysis benefits={results} userContext={userContext} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
    </PageTransition>
  );
}
