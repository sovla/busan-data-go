import { NextRequest, NextResponse } from "next/server";
import { Benefit, BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body: BenefitMatchRequest = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase.from("benefits").select("*");

    if (error) {
      return NextResponse.json({ error: "데이터 조회에 실패했습니다." }, { status: 500 });
    }

    const benefits: Benefit[] = (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      provider: row.provider,
      amount: row.amount,
      amountValue: row.amount_value ?? 0,
      description: row.description,
      how_to_apply: row.how_to_apply,
      url: row.url,
      eligibility: {
        ...(row.eligibility as object),
        exclusionGroup: row.exclusion_group ?? undefined,
        excludeWhenPregnant: row.exclude_when_pregnant ?? undefined,
      },
    }));

    const matched = matchBenefits(benefits, body);
    return NextResponse.json({ benefits: matched, count: matched.length });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
