"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "홈",
    icon: "🏠",
    activeIcon: "🏠",
  },
  {
    href: "/map",
    label: "지도",
    icon: "🗺️",
    activeIcon: "🗺️",
  },
  {
    href: "/benefits",
    label: "혜택",
    icon: "💝",
    activeIcon: "💝",
  },
  {
    href: "/more",
    label: "더보기",
    icon: "⋯",
    activeIcon: "⋯",
  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-stretch pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors duration-150 ${
                active
                  ? "text-rose-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span
                className={`text-xl leading-none transition-transform duration-150 ${
                  active ? "scale-110" : "scale-100"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? "text-rose-500" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-rose-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
