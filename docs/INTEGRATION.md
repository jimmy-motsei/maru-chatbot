# Maru Chatbot Integration Guide

## Files Copied

✅ **Components:**
- `components/ChatWidget.tsx` - Main chatbot interface
- `components/ChatMessage.tsx` - Message display
- `components/LeadCaptureForm.tsx` - Lead capture form

✅ **Library:**
- `lib/gemini.ts` - Gemini API wrapper
- `lib/chatbot-prompt.ts` - Knowledge base & system prompt
- `lib/types.ts` - TypeScript types

✅ **API Routes:**
- `app/api/chat/route.ts` - Chat endpoint
- `app/api/leads/route.ts` - Lead capture endpoint

## Next Steps

### 1. Add ChatWidget to Your Layout

Edit your `app/layout.tsx`:

```tsx
import ChatWidget from '@/components/ChatWidget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />  {/* Chatbot appears on all pages */}
      </body>
    </html>
  );
}
```

### 2. Configure Gemini API Key

1. Get your API key from: https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Note:** The chatbot works in demo mode without an API key!

### 3. Install Dependencies (if not done already)

```bash
npm install @google/generative-ai framer-motion lucide-react
```

### 4. Start Development Server

```bash
npm run dev
```

Visit your website and you'll see the floating cyan chat button in the bottom-right corner!

## Customization

### Change Greeting Message
Edit `components/ChatWidget.tsx`, line ~26

### Update Services Info
Edit `lib/chatbot-prompt.ts`

### Adjust Position
Edit `components/ChatWidget.tsx`:
```tsx
// Change bottom-6 right-6 to your preference
className="fixed bottom-6 right-6 z-50"
```

### Modify Colors
The chatbot uses CSS variables from your global styles:
- `--maru-cyan`: Primary accent color
- `--maru-dark`: Background color

## Testing

1. Click the floating chat button
2. Try these messages:
   - "Tell me about your services"
   - "I need help with lead generation"
   - "What are your pricing options?"

## Support

For issues or questions, check:
- `/maru-chatbot/README.md` in the original chatbot project
- Maru Online: hello@maruonline.com
