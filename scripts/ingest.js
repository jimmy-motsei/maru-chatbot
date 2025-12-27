require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { PineconeStore } = require('@langchain/pinecone');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

// SIMULATED DATA SOURCE (Replace with actual loader later)
const rawText = `
maruOnline is an AI-powered marketing agency for SMBs.
We specialize in data-backed insights and scalable systems.
Our founder resides in the North West Province, South Africa.
Services include: Automated Lead Gen, AI Content Engines, and CRM Integration.
`;

const ingestData = async () => {
  console.log("🚀 Starting Ingestion...");

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.createDocuments([rawText]);

  await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
  });

  console.log("✅ Data successfully embedded and stored in Pinecone!");
};

ingestData();
