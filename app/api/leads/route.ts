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
