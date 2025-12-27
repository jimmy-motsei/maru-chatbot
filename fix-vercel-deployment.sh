#!/bin/bash

# Fix for Vercel Deployment - Add 'use client' directives

echo "🔧 Fixing ChatWidget for Vercel deployment..."

# Note: This script assumes maru-online is in the workspace
# If not accessible, you'll need to manually add 'use client' to these files:

cat << 'EOF'

MANUAL FIX REQUIRED:
===================

The Vercel build is failing due to missing 'use client' directives.

Add 'use client'; as the FIRST line in these files:

1. /Users/ramoloimotsei/maru-online/components/ChatWidget.tsx
2. /Users/ramoloimotsei/maru-online/components/ChatMessage.tsx  
3. /Users/ramoloimotsei/maru-online/components/LeadCaptureForm.tsx

Example:
--------
'use client';

import { useState } from 'react';
// ... rest of the file


ALSO CHECK:
-----------
If you added ChatWidget to app/layout.tsx or app/page.tsx, make sure
those files also have 'use client'; at the top if they're using
client-side features.

After making these changes:
1. Commit: git add . && git commit -m "fix: Add use client directives for chatbot"
2. Push: git push origin main
3. Vercel will auto-deploy

EOF

echo ""
echo "✅ Instructions created!"
