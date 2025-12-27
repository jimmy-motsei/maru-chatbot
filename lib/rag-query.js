require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
const { PineconeStore } = require('@langchain/pinecone');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');

const queryRAG = async (userQuestion) => {
  console.log(`🤔 User asking: "${userQuestion}"`);

  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const retriever = vectorStore.asRetriever(3);
  
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful support agent for maruOnline.
    Answer the question based ONLY on the following context:
    {context}

    Question: {question}
  `);

  const model = new ChatOpenAI({ model: 'gpt-4o' });
  const chain = RunnableSequence.from([
    {
      context: async (input) => {
        const docs = await retriever.getRelevantDocuments(input.question);
        return docs.map((d) => d.pageContent).join('\n');
      },
      question: (input) => input.question,
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return await chain.invoke({ question: userQuestion });
};

module.exports = { queryRAG };
