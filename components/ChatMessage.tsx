'use client';

import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { COLORS } from '@/lib/constants';

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
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isBot ? COLORS.accent : COLORS.maruGray,
            color: isBot ? COLORS.maruDark : '#d1d5db',
          }}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Content */}
        <div
          className="px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isBot ? COLORS.maruDarkSecondary : COLORS.maruGray,
            border: isBot ? `1px solid ${COLORS.accent}30` : 'none',
            color: '#f3f4f6',
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Timestamp */}
          <p className="text-xs mt-1" style={{ color: isBot ? '#6b7280' : '#9ca3af' }}>
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
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: COLORS.accent, color: COLORS.maruDark }}
        >
          <Bot size={18} />
        </div>
        <div 
          className="px-4 py-3 rounded-2xl"
          style={{ 
            backgroundColor: COLORS.maruDarkSecondary, 
            border: `1px solid ${COLORS.accent}30` 
          }}
        >
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.accent, animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.accent, animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.accent, animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
