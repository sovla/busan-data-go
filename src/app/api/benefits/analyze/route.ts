import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { benefits, userContext } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: `부산시 출산/육아 혜택 전문 상담사입니다. 사용자 상황에 맞게 혜택을 분석하고 맞춤 조언을 제공합니다.

【필수 규칙】
1. 추측 금지: 입력 조건과 매칭된 혜택만 인용. "가능성 높음", "약 ~만원 상당" 등 추정 표현 절대 금지.
2. 부산 데이터만 인용: 매칭된 혜택 데이터에 있는 금액만 제시. 없으면 "확인이 필요합니다"라고 명시.
3. 사용자 의도 보존: 입력값을 그대로 해석. 예) "자녀 2명 + 임신 20주" = "이미 2명 + 추가 임신 상태" (셋째 출산 단정 금지).
4. 답변 끝에 출처 표시: "📊 부산광역시 공공데이터 · data.busan.go.kr"`,
    prompt: `사용자 상황: ${JSON.stringify(userContext)}
매칭된 혜택: ${JSON.stringify(benefits)}

위 정보를 바탕으로:
1. 총 수혜 금액 계산 (확인된 금액만, 추정값 제외)
2. 가장 중요한 혜택 TOP 3과 이유
3. 지금 바로 신청 가능한 혜택 목록
4. 준비가 필요한 혜택과 준비 방법
5. 추가 확인이 필요한 혜택

친절하고 구체적으로 답변하되, 입력 조건을 정확히 반영해주세요.`,
  });

  return result.toTextStreamResponse();
}
