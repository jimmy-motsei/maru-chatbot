// Main entry point for the chatbot library (CLIENT-SAFE)
// This file should NEVER import server-only code like RAG or Pinecone

export { default as ChatWidget } from '../components/ChatWidget';
export { default as ChatMessage, TypingIndicator } from '../components/ChatMessage';
export { default as LeadCaptureForm } from '../components/LeadCaptureForm';

// Export types
export type { Message, LeadData, ConversationStage, ConversationState } from '../lib/types';

// Export constants
export { COLORS } from '../lib/constants';

// NOTE: API handlers are exported separately via 'maru-chatbot/api-handlers'
// They contain server-only code (Pinecone, RAG) and should ONLY be imported in API routes
