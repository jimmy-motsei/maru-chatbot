# Maru Chatbot Migration Guide

This guide contains the source code for the HubSpot-style proactive chatbot that was developed for the Maru website. Use this code to rebuild the chatbot in a separate repository or microservice.

## 1. Type Definitions

**File:** `lib/types.ts`

```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest?: string;
  message?: string;
  conversationTranscript?: string;
  sourceUrl?: string;
  timestamp: Date;
}

export type ConversationStage =
  | 'greeting'
  | 'exploring'
  | 'qualifying'
  | 'presenting'
  | 'capturing'
  | 'closing';

export interface ConversationState {
  stage: ConversationStage;
  leadData: Partial<LeadData>;
  messageCount: number;
  hasShownInterest: boolean;
  qualificationScore: number; // 0-10
}
```

## 2. Components

### Proactive Chat Widget (Main Container)
**File:** `components/ProactiveChatWidget.tsx`

```tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MessageCircle, X, Send, Minus, Lightbulb, Rocket, Calendar, MessageSquare, Bot } from 'lucide-react';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import LeadCaptureForm from './LeadCaptureForm';
import { Message, LeadData } from '@/lib/types';
import Link from 'next/link';

// Storage keys
const STORAGE_KEYS = {
  DISMISSED: 'maru-chat-dismissed',
  MINIMIZED: 'maru-chat-minimized',
  CHAT_STARTED: 'maru-chat-started',
};

// HubSpot-style action buttons for greeting
const ACTION_BUTTONS = [
  { 
    id: 'assessment', 
    label: 'Free AI Readiness Assessment', 
    icon: Lightbulb,
    message: "I'd like to take the free AI readiness assessment to see how AI can help my business.",
  },
  { 
    id: 'lead-gen', 
    label: 'Lead Generation Solutions', 
    icon: Rocket,
    message: "I'm interested in your lead generation solutions and how they can help grow my business.",
  },
  { 
    id: 'demo', 
    label: 'Sales Automation Demo', 
    icon: Calendar,
    message: "I'd like to see a demo of your sales automation solutions.",
  },
  { 
    id: 'specialist', 
    label: 'Talk to a Specialist', 
    icon: MessageSquare,
    message: "I'd like to speak with a specialist about my specific business needs.",
  },
];

// Chat widget states
type ChatState = 'minimized' | 'greeting' | 'active';

// Solid dark color palette for visibility on all backgrounds
const COLORS = {
  background: '#2D2D2D',
  backgroundLight: '#3A3A3A',
  backgroundLighter: '#404040',
  backgroundHover: '#4A4A4A',
  border: '#505050',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  text: '#FFFFFF',
  textSecondary: '#B8B8B8',
  textMuted: '#888888',
  accent: '#22d3ee',
  accentHover: '#5cc5d1',
  shadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  shadowStrong: '0 12px 32px rgba(0, 0, 0, 0.4)',
};

interface ProactiveChatWidgetProps {
  triggerOnScroll?: boolean; // For homepage
  scrollTargetId?: string;   // Section ID to observe
  triggerDelay?: number;     // Delay in ms
}

export default function ProactiveChatWidget({
  triggerOnScroll = false,
  scrollTargetId = 'process',
  triggerDelay = 500,
}: ProactiveChatWidgetProps) {
  const [chatState, setChatState] = useState<ChatState>('minimized');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if greeting should auto-show
  const shouldShowGreeting = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    // Check if user dismissed within 24 hours
    const dismissedTime = localStorage.getItem(STORAGE_KEYS.DISMISSED);
    if (dismissedTime && (Date.now() - parseInt(dismissedTime)) < 86400000) {
      return false;
    }
    
    // Check if minimized this session
    if (sessionStorage.getItem(STORAGE_KEYS.MINIMIZED) === 'true') {
      return false;
    }
    
    // Check if chat already started this session
    if (sessionStorage.getItem(STORAGE_KEYS.CHAT_STARTED) === 'true') {
      return false;
    }
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    
    // Check mobile landscape
    if (window.innerWidth > window.innerHeight && window.innerHeight < 500) {
      return false;
    }
    
    return true;
  };

  // Homepage: Intersection Observer for scroll-based trigger
  useEffect(() => {
    if (!triggerOnScroll || hasTriggered) return;
    
    const targetElement = document.getElementById(scrollTargetId);
    if (!targetElement) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setHasTriggered(true);
            setTimeout(() => {
              if (shouldShowGreeting()) {
                setChatState('greeting');
              }
            }, triggerDelay);
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observerRef.current.observe(targetElement);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [triggerOnScroll, scrollTargetId, triggerDelay, hasTriggered]);

  // Non-homepage: Time-based trigger
  useEffect(() => {
    if (triggerOnScroll || hasTriggered) return;
    
    // Wait for document to be fully loaded
    if (document.readyState !== 'complete') {
      const handleLoad = () => {
        setTimeout(() => {
          if (shouldShowGreeting()) {
            setChatState('greeting');
            setHasTriggered(true);
          }
        }, 3000);
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    } else {
      const timer = setTimeout(() => {
        if (shouldShowGreeting()) {
          setChatState('greeting');
          setHasTriggered(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [triggerOnScroll, hasTriggered]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat becomes active
  useEffect(() => {
    if (chatState === 'active' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatState]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatState !== 'minimized') {
        handleMinimize();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatState]);

  // Initialize chat with greeting
  const initializeChat = useCallback((initialMessage?: string) => {
    sessionStorage.setItem(STORAGE_KEYS.CHAT_STARTED, 'true');
    
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm the Maru AI Assistant. How can I help you grow your business today? 🚀",
      timestamp: new Date(),
    };
    
    if (initialMessage) {
      const userMsg: Message = {
        id: '2',
        role: 'user',
        content: initialMessage,
        timestamp: new Date(),
      };
      setMessages([greeting, userMsg]);
      // Trigger bot response
      handleBotResponse([greeting, userMsg]);
    } else {
      setMessages([greeting]);
    }
  }, []);

  // Handle option button click
  const handleOptionClick = (option: typeof ACTION_BUTTONS[0]) => {
    setChatState('active');
    initializeChat(option.message);
  };

  // Handle minimize
  const handleMinimize = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEYS.MINIMIZED, 'true');
    }
    setShowBadge(true);
    setChatState('minimized');
  };

  // Handle dismiss (close)
  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEYS.DISMISSED, Date.now().toString());
    setChatState('minimized');
  };

  // Handle icon click - always opens chat
  const handleIconClick = () => {
    // Clear flags when user manually opens
    sessionStorage.removeItem(STORAGE_KEYS.MINIMIZED);
    localStorage.removeItem(STORAGE_KEYS.DISMISSED);
    setShowBadge(false);
    
    if (messages.length > 0) {
      // Resume existing chat
      setChatState('active');
    } else {
      // Show greeting first
      setChatState('greeting');
    }
  };

  // Handle starting chat from input in greeting
  const handleGreetingInputSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    setChatState('active');
    initializeChat(inputValue.trim());
    setInputValue('');
  };

  // Handle bot response
  const handleBotResponse = async (currentMessages: Message[]) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Show lead form after conversation
      if (currentMessages.length >= 5 && !showLeadForm) {
        if (checkIfShouldShowForm(data.response)) {
          setTimeout(() => setShowLeadForm(true), 1000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
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

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    handleBotResponse(updatedMessages);
  };

  const checkIfShouldShowForm = (response: string): boolean => {
    const keywords = ['consultation', 'schedule', 'book', 'contact', 'speak', 'connect', 'pricing', 'quote'];
    return keywords.some((keyword) => response.toLowerCase().includes(keyword));
  };

  const handleLeadSubmit = async (leadData: Partial<LeadData>) => {
    try {
      const transcript = messages.map((m) => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${m.content}`).join('\n');

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

      if (!response.ok) throw new Error('Failed to submit lead');

      setShowLeadForm(false);

      const confirmationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Thank you, ${leadData.name}! 🎉 Our team will reach out to you at ${leadData.email} within 24 hours. Is there anything else I can help you with?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, there was an error. Please email us directly at hello@maruonline.com",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Animation variants
  const iconVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    exit: { scale: 0, opacity: 0 }
  };

  const greetingVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.34, 1.56, 0.64, 1] // bounce
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const chatVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: 20, scale: 0.95 }
  };

  return (
    <>
      {/* State 1: Minimized Icon */}
      <AnimatePresence>
        {chatState === 'minimized' && (
          <motion.button
            key="chat-icon"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleIconClick}
            className="fixed bottom-5 right-5 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 chat-icon-pulse"
            style={{
              backgroundColor: COLORS.background,
              boxShadow: COLORS.shadow,
              border: `2px solid ${COLORS.text}`,
            }}
            aria-label="Open chat assistant"
          >
            <MessageCircle size={28} className="text-white" />
            {/* Notification badge if minimized from greeting */}
            {showBadge && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{ 
                  backgroundColor: '#ef4444', 
                  borderColor: COLORS.background 
                }} 
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* State 2: Greeting Bubble (HubSpot-style) */}
      <AnimatePresence>
        {chatState === 'greeting' && (
          <motion.div
            key="greeting-bubble"
            variants={greetingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-labelledby="chat-title"
            aria-describedby="chat-description"
            aria-live="polite"
            className="fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-40px)] md:w-[380px]"
          >
            <div 
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: COLORS.background,
                boxShadow: COLORS.shadowStrong,
              }}
            >
              {/* Header */}
              <div 
                className="px-4 py-4 flex items-center justify-between"
                style={{ backgroundColor: COLORS.backgroundLight }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    <Bot size={22} className="text-[#050505]" />
                  </div>
                  <div>
                    <h3 
                      id="chat-title" 
                      className="font-semibold text-base"
                      style={{ color: COLORS.text }}
                    >
                      MaruBot
                    </h3>
                    <span 
                      className="text-xs flex items-center gap-1.5"
                      style={{ color: '#4ade80' }}
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Online now
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMinimize}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ 
                      color: COLORS.textSecondary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.backgroundHover;
                      e.currentTarget.style.color = COLORS.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = COLORS.textSecondary;
                    }}
                    aria-label="Minimize chat"
                  >
                    <Minus size={18} />
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{ 
                      color: COLORS.textSecondary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.backgroundHover;
                      e.currentTarget.style.color = COLORS.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = COLORS.textSecondary;
                    }}
                    aria-label="Close chat"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Greeting Message */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: COLORS.accent }}
                  >
                    <Bot size={16} className="text-[#050505]" />
                  </div>
                  <div 
                    className="p-4 rounded-xl flex-1"
                    style={{ backgroundColor: COLORS.backgroundLight }}
                  >
                    <p 
                      id="chat-description"
                      className="text-base leading-relaxed"
                      style={{ color: COLORS.text }}
                    >
                      👋 Want to chat about your marketing challenges? I'm an AI assistant here to help.
                    </p>
                    <p 
                      className="text-sm mt-2"
                      style={{ color: COLORS.textSecondary }}
                    >
                      Ask me or select an option below.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {ACTION_BUTTONS.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="w-full px-4 py-3 text-left text-sm font-medium rounded-lg flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: COLORS.backgroundLighter,
                          border: `1px solid ${COLORS.borderLight}`,
                          color: COLORS.text,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.backgroundHover;
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.backgroundLighter;
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        aria-label={option.label}
                      >
                        <IconComponent size={18} style={{ color: COLORS.accent }} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Section */}
              <div 
                className="px-4 py-3 border-t"
                style={{ borderColor: COLORS.borderLight }}
              >
                <form onSubmit={handleGreetingInputSubmit} className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full px-4 py-3 pr-12 rounded-full text-sm focus:outline-none transition-all"
                    style={{
                      backgroundColor: COLORS.backgroundLight,
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.text,
                    }}
                    aria-label="Type your message"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                    style={{ backgroundColor: COLORS.accent }}
                    aria-label="Send message"
                  >
                    <Send size={14} className="text-[#050505]" />
                  </button>
                </form>
                <p 
                  className="text-xs mt-2 text-center"
                  style={{ color: COLORS.textMuted }}
                >
                  AI-generated content may be inaccurate.
                </p>
              </div>

              {/* Footer */}
              <div 
                className="px-4 py-3 border-t"
                style={{ borderColor: COLORS.borderLight }}
              >
                <p 
                  className="text-xs leading-relaxed"
                  style={{ color: COLORS.textSecondary }}
                >
                  Maru uses the information you provide to contact you about relevant services. Check our{' '}
                  <Link 
                    href="/privacy-policy" 
                    className="underline hover:no-underline transition-colors"
                    style={{ color: '#60a5fa' }}
                  >
                    privacy policy
                  </Link>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* State 3: Active Chat */}
      <AnimatePresence>
        {chatState === 'active' && (
          <motion.div
            key="active-chat"
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-labelledby="active-chat-title"
            aria-modal="true"
            className="fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-40px)] h-[600px] max-h-[80vh] rounded-2xl flex flex-col overflow-hidden"
            style={{
              backgroundColor: COLORS.background,
              boxShadow: COLORS.shadowStrong,
            }}
          >
            {/* Header */}
            <div 
              className="px-5 py-4 flex items-center justify-between flex-shrink-0"
              style={{ 
                backgroundColor: COLORS.backgroundLight,
                borderBottom: `1px solid ${COLORS.borderLight}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Bot size={22} className="text-[#050505]" />
                </div>
                <div>
                  <h3 
                    id="active-chat-title"
                    className="font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    Maru AI Assistant
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Responds instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundHover;
                    e.currentTarget.style.color = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = COLORS.textSecondary;
                  }}
                  aria-label="Minimize chat"
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => setChatState('minimized')}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.backgroundHover;
                    e.currentTarget.style.color = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = COLORS.textSecondary;
                  }}
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto px-5 py-4 space-y-2 chat-messages-container"
              style={{ backgroundColor: COLORS.background }}
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && <TypingIndicator />}

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

            {/* Input */}
            <div 
              className="px-5 py-4 flex-shrink-0"
              style={{ 
                backgroundColor: COLORS.background,
                borderTop: `1px solid ${COLORS.borderLight}`,
              }}
            >
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-full text-sm focus:outline-none disabled:opacity-50 transition-all"
                  style={{
                    backgroundColor: COLORS.backgroundLight,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                  }}
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  style={{ 
                    backgroundColor: COLORS.accent,
                    color: '#050505',
                  }}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
              <p 
                className="text-xs mt-2 text-center"
                style={{ color: COLORS.textMuted }}
              >
                Powered by Maru Online
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
        /* Pulse animation for minimized chat icon */
        @keyframes chat-icon-pulse-anim {
          0%, 100% {
            transform: scale(1);
            box-shadow: ${COLORS.shadow};
          }
          50% {
            transform: scale(1.05);
            box-shadow: ${COLORS.shadow}, 0 0 0 8px rgba(34, 211, 238, 0.15);
          }
        }
        
        .chat-icon-pulse {
          animation: chat-icon-pulse-anim 2s ease-in-out infinite;
        }
        
        .chat-icon-pulse:hover {
          animation: none;
          transform: scale(1.1);
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .chat-icon-pulse,
          .chat-widget * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Custom scrollbar for chat messages */
        .chat-messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages-container::-webkit-scrollbar-track {
          background: ${COLORS.backgroundLight};
        }
        
        .chat-messages-container::-webkit-scrollbar-thumb {
          background: ${COLORS.border};
          border-radius: 3px;
        }
        
        .chat-messages-container::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.textMuted};
        }
        
        /* Focus states for accessibility */
        .chat-widget input:focus,
        .chat-widget button:focus {
          outline: 2px solid ${COLORS.accent};
          outline-offset: 2px;
        }
        
        .chat-widget input::placeholder {
          color: ${COLORS.textMuted};
        }
        
        /* Ensure solid backgrounds on all widget containers */
        .chat-widget-container {
          background-color: ${COLORS.background} !important;
        }
      `}</style>
    </>
  );
}
```

### Chat Widget Wrapper
**File:** `components/ChatWidgetWrapper.tsx`

```tsx
'use client';

import { usePathname } from 'next/navigation';
import ProactiveChatWidget from './ProactiveChatWidget';

/**
 * Wrapper that handles page-specific chat widget behavior
 * - Homepage: Triggered on scroll to #process section
 * - Other pages: Triggered after 3 second delay
 * - Hidden on homepage hero (chat only appears after scroll)
 */
export default function ChatWidgetWrapper() {
  const pathname = usePathname();
  
  // Don't show chat widget on homepage at all (controlled by scroll trigger)
  const isHomepage = pathname === '/';
  
  if (isHomepage) {
    // Homepage: trigger on scroll to process section
    return (
      <ProactiveChatWidget 
        triggerOnScroll={true}
        scrollTargetId="process"
        triggerDelay={500}
      />
    );
  }
  
  // Other pages: trigger after 3 second delay
  return (
    <ProactiveChatWidget 
      triggerOnScroll={false}
      triggerDelay={3000}
    />
  );
}
```

### Chat Message Component
**File:** `components/ChatMessage.tsx`

```tsx
'use client';

import { Message } from '@/lib/types';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

// Solid dark color palette matching ProactiveChatWidget
const COLORS = {
  background: '#2D2D2D',
  backgroundLight: '#3A3A3A',
  backgroundLighter: '#404040',
  text: '#FFFFFF',
  textSecondary: '#B8B8B8',
  accent: '#22d3ee',
  accentDark: '#050505',
  userBubble: '#22d3ee',
};

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
            backgroundColor: isBot ? COLORS.accent : COLORS.backgroundLighter,
            color: isBot ? COLORS.accentDark : COLORS.textSecondary,
          }}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Message Content */}
        <div
          className="px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isBot ? COLORS.backgroundLight : COLORS.userBubble,
            color: isBot ? COLORS.text : COLORS.accentDark,
            borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Timestamp */}
          <p 
            className="text-xs mt-1"
            style={{ 
              color: isBot ? COLORS.textSecondary : 'rgba(0,0,0,0.5)',
              opacity: 0.8,
            }}
          >
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
 * Typing indicator component with solid background
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
          style={{ backgroundColor: COLORS.accent }}
        >
          <Bot size={18} style={{ color: COLORS.accentDark }} />
        </div>
        <div 
          className="px-4 py-3 rounded-2xl"
          style={{ 
            backgroundColor: COLORS.backgroundLight,
            borderRadius: '4px 16px 16px 16px',
          }}
        >
          <div className="flex gap-1.5">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ 
                backgroundColor: COLORS.accent,
                animation: 'typing 1.4s infinite',
                animationDelay: '0ms',
              }} 
            />
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ 
                backgroundColor: COLORS.accent,
                animation: 'typing 1.4s infinite',
                animationDelay: '200ms',
              }} 
            />
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ 
                backgroundColor: COLORS.accent,
                animation: 'typing 1.4s infinite',
                animationDelay: '400ms',
              }} 
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% { 
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </motion.div>
  );
}
```

### Lead Capture Form
**File:** `components/LeadCaptureForm.tsx`

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { LeadData } from '@/lib/types';

// Solid dark color palette
const COLORS = {
  background: '#2D2D2D',
  backgroundLight: '#3A3A3A',
  border: '#505050',
  text: '#FFFFFF',
  textSecondary: '#B8B8B8',
  accent: '#22d3ee',
  accentDark: '#050505',
};

interface LeadCaptureFormProps {
  onSubmit: (data: Partial<LeadData>) => void;
  onClose: () => void;
}

export default function LeadCaptureForm({ onSubmit, onClose }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-4 rounded-2xl p-6"
      style={{
        backgroundColor: COLORS.backgroundLight,
        border: `1px solid ${COLORS.accent}40`,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: COLORS.accent }}
        >
          Let's Connect
        </h3>
        <button
          onClick={onClose}
          className="transition-colors p-1 rounded-lg"
          style={{ color: COLORS.textSecondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textSecondary;
          }}
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <p 
        className="text-sm mb-4"
        style={{ color: COLORS.textSecondary }}
      >
        Share your details and our team will reach out within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium mb-1"
            style={{ color: COLORS.textSecondary }}
          >
            Name <span style={{ color: COLORS.accent }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-1"
            style={{ color: COLORS.textSecondary }}
          >
            Email <span style={{ color: COLORS.accent }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Company */}
        <div>
          <label 
            htmlFor="company" 
            className="block text-sm font-medium mb-1"
            style={{ color: COLORS.textSecondary }}
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
            placeholder="Your company name"
          />
        </div>

        {/* Phone */}
        <div>
          <label 
            htmlFor="phone" 
            className="block text-sm font-medium mb-1"
            style={{ color: COLORS.textSecondary }}
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
            placeholder="+27 XX XXX XXXX"
          />
        </div>

        {/* Interest */}
        <div>
          <label 
            htmlFor="interest" 
            className="block text-sm font-medium mb-1"
            style={{ color: COLORS.textSecondary }}
          >
            I'm interested in
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg focus:outline-none transition-colors"
            style={{
              backgroundColor: COLORS.background,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
          >
            <option value="">Select an option</option>
            <option value="lead-generation">Lead Generation Automation</option>
            <option value="sales-systems">Sales Systems Automation</option>
            <option value="office-automation">Office Operations Automation</option>
            <option value="whatsapp-solutions">WhatsApp Business Solutions</option>
            <option value="custom">Custom AI/Automation Solution</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: COLORS.accent,
            color: COLORS.accentDark,
          }}
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Sending...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
```

