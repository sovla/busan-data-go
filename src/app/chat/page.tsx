"use client";

import { useChat, Chat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState, useMemo } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { MessageCircle } from 'lucide-react';

const EXAMPLE_QUESTIONS = [
  "해운대구에서 받을 수 있는 출산 혜택은?",
  "근처 수유실 알려줘",
  "둘째 출산 장려금 얼마야?",
];

export default function ChatPage() {
  const chat = useMemo(
    () => new Chat({ transport: new DefaultChatTransport({ api: '/api/chat' }) }),
    []
  );

  const { messages, status, sendMessage } = useChat({ chat });

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleExampleClick = (question: string) => {
    sendMessage({ text: question });
  };

  const getMessageText = (msg: (typeof messages)[number]) => {
    return msg.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-[#FF6B6B]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">육아 상담</h1>
            <p className="text-xs text-gray-400">무엇이든 물어보세요</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFF8F0] flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-[#FF6B6B]" />
              </div>
              <p className="text-gray-600 text-sm font-medium">무엇이든 물어보세요</p>
              <p className="text-gray-400 text-xs mt-1">부산시 출산·육아 혜택을 안내해 드립니다</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleExampleClick(q)}
                  className="text-left px-4 py-3 rounded-2xl bg-white border border-gray-100 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role as 'user' | 'assistant'}
            content={getMessageText(msg)}
          />
        ))}

        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-4 w-4 text-[#FF6B6B]" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[#E8847C] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100 pb-20">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
