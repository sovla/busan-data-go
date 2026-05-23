"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Database, Cpu, Map, ExternalLink, Briefcase, ChevronRight, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";

type DatasetItem = {
  label: string;
  count: string;
  usage: string;
};

type DatasetGroup = {
  source: string;
  url: string;
  items: DatasetItem[];
};

const publicDatasets: DatasetGroup[] = [
  {
    source: "data.busan.go.kr",
    url: "https://data.busan.go.kr",
    items: [
      { label: "수유실", count: "291개", usage: "지도·챗봇 시설 검색" },
      { label: "키즈카페", count: "69개", usage: "주변 시설 추천" },
      { label: "산후조리원", count: "12개", usage: "주변 시설 추천" },
      { label: "어린이집", count: "317개", usage: "지도·챗봇 시설 검색" },
    ],
  },
  {
    source: "부산교통공사",
    url: "https://www.humetro.busan.kr",
    items: [
      { label: "도시철도 편의시설", count: "114역", usage: "유모차 경로 추천" },
    ],
  },
  {
    source: "부산광역시",
    url: "https://www.busan.go.kr",
    items: [
      { label: "보행자우선도로", count: "31개", usage: "안전한 유모차 길 안내" },
      { label: "아동급식카드 가맹점", count: "35,239개", usage: "지도 가맹점 검색" },
      { label: "아토피·천식 안심학교", count: "458개", usage: "교육시설 매핑" },
    ],
  },
];

const TOTAL_DATASETS = publicDatasets.reduce(
  (sum, g) => sum + g.items.length,
  0
);
const TOTAL_RECORDS = publicDatasets.reduce(
  (sum, g) =>
    sum +
    g.items.reduce((s, i) => s + parseInt(i.count.replace(/[^0-9]/g, "") || "0", 10), 0),
  0
);

const techStack = [
  { name: "Next.js 16", desc: "App Router 기반 풀스택 프레임워크", icon: Cpu },
  { name: "Supabase (PostGIS)", desc: "지리 공간 데이터 저장 및 위치 검색", icon: Database },
  { name: "Claude", desc: "상담 및 혜택 분석 엔진", icon: Heart },
  { name: "네이버 지도 SDK", desc: "지도 시각화 및 마커 표시", icon: Map },
];

export default function MorePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FFF8F0] mb-4">
          <Heart className="w-5 h-5 text-[#FF6B6B]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">맘편한 부산</h1>
        <p className="mt-1 text-sm font-medium text-gray-400">v1.0</p>
      </div>

      <div className="mx-auto max-w-lg px-4 space-y-6 pt-6">
        {/* 활용 공공데이터 */}
        <section id="public-data">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            활용 공공데이터
          </h2>

          {/* 총합 카드 */}
          <Card className="border-0 shadow-sm bg-[#FFF8F0] mb-3">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#E8847C]">
                    데이터셋
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-gray-900">
                    {TOTAL_DATASETS}<span className="text-sm font-medium text-gray-500 ml-0.5">종</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#E8847C]">
                    총 데이터 건수
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-gray-900">
                    {TOTAL_RECORDS.toLocaleString()}<span className="text-sm font-medium text-gray-500 ml-0.5">건</span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
                부산광역시·부산교통공사·각 구 공식 공공데이터를 활용하여 출산·육아 정보를 통합 제공합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {publicDatasets.map((dataset, di) => (
                <div
                  key={dataset.source}
                  className={di > 0 ? "border-t border-gray-100" : ""}
                >
                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-gray-50/60 hover:bg-gray-100 transition-colors group"
                  >
                    <p className="text-xs font-semibold text-[#FF6B6B]">
                      {dataset.source}
                    </p>
                    <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-[#FF6B6B] transition-colors" />
                  </a>
                  <div className="divide-y divide-gray-50">
                    {dataset.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-3 px-4 py-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{item.label}</p>
                          <p className="mt-0.5 text-[11px] text-gray-400 leading-relaxed">
                            {item.usage}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 기술 스택 */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            기술 스택
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.name} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-2 h-8 w-8 rounded-lg bg-[#FFF8F0] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#FF6B6B]" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">{tech.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                      {tech.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 대회 정보 */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            대회 정보
          </h2>
          <Card className="border-0 shadow-sm bg-[#FFF8F0]">
            <CardContent className="p-4 space-y-1">
              <p className="text-xs font-semibold text-[#FF6B6B] uppercase tracking-wide">
                2026 공공데이터 활용 창업경진대회
              </p>
              <p className="text-sm font-bold text-gray-900">
                부산광역시 공공데이터 활용 창업경진대회
              </p>
              <p className="text-xs text-gray-500 leading-relaxed pt-1">
                부산시 임산부·예비부모를 위한 출산·육아 정보 서비스로
                지역 저출산 문제 해결에 기여합니다.
              </p>
            </CardContent>
          </Card>

          <Link
            href="/about/business"
            className="mt-3 block transition-all active:scale-[0.98]"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFB] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-[#4ECDC4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    사업 개요 보기
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                    시장 규모 · 수익 모델 · 사업화 로드맵 · ESG 가치
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link
            href="/about/intelligence"
            className="mt-2 block transition-all active:scale-[0.98]"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    기술 개요 보기
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                    핵심 역량 · 기술 스택 · 응답 품질 · 유사 서비스 비교
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* 하단 크레딧 */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            부산광역시 공공데이터 활용
          </p>
          <a
            href="https://data.busan.go.kr"
            className="text-xs text-[#FF6B6B] hover:text-[#e85d5d] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            data.busan.go.kr
          </a>
        </div>
      </div>
      </main>
    </PageTransition>
  );
}
