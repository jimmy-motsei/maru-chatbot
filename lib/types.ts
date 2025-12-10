/**
 * Type definitions for the Maru Chatbot
 */

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
