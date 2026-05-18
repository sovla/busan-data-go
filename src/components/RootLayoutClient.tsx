"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const HIDE_NAV_PATHS = ["/onboarding"];

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = HIDE_NAV_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  );
}
