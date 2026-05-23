'use client';

export function AccessibilityLegend() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#F3F4F6] p-4">
      <h3 className="text-xs font-semibold text-[#1A1A1A] mb-0.5">지하철 역 유모차 접근성</h3>
      <p className="text-[10px] text-[#9CA3AF] mb-3">마커를 클릭하면 상세 정보를 볼 수 있어요</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#2ECC71' }} />
          <span className="text-xs text-[#6B7280]">안전 — 엘리베이터 4개+ &amp; 경사로 2개+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#F39C12' }} />
          <span className="text-xs text-[#6B7280]">보통 — 엘리베이터 3개 이상</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#FF6B6B' }} />
          <span className="text-xs text-[#6B7280]">주의 — 엘리베이터 2개 이하</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded bg-blue-500 flex-shrink-0" />
          <span className="text-xs text-[#6B7280]">보행자우선도로</span>
        </div>
      </div>
      <p className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-[#9CA3AF] leading-relaxed">
        📊 부산교통공사 도시철도 편의시설 · 부산광역시 보행자우선도로
      </p>
    </div>
  );
}
