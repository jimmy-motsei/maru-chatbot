require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { PineconeStore } = require('@langchain/pinecone');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const fs = require('fs');
const path = require('path');

/**
 * Maru Online Business Knowledge Base
 * This data powers the RAG chatbot responses
 */
const BUSINESS_DATA = `
# About Maru Online

Maru Online is an AI-powered marketing and automation agency specializing in helping South African SMBs bridge into the age of AI.

## Our Services

### 1. Lead Generation Automation
- AI-powered lead enrichment and scoring
- Automated pipeline management
- Smart CRM integration
- Lead Score Predictor tool (free assessment)

### 2. Sales Systems Automation
- CRM workflow automation
- Sales pipeline optimization
- Follow-up automation
- Deal tracking and analytics

### 3. Office Operations Automation
- Document processing automation
- Invoice and receipt handling
- Workflow optimization
- Back-office efficiency improvements

## Pricing

### Starter Plan - R4,950/month
- Basic automation setup
- Up to 500 leads/month
- Email support
- Monthly reporting

### Growth Plan - R12,500/month
- Advanced automation
- Up to 2,000 leads/month
- Priority support
- Custom integrations
- Weekly reporting

### Enterprise Plan - R28,000+/month
- Fully custom solutions
- Unlimited leads
- Dedicated account manager
- 24/7 support
- Real-time analytics
- White-glove service

## Our Technology

We use cutting-edge AI technology including:
- Google Gemini for AI intelligence
- LangChain for orchestration
- Pinecone for knowledge bases
- Next.js for web applications
- Supabase for databases

## Location

Based in the North West Province, South Africa
Serving businesses across South Africa and internationally

## Contact

- Email: hello@maruonline.com
- Website: https://maruonline.com
- Phone: Available upon request

## Free Tools

1. **Lead Score Predictor**
   - Analyze your website's lead generation potential
   - Get actionable recommendations
   - Receive detailed PDF report
   - Free assessment, no credit card required

2. **Pipeline Leak Detector**
   - Upload your CRM data
   - Identify bottlenecks
   - Find stalled deals
   - Get recovery strategies

3. **Proposal Accelerator**
   - Generate professional proposals
   - AI-powered customization
   - Brand-consistent templates
   - Fast turnaround

## Why Choose Maru

- **South African Focus**: We understand local business challenges
- **AI-Powered**: Cutting-edge technology for competitive advantage
- **Data-Driven**: All recommendations backed by analytics
- **Proven Results**: Track record of 300%+ lead increases
- **Easy Integration**: Works with your existing tools
- **Ongoing Support**: We're partners in your growth

## Industries We Serve

- Professional Services
- Real Estate
- Financial Services
- Healthcare
- Technology
- Manufacturing
- Retail & E-commerce

## Process

1. **Discovery Call**: Understand your needs (30 minutes, free)
2. **Strategy Session**: Map out automation opportunities
3. **Implementation**: Build and deploy your systems
4. **Training**: Ensure your team knows how to use everything
5. **Optimization**: Continuous improvement and support

## Book a Consultation

Ready to transform your business with AI?
Email us at hello@maruonline.com or use the chatbot to schedule a discovery call.

We typically respond within 24 hours.
`;

async function ingestData() {
  console.log('🚀 Starting Pinecone Ingestion with Gemini Embeddings...\n');

  // Validate environment variables
  if (!process.env.PINECONE_API_KEY) {
    console.error('❌ Error: PINECONE_API_KEY not found in environment');
    console.log('\nPlease add to .env.local:');
    console.log('PINECONE_API_KEY=your_key_here');
    process.exit(1);
  }

  if (!process.env.PINECONE_INDEX) {
    console.error('❌ Error: PINECONE_INDEX not found in environment');
    console.log('\nPlease add to .env.local:');
    console.log('PINECONE_INDEX=maru-knowledge-base');
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY not found in environment');
    console.log('\nPlease add to .env.local:');
    console.log('GEMINI_API_KEY=your_key_here');
    process.exit(1);
  }

  try {
    // Initialize Pinecone
    console.log('📌 Connecting to Pinecone...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    console.log('✅ Connected to Pinecone index:', process.env.PINECONE_INDEX);

    // Split text into chunks
    console.log('\n📄 Splitting text into chunks...');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,  // Larger chunks for better context
      chunkOverlap: 100,
    });
    const docs = await splitter.createDocuments([BUSINESS_DATA]);
    console.log(`✅ Created ${docs.length} document chunks`);

    // Create embeddings with Gemini
    console.log('\n🧠 Creating embeddings with Gemini...');
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'models/text-embedding-004',
    });

    // Store in Pinecone
    console.log('💾 Storing vectors in Pinecone...');
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
    });

    console.log('\n✅ SUCCESS! Data ingested into Pinecone.');
    console.log('\n📊 Summary:');
    console.log(`   - Documents: ${docs.length} chunks`);
    console.log(`   - Index: ${process.env.PINECONE_INDEX}`);
    console.log(`   - Embeddings: Gemini embedding-001`);
    console.log('\n🎉 Your chatbot is now ready to answer questions!');
  } catch (error) {
    console.error('\n❌ Error during ingestion:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run ingestion
ingestData();
