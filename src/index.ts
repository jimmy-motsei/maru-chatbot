// Main entry point for the chatbot library
export { default as ChatWidget } from '../components/ChatWidget';
export { default as ChatMessage, TypingIndicator } from '../components/ChatMessage';
export { default as LeadCaptureForm } from '../components/LeadCaptureForm';

// Export types
export type { Message, LeadData, ConversationStage, ConversationState } from '../lib/types';

// Export constants
export { COLORS } from '../lib/constants';

// Export API handlers for Next.js routes
export { handleChatRequest, handleLeadSubmission } from '../lib/api-handlers';
