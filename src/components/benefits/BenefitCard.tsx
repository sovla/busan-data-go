"use client";

import { Benefit } from "@/types/benefit";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BenefitCardProps {
  benefit: Benefit;
}

const CATEGORY_COLORS: Record<string, string> = {
  출산지원: "bg-pink-100 text-pink-700",
  양육지원: "bg-blue-100 text-blue-700",
  보육지원: "bg-green-100 text-green-700",
  임산부지원: "bg-purple-100 text-purple-700",
  다자녀지원: "bg-orange-100 text-orange-700",
  주거지원: "bg-yellow-100 text-yellow-700",
};

export function BenefitCard({ benefit }: BenefitCardProps) {
  const categoryColor =
    CATEGORY_COLORS[benefit.category] ?? "bg-gray-100 text-gray-700";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">
            {benefit.title}
          </CardTitle>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor}`}
          >
            {benefit.category}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-sm font-bold">
            {benefit.amount}
          </Badge>
          <span className="text-xs text-muted-foreground">{benefit.provider}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {benefit.description}
        </p>
        <div className="mt-auto pt-2 border-t">
          <p className="text-xs font-medium text-foreground mb-2">신청 방법</p>
          <p className="text-xs text-muted-foreground mb-3">{benefit.how_to_apply}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(benefit.url, "_blank")}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
