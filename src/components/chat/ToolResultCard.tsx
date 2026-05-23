"use client";

import { motion } from "framer-motion";
import { MapPin, Heart, Phone, Baby, Building2, Cross, Stethoscope } from "lucide-react";
import Link from "next/link";

interface Facility {
  id: string;
  type: string;
  name: string;
  address: string;
  phone: string | null;
  district: string;
}

interface Benefit {
  title: string;
  amount: string | null;
  description: string | null;
  category: string | null;
  eligibility: string | null;
  how_to_apply: string | null;
  url: string | null;
}

const FACILITY_STYLES: Record<string, { color: string; bg: string; icon: typeof MapPin; label: string }> = {
  nursing_room: { color: "#FF6B6B", bg: "#FFF0F0", icon: Baby, label: "수유실" },
  kids_cafe: { color: "#4ECDC4", bg: "#F0FDFB", icon: Building2, label: "키즈카페" },
  postpartum: { color: "#9B59B6", bg: "#F8F0FF", icon: Cross, label: "산후조리원" },
  daycare: { color: "#F39C12", bg: "#FFF8E7", icon: Building2, label: "어린이집" },
  hospital: { color: "#3498DB", bg: "#F0F7FF", icon: Stethoscope, label: "병원" },
};

function FacilityCard({ facility }: { facility: Facility }) {
  const style = FACILITY_STYLES[facility.type] ?? {
    color: "#6B7280",
    bg: "#F3F4F6",
    icon: MapPin,
    label: facility.type,
  };
  const Icon = style.icon;

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#F3F4F6] shadow-sm">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: style.bg }}
      >
        <Icon className="h-4 w-4" style={{ color: style.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {style.label}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900 truncate">{facility.name}</p>
        <p className="text-xs text-gray-400 truncate">{facility.address}</p>
        {facility.phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Phone className="h-3 w-3" />
            {facility.phone}
          </p>
        )}
      </div>
    </div>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-[#F3F4F6] shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
        {benefit.amount && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF0F0] text-[#FF6B6B] whitespace-nowrap flex-shrink-0">
            {benefit.amount}
          </span>
        )}
      </div>
      {benefit.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{benefit.description}</p>
      )}
    </div>
  );
}

interface ToolResultCardProps {
  toolName: string;
  result: Record<string, unknown>;
}

export default function ToolResultCard({ toolName, result }: ToolResultCardProps) {
  if (toolName === "searchFacilities") {
    const facilities = (result.facilities ?? []) as Facility[];
    if (facilities.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 space-y-2"
      >
        <p className="text-xs font-medium text-gray-400 px-1">
          {facilities.length}개 시설을 찾았어요
        </p>
        <div className="space-y-1.5">
          {facilities.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
        <Link
          href="/map"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6B6B] hover:underline px-1 mt-1"
        >
          <MapPin className="h-3 w-3" /> 지도에서 보기
        </Link>
        <div className="text-right text-[10px] text-gray-400 mt-2">
          📊 부산광역시 공공데이터 · data.busan.go.kr
        </div>
      </motion.div>
    );
  }

  if (toolName === "searchBenefits") {
    const benefits = (result.benefits ?? []) as Benefit[];
    if (benefits.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 space-y-2"
      >
        <p className="text-xs font-medium text-gray-400 px-1">
          {benefits.length}개 혜택을 찾았어요
        </p>
        <div className="space-y-1.5">
          {benefits.map((b, i) => (
            <BenefitCard key={i} benefit={b} />
          ))}
        </div>
        <Link
          href="/benefits"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6B6B] hover:underline px-1 mt-1"
        >
          <Heart className="h-3 w-3" /> 혜택 자세히 보기
        </Link>
        <div className="text-right text-[10px] text-gray-400 mt-2">
          📊 부산광역시 공공데이터 · data.busan.go.kr
        </div>
      </motion.div>
    );
  }

  return null;
}
