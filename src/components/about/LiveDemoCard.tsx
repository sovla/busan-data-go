"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Smartphone } from "lucide-react";

const LIVE_URL = "https://busan-data-go.vercel.app";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(
  LIVE_URL
)}`;

export function LiveDemoCard() {
  return (
    <section>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
        라이브 데모
      </h3>
      <Card className="border-0 shadow-sm bg-[#FFF8F0]">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-[88px] h-[88px] rounded-xl bg-white p-1.5 flex-shrink-0">
              <img
                src={QR_SRC}
                alt={`${LIVE_URL} QR 코드`}
                width={88}
                height={88}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80">
                <Smartphone className="w-3 h-3 text-[#FF6B6B]" />
                <span className="text-[10px] font-semibold text-[#FF6B6B] uppercase tracking-wide">
                  모바일 데모
                </span>
              </div>
              <p className="mt-2 text-sm font-bold text-gray-900 break-all">
                busan-data-go.vercel.app
              </p>
              <a
                href={LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#FF6B6B] hover:underline"
              >
                새 탭에서 열기 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
            모바일에서 QR을 스캔하거나 위 URL을 입력하면 실제 서비스를 즉시 사용해보실 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
