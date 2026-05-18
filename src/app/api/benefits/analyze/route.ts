import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { benefits, userContext } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: '부산시 출산/육아 혜택 전문 상담사입니다. 사용자 상황에 맞게 혜택을 분석하고 맞춤 조언을 제공합니다.',
    prompt: `사용자 상황: ${JSON.stringify(userContext)}
매칭된 혜택: ${JSON.stringify(benefits)}

위 정보를 바탕으로:
1. 총 예상 연간 수혜 금액 계산
2. 가장 중요한 혜택 TOP 3와 이유
3. 지금 바로 신청 가능한 혜택 목록
4. 준비가 필요한 혜택과 준비 방법
5. 추가로 확인하면 좋을 혜택 안내

친절하고 구체적으로 답변해주세요.`,
  });

  return result.toTextStreamResponse();
}
