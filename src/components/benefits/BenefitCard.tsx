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
import { ExternalLink, Building2, FileText } from "lucide-react";

interface BenefitCardProps {
  benefit: Benefit;
}

const CATEGORY_STYLES: Record<string, { badge: string; dot: string }> = {
  출산지원: {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-400",
  },
  양육지원: {
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
  },
  보육지원: {
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
  },
  임산부지원: {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-400",
  },
  다자녀지원: {
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    dot: "bg-sky-400",
  },
  주거지원: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
};

export function BenefitCard({ benefit }: BenefitCardProps) {
  const style = CATEGORY_STYLES[benefit.category] ?? {
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <Card className="h-full flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {benefit.category}
          </span>
        </div>
        <CardTitle className="text-sm font-semibold leading-snug text-foreground">
          {benefit.title}
        </CardTitle>
        <div className="mt-2">
          <span className="text-2xl font-bold text-rose-600 leading-none">
            {benefit.amount}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3 pt-0">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {benefit.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3 shrink-0" />
          <span>{benefit.provider}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 space-y-2">
          <div className="flex items-start gap-1.5">
            <FileText className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {benefit.how_to_apply}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            onClick={() => window.open(benefit.url, "_blank")}
          >
            <ExternalLink className="mr-1.5 h-3 w-3" />
            신청 방법 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
