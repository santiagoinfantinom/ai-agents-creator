# N8N Workflow Setup Guide

This guide explains how to set up N8N workflows for document embedding and chat processing as an alternative to the built-in implementation.

## Why Use N8N?

- **Visual Workflow Editor**: Easy to modify and debug
- **Flexibility**: Add custom processing steps
- **Scalability**: Offload heavy processing from your main application
- **Integration**: Connect to other services easily
- **Monitoring**: Built-in execution logs and error handling

## Workflow 1: Document Embedding

### Purpose
Process uploaded documents, extract text, generate embeddings, and store in Pinecone.

### Workflow Steps

1. **Webhook Trigger**
   - Node: Webhook
   - Method: POST
   - Authentication: None (or add API key header)
   - Expected payload:
     ```json
     {
       "documentId": "uuid",
       "filePath": "user-id/timestamp_filename.txt",
       "filename": "document.txt",
       "userId": "user-uuid"
     }
     ```

2. **Download Document from Supabase**
   - Node: HTTP Request
   - Method: GET
   - URL: `{{ $env.SUPABASE_URL }}/storage/v1/object/documents/{{ $json.filePath }}`
   - Headers:
     - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_KEY }}`
   - Response Format: File

3. **Extract Text**
   - Node: Code
   - JavaScript:
     ```javascript
     const text = await $input.item.binary.data.toString('utf-8');
     return { text };
     ```

4. **Split into Chunks**
   - Node: Code
   - JavaScript:
     ```javascript
     const text = $input.item.json.text;
     const chunkSize = 1000;
     const chunks = [];
     
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
     
     return chunks.map((chunk, i) => ({
       json: {
         chunk,
         chunkIndex: i,
         documentId: $('Webhook').item.json.documentId,
         userId: $('Webhook').item.json.userId,
         filename: $('Webhook').item.json.filename
       }
     }));
     ```

5. **Generate Embeddings (Loop)**
   - Node: OpenAI
   - Operation: Create Embedding
   - Model: text-embedding-3-small
   - Input: `{{ $json.chunk }}`

6. **Store in Pinecone**
   - Node: HTTP Request
   - Method: POST
   - URL: `https://{{ $env.PINECONE_INDEX_NAME }}-{{ $env.PINECONE_PROJECT_ID }}.svc.{{ $env.PINECONE_ENVIRONMENT }}.pinecone.io/vectors/upsert`
   - Headers:
     - `Api-Key`: `{{ $env.PINECONE_API_KEY }}`
     - `Content-Type`: `application/json`
   - Body:
     ```json
     {
       "vectors": [{
         "id": "{{ $json.documentId }}_chunk_{{ $json.chunkIndex }}",
         "values": {{ $json.embedding }},
         "metadata": {
           "documentId": "{{ $json.documentId }}",
           "userId": "{{ $json.userId }}",
           "filename": "{{ $json.filename }}",
           "chunkIndex": {{ $json.chunkIndex }},
           "text": "{{ $json.chunk }}"
         }
       }]
     }
     ```

7. **Collect Vector IDs**
   - Node: Aggregate
   - Operation: Aggregate All Items
   - Fields to Aggregate:
     - Field: vectorId
     - Type: Append

8. **Update Supabase Document Status**
   - Node: HTTP Request (Supabase)
   - Method: PATCH
   - URL: `{{ $env.SUPABASE_URL }}/rest/v1/documents?id=eq.{{ $('Webhook').item.json.documentId }}`
   - Headers:
     - `apikey`: `{{ $env.SUPABASE_SERVICE_KEY }}`
     - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_KEY }}`
     - `Content-Type`: `application/json`
     - `Prefer`: `return=minimal`
   - Body:
     ```json
     {
       "status": "completed",
       "pinecone_ids": {{ $json.vectorIds }}
     }
     ```

### Environment Variables

Add these to your N8N environment:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX_NAME`
- `PINECONE_PROJECT_ID`
- `OPENAI_API_KEY`

---

## Workflow 2: RAG Chat

### Purpose
Process chat messages, retrieve relevant context from Pinecone, and generate AI responses.

### Workflow Steps

1. **Webhook Trigger**
   - Node: Webhook
   - Method: POST
   - Expected payload:
     ```json
     {
       "message": "User question",
       "userId": "user-uuid",
       "sessionId": "session-uuid"
     }
     ```

2. **Generate Query Embedding**
   - Node: OpenAI
   - Operation: Create Embedding
   - Model: text-embedding-3-small
   - Input: `{{ $json.message }}`

3. **Query Pinecone**
   - Node: HTTP Request
   - Method: POST
   - URL: `https://{{ $env.PINECONE_INDEX_NAME }}-{{ $env.PINECONE_PROJECT_ID }}.svc.{{ $env.PINECONE_ENVIRONMENT }}.pinecone.io/query`
   - Headers:
     - `Api-Key`: `{{ $env.PINECONE_API_KEY }}`
     - `Content-Type`: `application/json`
   - Body:
     ```json
     {
       "vector": {{ $json.embedding }},
       "topK": 5,
       "includeMetadata": true,
       "filter": {
         "userId": "{{ $('Webhook').item.json.userId }}"
       }
     }
     ```

4. **Extract Context**
   - Node: Code
   - JavaScript:
     ```javascript
     const matches = $input.item.json.matches || [];
     const relevantMatches = matches.filter(m => m.score > 0.7);
     
     const context = relevantMatches
       .map(m => m.metadata.text)
       .join('\n\n');
     
     const sources = relevantMatches.map(m => ({
       document_id: m.metadata.documentId,
       filename: m.metadata.filename,
       relevance_score: m.score
     }));
     
     return {
       context,
       sources,
       message: $('Webhook').item.json.message
     };
     ```

