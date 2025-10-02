import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getIndex } from '@/lib/pinecone';
import { generateEmbedding, generateChatCompletion } from '@/lib/openai';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();
    const supabase = createServerClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create or get session
    let session = sessionId;
    if (!session) {
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      session = newSession.id;
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: session,
      role: 'user',
      content: message,
    });

    // Check if N8N webhook is configured for chat
    const n8nChatUrl = process.env.N8N_WEBHOOK_CHAT_URL;
    
    if (n8nChatUrl) {
      // Use N8N workflow for RAG
      const response = await axios.post(n8nChatUrl, {
        message,
        userId: user.id,
        sessionId: session,
      });

      const assistantMessage = response.data.response;
      const sources = response.data.sources || [];

      // Save assistant message
      await supabase.from('chat_messages').insert({
        session_id: session,
        role: 'assistant',
        content: assistantMessage,
        sources,
      });

      return NextResponse.json({
        response: assistantMessage,
        sessionId: session,
        sources,
      });
    }

    // Otherwise, process RAG directly
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(message);

    // Query Pinecone for relevant documents
    const index = await getIndex();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
      filter: {
        userId: { $eq: user.id },
      },
    });

    // Extract relevant context
    const relevantChunks = queryResponse.matches
      .filter((match) => match.score && match.score > 0.7)
      .map((match) => match.metadata?.text)
      .filter(Boolean);

    const context = relevantChunks.join('\n\n');

    // Get chat history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session)
      .order('created_at', { ascending: true })
      .limit(10);

    const messages = [
      {
        role: 'system' as const,
        content:
          'You are a helpful AI assistant. Use the provided context to answer questions.',
      },
      ...(history || [])
        .filter((msg) => msg.role !== 'system')
        .map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
    ];

    // Generate response
    const assistantMessage = await generateChatCompletion(messages, context);

    // Prepare sources
    const sources = queryResponse.matches
      .filter((match) => match.score && match.score > 0.7)
      .map((match) => ({
        document_id: match.metadata?.documentId,
        filename: match.metadata?.filename,
        relevance_score: match.score,
      }));

    // Save assistant message
    await supabase.from('chat_messages').insert({
      session_id: session,
      role: 'assistant',
      content: assistantMessage,
      sources,
    });

    return NextResponse.json({
      response: assistantMessage,
      sessionId: session,
      sources,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat';
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

