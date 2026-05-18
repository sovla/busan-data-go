import { NextRequest, NextResponse } from "next/server";
import { BenefitMatchRequest } from "@/types/benefit";
import { matchBenefits } from "@/lib/benefits-matcher";

export async function POST(request: NextRequest) {
  try {
    const body: BenefitMatchRequest = await request.json();
    const benefits = matchBenefits(body);
    return NextResponse.json({ benefits, count: benefits.length });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
