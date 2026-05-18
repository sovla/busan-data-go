import { Card, CardContent } from "@/components/ui/card";
import { Heart, Database, Cpu, Map } from "lucide-react";

const publicDatasets = [
  {
    source: "data.busan.go.kr",
    items: [
      { label: "수유실", count: "291개" },
      { label: "키즈카페", count: "69개" },
      { label: "산후조리원", count: "12개" },
      { label: "어린이집", count: "317개" },
    ],
  },
  {
    source: "부산교통공사",
    items: [{ label: "도시철도 편의시설", count: "114역" }],
  },
  {
    source: "부산광역시",
    items: [
      { label: "보행자우선도로", count: "31개" },
      { label: "아동급식카드 가맹점", count: "35,239개" },
      { label: "아토피·천식 안심학교", count: "458개" },
    ],
  },
];

const techStack = [
  { name: "Next.js 16", desc: "App Router 기반 풀스택 프레임워크", icon: Cpu },
  { name: "Supabase (PostGIS)", desc: "지리 공간 데이터 저장 및 위치 검색", icon: Database },
  { name: "Claude", desc: "상담 및 혜택 분석 엔진", icon: Heart },
  { name: "네이버 지도 SDK", desc: "지도 시각화 및 마커 표시", icon: Map },
];

export default function MorePage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FFF8F0] mb-4">
          <Heart className="h-7 w-7 text-[#FF6B6B]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">맘편한 부산</h1>
        <p className="mt-1 text-sm font-medium text-gray-400">v1.0</p>
      </div>

      <div className="mx-auto max-w-lg px-4 space-y-6 pt-6">
        {/* 활용 공공데이터 */}
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            활용 공공데이터
          </h2>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              {publicDatasets.map((dataset, di) => (
                <div
                  key={dataset.source}
                  className={di > 0 ? "border-t border-gray-100" : ""}
                >
                  <div className="px-4 py-3 bg-gray-50/60">
                    <p className="text-xs font-semibold text-[#FF6B6B]">
                      {dataset.source}
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {dataset.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900">
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
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            기술 스택
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.name} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-2 h-8 w-8 rounded-lg bg-[#FFF8F0] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[#FF6B6B]" />
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
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
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
  );
}
