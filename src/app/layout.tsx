import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";

export const metadata: Metadata = {
  title: "맘편한 부산 - AI 출산·육아 도우미",
  description:
    "부산시 임산부·예비부모·영유아 가정을 위한 AI 기반 출산·육아 정보 서비스. 혜택 안내, 시설 지도, 맞춤 상담을 한 곳에서.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-[100dvh] antialiased">
      <body
        style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        className="h-[100dvh] flex flex-col bg-[#F8F8F8]"
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