## 3. Server-Side API Routes

### Chat Response API
**File:** `app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini';
import SYSTEM_PROMPT from '@/lib/chatbot-prompt';

// Demo responses when API key is not configured
const DEMO_RESPONSES: Record<string, string> = {
  default: "Thanks for trying the Maru AI Chatbot! This is a demo response. To get real AI-powered responses, please add your GEMINI_API_KEY to the .env.local file. You can learn about our services at maruonline.com or email us at hello@maruonline.com.",
  lead: "Our Lead Generation Automation service transforms raw data into qualified sales opportunities. We use AI-powered enrichment and smart scoring to help you find the best leads for your business. Would you like to schedule a consultation?",
  sales: "Sales Systems Automation helps you supercharge your CRM with AI. We can help you automate follow-ups, manage your pipeline, and give your sales team more time to actually sell. Interested in learning more?",
  office: "Office Operations Automation streamlines your back-office workflows. From invoice processing to document routing, we help you eliminate manual work and focus on what matters. Want to discuss your specific needs?",
  pricing: "We offer three tiers: Starter (R4,950/month), Growth (R12,500/month), and Enterprise (R28,000+/month). Each tier includes our core automation services with varying levels of support and customization. Which one sounds right for your business?",
};

function getDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('lead')) return DEMO_RESPONSES.lead;
  if (msg.includes('sales') || msg.includes('crm')) return DEMO_RESPONSES.sales;
  if (msg.includes('office') || msg.includes('operation')) return DEMO_RESPONSES.office;
  if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')) return DEMO_RESPONSES.pricing;
  return DEMO_RESPONSES.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    let response: string;

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      // Demo mode - use pre-defined responses
      const lastMessage = messages[messages.length - 1];
      response = getDemoResponse(lastMessage.content);
      console.log('⚠️  Running in DEMO mode - GEMINI_API_KEY not set');
    } else {
      // Generate response using Gemini AI
      response = await generateResponse(messages, SYSTEM_PROMPT);
    }

    return NextResponse.json({ 
      response,
      success: true 
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### Lead Capture API
**File:** `app/api/leads/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { LeadData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const leadData: LeadData = body;

    // Validate required fields
    if (!leadData.name || !leadData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send lead data via email (for now - can be extended to database/CRM later)
    const emailSent = await sendLeadEmail(leadData);

    if (!emailSent) {
      throw new Error('Failed to send lead notification');
    }

    return NextResponse.json({
      success: true,
      message: 'Lead information received successfully'
    });
  } catch (error) {
    console.error('Leads API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process lead data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Send lead notification email
 * For production, this should use a proper email service (SendGrid, Resend, etc.)
 */
async function sendLeadEmail(leadData: LeadData): Promise<boolean> {
  try {
    // Format the email content
    const emailContent = `
New Lead from Maru Chatbot
========================

Name: ${leadData.name}
Email: ${leadData.email}
Company: ${leadData.company || 'Not provided'}
Phone: ${leadData.phone || 'Not provided'}
Interest: ${leadData.interest || 'Not specified'}
Message: ${leadData.message || 'None'}

Source URL: ${leadData.sourceUrl || 'Unknown'}
Timestamp: ${leadData.timestamp.toISOString()}

--- Conversation Transcript ---
${leadData.conversationTranscript || 'No transcript available'}
========================
    `.trim();

    // For development/testing: Log to console
    console.log('=================================');
    console.log('NEW LEAD CAPTURED:');
    console.log(emailContent);
    console.log('=================================');
    
    return true;
  } catch (error) {
    console.error('Error sending lead email:', error);
    return false;
  }
}
```
