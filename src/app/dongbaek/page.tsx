"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, MapPin, Phone } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

type Store = { id: number; name: string; category: string; district: string; address: string; phone?: string; };
type Category = "전체" | "육아용품" | "의료" | "약국" | "식품" | "교육";

const CATEGORIES: Category[] = ["전체", "육아용품", "의료", "약국", "식품", "교육"];

const CATEGORY_COLORS: Record<Exclude<Category, "전체">, { bg: string; text: string }> = {
  육아용품: { bg: "#FFF0F0", text: "#FF6B6B" },
  의료:     { bg: "#F0FDFB", text: "#4ECDC4" },
  약국:     { bg: "#FFF8E7", text: "#F39C12" },
  식품:     { bg: "#F0FDF4", text: "#22C55E" },
  교육:     { bg: "#F5F3FF", text: "#9B59B6" },
};

export default function DongbaekPage() {
  const [selected, setSelected] = useState<Category>("전체");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dongbaek')
      .then(r => r.json())
      .then(d => { setStores(d.stores ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    selected === "전체"
      ? stores
      : stores.filter((s) => s.category === selected);

  return (
    <PageTransition>
      <main className="min-h-screen bg-white pb-24">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 h-14">
            <Link
              href="/"
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors"
              aria-label="뒤로"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-base font-bold text-gray-900">동백전 가맹점</h1>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-5">
          {/* 히어로 배너 */}
          <div className="rounded-2xl bg-[#FFF8F0] px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#FF6B6B]">출산축하금 사용처</span>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              부산시 출산축하금이 <strong>동백전</strong>으로 지급됩니다.
              아래 영유아 관련 가맹점에서 바로 사용하세요.
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  selected === cat
                    ? "bg-[#FF6B6B] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 결과 카운트 */}
          <p className="text-xs text-gray-400">
            {loading ? "로딩 중..." : `${filtered.length}개 가맹점`}
          </p>

          {/* 가맹점 카드 리스트 */}
          <div className="space-y-3">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex flex-col gap-2 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
            {!loading && filtered.map((store) => {
              const color = CATEGORY_COLORS[store.category as Exclude<Category, "전체">] ?? { bg: "#F3F4F6", text: "#6B7280" };
              return (
                <div
                  key={store.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-semibold text-gray-900 leading-snug">
                      {store.name}
                    </p>
                    <span
                      className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {store.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    <span>{store.address}</span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      <a href={`tel:${store.phone}`} className="hover:text-[#FF6B6B] transition-colors">
                        {store.phone}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 데이터 출처 footer */}
          <div className="pt-2 pb-4 text-center">
            <p className="text-[11px] text-gray-400">
              📊 부산광역시 동백전 가맹점 · data.busan.go.kr
            </p>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
