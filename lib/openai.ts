import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export const getOpenAIClient = () => {
  if (openaiClient) {
    return openaiClient;
  }

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  return openaiClient;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const client = getOpenAIClient();
  
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
};

export const generateChatCompletion = async (
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  context?: string
) => {
  const client = getOpenAIClient();
  
  const systemMessage = context
    ? {
        role: 'system' as const,
        content: `You are a helpful AI assistant. Use the following context from the user's documents to answer their questions. If the answer cannot be found in the context, say so.\n\nContext:\n${context}`,
      }
    : messages[0];

  const chatMessages = context ? [systemMessage, ...messages.slice(1)] : messages;

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
};

