"use client";

import { useState, useRef } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { Loader2, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAnalysisProps {
  benefits: Benefit[];
  userContext: BenefitMatchRequest;
}

export function AIAnalysis({ benefits, userContext }: AIAnalysisProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleAnalyze() {
    if (loading) return;

    setText("");
    setDone(false);
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/benefits/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benefits, userContext }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("분석 요청 실패");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setDone(true);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setText("분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FFF8F0] flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-[#FF6B6B]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">상세 분석</p>
            <p className="text-xs text-gray-400">
              내 상황에 맞게 분석해드려요
            </p>
          </div>
        </div>
        {!loading && !done && (
          <Button
            onClick={handleAnalyze}
            size="sm"
            className="bg-[#FF6B6B] hover:bg-[#e85d5d] text-white border-0 shadow-sm"
          >
            <Search className="h-3.5 w-3.5 mr-1.5" />
            분석 시작
          </Button>
        )}
        {done && (
          <Button
            onClick={handleAnalyze}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            다시 분석
          </Button>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading && !text && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-[#FF6B6B] animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            상황을 분석하고 있어요...
          </p>
          <p className="text-xs text-gray-400">잠시만 기다려 주세요</p>
        </div>
      )}

      {/* 스트리밍 텍스트 결과 */}
      {text && (
        <div className="px-5 py-4">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {text}
            {loading && (
              <span className="inline-block h-4 w-0.5 bg-[#FF6B6B] animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        </div>
      )}

      {/* 초기 안내 (분석 전) */}
      {!loading && !done && !text && (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-center px-6">
          <ChevronDown className="h-5 w-5 text-gray-300" />
          <p className="text-sm text-gray-500">
            버튼을 눌러 내 혜택을 상세 분석해보세요
          </p>
          <p className="text-xs text-gray-400">
            연간 수혜 금액, TOP 3 혜택, 즉시 신청 가능 항목 등을 알려드려요
          </p>
        </div>
      )}
    </div>
  );
}
