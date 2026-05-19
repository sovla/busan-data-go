import { streamText, convertToModelMessages, type UIMessage, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const SYSTEM_PROMPT = `당신은 '맘편한 부산' AI 도우미입니다. 부산시 임산부와 예비부모를 위한 출산/육아 혜택, 시설 정보를 안내합니다.
항상 친절하고 따뜻한 톤으로 답변하세요. 답변에 구체적인 금액, 자격 조건, 신청 방법을 포함하세요.

중요 규칙:
- 시설(수유실, 키즈카페, 산후조리원, 어린이집, 병원) 위치나 정보를 물어보면 반드시 searchFacilities 도구를 사용하세요.
- 출산/육아 혜택, 지원금, 장려금을 물어보면 반드시 searchBenefits 도구를 사용하세요.
- 도구 결과를 받으면 자연스러운 한국어로 요약해주세요.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      searchFacilities: tool({
        description: '주변 시설(수유실, 키즈카페, 산후조리원, 어린이집, 병원)을 검색합니다. 사용자가 시설 위치를 물어볼 때 사용하세요.',
        inputSchema: z.object({
          district: z.string().optional().describe('구군명 (예: 해운대구, 기장군)'),
          type: z.enum(['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital']).optional().describe('시설 유형'),
          limit: z.number().optional().default(5).describe('최대 결과 수'),
        }),
        execute: async ({ district, type, limit }) => {
          const supabase = await createClient();
          let query = supabase
            .from('facilities')
            .select('id, type, name, address, phone, district')
            .limit(limit ?? 5);
          if (district) query = query.eq('district', district);
          if (type) query = query.eq('type', type);
          const { data } = await query;
          return { facilities: data ?? [] };
        },
      }),
      searchBenefits: tool({
        description: '출산/육아 혜택을 검색합니다. 사용자가 혜택, 지원금, 장려금을 물어볼 때 사용하세요.',
        inputSchema: z.object({
          keyword: z.string().optional().describe('검색 키워드'),
        }),
        execute: async ({ keyword }) => {
          const supabase = await createClient();
          let query = supabase
            .from('benefits')
            .select('title, amount, description, category, eligibility, how_to_apply, url');
          if (keyword) {
            query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
          }
          const { data } = await query;
          return { benefits: data ?? [] };
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
