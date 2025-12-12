'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import LeadCaptureForm from './LeadCaptureForm';
import { Message, LeadData } from '@/lib/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm the Maru AI Assistant. How can I help you grow your business today? 🚀",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Show lead form after 3-4 messages of conversation
      if (messages.length >= 5 && !showLeadForm) {
        const shouldShowForm = checkIfShouldShowForm(data.response);
        if (shouldShowForm) {
          setTimeout(() => setShowLeadForm(true), 1000);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or email us at hello@maruonline.com",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfShouldShowForm = (response: string): boolean => {
    const keywords = [
      'consultation',
      'schedule',
      'book',
      'contact',
      'speak',
      'connect',
      'pricing',
      'quote',
    ];
    return keywords.some((keyword) =>
      response.toLowerCase().includes(keyword)
    );
  };

  const handleLeadSubmit = async (leadData: Partial<LeadData>) => {
    try {
      // Add conversation transcript
      const transcript = messages
        .map((m) => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${m.content}`)
        .join('\n');

      const fullLeadData: LeadData = {
        ...leadData as LeadData,
        conversationTranscript: transcript,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date(),
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullLeadData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }

      setShowLeadForm(false);

      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Thank you, ${leadData.name}! 🎉 Our team will reach out to you at ${leadData.email} within 24 hours. Is there anything else I can help you with?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error) {
      console.error('Error submitting lead:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, there was an error submitting your information. Please email us directly at hello@maruonline.com",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Chat Button - Modern Pill Style */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[var(--maru-cyan)] to-[#0099FF] rounded-full shadow-[0_8px_24px_rgba(0,217,255,0.3),0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_32px_rgba(0,217,255,0.4),0_8px_16px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 animate-pulse-glow"
            aria-label="Open chat"
            style={{ position: 'relative' }}
          >
            {/* Chat Icon SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="white"
              />
              {/* Three dots inside chat bubble */}
              <circle cx="8" cy="10" r="1.5" fill="#00D9FF" />
              <circle cx="12" cy="10" r="1.5" fill="#00D9FF" />
              <circle cx="16" cy="10" r="1.5" fill="#00D9FF" />
            </svg>

            {/* "Chat" Text */}
            <span className="text-white font-semibold text-base tracking-wide select-none">
              Chat
            </span>

            {/* Notification Badge */}
            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 border-2 border-white rounded-full text-white text-xs font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--maru-dark)] to-[var(--maru-dark-secondary)] px-6 py-4 flex items-center justify-between border-b border-[var(--maru-cyan)]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--maru-cyan)] rounded-full flex items-center justify-center">
                  <MessageCircle size={22} className="text-[var(--maru-dark)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Maru AI Assistant</h3>
                  <p className="text-xs text-gray-400">Online • Responds instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isLoading && <TypingIndicator />}

                  {/* Lead Capture Form */}
                  <AnimatePresence>
                    {showLeadForm && (
                      <LeadCaptureForm
                        onSubmit={handleLeadSubmit}
                        onClose={() => setShowLeadForm(false)}
                      />
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-gray-800">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-[var(--maru-dark)] border border-gray-700 rounded-lg focus:border-[var(--maru-cyan)] focus:outline-none text-white placeholder-gray-500 disabled:opacity-50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="px-4 py-2 bg-[var(--maru-cyan)] text-[var(--maru-dark)] rounded-lg hover:bg-[var(--maru-cyan)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                      aria-label="Send message"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by Maru Online | AI & Automation Experts
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
