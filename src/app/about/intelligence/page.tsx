"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Wrench,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  X,
  Heart,
  MapPin,
  Navigation,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { LiveDemoCard } from "@/components/about/LiveDemoCard";
import Link from "next/link";

const coreCapabilities = [
  {
    icon: MessageSquare,
    title: "자연어 상담",
    desc: "복잡한 메뉴 탐색 없이 한 줄 질문으로 답을 얻습니다. 부산 행정 용어와 출산·육아 도메인에 맞춰 시스템 프롬프트를 튜닝했습니다.",
  },
  {
    icon: Wrench,
    title: "Tool Use 기반 실시간 검색",
    desc: "searchFacilities · searchBenefits 두 종류의 도구를 모델이 스스로 호출해 Supabase 공공데이터에서 결과를 가져옵니다.",
  },
  {
    icon: Search,
    title: "조건 자동 추출",
    desc: "“해운대 사는 둘째 출산 가정” 같은 자연어에서 구군·자녀 수·소득 조건을 추출해 매칭 조건으로 변환합니다.",
  },
  {
    icon: Layers,
    title: "멀티턴 맥락 유지",
    desc: "이전 대화 맥락을 유지하며 후속 질문에도 일관된 답변을 제공합니다 (최대 3단계 도구 호출).",
  },
];

const stack = [
  { label: "기반 모델", value: "Claude Sonnet 4 (Anthropic)" },
  { label: "프레임워크", value: "Vercel AI SDK v6" },
  { label: "도구 호출", value: "tool calling (Function Calling)" },
  { label: "데이터 조회", value: "Supabase (PostGIS + RLS)" },
  { label: "스트리밍 응답", value: "streamText + UI Message Stream" },
];

type CompareRow = {
  feature: string;
  ours: boolean;
  gov24: boolean;
  bokjiro: boolean;
  busanPortal: boolean;
};

const compareTable: CompareRow[] = [
  { feature: "자연어 대화형 검색", ours: true, gov24: false, bokjiro: false, busanPortal: false },
  { feature: "부산 시설 위치 통합 지도", ours: true, gov24: false, bokjiro: false, busanPortal: false },
  { feature: "지하철 유모차 접근성", ours: true, gov24: false, bokjiro: false, busanPortal: false },
  { feature: "조건 기반 자동 혜택 매칭", ours: true, gov24: false, bokjiro: true, busanPortal: false },
  { feature: "모바일 앱 퍼스트 UX", ours: true, gov24: false, bokjiro: false, busanPortal: false },
  { feature: "부산 공공데이터 직접 활용", ours: true, gov24: false, bokjiro: false, busanPortal: true },
];

const competitors = [
  { key: "ours" as const, label: "맘편한\n부산", highlight: true },
  { key: "gov24" as const, label: "정부24", highlight: false },
  { key: "bokjiro" as const, label: "복지로", highlight: false },
  { key: "busanPortal" as const, label: "부산\n포털", highlight: false },
];

type ScenarioStep = { label: string; detail: string };

const scenarios: { icon: typeof Heart; tag: string; title: string; steps: ScenarioStep[] }[] = [
  {
    icon: Heart,
    tag: "혜택 매칭",
    title: "둘째 출산하면 지원금 얼마야?",
    steps: [
      { label: "조건 추출", detail: "둘째 자녀 · 출산" },
      { label: "도구 호출", detail: "searchBenefits(keyword=\"출산\")" },
      { label: "응답", detail: "부산 출산 장려금 · 첫만남 이용권 · 부모급여 통합 안내" },
    ],
  },
  {
    icon: MapPin,
    tag: "시설 검색",
    title: "해운대구에 수유실 어디 있어?",
    steps: [
      { label: "조건 추출", detail: "구군=해운대구 · 유형=nursing_room" },
      { label: "도구 호출", detail: "searchFacilities(district, type)" },
      { label: "응답", detail: "Supabase 실시간 조회 → 5건 (롯데백화점·벡스코 등)" },
    ],
  },
  {
    icon: Navigation,
    tag: "유모차 경로",
    title: "유모차로 가기 좋은 지하철역 알려줘",
    steps: [
      { label: "조건 추출", detail: "엘리베이터 + 수유실 우선" },
      { label: "데이터 조회", detail: "metro_accessibility · 114역 접근성 점수화" },
      { label: "응답", detail: "안전 등급별 추천 역 + 편의시설 안내" },
    ],
  },
];

