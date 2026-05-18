import { streamText, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';

function uiMessagesToModelMessages(uiMessages: UIMessage[]) {
  return uiMessages.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content:
      msg.parts
        ?.filter((p) => p.type === 'text')
        .map((p) => (p as { type: 'text'; text: string }).text)
        .join('') ?? '',
  }));
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const supabase = await createClient();

  const { data: benefits } = await supabase
    .from('benefits')
    .select('title, amount, description, category, eligibility');

  const { data: facilities } = await supabase
    .from('facilities')
    .select('type, name, district, address, phone')
    .limit(50);

  const context = `
## 부산시 출산/육아 혜택 데이터
${JSON.stringify(benefits, null, 2)}

## 부산시 시설 데이터 (상위 50건)
${JSON.stringify(facilities, null, 2)}
`;

  const modelMessages = uiMessagesToModelMessages(messages);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `당신은 '맘편한 부산' AI 도우미입니다. 부산시 임산부와 예비부모를 위한 출산/육아 혜택, 시설 정보를 안내합니다.
항상 친절하고 따뜻한 톤으로 답변하세요. 답변에 구체적인 금액, 자격 조건, 신청 방법을 포함하세요.
아래는 참고할 부산시 공공데이터입니다:
${context}`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
