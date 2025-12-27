const { queryRAG } = require('./lib/rag-query');

const testChat = async () => {
  console.log('🧪 Testing RAG Pipeline...\n');
  
  try {
    const question = "What services do you offer?";
    const answer = await queryRAG(question);
    
    console.log('\n📝 Response:');
    console.log('─'.repeat(50));
    console.log(answer);
    console.log('─'.repeat(50));
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testChat();
