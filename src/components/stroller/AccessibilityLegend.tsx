'use client';

export function AccessibilityLegend() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-[#F3F4F6] p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xs font-semibold text-[#6B7280]">안전 등급 산출</h3>
        <span className="text-[10px] text-[#9CA3AF]">114역 데이터</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#2ECC71' }} />
          <span className="text-xs text-[#6B7280]">엘리베이터 2개+ &amp; 수유실 (안전)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#F39C12' }} />
          <span className="text-xs text-[#6B7280]">엘리베이터 1개 이상 (보통)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#FF6B6B' }} />
          <span className="text-xs text-[#6B7280]">엘리베이터 없음 (주의)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded bg-blue-500 flex-shrink-0" />
          <span className="text-xs text-[#6B7280]">보행자우선도로 (31개)</span>
        </div>
      </div>
      <p className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-[#9CA3AF] leading-relaxed">
        출처: 부산교통공사 도시철도 편의시설 · 부산광역시 보행자우선도로
      </p>
    </div>
  );
}
