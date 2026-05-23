"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Baby, X } from "lucide-react";
import { saveProfile, calcEstimatedBirthDate } from "@/lib/user-profile";

type Step = "ask" | "week";

interface Props {
  onClose: () => void;
}

export default function OnboardingModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("ask");
  const [pregnancyWeek, setPregnancyWeek] = useState(20);

  const handleNotPregnant = () => {
    saveProfile({ isPregnant: false });
    onClose();
  };

  const handlePregnant = () => {
    setStep("week");
  };

  const handleConfirm = () => {
    saveProfile({
      isPregnant: true,
      pregnancyWeek,
      estimatedBirthDate: calcEstimatedBirthDate(pregnancyWeek),
    });
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleSkip} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl"
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {step === "ask" && (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] flex items-center justify-center mb-4">
                <Baby className="h-6 w-6 text-[#FF6B6B]" />
              </div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                환영해요!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                임신 중이시면 출산 D-day를 바로 확인할 수 있어요.
              </p>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                현재 임신 중이신가요?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePregnant}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all active:scale-[0.97]"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  네, 임신 중이에요
                </button>
                <button
                  onClick={handleNotPregnant}
                  className="w-full py-3.5 rounded-2xl font-semibold text-gray-500 bg-gray-100 transition-all active:scale-[0.97] hover:bg-gray-200"
                >
                  아니요
                </button>
                <button
                  onClick={handleSkip}
                  className="text-xs text-gray-400 mt-1 py-1"
                >
                  나중에 입력할게요
                </button>
              </div>
            </>
          )}

          {step === "week" && (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] flex items-center justify-center mb-4">
                <Baby className="h-6 w-6 text-[#FF6B6B]" />
              </div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                임신 주차를 알려주세요
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                출산 예정일을 자동으로 계산해 드려요.
              </p>

              <div className="bg-[#FFF0F0] rounded-2xl p-4 mb-6 text-center">
                <p className="text-[36px] font-bold text-[#FF6B6B]">
                  {pregnancyWeek}주
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  출산까지 약 {(40 - pregnancyWeek) * 7}일 남았어요
                </p>
              </div>

              <input
                type="range"
                min={1}
                max={40}
                value={pregnancyWeek}
                onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                className="w-full mb-6 accent-[#FF6B6B]"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("ask")}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-gray-500 bg-gray-100 transition-all active:scale-[0.97] hover:bg-gray-200"
                >
                  이전
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-2 flex-1 py-3.5 rounded-2xl font-semibold text-white transition-all active:scale-[0.97]"
                  style={{ backgroundColor: "#FF6B6B" }}
                >
                  확인
                </button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
