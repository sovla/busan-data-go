"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import SuggestionCards from "@/components/chat/SuggestionCards";
import { PageTransition } from "@/components/PageTransition";

export default function HomePage() {
  const chat = useMemo(
    () => new Chat({ transport: new DefaultChatTransport({ api: "/api/chat" }) }),
    []
  );

  const { messages, status, sendMessage } = useChat({ chat });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionSelect = (query: string) => {
    sendMessage({ text: query });
  };

  const getMessageText = (msg: (typeof messages)[number]) => {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-screen bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF8F0] flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-7 w-7 text-[#FF6B6B]" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">맘편한 부산</h1>
                <p className="text-sm text-gray-500 mt-1">무엇을 도와드릴까요?</p>
              </motion.div>
              <SuggestionCards onSelect={handleSuggestionSelect} />
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
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
    </PageTransition>
  );
}
