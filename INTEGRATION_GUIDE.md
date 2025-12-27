# Maru Chatbot Library - Integration Guide

## Overview
The `maru-chatbot` is now a **distributable library package** that can be safely integrated into your Next.js applications without causing build conflicts or hangs.

## What Changed?
✅ **Self-Contained Styling** - No dependency on host CSS variables  
✅ **Bundled Distribution** - Pre-compiled code prevents build hangs  
✅ **Reusable API Handlers** - Easy integration with your existing API routes  
✅ **Peer Dependencies** - Prevents version conflicts

---

## Installation

### Option 1: Local Package (Recommended for Development)
```bash
# From your host project (e.g., maru-website or maru-ai-academy)
npm install file:../maru-chatbot
```

### Option 2: NPM Registry (Future)
```bash
npm install maru-chatbot
```

---

## Integration Steps

### Step 1: Add ChatWidget to Your Layout

**File:** `app/layout.tsx`

```tsx
import { ChatWidget } from 'maru-chatbot';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />  {/* Floating chatbot on all pages */}
      </body>
    </html>
  );
}
```

### Step 2: Create API Route Handlers

#### Chat API Route
**File:** `app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handleChatRequest } from 'maru-chatbot/api-handlers';

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

    const result = await handleChatRequest(messages);
    return NextResponse.json(result);
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

#### Leads API Route
**File:** `app/api/leads/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { LeadData } from 'maru-chatbot';
import { handleLeadSubmission } from 'maru-chatbot/api-handlers';

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
```

### Step 3: Environment Variables

Add to your `.env.local`:
```
# Optional: Gemini API Key for AI responses
# Without this, the chatbot runs in demo mode
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

---

## Build & Deploy

### Test Locally
```bash
npm run dev
```
Visit your app - the chatbot will appear in the bottom-right corner.

### Production Build
```bash
npm run build
```
✅ **No build hangs** - The chatbot is pre-compiled!

---

## Customization

### Import Individual Components
```tsx
import { ChatWidget, ChatMessage, COLORS } from 'maru-chatbot';
```

### Use Custom Colors
```tsx
import { COLORS } from 'maru-chatbot';

console.log(COLORS.accent); // #22d3ee (Cyan)
console.log(COLORS.background); // #2D2D2D
```

### TypeScript Support
All types are exported:
```tsx
import type { Message, LeadData, ConversationState } from 'maru-chatbot';
```

---

## Troubleshooting

### Build Still Hangs?
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Rebuild the chatbot library: `cd ../maru-chatbot && npm run package`

### Styling Conflicts?
The chatbot uses **inline styles** and hardcoded colors - no CSS variable dependencies!

### API Routes Not Working?
- Verify routes exist at `/api/chat` and `/api/leads`
- Check browser console for error messages
- Ensure `GEMINI_API_KEY` is set (or expect demo responses)

---

## What's Included

### Components
- `ChatWidget` - Main floating chat interface
- `ChatMessage` - Message bubble component
- `LeadCaptureForm` - Lead capture form
- `TypingIndicator` - Loading indicator

### API Handlers
- `handleChatRequest(messages)` - Process chat messages
- `handleLeadSubmission(leadData)` - Handle lead submissions

### Types
- `Message` - Chat message structure
- `LeadData` - Lead capture data
- `ConversationStage` - Conversation flow stages
- `ConversationState` - State management

### Constants
- `COLORS` - Color palette matching the Maru brand

---

## Support
For issues or questions:
- Email: hello@maruonline.com
- Check `/maru-chatbot/README.md` for more details