const qualityChecks = [
  {
    icon: ShieldCheck,
    title: "도메인 시스템 프롬프트",
    desc: "출산·육아 영역에만 답하도록 범위를 제한하여 환각(hallucination)을 최소화합니다.",
  },
  {
    icon: Search,
    title: "출처 기반 응답",
    desc: "모든 시설·혜택 정보는 Supabase 공공데이터에서 도구를 통해 조회한 결과만 사용합니다.",
  },
  {
    icon: Sparkles,
    title: "Tool Step 제한",
    desc: "stopWhen: stepCountIs(3)으로 무한 호출을 방지하고 응답 시간을 일정 수준으로 유지합니다.",
  },
];

export default function IntelligencePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white pb-24">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 h-14">
            <Link
              href="/more"
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors"
              aria-label="뒤로"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-base font-bold text-gray-900">기술 개요</h1>
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 space-y-8 pt-6">
          {/* 비전 */}
          <section>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDFB]">
              <Sparkles className="w-3 h-3 text-[#4ECDC4]" />
              <span className="text-[11px] font-medium text-[#4ECDC4]">대화형 인터페이스</span>
            </div>
            <h2 className="mt-3 text-[22px] font-bold text-gray-900 leading-snug">
              검색이 아닌 대화로<br />
              필요한 정보를 매칭합니다
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              메뉴를 탐색하는 기존 포털 방식 대신, 부모가 일상 언어로 묻고
              그 자리에서 부산 공공데이터로부터 답을 받는 경험을 설계했습니다.
            </p>
          </section>

          {/* 핵심 역량 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              핵심 역량
            </h3>
            <div className="space-y-3">
              {coreCapabilities.map((c) => {
                const Icon = c.icon;
                return (
                  <Card key={c.title} className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#FF6B6B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {c.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                          {c.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 기술 스택 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              기술 스택
            </h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-gray-50">
                  {stack.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="text-xs text-gray-500">{s.label}</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 응답 품질 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              응답 품질 관리
            </h3>
            <div className="space-y-3">
              {qualityChecks.map((q) => {
                const Icon = q.icon;
                return (
                  <Card key={q.title} className="border-0 shadow-sm">
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="w-8 h-8 rounded-lg bg-[#F0FDFB] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#4ECDC4]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{q.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                          {q.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 사용 사례 시나리오 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              사용 사례
            </h3>
            <div className="space-y-3">
              {scenarios.map((sc) => {
                const Icon = sc.icon;
                return (
                  <Card key={sc.title} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FFF0F0] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#FF6B6B]" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B6B]">
                          {sc.tag}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        “{sc.title}”
                      </p>
                      <div className="mt-3 space-y-2">
                        {sc.steps.map((step, si) => (
                          <div key={si} className="flex items-start gap-3">
                            <div className="flex flex-col items-center pt-0.5">
                              <div className="w-4 h-4 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                                <span className="text-[9px] font-bold text-[#FF6B6B]">
                                  {si + 1}
                                </span>
                              </div>
                              {si < sc.steps.length - 1 && (
                                <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[10px]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pb-2">
                              <p className="text-[11px] font-medium text-gray-500">
                                {step.label}
                              </p>
                              <p className="mt-0.5 text-[12px] text-gray-800 leading-relaxed break-words">
                                {step.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 차별성 비교표 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              유사 서비스 비교
            </h3>
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50/60 border-b border-gray-100">
                        <th className="text-left font-medium text-gray-500 px-3 py-3 min-w-[120px] text-[11px]">
                          기능
                        </th>
                        {competitors.map((c) => (
                          <th
                            key={c.key}
                            className={`text-center font-semibold px-1.5 py-3 whitespace-pre-line leading-tight text-[11px] ${
                              c.highlight ? "text-[#FF6B6B]" : "text-gray-500"
                            }`}
                          >
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {compareTable.map((row, ri) => (
                        <tr
                          key={row.feature}
                          className={ri > 0 ? "border-t border-gray-50" : ""}
                        >
                          <td className="px-3 py-3 text-gray-700 text-[12px] leading-tight">{row.feature}</td>
                          {competitors.map((c) => (
                            <td
                              key={c.key}
                              className={`text-center px-2 py-3 ${
                                c.highlight ? "bg-[#FFF8F0]/40" : ""
                              }`}
                            >
                              {row[c.key] ? (
                                <Check
                                  className={`w-4 h-4 mx-auto ${
                                    c.highlight ? "text-[#FF6B6B]" : "text-gray-400"
                                  }`}
                                />
                              ) : (
                                <X className="w-3.5 h-3.5 mx-auto text-gray-200" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
              ※ 비교 항목은 각 서비스의 공개된 기능 기준으로 작성되었습니다.
            </p>
          </section>

          {/* 라이브 데모 */}
          <LiveDemoCard />

          {/* 푸터 */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-gray-400">
              2026 부산광역시 공공데이터 활용 창업경진대회 출품작
            </p>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
