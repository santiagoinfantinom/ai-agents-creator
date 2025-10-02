# AI Agents Creator

A modern web application that allows users to upload documents, convert them to embeddings, and chat with their data using Retrieval Augmented Generation (RAG) technology.

## Features

- 🔐 **Secure Authentication**: User authentication powered by Supabase
- 📤 **Document Upload**: Upload and persist documents with user-specific storage
- 🧠 **Smart Embeddings**: Automatic conversion to embeddings using Pinecone vector database
- 💬 **RAG Chat Interface**: Chat with your documents using AI-powered responses
- 🔗 **N8N Integration**: Optional webhook support for embedding generation and chat processing
- 📊 **Document Management**: View, track, and delete uploaded documents
- 💾 **Chat History**: Persistent chat sessions with message history

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Vector Database**: Pinecone
- **AI**: OpenAI (GPT-4 & Embeddings)
- **Storage**: Supabase Storage
- **Automation**: N8N (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Pinecone account and index
- OpenAI API key
- (Optional) N8N instance for workflow automation

### Installation

1. Clone the repository:
```bash
cd ai-agents-creator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=ai-agents-documents

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# N8N Webhook URLs (optional)
N8N_WEBHOOK_EMBED_URL=your_n8n_webhook_url_for_embeddings
N8N_WEBHOOK_CHAT_URL=your_n8n_webhook_url_for_chat
```

4. Set up Supabase database:

Run the SQL schema in your Supabase SQL editor:
```bash
supabase/schema.sql
```

This will create:
- `documents` table for document metadata
- `chat_sessions` table for chat sessions
- `chat_messages` table for chat messages
- Storage bucket for documents
- Row Level Security policies
- Necessary indexes and triggers

5. Set up Pinecone:

Create a Pinecone index with:
- Dimension: 1536 (for OpenAI text-embedding-3-small)
- Metric: cosine
- Name: ai-agents-documents (or your custom name)

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### 1. Sign Up / Login

- Create a new account or sign in with existing credentials
- Authentication is handled securely through Supabase

### 2. Upload Documents

- Navigate to the dashboard
- Drag and drop files or click to select
- Supported formats: TXT, PDF, DOC, DOCX, MD
- Documents are automatically processed and converted to embeddings

### 3. Chat with Your Documents

- Click the "Chat" button to open the chat interface
- Ask questions about your uploaded documents
- The AI will use relevant document context to provide accurate answers
- View source documents and relevance scores for each response

### 4. Manage Documents

- View all uploaded documents in the dashboard
- Track processing status (processing, completed, failed)
- Delete documents when no longer needed

## Architecture

### Document Upload Flow

1. User uploads document via drag-and-drop interface
2. File is stored in Supabase Storage with user-specific path
3. Document metadata is saved to `documents` table
4. Embedding generation is triggered via API route
5. Document is chunked into smaller pieces
6. Each chunk is converted to embedding using OpenAI
7. Embeddings are stored in Pinecone with metadata
8. Document status is updated to "completed"

### Chat (RAG) Flow

1. User sends a message in chat interface
2. Message is converted to embedding using OpenAI
3. Pinecone is queried for relevant document chunks
4. Top relevant chunks are retrieved (with similarity scores)
5. Context is constructed from relevant chunks
6. OpenAI generates response using context and chat history
7. Response is saved with source documents
8. User receives AI response with source citations

## N8N Integration (Optional)

You can offload embedding generation and chat processing to N8N workflows:

### Embedding Workflow

Create an N8N workflow that:
1. Receives webhook with document metadata
2. Downloads document from Supabase Storage
3. Extracts text and creates chunks
4. Generates embeddings using OpenAI
5. Stores embeddings in Pinecone
6. Updates document status in Supabase

### Chat Workflow

Create an N8N workflow that:
1. Receives webhook with user message
2. Generates query embedding
3. Queries Pinecone for relevant chunks
4. Constructs context from results
5. Generates response using OpenAI
6. Returns response with sources

## API Routes

- `POST /api/documents/embed` - Trigger embedding generation for a document
- `POST /api/documents/delete` - Delete document vectors from Pinecone
- `POST /api/chat` - Send a chat message and get AI response
- `GET /api/chat/sessions` - Get all chat sessions for current user
- `GET /api/chat/messages` - Get messages for a specific session

## Database Schema

### documents
- Stores document metadata and processing status
- Links to user and tracks Pinecone vector IDs

### chat_sessions
- Stores chat session information
- Links to user with timestamps

### chat_messages
- Stores individual chat messages
- Links to session with role, content, and sources

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- File storage uses user-specific paths
- Authentication required for all protected routes
- Middleware protects dashboard and chat routes

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup

1. Run the schema.sql in your Supabase SQL editor
2. Create the storage bucket named "documents"
3. Enable email authentication
4. Configure email templates (optional)

### Pinecone Setup

1. Create an index with dimension 1536
2. Use cosine metric for similarity
3. Copy API key and environment to .env.local

## Troubleshooting

### Documents stuck in "processing" status
- Check Pinecone API key and index name
- Verify OpenAI API key is valid
- Check server logs for errors

### Authentication errors
- Verify Supabase URL and keys
- Check middleware configuration
- Ensure cookies are enabled

### Chat not working
- Verify documents have "completed" status
- Check Pinecone index has vectors
- Ensure OpenAI API key has credits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
