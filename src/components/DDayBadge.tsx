"use client";

import { useEffect, useState } from "react";
import { Baby } from "lucide-react";
import { loadProfile, calcDDay } from "@/lib/user-profile";

export default function DDayBadge() {
  const [dday, setDday] = useState<number | null>(null);
  const [week, setWeek] = useState<number | null>(null);

  useEffect(() => {
    const profile = loadProfile();
    if (!profile?.isPregnant || !profile.estimatedBirthDate) return;
    setDday(calcDDay(profile.estimatedBirthDate));
    setWeek(profile.pregnancyWeek ?? null);
  }, []);

  if (dday === null) return null;

  return (
    <div className="mx-6 mb-4">
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ backgroundColor: "#FFF0F0", border: "1px solid #FFD6D6" }}
      >
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Baby className="h-5 w-5" style={{ color: "#FF6B6B" }} />
        </div>
        <div>
          <p className="text-[22px] font-bold leading-tight" style={{ color: "#FF6B6B" }}>
            출산까지 D-{dday > 0 ? dday : dday === 0 ? "day" : Math.abs(dday)}
          </p>
          {week !== null && (
            <p className="text-xs text-gray-400 mt-0.5">임신 {week}주차 · 힘내세요!</p>
          )}
        </div>
      </div>
    </div>
  );
}
