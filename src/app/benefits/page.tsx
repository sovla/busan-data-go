"use client";

import { useState } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";
import { BenefitForm } from "@/components/benefits/BenefitForm";
import { BenefitResult } from "@/components/benefits/BenefitResult";

export default function BenefitsPage() {
  const [results, setResults] = useState<Benefit[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(request: BenefitMatchRequest) {
    const matched = matchBenefits(request);
    setResults(matched);
    setSearched(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">AI 혜택 매칭</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            내 상황에 맞는 부산시 출산·육아 혜택을 찾아보세요.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BenefitForm onSearch={handleSearch} />
          </div>
          <div className="lg:col-span-2">
            <BenefitResult benefits={results} searched={searched} />
          </div>
        </div>
      </div>
    </main>
  );
}
