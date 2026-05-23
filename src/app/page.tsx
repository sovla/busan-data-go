"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, MapPin, Baby, Navigation, Sparkles, ArrowRight, Briefcase, Lightbulb } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import ToolResultCard from "@/components/chat/ToolResultCard";
import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";

const SUGGESTIONS = [
  { icon: Heart, label: "내 맞춤 혜택 찾기", query: "내 조건에 맞는 출산·육아 혜택을 알려줘", color: "#FF6B6B", bg: "#FFF0F0" },
  { icon: MapPin, label: "주변 수유실 찾기", query: "근처 수유실 위치를 알려줘", color: "#4ECDC4", bg: "#F0FDFB" },
  { icon: Baby, label: "출산 장려금 안내", query: "부산 출산 장려금 얼마야?", color: "#9B59B6", bg: "#F8F0FF" },
  { icon: Navigation, label: "유모차 길 안내", query: "유모차로 이동하기 좋은 지하철역 알려줘", color: "#F39C12", bg: "#FFF8E7" },
];

const QUICK_QUESTIONS = [
  "해운대구에서 받을 수 있는 혜택은?",
  "둘째 출산하면 지원금 얼마야?",
  "부산 어린이집 추천해줘",
  "임산부 교통비 지원 받을 수 있어?",
  "무상보육 대상 조건이 뭐야?",
];

const STATS = [
  { label: "수유실", value: "291" },
  { label: "키즈카페", value: "69" },
  { label: "어린이집", value: "317" },
  { label: "산후조리원", value: "12" },
  { label: "도시철도", value: "114역" },
  { label: "보행자길", value: "31" },
  { label: "안심학교", value: "458" },
  { label: "혜택", value: "15종" },
];

export default function HomePage() {
  const chat = useMemo(
    () => new Chat({ transport: new DefaultChatTransport({ api: "/api/chat" }) }),
    []
  );
  const { messages, status, sendMessage } = useChat({ chat });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSend = (query: string) => {
    sendMessage({ text: query });
  };

  const getMessageText = (msg: (typeof messages)[number]) => {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  const getToolParts = (msg: (typeof messages)[number]) => {
    return msg.parts.filter(
      (p) =>
        p.type === "tool-searchFacilities" ||
        p.type === "tool-searchBenefits"
    );
  };

  const mergedMessages = useMemo(() => {
    const result: (typeof messages) = [];
    for (const msg of messages) {
      const prev = result[result.length - 1];
      if (prev && prev.role === "assistant" && msg.role === "assistant") {
        result[result.length - 1] = {
          ...prev,
          parts: [...prev.parts, ...msg.parts],
        };
      } else {
        result.push(msg);
      }
    }
    return result;
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <PageTransition>
      <div className="flex flex-col h-screen bg-white">
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="min-h-full flex flex-col">
              {/* 히어로 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-6 pt-14 pb-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#FF6B6B]">맘편한 부산</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-[28px] font-bold text-gray-900 leading-tight"
                >
                  부산에서 아이 키우기,<br />
                  무엇이든 물어보세요
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-sm text-gray-400 mt-2"
                >
                  출산·육아 혜택부터 주변 시설까지, AI가 찾아드려요
                </motion.p>
              </motion.div>

              {/* 기능 카드 4개 — 2x2 그리드 */}
              <div className="px-6 pb-5">
                <div className="grid grid-cols-2 gap-3">
                  {SUGGESTIONS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.35 }}
                        onClick={() => handleSend(item.query)}
                        className="flex flex-col gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.97] hover:shadow-md border border-gray-100 bg-white shadow-sm"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: item.bg }}
                        >
                          <Icon className="h-5 w-5" style={{ color: item.color }} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-800">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 자주 묻는 질문 */}
              <div className="px-6 pb-5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">자주 묻는 질문</p>
                <div className="flex flex-col gap-2">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.06, duration: 0.3 }}
                      onClick={() => handleSend(q)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group active:scale-[0.98]"
                    >
                      <span className="text-sm text-gray-600">{q}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 ml-2" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 데이터 통계 배너 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mx-6 mb-5"
              >
                <Link
                  href="/more#public-data"
                  className="block rounded-2xl bg-[#FFF8F0] p-5 transition-all active:scale-[0.98] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-[#E8847C]">부산시 공공데이터 활용</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">8종 36,531건 실시간 연동</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#E8847C]" />
                  </div>
                  <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                    {STATS.map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-[15px] font-bold text-gray-900 leading-tight">{s.value}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Link>
              </motion.div>

              {/* 바로가기 */}
              <div className="px-6 pb-5">
                <div className="flex gap-2">
                  <Link href="/map" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-gray-500">
                    <MapPin className="h-3.5 w-3.5" /> 시설 지도
                  </Link>
                  <Link href="/benefits" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-gray-500">
                    <Heart className="h-3.5 w-3.5" /> 혜택 매칭
                  </Link>
                  <Link href="/stroller" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-gray-500">
                    <Navigation className="h-3.5 w-3.5" /> 유모차 길
                  </Link>
                </div>
              </div>

              {/* 서비스 소개 (심사위원 동선) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.4 }}
                className="px-6 pb-8"
              >
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  서비스 소개
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/about/business"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all active:scale-[0.97]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDFB] flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-4 w-4 text-[#4ECDC4]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">사업 소개</p>
                      <p className="text-[10px] text-gray-400 truncate">시장·BM·로드맵</p>
                    </div>
                  </Link>
                  <Link
                    href="/about/intelligence"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all active:scale-[0.97]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-[#FF6B6B]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">기술 소개</p>
                      <p className="text-[10px] text-gray-400 truncate">핵심 역량·차별성</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-4">
              {mergedMessages.map((msg) => {
                const text = getMessageText(msg);
                const toolParts = msg.role === "assistant" ? getToolParts(msg) : [];

                return (
                  <div key={msg.id} className="space-y-2">
                    {text && (
                      <ChatMessage
                        role={msg.role as "user" | "assistant"}
                        content={text}
                      />
                    )}
                    {toolParts.map((part, i) => {
                      const toolPart = part as {
                        type: string;
                        state: string;
                        toolCallId: string;
                        toolName: string;
                        output?: Record<string, unknown>;
                      };
                      if (toolPart.state === "output-available" && toolPart.output) {
                        return (
                          <div key={toolPart.toolCallId} className="flex items-end gap-2">
                            <div className="w-8 flex-shrink-0" />
                            <div className="max-w-[75%]">
                              <ToolResultCard
                                toolName={toolPart.toolName}
                                result={toolPart.output}
                              />
                            </div>
                          </div>
                        );
                      }
                      if (toolPart.state === "input-available" || toolPart.state === "input-streaming") {
                        return (
                          <div key={toolPart.toolCallId ?? i} className="flex items-end gap-2">
                            <div className="w-8 flex-shrink-0" />
                            <div className="text-xs text-gray-400 px-4 py-2">
                              검색 중...
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-[#FF6B6B]" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-[#E8847C] rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100 pb-20">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </PageTransition>
  );
}
