"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/map", label: "지도", icon: Map },
  { href: "/benefits", label: "혜택", icon: Heart },
  { href: "/chat", label: "상담", icon: MessageCircle },
  { href: "/more", label: "더보기", icon: MoreHorizontal },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="flex items-stretch pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors duration-150 ${
                active
                  ? "text-[#FF6B6B]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? "text-[#FF6B6B]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-[#FF6B6B]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
