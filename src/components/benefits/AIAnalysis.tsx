"use client";

import { useState, useRef } from "react";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="rounded-2xl border border-[#F3F4F6] bg-white shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FFF8F0] flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-[#FF6B6B]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">상세 분석</p>
            <p className="text-xs text-[#9CA3AF]">
              내 상황에 맞게 분석해드려요
            </p>
          </div>
        </div>
        {!loading && !done && (
          <Button
            onClick={handleAnalyze}
            size="sm"
            className="h-9 rounded-xl bg-[#FF6B6B] hover:bg-[#e85d5d] text-white border-0 shadow-sm text-xs font-semibold"
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
            className="h-9 rounded-xl text-[#6B7280] border-[#F3F4F6] hover:bg-[#F8F8F8] text-xs"
          >
            다시 분석
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* shimmer 로딩 상태 */}
        {loading && !text && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-5 py-6 space-y-3"
          >
            <div className="h-3 rounded-2xl bg-[#F3F4F6] animate-pulse w-3/4" />
            <div className="h-3 rounded-2xl bg-[#F3F4F6] animate-pulse w-full" />
            <div className="h-3 rounded-2xl bg-[#F3F4F6] animate-pulse w-5/6" />
            <div className="h-3 rounded-2xl bg-[#F3F4F6] animate-pulse w-2/3" />
          </motion.div>
        )}

        {/* 스트리밍 텍스트 결과 */}
        {text && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 py-4"
          >
            <div className="prose prose-sm max-w-none text-[#6B7280] leading-relaxed whitespace-pre-wrap">
              {text}
              {loading && (
                <span className="inline-block h-4 w-0.5 bg-[#FF6B6B] animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </motion.div>
        )}

        {/* 초기 안내 (분석 전) */}
        {!loading && !done && !text && (
          <motion.div
            key="guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-8 gap-2 text-center px-6"
          >
            <ChevronDown className="h-5 w-5 text-[#F3F4F6]" />
            <p className="text-sm text-[#6B7280]">
              버튼을 눌러 내 혜택을 상세 분석해보세요
            </p>
            <p className="text-xs text-[#9CA3AF]">
              연간 수혜 금액, TOP 3 혜택, 즉시 신청 가능 항목 등을 알려드려요
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
