import { NextRequest, NextResponse } from 'next/server';
import { LeadData } from '@/lib/types';
import { handleLeadSubmission } from '@/lib/api-handlers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const leadData: LeadData = body;

    const result = await handleLeadSubmission(leadData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Leads API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process lead data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: error instanceof Error && error.message.includes('required') ? 400 : 500 }
    );
  }
}
