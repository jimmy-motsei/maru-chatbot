'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2 } from 'lucide-react';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import LeadCaptureForm from './LeadCaptureForm';
import { Message, LeadData } from '@/lib/types';
import { COLORS } from '@/lib/constants';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation starters
  const conversationStarters = [
    { icon: '🚀', text: 'Learn about our services', query: 'What services does Maru Online offer?' },
    { icon: '💰', text: 'View pricing plans', query: 'How much does the Growth plan cost?' },
    { icon: '🛠️', text: 'Explore free tools', query: 'What free tools do you have?' },
    { icon: '📞', text: 'Book a consultation', query: 'How can I schedule a consultation?' },
  ];

  // Initial greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: '1',
        role: 'assistant',
        content: "👋 Hi! I'm Maru AI, your intelligent assistant for AI & automation solutions.\n\nI'm here to help you discover how we can transform your business with cutting-edge technology.\n\nAsk me a question or select an option below:",
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
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{
              position: 'relative',
              backgroundColor: COLORS.accent,
              boxShadow: '0 8px 24px rgba(61,214,208,0.4), 0 4px 8px rgba(0,0,0,0.1)'
            }}
            aria-label="Open chat"
          >
            {/* Maru Favicon */}
            <img 
              src="/favicon.ico" 
              alt="Maru" 
              width="24" 
              height="24"
              className="flex-shrink-0"
            />

            {/* "Chat" Text - Dark color for contrast */}
            <span className="font-semibold text-base tracking-wide select-none" style={{ color: COLORS.maruDark }}>
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
            <div 
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{
                background: `linear-gradient(to right, ${COLORS.maruDark}, ${COLORS.maruDarkSecondary})`,
                borderBottomColor: `${COLORS.accent}30`
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                  <img 
                    src="/favicon.ico" 
                    alt="Maru" 
                    width="22" 
                    height="22"
                  />
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
                  
                  {/* Conversation Starters - Show only on first message */}
                  {messages.length === 1 && !isLoading && (
                    <div className="flex flex-col gap-2 mt-4">
                      {conversationStarters.map((starter, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputValue(starter.query);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all hover:scale-[1.02] text-left"
                          style={{
                            backgroundColor: COLORS.maruDarkSecondary,
                            borderColor: `${COLORS.accent}40`,
                            color: COLORS.text
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = `${COLORS.accent}40`}
                        >
                          <span className="text-xl">{starter.icon}</span>
                          <span className="text-sm font-medium">{starter.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
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
                      className="flex-1 px-4 py-2 rounded-lg focus:outline-none disabled:opacity-50 transition-colors"
                      style={{
                        backgroundColor: COLORS.maruDark,
                        border: '1px solid #374151',
                        color: COLORS.text
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#374151'}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                      style={{
                        backgroundColor: COLORS.accent,
                        color: COLORS.maruDark
                      }}
                      onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = COLORS.accentHover)}
                      onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = COLORS.accent)}
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
