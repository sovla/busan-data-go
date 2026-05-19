import { FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <Input
        value={input}
        onChange={onInputChange}
        placeholder="출산/육아 관련 질문을 해보세요..."
        disabled={isLoading}
        className="flex-1 h-12 rounded-xl bg-white border-[#F3F4F6] px-4 text-sm focus-visible:ring-[#FF6B6B]"
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        size="icon"
        className="h-12 w-12 rounded-xl bg-[#FF6B6B] hover:bg-[#e55a5a] text-white flex-shrink-0 active:scale-95 transition-transform"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
