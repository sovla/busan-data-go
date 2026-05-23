import { streamText, convertToModelMessages, type UIMessage, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';
import { BENEFITS } from '@/lib/benefits-data';
import { HOSPITALS } from '@/lib/hospitals-data';
import { z } from 'zod';

const SYSTEM_PROMPT_STANDARD = `당신은 '맘편한 부산' AI 도우미입니다. 부산시 임산부와 예비부모를 위한 출산/육아 혜택, 시설 정보를 안내합니다.
항상 친절하고 따뜻한 톤으로 답변하세요. 답변에 구체적인 금액, 자격 조건, 신청 방법을 포함하세요.

중요 규칙:
- 시설(수유실, 키즈카페, 산후조리원, 어린이집, 병원) 위치나 정보를 물어보면 반드시 searchFacilities 도구를 사용하세요.
- 출산/육아 혜택, 지원금, 장려금을 물어보면 반드시 searchBenefits 도구를 사용하세요.
- 도구 결과를 받으면 자연스러운 한국어로 요약해주세요.
- 도구 결과가 0건이면 더 넓은 검색을 시도하세요 (district 생략 또는 keyword 변경).
- 그래도 0건이면 사용자에게 '맞춤 혜택 찾기' 페이지(/benefits) 또는 '시설 지도'(/map)로 안내하세요.
- 답변 마지막에 항상 '📊 부산광역시 공공데이터' 출처 표시를 포함하세요.`;

const SYSTEM_PROMPT_BUSAN = `당신은 '맘편한 부산' AI 도우미입니더. 부산시 임산부와 예비부모를 위한 출산/육아 혜택, 시설 정보를 친근하게 안내합니더.
부산 사투리를 자연스럽게 섞어서 따뜻하고 정겹게 답변하이소. 예: "~카이", "~예", "~심더", "~할라꼬예", "마", "되지예", "알겠심더", "그라믄". 정확성과 정중함은 반드시 유지하이소.

중요 규칙:
- 시설(수유실, 키즈카페, 산후조리원, 어린이집, 병원) 위치나 정보를 물어보면 반드시 searchFacilities 도구를 사용하이소.
- 출산/육아 혜택, 지원금, 장려금을 물어보면 반드시 searchBenefits 도구를 사용하이소.
- 도구 결과를 받으면 자연스러운 부산말로 요약해주이소.
- 도구 결과가 0건이면 더 넓은 검색을 시도하이소 (district 생략 또는 keyword 변경).
- 그래도 0건이면 사용자에게 '맞춤 혜택 찾기' 페이지(/benefits) 또는 '시설 지도'(/map)로 안내하이소.
- 답변 마지막에 항상 '📊 부산광역시 공공데이터' 출처 표시를 포함하이소.`;

export async function POST(req: Request) {
  const { messages, dialect = 'standard' }: { messages: UIMessage[]; dialect?: 'standard' | 'busan' } = await req.json();
  const systemPrompt = dialect === 'busan' ? SYSTEM_PROMPT_BUSAN : SYSTEM_PROMPT_STANDARD;

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      searchFacilities: tool({
        description: '주변 시설(수유실, 키즈카페, 산후조리원, 어린이집, 병원)을 검색합니다. 사용자가 시설 위치를 물어볼 때 사용하세요.',
        inputSchema: z.object({
          district: z.string().optional().describe('구군명 (예: 해운대구, 기장군)'),
          type: z.enum(['nursing_room', 'kids_cafe', 'postpartum', 'daycare', 'hospital']).optional().describe('시설 유형'),
          limit: z.number().optional().default(10).describe('최대 결과 수'),
        }),
        execute: async ({ district, type, limit }) => {
          const cap = limit ?? 10;
          if (type === 'hospital') {
            const filtered = district
              ? HOSPITALS.filter(
                  (h) =>
                    h.district.includes(district) || h.address.includes(district),
                )
              : HOSPITALS;
            return {
              facilities: filtered.slice(0, cap).map((h) => ({
                id: h.id,
                type: 'hospital' as const,
                name: h.name,
                address: h.address,
                phone: h.phone,
                district: h.district,
              })),
            };
          }
          const supabase = await createClient();
          let query = supabase
            .from('facilities')
            .select('id, type, name, address, phone, district')
            .limit(cap);
          if (district) {
            query = query.or(`district.ilike.%${district}%,address.ilike.%${district}%`);
          }
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
          if (!keyword) {
            return { benefits: BENEFITS.slice(0, 10) };
          }
          const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
          const tokens = keyword
            .toLowerCase()
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean)
            .map(normalize);
          const matched = BENEFITS.filter((b) => {
            const hay = normalize(`${b.title ?? ''} ${b.description ?? ''} ${b.category ?? ''}`);
            return tokens.some((t) => hay.includes(t));
          });
          return { benefits: matched.length > 0 ? matched : BENEFITS.slice(0, 10) };
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
