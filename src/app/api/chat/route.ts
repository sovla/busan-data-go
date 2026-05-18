import { streamText, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';
import {
  analyzeQuery,
  retrieveContext,
  buildSystemPrompt,
  getFallbackContext,
} from '@/lib/chat-rag';

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

  const lastUserMessage =
    [...messages]
      .reverse()
      .find((m: UIMessage) => m.role === 'user')
      ?.parts?.filter((p: { type: string }) => p.type === 'text')
      .map((p: { type: string; text: string }) => p.text)
      .join('') ?? '';

  const analysis = await analyzeQuery(lastUserMessage);

  const context = analysis
    ? await retrieveContext(analysis, supabase)
    : await getFallbackContext(supabase);

  const systemPrompt = buildSystemPrompt(context);
  const modelMessages = uiMessagesToModelMessages(messages);

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
