'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { getStationGrade, GRADE_COLORS, GRADE_LABELS } from '@/lib/stroller-grade';

interface MetroStation {
  id: number;
  line: string;
  station_name: string;
  nursing_room: number;
  elevator_inner: number;
  elevator_outer: number;
  wheelchair_lift: number;
  escalator: number;
  outer_ramp: number;
  location: string;
}

interface StationDetailProps {
  station: MetroStation | null;
  onClose: () => void;
}

const LINE_COLORS: Record<string, string> = {
  '1호선': 'bg-blue-500 text-white border-blue-500',
  '2호선': 'bg-emerald-500 text-white border-emerald-500',
  '3호선': 'bg-orange-500 text-white border-orange-500',
  '4호선': 'bg-purple-500 text-white border-purple-500',
};

function getAccessibilityLevel(station: MetroStation) {
  return getStationGrade(station);
}

export function StationDetail({ station, onClose }: StationDetailProps) {
  if (!station) return null;

  const level = getAccessibilityLevel(station);

  return (
    <Sheet open={!!station} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="rounded-t-[20px] pb-8">
        <div className="mx-auto w-9 h-1 rounded-full bg-gray-300 mb-4" />
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs font-bold px-2.5 py-1 rounded-full border ${LINE_COLORS[station.line] ?? 'bg-slate-400 text-white border-slate-400'}`}>
              {station.line}
            </Badge>
            <SheetTitle className="text-lg font-bold text-[#1A1A1A]">
              {station.station_name}역
            </SheetTitle>
          </div>
          {station.location && (
            <p className="text-xs text-[#9CA3AF] mt-1">{station.location}</p>
          )}
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">엘리베이터 (내부)</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{station.elevator_inner ?? 0}개</p>
          </div>
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">엘리베이터 (외부)</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{station.elevator_outer ?? 0}개</p>
          </div>
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">수유실</p>
            <p className="text-lg font-bold text-[#1A1A1A]">
              {(station.nursing_room ?? 0) >= 1 ? '있음' : '없음'}
            </p>
          </div>
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">에스컬레이터</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{station.escalator ?? 0}개</p>
          </div>
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">외부경사로</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{station.outer_ramp ?? 0}개</p>
          </div>
          <div className="rounded-xl p-3 border border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280] mb-1">휠체어리프트</p>
            <p className="text-lg font-bold text-[#1A1A1A]">{station.wheelchair_lift ?? 0}개</p>
          </div>
        </div>

        <div className="rounded-xl p-3 text-sm font-medium text-center text-white" style={{
          backgroundColor: GRADE_COLORS[level]
        }}>
          {GRADE_LABELS[level]}
        </div>
      </SheetContent>
    </Sheet>
  );
}
