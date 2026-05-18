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
        className="flex-1 rounded-full bg-white border-gray-200 px-4 text-sm focus-visible:ring-rose-300"
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        size="icon"
        className="rounded-full bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 text-white flex-shrink-0 shadow-md"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
