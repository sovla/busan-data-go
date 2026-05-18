"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Search, MapPin } from "lucide-react";

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
  const [animating, setAnimating] = useState(false);
  const router = useRouter();

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (animating) return;
    if (currentStep === steps.length - 1) {
      router.push("/");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setAnimating(false);
    }, 300);
  };

  const handleDotClick = (idx: number) => {
    if (animating || idx === currentStep) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(idx);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* 건너뛰기 */}
      <div className="flex justify-end px-6 pt-12">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          건너뛰기
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div
        className={`flex flex-1 flex-col items-center justify-center px-8 text-center transition-all duration-300 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#FFF8F0]">
          <Icon className="h-12 w-12 text-[#FF6B6B]" />
        </div>

        <h1 className="whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
          {step.title}
        </h1>

        <p className="mt-4 max-w-xs text-base leading-relaxed text-gray-500">
          {step.subtitle}
        </p>
      </div>

      {/* 하단 영역 */}
      <div className="px-8 pb-16">
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? "w-6 bg-[#FF6B6B]"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full rounded-2xl bg-[#FF6B6B] hover:bg-[#e85d5d] py-4 text-base font-bold text-white transition-colors active:scale-[0.98]"
        >
          {currentStep === steps.length - 1 ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
