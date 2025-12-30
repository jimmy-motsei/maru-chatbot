import { LeadData } from './types';

/**
 * Handle chat API request
 * This function can be used in any Next.js API route
 */
export async function handleChatRequest(messages: Array<{ role: 'user' | 'assistant', content: string }>) {
  const { generateResponse } = await import('./gemini');
  const SYSTEM_PROMPT = (await import('./chatbot-prompt')).default;
  
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

  let response: string;

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    // Demo mode - use pre-defined responses
    const lastMessage = messages[messages.length - 1];
    response = getDemoResponse(lastMessage.content);
    console.log('⚠️  Running in DEMO mode - GEMINI_API_KEY not set');
  } else {
    // Production mode
    // Try RAG first (Knowledge Base)
    try {
      const { queryRAG } = await import('./rag-pipeline');
      const lastMessage = messages[messages.length - 1];
      
      // Attempt RAG query
      const ragResponse = await queryRAG(lastMessage.content);

      if (ragResponse) {
        response = ragResponse;
      } else {
        // Fallback: Generate response using Gemini AI
        response = await generateResponse(messages, SYSTEM_PROMPT);
      }
    } catch (e) {
      console.error('Error in chat handler:', e);
      // Fallback if import fails or RAG fails completely
      response = await generateResponse(messages, SYSTEM_PROMPT);
    }
  }

  return { response, success: true };
}

/**
 * Handle lead submission
 * This function can be used in any Next.js API route
 */
export async function handleLeadSubmission(leadData: LeadData) {
  // Validate required fields
  if (!leadData.name || !leadData.email) {
    throw new Error('Name and email are required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(leadData.email)) {
    throw new Error('Invalid email address');
  }

  // Send lead notification
  const emailSent = await sendLeadEmail(leadData);

  if (!emailSent) {
    throw new Error('Failed to send lead notification');
  }

  return {
    success: true,
    message: 'Lead information received successfully'
  };
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

    // TODO: Implement actual email sending
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'chatbot@maruonline.com',
    //   to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@maruonline.com',
    //   subject: `New Chatbot Lead: ${leadData.name}`,
    //   text: emailContent,
    // });

    // For now, return true (development mode)
    return true;
  } catch (error) {
    console.error('Error sending lead email:', error);
    return false;
  }
}
