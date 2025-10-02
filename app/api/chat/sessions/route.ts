import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all sessions for user
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sessions });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

