# Quick Setup Guide

Follow these steps to get your AI Agents Creator up and running.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/command line access

## 🔑 Required Accounts

You'll need to create accounts for these services:

1. **Supabase** (Database & Auth) - [https://supabase.com](https://supabase.com)
2. **Pinecone** (Vector Database) - [https://www.pinecone.io](https://www.pinecone.io)
3. **OpenAI** (AI Models) - [https://platform.openai.com](https://platform.openai.com)
4. **N8N** (Optional - Workflow Automation) - [https://n8n.io](https://n8n.io)

---

## Step 1: Supabase Setup (10 minutes)

### 1.1 Create Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `ai-agents-creator`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait for project to initialize (~2 minutes)

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" (green play button)
6. Verify: You should see "Success. No rows returned"

### 1.3 Create Storage Bucket
1. Go to **Storage** in sidebar
2. Click "Create a new bucket"
3. Name: `documents`
4. Public: **OFF** (keep it private)
5. Click "Create bucket"

### 1.4 Get API Keys
1. Go to **Settings** > **API**
2. Copy these values (you'll need them later):
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` `public` key
   - `service_role` `secret` key (⚠️ Keep this secure!)

---

## Step 2: Pinecone Setup (5 minutes)

### 2.1 Create Account & Index
1. Go to [https://www.pinecone.io](https://www.pinecone.io)
2. Sign up for free account
3. Click "Create Index"
4. Fill in:
   - Name: `ai-agents-documents`
   - Dimensions: `1536` (for OpenAI embeddings)
   - Metric: `cosine`
   - Cloud: Choose free tier region
5. Click "Create Index"

### 2.2 Get API Key
1. Go to **API Keys** in sidebar
2. Copy your API key
3. Note your environment (e.g., `us-east-1-aws`)

---

## Step 3: OpenAI Setup (3 minutes)

### 3.1 Get API Key
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Give it a name: `ai-agents-creator`
6. Copy the key (⚠️ Only shown once!)

### 3.2 Add Credits
1. Go to **Billing** > **Payment methods**
2. Add a payment method
3. Add at least $5 credit (recommended $10-20 for testing)

---

## Step 4: Project Setup (5 minutes)

### 4.1 Clone/Navigate to Project
```bash
cd /Users/santiago/Documents/Projects/ai-agents-creator
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Configure Environment Variables
1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in your editor

3. Fill in all the values you collected:

```bash
# Supabase (from Step 1.4)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Pinecone (from Step 2.2)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1-aws  # your environment
PINECONE_INDEX_NAME=ai-agents-documents

# OpenAI (from Step 3.1)
OPENAI_API_KEY=sk-xxxxx

# N8N (Optional - leave empty for now)
N8N_WEBHOOK_EMBED_URL=
N8N_WEBHOOK_CHAT_URL=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Save the file

---

## Step 5: Launch Application (2 minutes)

### 5.1 Start Development Server
```bash
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

### 5.2 Open in Browser
1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the landing page!

---

## Step 6: Test the Application (10 minutes)

### 6.1 Create Account
1. Click "Get Started"
2. Enter email and password
3. Click "Sign up"
4. You should be redirected to the dashboard

### 6.2 Upload Test Document
1. Create a test file `test.txt` with some content:
   ```
   This is a test document about AI and machine learning.
   Machine learning is a subset of artificial intelligence.
   It involves training algorithms on data to make predictions.
   ```

2. Drag and drop `test.txt` onto the upload area
3. Wait for status to change from "processing" to "completed" (~30-60 seconds)
4. If you see errors, check the browser console and terminal logs

### 6.3 Test Chat
1. Click "Chat" button
2. Ask: "What is machine learning?"
3. Wait for response (~5-10 seconds)
4. You should see an AI response using your document as context
5. Check the "Sources" section to see which document was used

### 6.4 Verify Everything Works ✅
- [ ] Sign up works
- [ ] Login works
- [ ] Document upload works
- [ ] Document shows "completed" status
- [ ] Chat responds to questions
- [ ] Chat shows relevant sources

---

## 🐛 Troubleshooting

### "Unauthorized" errors
**Solution:** Check your Supabase keys in `.env.local`

### Documents stuck at "processing"
**Possible causes:**
1. Invalid OpenAI API key → Check key and billing
2. Invalid Pinecone API key → Verify key and index name
3. Check browser console for errors
4. Check terminal logs for API errors

### Chat not responding
**Check:**
1. Do you have documents with "completed" status?
2. Is your OpenAI API key valid?
3. Do you have OpenAI credits?
4. Check browser console for errors

### "fetch failed" errors
**Solution:**
1. Make sure dev server is running
2. Check `.env.local` has all required variables
3. Restart dev server: `Ctrl+C` then `npm run dev`

### Database errors
**Solution:**
1. Verify you ran the schema.sql in Supabase
2. Check all tables exist: documents, chat_sessions, chat_messages
3. Verify storage bucket "documents" exists

---

## 🚀 Next Steps

### Deploy to Production

#### Deploy to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Deploy!

#### Update Environment Variables
For production, update:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Set Up N8N (Optional)
For advanced workflow automation, see [N8N_WORKFLOWS.md](./N8N_WORKFLOWS.md)

### Customize Your Application
1. Update branding in `app/page.tsx`
2. Modify colors in `tailwind.config.ts`
3. Add more file type support in upload handler
4. Customize AI prompts in `lib/openai.ts`

---

## 💰 Cost Estimates (Monthly)

### Free Tier Usage
- **Supabase**: Free (up to 500MB database, 1GB storage)
- **Pinecone**: Free (1 index, 100K vectors)
- **OpenAI**: ~$1-5 for testing (pay-as-you-go)
- **Vercel**: Free (hobby plan)

### Light Production Usage (10 users, 100 documents, 1000 chats/month)
- **Supabase**: Free or $25/month (Pro)
- **Pinecone**: Free or $70/month (Standard)
- **OpenAI**: ~$20-50/month
- **Vercel**: Free or $20/month (Pro)
- **Total**: $0-165/month depending on tier choices

### Optimization Tips
1. Use GPT-3.5 instead of GPT-4 for lower costs
2. Cache common queries
3. Limit chunk size to reduce embedding costs
4. Implement rate limiting per user
5. Monitor usage in each service dashboard

---

## 📚 Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Pinecone Docs](https://docs.pinecone.io)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Learning
- [RAG Explained](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Vector Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

### Community
- [Next.js Discord](https://discord.com/invite/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [OpenAI Forum](https://community.openai.com)

---

## ✅ Setup Complete!

You now have a fully functional AI Agents Creator with:
- ✅ User authentication
- ✅ Document upload and storage
- ✅ Automatic embedding generation
- ✅ RAG-powered chat interface
- ✅ Production-ready deployment option

**Need help?** Open an issue on GitHub or check the troubleshooting section above.

**Ready to scale?** Check out the N8N workflows for advanced automation!

