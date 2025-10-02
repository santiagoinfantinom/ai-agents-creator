import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getIndex } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/openai';
import axios from 'axios';

// Helper to extract text from file
async function extractTextFromFile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  filePath: string,
  mimeType: string
): Promise<string> {
  // Download file from Supabase Storage
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath);

  if (error) throw error;

  // Convert to text based on mime type
  if (mimeType.includes('text') || mimeType.includes('markdown')) {
    return await data.text();
  }

  // For PDF and other formats, you might want to use a library
  // For now, just handle text files
  return await data.text();
}

// Split text into chunks
function splitIntoChunks(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const { filePath, filename } = await request.json();
    const supabase = createServerClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('file_path', filePath)
      .single();

    if (docError) throw docError;

    // Check if N8N webhook is configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_EMBED_URL;
    
    if (n8nWebhookUrl) {
      // Use N8N workflow for embedding
      await axios.post(n8nWebhookUrl, {
        documentId: document.id,
        filePath,
        filename,
        userId: user.id,
      });

      return NextResponse.json({
        message: 'Embedding process started via N8N',
        documentId: document.id,
      });
    }

    // Otherwise, process embeddings directly
    // Extract text from file
    const text = await extractTextFromFile(supabase, filePath, document.mime_type);

    // Split into chunks
    const chunks = splitIntoChunks(text);

    // Generate embeddings for each chunk
    const index = await getIndex();
    const vectorIds: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);

      const vectorId = `${document.id}_chunk_${i}`;
      vectorIds.push(vectorId);

      // Upsert to Pinecone
      await index.upsert([
        {
          id: vectorId,
          values: embedding,
          metadata: {
            documentId: document.id,
            userId: user.id,
            filename,
            chunkIndex: i,
            text: chunk,
          },
        },
      ]);
    }

    // Update document status
    await supabase
      .from('documents')
      .update({
        status: 'completed',
        pinecone_ids: vectorIds,
      })
      .eq('id', document.id);

    return NextResponse.json({
      message: 'Document embedded successfully',
      documentId: document.id,
      chunks: chunks.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to embed document';
    console.error('Error embedding document:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

