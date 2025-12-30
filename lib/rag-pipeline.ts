import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { Document } from '@langchain/core/documents';

/**
 * Query the RAG pipeline using Gemini for embeddings and chat
 * @param userQuestion - The user's question
 * @returns AI response based on retrieved context
 */
export async function queryRAG(userQuestion: string): Promise<string> {
  console.log(`🤔 User asking: "${userQuestion}"`);

  // Validate environment variables
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is required for RAG functionality');
  }
  if (!process.env.PINECONE_INDEX) {
    throw new Error('PINECONE_INDEX is required for RAG functionality');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for RAG functionality');
  }

  try {
    // Initialize Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    // Use Gemini for embeddings instead of OpenAI
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'models/text-embedding-004', // Gemini's embedding model
    });

    // Create vector store
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    // Set up retriever to get top 3 relevant documents
    const retriever = vectorStore.asRetriever(3);

    // Create prompt template
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful support agent for maruOnline.
      Answer the question based ONLY on the following context:
      {context}

      Question: {question}
    `);

    // Use Gemini for chat instead of OpenAI
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.0-flash-exp', // Latest Gemini model
      temperature: 0.7,
    });

    // Build the RAG chain
    const chain = RunnableSequence.from([
      {
        context: async (input: { question: string }) => {
          const docs = await retriever.invoke(input.question);
          return docs.map((d: Document) => d.pageContent).join('\n');
        },
        question: (input: { question: string }) => input.question,
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // Execute the chain
    const response = await chain.invoke({ question: userQuestion });
    console.log('✅ RAG response generated');
    return response;
  } catch (error) {
    console.error('❌ RAG query error:', error);
    throw new Error(`RAG pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
