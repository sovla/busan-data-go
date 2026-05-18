import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    title: "시설 지도",
    description:
      "부산 지역 산부인과, 산후조리원, 육아 지원 시설을 지도에서 한눈에 확인하세요.",
    href: "/map",
    icon: "🗺️",
  },
  {
    title: "혜택 매칭",
    description:
      "AI가 나의 상황에 맞는 임산부·예비부모 지원 혜택을 찾아 드립니다.",
    href: "/benefits",
    icon: "🎁",
  },
  {
    title: "유모차 내비",
    description:
      "유모차 이동이 편한 경로와 엘리베이터, 경사로 정보를 안내해 드립니다.",
    href: "/map",
    icon: "🚼",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 bg-zinc-50">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            맘편한 부산
          </h1>
          <p className="text-lg text-zinc-500">
            부산 임산부·예비부모를 위한 AI 생활 도우미
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href + feature.title} href={feature.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
