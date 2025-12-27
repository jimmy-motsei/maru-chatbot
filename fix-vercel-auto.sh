#!/bin/bash

# Automated Fix for Vercel Deployment Error
# This script adds 'use client' directives to chatbot components

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Vercel Deployment Auto-Fix Script${NC}"
echo "====================================="
echo ""

# Target directory
TARGET_DIR="/Users/ramoloimotsei/maru-online"

# Verify target exists
if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${RED}❌ Error: $TARGET_DIR not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Target directory: $TARGET_DIR${NC}"
echo ""

# Function to add 'use client' if not present
add_use_client() {
  local file="$1"
  
  if [ ! -f "$file" ]; then
    echo -e "${YELLOW}⚠ File not found: $file${NC}"
    return 1
  fi
  
  # Check if file already has 'use client'
  if grep -q "^'use client';" "$file" || grep -q '^"use client";' "$file"; then
    echo -e "${GREEN}✓ Already has 'use client': $(basename $file)${NC}"
    return 0
  fi
  
  # Add 'use client' as first line
  echo "'use client';" > "$file.tmp"
  echo "" >> "$file.tmp"
  cat "$file" >> "$file.tmp"
  mv "$file.tmp" "$file"
  
  echo -e "${BLUE}✓ Added 'use client' to: $(basename $file)${NC}"
}

# Step 1: Fix chatbot components
echo -e "${BLUE}📦 Step 1: Adding 'use client' to chatbot components...${NC}"
add_use_client "$TARGET_DIR/components/ChatWidget.tsx"
add_use_client "$TARGET_DIR/components/ChatMessage.tsx"
add_use_client "$TARGET_DIR/components/LeadCaptureForm.tsx"
echo ""

# Step 2: Check and fix layout/page files if they exist
echo -e "${BLUE}📄 Step 2: Checking layout and page files...${NC}"

# Function to check if file imports ChatWidget
file_imports_chatwidget() {
  local file="$1"
  if [ -f "$file" ]; then
    if grep -q "ChatWidget" "$file"; then
      return 0  # True - imports ChatWidget
    fi
  fi
  return 1  # False - doesn't import ChatWidget
}

# Check app/layout.tsx
if file_imports_chatwidget "$TARGET_DIR/app/layout.tsx"; then
  echo -e "${YELLOW}⚠ layout.tsx imports ChatWidget${NC}"
  add_use_client "$TARGET_DIR/app/layout.tsx"
fi

# Check app/page.tsx
if file_imports_chatwidget "$TARGET_DIR/app/page.tsx"; then
  echo -e "${YELLOW}⚠ page.tsx imports ChatWidget${NC}"
  add_use_client "$TARGET_DIR/app/page.tsx"
fi

echo ""

# Step 3: Git operations
echo -e "${BLUE}📝 Step 3: Git operations...${NC}"
cd "$TARGET_DIR"

# Check if there are changes
if git diff --quiet; then
  echo -e "${GREEN}✓ No changes needed - files already fixed!${NC}"
else
  echo "Changes detected. Files modified:"
  git diff --name-only
  echo ""
  
  # Stage changes
  git add components/ChatWidget.tsx components/ChatMessage.tsx components/LeadCaptureForm.tsx 2>/dev/null || true
  git add app/layout.tsx app/page.tsx 2>/dev/null || true
  
  # Commit
  echo "Committing changes..."
  git commit -m "fix: Add 'use client' directives to chatbot components for Vercel deployment"
  
  echo -e "${GREEN}✓ Changes committed${NC}"
  echo ""
  
  # Push
  echo -e "${BLUE}Pushing to remote...${NC}"
  git push origin main
  
  echo -e "${GREEN}✓ Changes pushed to GitHub${NC}"
fi

echo ""
echo "====================================="
echo -e "${GREEN}✅ Fix Complete!${NC}"
echo "====================================="
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Vercel will automatically detect the push and start a new deployment"
echo "2. Monitor the deployment at: https://vercel.com/maru-online/maru-website-rebuild"
echo "3. The build should now succeed without TypeScript errors"
echo ""
echo -e "${YELLOW}⏱  Estimated deployment time: 2-5 minutes${NC}"
echo ""
