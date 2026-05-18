'use client';

export function AccessibilityLegend() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-mint-100 p-4">
      <h3 className="text-xs font-semibold text-slate-600 mb-3">범례</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-xs text-slate-600">엘리베이터 2개 이상 + 수유실 (안전)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-xs text-slate-600">엘리베이터 1개 이상 (보통)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
          <span className="text-xs text-slate-600">엘리베이터 없음 (주의)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded bg-blue-500 flex-shrink-0" />
          <span className="text-xs text-slate-600">보행자우선도로</span>
        </div>
      </div>
    </div>
  );
}
