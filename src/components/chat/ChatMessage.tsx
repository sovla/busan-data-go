"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
          <MessageCircle className="h-4 w-4 text-[#FF6B6B]" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-[#FF6B6B] text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
}
