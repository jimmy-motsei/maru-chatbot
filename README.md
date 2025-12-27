# Maru Chatbot Library

A production-ready, AI-powered chatbot component for Next.js applications. Features a HubSpot-style proactive interface, lead capture, and seamless integration.

## 🚀 Features

- ✅ **Self-Contained Styling** - No CSS variable dependencies
- ✅ **Pre-Built Distribution** - Prevents build hangs
- ✅ **AI-Powered Responses** - Google Gemini integration
- ✅ **Demo Mode** - Works without API key
- ✅ **Lead Capture** - Built-in form with validation
- ✅ **TypeScript Support** - Full type definitions
- ✅ **Responsive Design** - Mobile-friendly interface

## 📦 Installation

```bash
# Install from local path
npm install file:../maru-chatbot

# Or from NPM (when published)
npm install maru-chatbot
```

## 🎯 Quick Start

### 1. Add to Your App

```tsx
// app/layout.tsx
import { ChatWidget } from 'maru-chatbot';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
```

### 2. Create API Routes

```typescript
// app/api/chat/route.ts
import { handleChatRequest } from 'maru-chatbot/api-handlers';

export async function POST(request) {
  const { messages } = await request.json();
  const result = await handleChatRequest(messages);
  return Response.json(result);
}
```

```typescript
// app/api/leads/route.ts
import { handleLeadSubmission } from 'maru-chatbot/api-handlers';

export async function POST(request) {
  const leadData = await request.json();
  const result = await handleLeadSubmission(leadData);
  return Response.json(result);
}
```

### 3. Configure (Optional)

```bash
# .env.local
GEMINI_API_KEY=your_key_here  # Optional - works in demo mode without it
```

## 📚 Documentation

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed integration instructions.

## 🛠️ Development

This repo serves as both:
1. **Library Package** - Distributable chatbot component
2. **Development Playground** - Test & develop the chatbot

### Commands

```bash
# Development mode (Next.js app)
npm run dev

# Build library package
npm run package

# Build Next.js app
npm run build
```

### Package Structure

```
maru-chatbot/
├── src/
│   └── index.ts          # Library entry point
├── components/
│   ├── ChatWidget.tsx    # Main component
│   ├── ChatMessage.tsx   # Message display
│   └── LeadCaptureForm.tsx
├── lib/
│   ├── api-handlers.ts   # Reusable API logic
│   ├── constants.ts      # Colors & config
│   ├── gemini.ts         # AI integration
│   └── types.ts          # TypeScript types
└── dist/                 # Built package (npm run package)
```

## 🎨 Customization

### Colors

```tsx
import { COLORS } from 'maru-chatbot';

const CustomComponent = () => (
  <div style={{ color: COLORS.accent }}>
    {/* Uses #22d3ee (Cyan) */}
  </div>
);
```

### Types

```tsx
import type { Message, LeadData } from 'maru-chatbot';

const myMessages: Message[] = [...];
```

## 🔧 Integration into Existing Projects

### maru-website

```bash
cd /path/to/maru-website
npm install file:../maru-chatbot
```

Follow the Quick Start guide above to add the widget.

### maru-ai-academy

Same process as above. The chatbot is framework-agnostic within Next.js apps.

## 🐛 Troubleshooting

**Build Hangs?**
- The chatbot is pre-compiled. Clear `.next` and rebuild: `rm -rf .next && npm run build`

**Styling Issues?**
- All styles are self-contained. No CSS imports needed.

**API Not Working?**
- Check console for errors
- Verify `/api/chat` and `/api/leads` routes exist
- Without `GEMINI_API_KEY`, expect demo responses

## 📝 License

Private - Maru Online

## 💬 Support

Email: hello@maruonline.com
