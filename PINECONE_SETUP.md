# Pinecone RAG Setup Guide

This guide will help you set up Pinecone for RAG (Retrieval-Augmented Generation) functionality in the Maru Chatbot.

## What is RAG?

RAG allows the chatbot to:
- Access your business knowledge base
- Provide accurate, specific answers about your services
- Stay up-to-date without retraining the AI model
- Cite sources and provide contextual responses

## Prerequisites

- Gemini API Key (you already have this)
- Pinecone account (free tier available)

---

## Step 1: Create a Pinecone Account

1. Go to [https://www.pinecone.io/](https://www.pinecone.io/)
2. Click "Start Free" or "Sign Up"
3. Create account with email or Google

**Free Tier Includes:**
- 1 index
- 100,000 vectors
- More than enough for a chatbot knowledge base

## Step 2: Create an Index

### Via Pinecone Console (Recommended)

1. Log in to [https://app.pinecone.io/](https://app.pinecone.io/)
2. Click "Create Index"
3. Configure:
   - **Name**: `maru-knowledge-base`
   - **Dimensions**: `768` (for Gemini embedding-001)
   - **Metric**: `cosine`
   - **Cloud**: `GCP` (recommended for Gemini)
   - **Region**: `us-central1` (or closest to you)

4. Click "Create Index"

### Via API (Alternative)

```bash
curl -X POST https://api.pinecone.io/indexes \\
  -H "Api-Key: YOUR_PINECONE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "maru-knowledge-base",
    "dimension": 768,
    "metric": "cosine",
    "spec": {
      "serverless": {
        "cloud": "gcp",
        "region": "us-central1"
      }
    }
  }'
```

## Step 3: Get Your API Key

1. In Pinecone console, click "API Keys" in left sidebar
2. Copy your API key
3. Keep it secure!

## Step 4: Configure Environment Variables

### In maru-chatbot

Edit `/Users/ramoloimotsei/maru-chatbot/.env.local`:

```bash
# Existing
GEMINI_API_KEY=AIzaSy...

# Add these:
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=maru-knowledge-base
```

### In maru-website

Edit `/Users/ramoloimotsei/maru-website/.env.local`:

```bash
# Existing
GEMINI_API_KEY=AIzaSy...

# Add these:
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=maru-knowledge-base
```

## Step 5: Run Data Ingestion

### From maru-chatbot directory

```bash
cd /Users/ramoloimotsei/maru-chatbot
node scripts/ingest.js
```

**Expected Output:**
```
🚀 Starting Pinecone Ingestion with Gemini Embeddings...

📌 Connecting to Pinecone...
✅ Connected to Pinecone index: maru-knowledge-base

📄 Splitting text into chunks...
✅ Created 15 document chunks

🧠 Creating embeddings with Gemini...
💾 Storing vectors in Pinecone...

✅ SUCCESS! Data ingested into Pinecone.

📊 Summary:
   - Documents: 15 chunks
   - Index: maru-knowledge-base
   - Embeddings: Gemini embedding-001

🎉 Your chatbot is now ready to answer questions!
```

## Step 6: Test RAG Functionality

### Test Query Script

Create a test file:

```javascript
// test-rag.js
require('dotenv').config();
const { queryRAG } = require('./lib/rag-pipeline');

async function test() {
  const questions = [
    "What services does Maru Online offer?",
    "How much does the Growth plan cost?",
    "Where is Maru Online based?",
    "What free tools are available?"
  ];

  for (const q of questions) {
    console.log(`\\n❓ ${q}`);
    const answer = await queryRAG(q);
    console.log(`✅ ${answer}\\n`);
  }
}

test();
```

Run it:
```bash
node test-rag.js
```

### Via Dev Server

1. Ensure dev server is running: `npm run dev`
2. Open http://localhost:3000
3. Click chatbot
4. Ask: "What services does Maru Online offer?"
5. You should get a detailed, accurate response!

## Troubleshooting

### "Module not found" errors
```bash
cd /Users/ramoloimotsei/maru-chatbot
npm install
```

### "Index not found"
- Check index name matches exactly: `maru-knowledge-base`
- Verify index was created successfully in Pinecone console

### "Dimension mismatch"
- Ensure index was created with `768` dimensions
- Gemini embedding-001 produces 768-dimensional vectors

### "API key invalid"
- Double-check both PINECONE_API_KEY and GEMINI_API_KEY
- Ensure no trailing spaces in .env.local

### "Rate limit exceeded"
- Free tier limits: 100,000 vectors, 1 index
- Wait a moment and try again

## Updating Knowledge Base

To add new information:

1. Edit `scripts/ingest.js`
2. Update the `BUSINESS_DATA` constant
3. Run ingestion again: `node scripts/ingest.js`

**Note**: This will add new vectors. To replace entirely, delete the index and recreate it.

## Production Considerations

### For maru-website deployment:

1. Add environment variables to Vercel/Netlify:
   - `PINECONE_API_KEY`
   - `PINECONE_INDEX`
   - `GEMINI_API_KEY`

2. Run ingestion once (locally is fine)
3. Deploy your app
4. RAG will work automatically!

## Monitoring

### Pinecone Dashboard

Monitor usage at: https://app.pinecone.io/

Check:
- Vector count
- Query latency
- API usage
- Index health

### Cost Tracking

Free tier includes:
- 100,000 vectors (plenty for SMB chatbot)
- Pay-as-you-go after that

---

## Next Steps

After setup:
- ✅ Test chatbot responses
- ✅ Add more business-specific content
- ✅ Monitor query performance
- ✅ Gather user feedback
- ✅ Iterate on knowledge base

## Support

- **Pinecone Docs**: https://docs.pinecone.io/
- **Gemini Docs**: https://ai.google.dev/docs
- **LangChain Docs**: https://js.langchain.com/docs/

---

**Status**: Ready for setup!  
**Estimated Time**: 10-15 minutes  
**Difficulty**: Beginner-friendly
