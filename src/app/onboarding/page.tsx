"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    icon: Heart,
    title: "맘편한 부산에\n오신 걸 환영합니다",
    subtitle: "임산부와 예비부모를 위한 맞춤 정보 플랫폼",
  },
  {
    icon: Search,
    title: "나에게 맞는\n혜택을 찾아드려요",
    subtitle: "임신 주수와 자녀 수만 입력하면 맞춤 혜택을 매칭",
  },
  {
    icon: MapPin,
    title: "주변 시설을\n한눈에",
    subtitle: "수유실, 키즈카페, 소아과를 지도에서 바로 확인",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      router.push("/");
      return;
    }
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentStep) return;
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <div className="flex justify-end px-6 pt-12">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          건너뛰기
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#FFF8F0]"
            >
              <Icon className="h-12 w-12 text-[#FF6B6B]" />
            </motion.div>

            <h1 className="whitespace-pre-line text-[26px] leading-[34px] font-bold text-[#1A1A1A]">
              {step.title}
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-[22px] text-[#6B7280]">
              {step.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-16">
        <div className="mb-8 flex justify-center gap-2 items-center">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="relative flex items-center justify-center"
              style={{ width: idx === currentStep ? 24 : 8, height: 8 }}
            >
              <motion.div
                layoutId="dot-indicator"
                className="absolute inset-0 rounded-full bg-[#FF6B6B]"
                style={{ display: idx === currentStep ? "block" : "none" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <div
                className={`rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 h-2 bg-[#FF6B6B]" : "w-2 h-2 bg-[#F3F4F6]"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full h-12 rounded-xl bg-[#FF6B6B] hover:bg-[#e85d5d] text-sm font-semibold text-white transition-colors active:scale-95"
        >
          {currentStep === steps.length - 1 ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
