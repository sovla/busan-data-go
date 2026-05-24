"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";
  const [revealedLen, setRevealedLen] = useState(content.length);
  const targetLenRef = useRef(content.length);

  targetLenRef.current = content.length;

  useEffect(() => {
    if (!isStreaming) {
      setRevealedLen(content.length);
    }
  }, [content.length, isStreaming]);

  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      setRevealedLen((prev) => {
        const target = targetLenRef.current;
        if (prev >= target) return prev;
        const remaining = target - prev;
        const step = Math.max(1, Math.ceil(remaining * 0.35));
        return Math.min(prev + step, target);
      });
    }, 18);

    return () => clearInterval(timer);
  }, [isStreaming]);

  const displayContent = isStreaming ? content.slice(0, revealedLen) : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#E8847C] flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageCircle className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] text-[14px] leading-[1.7] ${
          isUser
            ? "bg-[#FF6B6B] text-white px-4 py-2.5 rounded-2xl rounded-br-md whitespace-pre-wrap"
            : "text-gray-800 px-1"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <div
            className={`prose prose-sm prose-gray max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
              prose-p:my-1.5 prose-p:leading-[1.8]
              prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-a:text-[#FF6B6B] prose-a:no-underline hover:prose-a:underline
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:text-xs
              ${isStreaming ? "streaming-text" : ""}`}
          >
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
