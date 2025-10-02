import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getIndex } from '@/lib/pinecone';

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json();
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
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError) throw docError;

    // Delete vectors from Pinecone
    if (document.pinecone_ids && document.pinecone_ids.length > 0) {
      try {
        const index = await getIndex();
        await index.deleteMany(document.pinecone_ids);
      } catch (error) {
        console.error('Error deleting from Pinecone:', error);
      }
    }

    return NextResponse.json({
      message: 'Document vectors deleted successfully',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete document vectors';
    console.error('Error deleting document vectors:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

