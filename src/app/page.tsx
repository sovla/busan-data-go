"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Navigation, MessageCircle } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";

const features = [
  {
    icon: Heart,
    title: "맞춤 혜택 매칭",
    description: "나의 조건에 맞는 출산·육아 혜택을 한눈에",
    href: "/benefits",
  },
  {
    icon: MapPin,
    title: "주변 시설 찾기",
    description: "수유실, 소아과, 키즈카페를 지도에서 바로",
    href: "/map",
  },
  {
    icon: Navigation,
    title: "유모차 길 안내",
    description: "엘리베이터·경사로가 있는 안전한 경로",
    href: "/stroller",
  },
  {
    icon: MessageCircle,
    title: "육아 상담",
    description: "궁금한 점을 자유롭게 물어보세요",
    href: "/chat",
  },
];

const statsTarget = [
  { value: 291, label: "수유실", suffix: "" },
  { value: 317, label: "어린이집", suffix: "" },
  { value: 15, label: "혜택", suffix: "종" },
  { value: 35239, label: "가맹점", suffix: "" },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

function StatItem({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const count = useCountUp(value);
  const display = value >= 10000
    ? count.toLocaleString()
    : String(count);
  return (
    <div>
      <p className="text-3xl font-bold text-gray-900 md:text-4xl">
        {display}{suffix}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

const featureVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function HomePage() {
  return (
    <PageTransition>
      <main className="flex flex-col min-h-screen bg-white">
        {/* Hero */}
        <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5"
            >
              <span className="text-xs font-medium text-gray-500">부산 출산율</span>
              <span className="text-sm font-bold text-[#FF6B6B]">0.66</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl leading-snug">
                부산에서 아이 키우기,
                <br />
                조금 더 편하게
              </h1>
              <p className="text-base text-gray-500 md:text-lg">
                임산부와 예비부모를 위한 맞춤 정보 플랫폼
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="flex gap-3"
            >
              <Link
                href="/benefits"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white bg-[#FF6B6B] hover:bg-[#e85d5d] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                내 혜택 찾기
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                주변 시설 보기
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={featureVariants}
                >
                  <Link href={feature.href} className="group flex items-center gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF8F0]">
                      <Icon className="h-5 w-5 text-[#FF6B6B]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF6B6B] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#FFF8F0] px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium text-gray-500 mb-8">
              부산의 육아 인프라
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsTarget.map((stat) => (
                <StatItem key={stat.label} value={stat.value} label={stat.label} suffix={stat.suffix} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              지금 시작하기
            </h2>
            <p className="text-gray-500">
              나에게 맞는 혜택과 시설 정보를 찾아보세요.
            </p>
            <Link
              href="/benefits"
              className="inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-semibold text-white bg-[#FF6B6B] hover:bg-[#e85d5d] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              내 혜택 찾기
            </Link>
            <p className="text-xs text-gray-400 pt-4">
              부산광역시 공공데이터 활용
            </p>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
