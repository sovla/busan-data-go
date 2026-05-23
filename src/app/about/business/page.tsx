"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  TrendingDown,
  Target,
  Sparkles,
  Building2,
  Handshake,
  Database,
  Calendar,
  Leaf,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const marketStats = [
  {
    icon: Users,
    label: "부산 영유아 인구",
    value: "약 12만",
    unit: "명",
    note: "0~6세, 통계청 KOSIS 2024",
  },
  {
    icon: TrendingDown,
    label: "부산 합계출산율",
    value: "0.66",
    unit: "명",
    note: "전국 평균 0.72보다 낮음",
  },
  {
    icon: HeartHandshake,
    label: "임산부·육아 가구",
    value: "약 25만",
    unit: "가구",
    note: "잠재 사용자",
  },
];

const problems = [
  {
    title: "흩어진 출산·육아 정보",
    desc: "혜택은 시·구·중앙부처에 분산, 시설 정보는 별도 사이트마다 검색 필요",
  },
  {
    title: "낮은 공공시설 활용률",
    desc: "수유실·키즈카페·안심학교 등 공공 시설이 있어도 부모가 알지 못함",
  },
  {
    title: "정책 사각지대",
    desc: "조건이 복잡해 본인이 받을 수 있는 혜택을 놓치는 경우가 많음",
  },
];

const solutions = [
  {
    title: "자연어 상담",
    desc: "복잡한 조건도 한 줄 질문으로 매칭",
  },
  {
    title: "통합 지도",
    desc: "7종 시설 + 지하철 접근성 + 가맹점을 한 화면에",
  },
  {
    title: "맞춤 혜택 매칭",
    desc: "소득·가구·거주 구군 기반 즉시 매칭",
  },
];

const businessModels = [
  {
    icon: Building2,
    tag: "B2G",
    title: "지자체 SaaS 라이선스",
    desc: "부산시·자치구 대상 화이트라벨 제공. 인접 광역시(울산·창원·경남) 확장.",
  },
  {
    icon: Handshake,
    tag: "B2B",
    title: "시설 제휴 광고",
    desc: "산후조리원·키즈카페·소아청소년과 등 검증된 시설의 노출·예약 연계.",
  },
  {
    icon: Database,
    tag: "Data",
    title: "정책 인사이트 API",
    desc: "검색·이용 패턴 데이터를 비식별화하여 정책 수립용 인사이트로 제공.",
  },
];

const roadmap = [
  {
    period: "2026 H2",
    title: "베타 운영 · 사용자 검증",
    desc: "부산 임산부·예비부모 베타 테스트, 부산테크노파크 협력",
    active: true,
  },
  {
    period: "2027 H1",
    title: "부산시 정식 출시 · MOU",
    desc: "부산시·자치구 협력 MOU, 시설 데이터 실시간 연동 확대",
  },
  {
    period: "2027 H2",
    title: "동남권 확장",
    desc: "울산·창원·김해 등 인접 광역시로 확장",
  },
  {
    period: "2028+",
    title: "전국 확장 · 정책 인사이트",
    desc: "전국 광역시 단위 확장, 비식별 데이터 기반 정책 자문",
  },
];

const esg = [
  {
    icon: HeartHandshake,
    tag: "Social",
    title: "출산 장려·정보 격차 해소",
    desc: "잠재 수혜자 약 25만 가구. 출산율 0.66 부산에서 부모가 누락 없이 15종 혜택을 받도록 안내",
  },
  {
    icon: Leaf,
    tag: "Environment",
    title: "도보·대중교통 기반 매핑",
    desc: "114역 도시철도 + 31개 보행자우선도로 기반. 가까운 시설 우선 추천 → 차량 이용·탄소 배출 감소",
  },
  {
    icon: ShieldCheck,
    tag: "Governance",
    title: "공공데이터 투명 활용",
    desc: "8종 36,531건의 공공데이터를 출처·활용 위치와 함께 투명하게 공개",
  },
];

export default function BusinessPage() {
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
            <h1 className="text-base font-bold text-gray-900">사업 개요</h1>
          </div>
        </div>

        <div className="mx-auto max-w-lg px-4 space-y-8 pt-6">
          {/* 비전 */}
          <section>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F0]">
              <Sparkles className="w-3 h-3 text-[#FF6B6B]" />
              <span className="text-[11px] font-medium text-[#FF6B6B]">맘편한 부산</span>
            </div>
            <h2 className="mt-3 text-[22px] font-bold text-gray-900 leading-snug">
              부산 부모가 받을 수 있는 모든 혜택,<br />
              한 번의 대화로 끝낸다
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              출산·육아 정보는 흩어져 있고, 공공시설은 활용률이 낮습니다.
              부산광역시 공공데이터를 통합해 부모가 정보 격차 없이
              필요한 자원을 즉시 찾을 수 있게 합니다.
            </p>
          </section>

          {/* 시장 규모 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              시장 규모
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {marketStats.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.label} className="border-0 shadow-sm">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-11 h-11 rounded-xl bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#FF6B6B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className="mt-0.5 text-xl font-bold text-gray-900">
                          {s.value}
                          <span className="text-sm font-medium text-gray-500 ml-1">{s.unit}</span>
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">{s.note}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 문제 정의 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              문제 정의
            </h3>
            <div className="space-y-3">
              {problems.map((p, i) => (
                <div key={p.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-semibold text-gray-500">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 솔루션 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              우리의 해결책
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {solutions.map((s) => (
                <Card key={s.title} className="border-0 shadow-sm">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDFB] flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-[#4ECDC4]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 수익 모델 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              수익 모델
            </h3>
            <div className="space-y-3">
              {businessModels.map((bm) => {
                const Icon = bm.icon;
                return (
                  <Card key={bm.title} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FFF0F0] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#FF6B6B]" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B6B]">
                          {bm.tag}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{bm.title}</p>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{bm.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 로드맵 */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              사업화 로드맵
            </h3>
            <div className="relative space-y-4 pl-7">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-100" />
              {roadmap.map((r) => (
                <div key={r.period} className="relative">
                  <div
                    className={`absolute -left-7 top-1 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${
                      r.active
                        ? "bg-[#FFF0F0] border-[#FF6B6B]"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {r.active ? (
                      <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                    ) : (
                      <Calendar className="w-3 h-3 text-gray-300" />
                    )}
                  </div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      r.active ? "text-[#FF6B6B]" : "text-gray-400"
                    }`}
                  >
                    {r.period}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">{r.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ESG */}
          <section>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              ESG 가치
            </h3>
            <div className="space-y-3">
              {esg.map((e) => {
                const Icon = e.icon;
                return (
                  <Card key={e.title} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F0FDFB] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-[#4ECDC4]" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ECDC4]">
                          {e.tag}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{e.title}</p>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{e.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

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
