#!/bin/bash

# Maru Chatbot Integration Script
# This script copies the chatbot files to your main Maru website

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🤖 Maru Chatbot Integration Script${NC}"
echo "=================================="
echo ""

# Source directory (current chatbot project)
SOURCE_DIR="/Users/ramoloimotsei/maru-chatbot"

# Prompt for target directory
echo -e "${YELLOW}Available Maru website directories:${NC}"
echo "1. /Users/ramoloimotsei/maru-online"
echo "2. /Users/ramoloimotsei/Projects/maru-website"
echo "3. Custom path"
echo ""
read -p "Select target directory (1-3): " choice

case $choice in
  1)
    TARGET_DIR="/Users/ramoloimotsei/maru-online"
    ;;
  2)
    TARGET_DIR="/Users/ramoloimotsei/Projects/maru-website"
    ;;
  3)
    read -p "Enter custom path: " TARGET_DIR
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

# Verify target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${YELLOW}Target directory does not exist: $TARGET_DIR${NC}"
  read -p "Create it? (y/n): " create
  if [ "$create" = "y" ]; then
    mkdir -p "$TARGET_DIR"
  else
    exit 1
  fi
fi

echo ""
echo -e "${GREEN}✓ Target directory: $TARGET_DIR${NC}"
echo ""

# Step 1: Copy components
echo -e "${BLUE}📦 Step 1: Copying components...${NC}"
mkdir -p "$TARGET_DIR/components"
cp -v "$SOURCE_DIR/components/ChatWidget.tsx" "$TARGET_DIR/components/"
cp -v "$SOURCE_DIR/components/ChatMessage.tsx" "$TARGET_DIR/components/"
cp -v "$SOURCE_DIR/components/LeadCaptureForm.tsx" "$TARGET_DIR/components/"
echo -e "${GREEN}✓ Components copied${NC}"
echo ""

# Step 2: Copy lib files
echo -e "${BLUE}📚 Step 2: Copying lib files...${NC}"
mkdir -p "$TARGET_DIR/lib"
cp -v "$SOURCE_DIR/lib/gemini.ts" "$TARGET_DIR/lib/"
cp -v "$SOURCE_DIR/lib/chatbot-prompt.ts" "$TARGET_DIR/lib/"
cp -v "$SOURCE_DIR/lib/types.ts" "$TARGET_DIR/lib/"
echo -e "${GREEN}✓ Lib files copied${NC}"
echo ""

# Step 3: Copy API routes
echo -e "${BLUE}🔌 Step 3: Copying API routes...${NC}"
mkdir -p "$TARGET_DIR/app/api/chat"
mkdir -p "$TARGET_DIR/app/api/leads"
cp -v "$SOURCE_DIR/app/api/chat/route.ts" "$TARGET_DIR/app/api/chat/"
cp -v "$SOURCE_DIR/app/api/leads/route.ts" "$TARGET_DIR/app/api/leads/"
echo -e "${GREEN}✓ API routes copied${NC}"
echo ""

# Step 4: Check for package.json and dependencies
echo -e "${BLUE}📋 Step 4: Checking dependencies...${NC}"
if [ -f "$TARGET_DIR/package.json" ]; then
  echo "package.json found. You'll need to install these dependencies:"
  echo "  - @google/generative-ai"
  echo "  - framer-motion"
  echo "  - lucide-react"
  echo ""
  read -p "Install dependencies now? (y/n): " install_deps
  if [ "$install_deps" = "y" ]; then
    cd "$TARGET_DIR"
    npm install @google/generative-ai framer-motion lucide-react
    echo -e "${GREEN}✓ Dependencies installed${NC}"
  else
    echo -e "${YELLOW}⚠ Remember to install dependencies later:${NC}"
    echo "  cd $TARGET_DIR"
    echo "  npm install @google/generative-ai framer-motion lucide-react"
  fi
else
  echo -e "${YELLOW}⚠ No package.json found in target directory${NC}"
  echo "Make sure this is a Next.js project!"
fi
echo ""

# Step 5: Environment variables
echo -e "${BLUE}🔐 Step 5: Environment variables...${NC}"
if [ -f "$TARGET_DIR/.env.local" ]; then
  echo "Existing .env.local found"
  if ! grep -q "GEMINI_API_KEY" "$TARGET_DIR/.env.local"; then
    echo "" >> "$TARGET_DIR/.env.local"
    echo "# Maru Chatbot" >> "$TARGET_DIR/.env.local"
    echo "GEMINI_API_KEY=" >> "$TARGET_DIR/.env.local"
    echo -e "${GREEN}✓ Added GEMINI_API_KEY to .env.local${NC}"
  else
    echo "GEMINI_API_KEY already exists in .env.local"
  fi
else
  echo "Creating .env.local..."
  echo "# Maru Chatbot" > "$TARGET_DIR/.env.local"
  echo "GEMINI_API_KEY=" >> "$TARGET_DIR/.env.local"
  echo -e "${GREEN}✓ Created .env.local with GEMINI_API_KEY${NC}"
fi
echo ""

# Step 6: Create integration guide
echo -e "${BLUE}📝 Step 6: Creating integration guide...${NC}"
cat > "$TARGET_DIR/CHATBOT_INTEGRATION.md" << 'EOF'
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
EOF

echo -e "${GREEN}✓ Created CHATBOT_INTEGRATION.md${NC}"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✅ Integration Complete!${NC}"
echo "=================================="
echo ""
echo "📂 Files copied to: $TARGET_DIR"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Add ChatWidget to your layout (see CHATBOT_INTEGRATION.md)"
echo "2. Add your Gemini API key to .env.local"
echo "3. Install dependencies (if needed)"
echo "4. Start your dev server"
echo ""
echo -e "${YELLOW}📖 Full instructions: $TARGET_DIR/CHATBOT_INTEGRATION.md${NC}"
echo ""
