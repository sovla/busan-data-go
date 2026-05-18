import { generateText, Output } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

const queryAnalysisSchema = z.object({
  district: z
    .string()
    .nullable()
    .describe('언급된 구군 (해운대구, 남구 등)'),
  facility_types: z
    .array(z.string())
    .describe(
      '찾는 시설 유형 (nursing_room, kids_cafe, postpartum, daycare, hospital)',
    ),
  topic: z
    .enum(['benefits', 'facilities', 'metro', 'meal_stores', 'general'])
    .describe('질문 주제'),
  keywords: z.array(z.string()).describe('핵심 키워드'),
});

type QueryAnalysis = z.infer<typeof queryAnalysisSchema>;

export async function analyzeQuery(
  question: string,
): Promise<QueryAnalysis | null> {
  try {
    const { output } = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      output: Output.object({ schema: queryAnalysisSchema }),
      prompt: `사용자 질문을 분석하여 검색 조건을 추출하세요: "${question}"`,
    });
    return output ?? null;
  } catch {
    return null;
  }
}

interface RetrievedContext {
  benefits: Record<string, unknown>[] | null;
  facilities: Record<string, unknown>[] | null;
  metro: Record<string, unknown>[] | null;
  mealStores: Record<string, unknown>[] | null;
}

export async function retrieveContext(
  analysis: QueryAnalysis,
  supabase: SupabaseClient,
): Promise<RetrievedContext> {
  const { district, facility_types, topic, keywords } = analysis;
  const result: RetrievedContext = {
    benefits: null,
    facilities: null,
    metro: null,
    mealStores: null,
  };

  if (topic === 'benefits' || topic === 'general') {
    const orConditions = keywords
      .flatMap((k) => [`title.ilike.%${k}%`, `description.ilike.%${k}%`])
      .join(',');

    if (orConditions) {
      const { data } = await supabase
        .from('benefits')
        .select('title, amount, description, category, eligibility, how_to_apply, url')
        .or(orConditions);
      result.benefits = data;
    } else {
      const { data } = await supabase
        .from('benefits')
        .select('title, amount, description, category, eligibility, how_to_apply, url');
      result.benefits = data;
    }
  }

  if (topic === 'facilities' || topic === 'general') {
    let query = supabase
      .from('facilities')
      .select('type, name, district, address, phone')
      .limit(20);
    if (district) query = query.eq('district', district);
    if (facility_types.length > 0) query = query.in('type', facility_types);
    const { data } = await query;
    result.facilities = data;
  }

  if (topic === 'metro') {
    const { data } = await supabase
      .from('metro_accessibility')
      .select('*');
    result.metro = data;
  }

  if (topic === 'meal_stores') {
    let query = supabase
      .from('meal_card_stores')
      .select('name, address, phone, category')
      .limit(20);
    if (district) query = query.ilike('address', `%${district}%`);
    const { data } = await query;
    result.mealStores = data;
  }

  return result;
}

export function buildSystemPrompt(context: RetrievedContext): string {
  const sections: string[] = [];

  if (context.benefits && context.benefits.length > 0) {
    sections.push(
      `## 관련 출산/육아 혜택 (${context.benefits.length}건)\n${JSON.stringify(context.benefits, null, 2)}`,
    );
  }

  if (context.facilities && context.facilities.length > 0) {
    sections.push(
      `## 관련 시설 정보 (${context.facilities.length}건)\n${JSON.stringify(context.facilities, null, 2)}`,
    );
  }

  if (context.metro && context.metro.length > 0) {
    sections.push(
      `## 지하철 접근성 정보 (${context.metro.length}건)\n${JSON.stringify(context.metro, null, 2)}`,
    );
  }

  if (context.mealStores && context.mealStores.length > 0) {
    sections.push(
      `## 급식카드 가맹점 (${context.mealStores.length}건)\n${JSON.stringify(context.mealStores, null, 2)}`,
    );
  }

  const dataSection =
    sections.length > 0
      ? sections.join('\n\n')
      : '(관련 데이터를 찾지 못했습니다. 일반적인 안내를 제공하세요.)';

  return `당신은 '맘편한 부산' AI 도우미입니다. 부산시 임산부와 예비부모를 위한 출산/육아 혜택, 시설 정보를 안내합니다.
항상 친절하고 따뜻한 톤으로 답변하세요. 답변에 구체적인 금액, 자격 조건, 신청 방법을 포함하세요.
아래는 사용자 질문에 관련된 부산시 공공데이터입니다:

${dataSection}`;
}

export async function getFallbackContext(
  supabase: SupabaseClient,
): Promise<RetrievedContext> {
  const [{ data: benefits }, { data: facilities }] = await Promise.all([
    supabase
      .from('benefits')
      .select('title, amount, description, category, eligibility, how_to_apply, url'),
    supabase
      .from('facilities')
      .select('type, name, district, address, phone')
      .limit(20),
  ]);

  return {
    benefits,
    facilities,
    metro: null,
    mealStores: null,
  };
}
