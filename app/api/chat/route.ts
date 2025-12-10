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
