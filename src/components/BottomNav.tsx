"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "상담", icon: MessageCircle },
  { href: "/map", label: "지도", icon: Map },
  { href: "/benefits", label: "혜택", icon: Heart },
  { href: "/more", label: "더보기", icon: MoreHorizontal },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 backdrop-blur-md bg-white/80 border-t border-[#F3F4F6]">
      <div className="flex items-stretch h-full pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              whileTap={{ scale: 0.85 }}
              className="flex-1"
            >
              <Link
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors duration-150 ${
                  active
                    ? "text-[#FF6B6B]"
                    : "text-[#9CA3AF]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span
                  className={`text-[10px] font-medium leading-none ${
                    active ? "text-[#FF6B6B]" : "text-[#9CA3AF]"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#FF6B6B]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
