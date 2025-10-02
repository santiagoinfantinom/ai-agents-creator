export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  upload_date: string;
  status: 'processing' | 'completed' | 'failed';
  pinecone_ids: string[] | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources: Array<{
    document_id: string;
    filename: string;
    relevance_score: number;
  }>;
  created_at: string;
}

