# 🚀 Maru Chatbot - Production Deployment Guide

## ✅ RAG Integration Complete

**Date**: December 30, 2024  
**Status**: Ready for Production Deployment

---

## 📋 What's Been Implemented

### 1. **Pinecone Vector Database**
- ✅ Index created: `maru-knowledge-base`
- ✅ Dimension: 768 (Gemini embeddings)
- ✅ Data ingested: 5 document chunks
- ✅ Knowledge base includes:
  - Services (Lead Gen, Sales, Office Automation)
  - Pricing (Starter, Growth, Enterprise)
  - Free tools (Lead Score Predictor, Pipeline Leak Detector, Proposal Accelerator)
  - Company info (location, contact, process)

### 2. **Gemini AI Integration**
- ✅ Embeddings: `models/text-embedding-004` (768 dimensions)
- ✅ Chat Model: `gemini-2.0-flash-exp`
- ✅ API Key: Updated and working

### 3. **RAG Pipeline**
- ✅ File: `/lib/rag-pipeline.ts`
- ✅ Retrieves top 3 relevant documents
- ✅ Generates contextual responses
- ✅ Tested and verified

### 4. **API Integration**
- ✅ Chat endpoint: `/app/api/chat/route.ts`
- ✅ Handler: `/lib/api-handlers.ts`
- ✅ Automatic RAG fallback to direct AI

---

## 🔧 Environment Variables Required on Vercel

You **must** set these environment variables in your Vercel project:

```bash
# Google Gemini API
GEMINI_API_KEY=AIzaSyDmZktsCBsHXgpVg1vkLnTGLcRC3FQpv04

# Pinecone Vector Database
PINECONE_API_KEY=pcsk_2omEp2_Ro2YyPd72eJsSCeemg8K1pkCuFQ5CymaVCVmx9iUZybGB8EqYvUigcobkSR9KCC
PINECONE_INDEX=maru-knowledge-base

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=hello@maruonline.com
```

### How to Set Environment Variables on Vercel:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

---

## 📦 Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "feat: integrate Pinecone RAG with Gemini embeddings"
git push origin main
```

### Step 2: Connect to Vercel (if not already connected)
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Link project to Vercel
vercel link

# Or deploy directly
vercel --prod
```

### Step 3: Set Environment Variables
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all variables listed above

### Step 4: Redeploy (if needed)
If you set env vars after deployment:
```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

---

## ✅ Testing Checklist

After deployment, test these queries:

- [ ] "What services does Maru Online offer?"
- [ ] "How much does the Growth plan cost?"
- [ ] "What free tools do you have?"
- [ ] "Where are you located?"
- [ ] "How can I contact you?"

Expected behavior:
- Responses should be accurate and based on knowledge base
- Response time should be under 3 seconds
- No errors in Vercel logs

---

## 📊 Monitoring

### Vercel Logs
Monitor for:
- API errors
- Slow response times
- Failed RAG queries

### Pinecone Dashboard
Check:
- Query count
- Vector count (should be 5)
- Index health

### Gemini API Usage
Monitor at: https://makersuite.google.com/

---

## 🔄 Updating Knowledge Base

To add or update business information:

1. Edit `scripts/ingest.js` - update the `BUSINESS_DATA` constant
2. Run the ingestion script:
   ```bash
   node scripts/ingest.js
   ```
3. Test locally before deploying

---

## 🐛 Troubleshooting

### Issue: RAG not working
- Check Vercel logs for errors
- Verify environment variables are set
- Check Pinecone index has data

### Issue: Slow responses
- Check Pinecone region (should be close to Vercel region)
- Reduce retriever count from 3 to 2 in `rag-pipeline.ts`

### Issue: Incorrect responses
- Update knowledge base data
- Re-run ingestion script
- Adjust prompt in `rag-pipeline.ts`

---

## 📝 Files Modified

- ✅ `lib/rag-pipeline.ts` - Updated embedding model
- ✅ `scripts/ingest.js` - Updated embedding model
- ✅ `.env` & `.env.local` - Updated Gemini API key
- ✅ `.gitignore` - Added test files

---

## 🎯 Next Steps After Deployment

1. **Test in production** - Verify all queries work
2. **Monitor performance** - Check Vercel and Pinecone dashboards
3. **Gather feedback** - Test with real users
4. **Expand knowledge base** - Add more business data
5. **Optimize** - Fine-tune retrieval and prompts

---

## 📞 Support

If you encounter issues:
- Check Vercel deployment logs
- Review Pinecone dashboard
- Verify API keys are valid
- Test locally first

---

**Deployment Ready**: ✅  
**Last Updated**: December 30, 2024  
**Version**: 1.0.0 (RAG Integrated)
