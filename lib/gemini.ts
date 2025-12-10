import { GoogleGenerativeAI } from '@google/generative-ai';

// Only initialize if API key is present
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });
}

export { model };

/**
 * Generate a response from the Gemini API
 */
export async function generateResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
): Promise<string> {
  if (!model) {
    throw new Error('Gemini model not initialized. Please set GEMINI_API_KEY.');
  }

  try {
    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response from AI');
  }
}
