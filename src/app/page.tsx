import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: "🤖",
    title: "AI 혜택 매칭",
    description:
      "임신 주수·자녀 수만 입력하면 받을 수 있는 혜택을 AI가 자동으로 찾아드려요",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    href: "/benefits",
    badge: null,
  },
  {
    icon: "🗺️",
    title: "AI 시설 추천",
    description:
      "수유실·소아과·키즈카페를 현재 위치 기반으로 추천해드려요",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    href: "/map",
    badge: null,
  },
  {
    icon: "🚼",
    title: "유모차 내비",
    description:
      "엘리베이터·경사로가 있는 안전한 길을 안내해드려요",
    gradient: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    href: "/map",
    badge: "준비중",
  },
];

const stats = [
  { value: "291", unit: "개", label: "수유실" },
  { value: "317", unit: "개", label: "어린이집" },
  { value: "15", unit: "종", label: "출산 혜택" },
  { value: "35,239", unit: "개", label: "가맹점" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-violet-50 to-sky-50 px-4 py-20 md:py-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center space-y-8">
          {/* Impact stat pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm ring-1 ring-rose-100 backdrop-blur-sm">
            <span className="text-sm font-semibold text-rose-500">부산 출산율</span>
            <span className="text-lg font-bold text-rose-600">0.66</span>
            <span className="text-sm text-zinc-400">— 함께 바꿔요</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 md:text-6xl">
              맘편한{" "}
              <span className="bg-gradient-to-r from-rose-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                부산
              </span>
            </h1>
            <p className="text-xl text-zinc-500 md:text-2xl leading-relaxed">
              AI가 당신의 출산·육아를{" "}
              <span className="font-semibold text-zinc-700">함께합니다</span>
            </p>
            <p className="text-base text-zinc-400 max-w-xl mx-auto">
              부산 임산부·예비부모를 위한 AI 생활 도우미. 혜택 매칭부터 시설 찾기까지 한 번에.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/benefits"
              className="inline-flex items-center justify-center rounded-lg px-8 h-9 text-base font-medium text-white bg-gradient-to-r from-rose-500 to-violet-500 shadow-md hover:shadow-rose-200/60 hover:scale-105 transition-all duration-200"
            >
              내 혜택 찾기
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-lg px-8 h-9 text-base font-medium text-violet-700 bg-white/80 backdrop-blur-sm border border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:scale-105 transition-all duration-200"
            >
              주변 시설 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-500">
              AI 기능
            </p>
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
              육아의 모든 순간, AI가 곁에
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href} className="group">
                <Card className="h-full border-0 shadow-sm ring-1 ring-zinc-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    {/* Icon background */}
                    <div
                      className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${feature.bg} bg-gradient-to-br ${feature.gradient} shadow-md`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-violet-600 transition-colors">
                          {feature.title}
                        </h3>
                        {feature.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-zinc-100 text-zinc-500"
                          >
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-violet-500 group-hover:gap-2 transition-all">
                      <span>자세히 보기</span>
                      <span>→</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-rose-500 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-200">
              부산 육아 인프라
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              부산의 육아 지원, 이만큼 있어요
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/20 hover:bg-white/20 transition-colors"
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white md:text-5xl">
                    {stat.value}
                  </span>
                  <span className="text-lg font-semibold text-violet-200">
                    {stat.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-violet-200">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="inline-block text-4xl">🌸</div>
          <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="text-zinc-500 text-lg">
            나에게 맞는 혜택과 시설을 AI가 빠르게 찾아드립니다.
            <br className="hidden sm:block" />
            부산 임산부·예비부모 여러분을 응원합니다.
          </p>
          <Link
            href="/benefits"
            className="inline-flex items-center justify-center rounded-lg px-10 h-9 text-base font-medium text-white bg-gradient-to-r from-rose-500 to-violet-500 shadow-md hover:shadow-rose-200/60 hover:scale-105 transition-all duration-200"
          >
            내 혜택 무료로 찾기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
