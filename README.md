# Maru AI Chatbot

An intelligent AI-powered chatbot for Maru Online, built with Next.js 15, Google Gemini API, and Framer Motion.

## Features

- 🤖 **AI-Powered Conversations**: Intelligent responses powered by Google Gemini
- 📊 **Lead Qualification**: Automatic visitor data collection and qualification
- 🎨 **Maru-Branded Design**: Matches the Maru Online website aesthetic
- ⚡ **Instant Responses**: 24/7 availability with real-time answers
- 📱 **Fully Responsive**: Works seamlessly on desktop and mobile
- ✨ **Smooth Animations**: Premium UX with Framer Motion animations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **Styling**: Tailwind CSS with custom Maru theming
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or navigate to the repository**:
   ```bash
   cd maru-chatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   To get a Google Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Get API key"
   - Copy the key and paste it into `.env.local`

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Try the chatbot**:
   
   Click the floating chat button in the bottom-right corner!

## Project Structure

```
maru-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Chat API endpoint
│   │   └── leads/route.ts      # Lead capture API endpoint
│   ├── globals.css             # Global styles with Maru branding
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main demo page
├── components/
│   ├── ChatWidget.tsx          # Main chat widget component
│   ├── ChatMessage.tsx         # Message display component
│   └── LeadCaptureForm.tsx     # Lead capture form
├── lib/
│   ├── gemini.ts               # Gemini API wrapper
│   ├── chatbot-prompt.ts       # System prompt & knowledge base
│   └── types.ts                # TypeScript type definitions
└── .env.local                  # Environment variables (not in git)
```

## Configuration

### Customizing the Chatbot

#### Change the Greeting Message
Edit `components/ChatWidget.tsx`, line ~26:
```typescript
const greeting: Message = {
  id: '1',
  role: 'assistant',
  content: "Your custom greeting message here!",
  timestamp: new Date(),
};
```

#### Modify Services & Knowledge Base
Edit `lib/chatbot-prompt.ts` to update:
- Service descriptions
- Pricing information
- FAQs and conversation guidelines

#### Adjust Colors
Edit `app/globals.css`:
```css
:root {
  --maru-cyan: #00d4ff;      /* Primary accent color */
  --maru-dark: #0a0a0a;      /* Background color */
  /* ... */
}
```

#### Configure Lead Form Trigger
Edit `components/ChatWidget.tsx`, function `checkIfShouldShowForm()` to customize when the lead form appears.

## Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - ImportGitHub repository
   - Add environment variables (GEMINI_API_KEY, etc.)
   - Click "Deploy"

3. **Set environment variables on Vercel**:
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Redeploy if needed

### Other Deployment Options

This is a standard Next.js app and can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker container
- Any Node.js hosting

## Integration with Main Website

### Option 1: Embed as Component (Recommended)

If your main website is also built with Next.js/React:

1. Copy the chatbot files to your main project
2. Import and use the component:
   ```tsx
   import ChatWidget from '@/components/ChatWidget';
   
   export default function Layout({ children }) {
     return (
       <>
         {children}
         <ChatWidget />
       </>
     );
   }
   ```

### Option 2: iframe Embed

Deploy the chatbot separately and embed via iframe:
```html
<iframe 
  src="https://your-chatbot-url.vercel.app" 
  style="position: fixed; bottom: 0; right: 0; width: 450px; height: 650px; border: none; z-index: 9999;"
></iframe>
```

### Option 3: Script Tag (Future Enhancement)

Create an embeddable script that can be added to any website with a single `<script>` tag.

## Testing the Chatbot

### Sample Conversations to Try

1. **General Inquiry**:
   - "Tell me about your services"
   - "How can you help my business?"

2. **Specific Service**:
   - "I need help with lead generation"
   - "Tell me about sales automation"

3. **Pricing**:
   - "How much does it cost?"
   - "What are your pricing tiers?"

4. **Lead Qualification**:
   - Express interest in a service
   - The chatbot will ask qualifying questions
   - Fill out the lead form when prompted

## Data Collection

### Current Implementation

Leads are currently logged to the console in development mode. Check your terminal/console to see captured leads.

### Production Setup

For production, implement email sending in `app/api/leads/route.ts`:

**Option A: Use Resend** (recommended):
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'chatbot@maruonline.com',
  to: 'hello@maruonline.com',
  subject: `New Chatbot Lead: ${leadData.name}`,
  text: emailContent,
});
```

**Option B: Use Nodemailer**:
```bash
npm install nodemailer
```

**Option C: Save to Database**:
- Add Supabase/PostgreSQL/MongoDB
- Store leads for CRM integration

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Main website URL | No |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email for leads | No |
| `SMTP_HOST` | SMTP server (if using email) | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |

## Troubleshooting

### "GEMINI_API_KEY is not set" Error

Make sure you've created `.env.local` and added your API key. Restart the dev server after adding environment variables.

### Chatbot not responding

1. Check browser console for errors
2. Verify API key is valid
3. Check network tab for failed API calls
4. Ensure you have internet connection (Gemini API requires network access)

### Styling issues

Make sure Tailwind is processing the CSS correctly. Try:
```bash
npm run build
npm run dev
```

## License

This project is proprietary to Maru Online.

## Support

For issues or questions:
- Email: hello@maruonline.com
- Website: [maruonline.com](https://maruonline.com)

---

Built with ❤️ by Maru Online | AI & Automation for SMEs
