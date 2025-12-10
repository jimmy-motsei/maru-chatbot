'use client';

import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

export default function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex ${isBot ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] items-start gap-2`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isBot
              ? 'bg-[var(--maru-cyan)] text-[var(--maru-dark)]'
              : 'bg-[var(--maru-gray)] text-gray-300'
          }`}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Content */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? 'bg-[var(--maru-dark-secondary)] border border-[var(--maru-cyan)]/30 text-gray-100'
              : 'bg-[var(--maru-gray)] text-gray-100'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Timestamp */}
          <p className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-gray-600'}`}>
            {new Date(message.timestamp).toLocaleTimeString('en-ZA', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Typing indicator component
 */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--maru-cyan)] text-[var(--maru-dark)] flex items-center justify-center">
          <Bot size={18} />
        </div>
        <div className="bg-[var(--maru-dark-secondary)] border border-[var(--maru-cyan)]/30 px-4 py-3 rounded-2xl">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[var(--maru-cyan)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-[var(--maru-cyan)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-[var(--maru-cyan)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