5. **Get Chat History**
   - Node: HTTP Request (Supabase)
   - Method: GET
   - URL: `{{ $env.SUPABASE_URL }}/rest/v1/chat_messages?session_id=eq.{{ $('Webhook').item.json.sessionId }}&order=created_at.asc&limit=10`
   - Headers:
     - `apikey`: `{{ $env.SUPABASE_ANON_KEY }}`
     - `Authorization`: `Bearer {{ $env.SUPABASE_ANON_KEY }}`

6. **Format Messages for OpenAI**
   - Node: Code
   - JavaScript:
     ```javascript
     const history = $input.item.json || [];
     const context = $('Extract Context').item.json.context;
     const message = $('Extract Context').item.json.message;
     
     const messages = [
       {
         role: 'system',
         content: `You are a helpful AI assistant. Use the following context from the user's documents to answer their questions. If the answer cannot be found in the context, say so.\n\nContext:\n${context}`
       },
       ...history
         .filter(msg => msg.role !== 'system')
         .map(msg => ({
           role: msg.role,
           content: msg.content
         }))
     ];
     
     return { messages };
     ```

7. **Generate AI Response**
   - Node: OpenAI
   - Operation: Create Chat Completion
   - Model: gpt-4-turbo-preview
   - Messages: `{{ $json.messages }}`
   - Temperature: 0.7
   - Max Tokens: 1000

8. **Save Response to Supabase**
   - Node: HTTP Request (Supabase)
   - Method: POST
   - URL: `{{ $env.SUPABASE_URL }}/rest/v1/chat_messages`
   - Headers:
     - `apikey`: `{{ $env.SUPABASE_SERVICE_KEY }}`
     - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_KEY }}`
     - `Content-Type`: `application/json`
     - `Prefer`: `return=minimal`
   - Body:
     ```json
     {
       "session_id": "{{ $('Webhook').item.json.sessionId }}",
       "role": "assistant",
       "content": "{{ $json.response }}",
       "sources": {{ $('Extract Context').item.json.sources }}
     }
     ```

9. **Return Response**
   - Node: Respond to Webhook
   - Response Body:
     ```json
     {
       "response": "{{ $('Generate AI Response').item.json.response }}",
       "sources": {{ $('Extract Context').item.json.sources }}
     }
     ```

---

## Setup Instructions

### 1. Create N8N Instance

Option A: Self-hosted
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Option B: N8N Cloud
- Sign up at https://n8n.io
- Create a new workflow

### 2. Import Workflows

1. Copy the workflow JSON (create from the steps above)
2. In N8N, click "Import from File" or "Import from URL"
3. Paste the workflow
4. Save

### 3. Configure Environment Variables

In N8N Settings > Environment Variables, add all required keys.

### 4. Activate Webhooks

1. Open each workflow
2. Click "Activate" in the top right
3. Copy the webhook URL from the Webhook node
4. Add URLs to your `.env.local`:
   ```
   N8N_WEBHOOK_EMBED_URL=https://your-n8n-instance/webhook/embed
   N8N_WEBHOOK_CHAT_URL=https://your-n8n-instance/webhook/chat
   ```

### 5. Test Workflows

1. Upload a test document in your app
2. Check N8N execution logs
3. Verify embeddings in Pinecone
4. Test chat functionality

---

## Monitoring and Debugging

### View Executions
- Go to N8N > Executions
- Filter by workflow
- View detailed execution logs

### Common Issues

1. **Webhook not triggering**
   - Check webhook URL is correct
   - Verify workflow is activated
   - Check firewall/network settings

2. **OpenAI errors**
   - Verify API key is valid
   - Check rate limits
   - Ensure sufficient credits

3. **Pinecone errors**
   - Verify index name and environment
   - Check API key permissions
   - Ensure index dimension matches (1536)

4. **Supabase errors**
   - Verify service key has proper permissions
   - Check RLS policies
   - Ensure tables exist

---

## Advanced Features

### Add Document Type Detection
Add a node after downloading to detect file type and route to appropriate text extraction:
- PDF: Use pdf-parse library
- DOCX: Use mammoth library
- Images: Use OCR (Tesseract)

### Add Document Summarization
Add OpenAI completion node to generate document summary and store in metadata.

### Add Error Notifications
Add email/Slack notification on workflow failures.

### Add Rate Limiting
Add delay nodes to respect API rate limits.

### Add Caching
Store frequently accessed embeddings in Redis for faster retrieval.

---

## Cost Optimization

1. **Batch Processing**: Process multiple documents in parallel
2. **Chunk Size**: Larger chunks = fewer API calls (balance with relevance)
3. **Caching**: Cache embeddings for duplicate content
4. **Model Selection**: Use cheaper models for less critical tasks
5. **Filtering**: Pre-filter documents before generating embeddings

---

## Security Considerations

1. **Webhook Authentication**: Add API key validation to webhook nodes
2. **Environment Variables**: Never hardcode sensitive keys
3. **User Isolation**: Always filter by userId in Pinecone queries
4. **Rate Limiting**: Implement rate limiting on webhooks
5. **Input Validation**: Validate all webhook inputs

---

## Support

For N8N-specific questions:
- Documentation: https://docs.n8n.io
- Community: https://community.n8n.io
- GitHub: https://github.com/n8n-io/n8n

