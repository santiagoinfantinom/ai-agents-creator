import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (pineconeClient) {
    return pineconeClient;
  }

  pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  return pineconeClient;
};

export const getIndex = async () => {
  const client = await getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME || 'ai-agents-documents';
  
  return client.index(indexName);
};

