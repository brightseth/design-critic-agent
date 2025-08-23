# Quick Supabase Setup for Nina

## Get Your Credentials

1. **Go to your Supabase project dashboard**
   - https://app.supabase.com/project/[your-project-id]

2. **Get API Keys** (Settings → API):
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **Anon/Public Key**: `eyJ...` (long string starting with eyJ)
   - **Service Role Key**: `eyJ...` (different long string - KEEP SECRET!)

3. **Set up the database**:
   - Go to SQL Editor
   - Create a new query
   - Copy ALL contents from `setup-supabase.sql`
   - Run the query (it will create all tables)

4. **Create storage bucket**:
   - Go to Storage
   - Click "New bucket"
   - Name: `nina-images`
   - Toggle "Public bucket" to ON
   - Click Create

## Configure Nina

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_KEY=[your-service-role-key]
ANTHROPIC_API_KEY=[your-anthropic-key]
DEFAULT_ARTIST_ID=seth
```

## Test Connection

```bash
node test-storage.js
```

You should see:
- ✓ Supabase configured
- ✓ Evaluation saved
- ✓ Storage tests completed

## Start Nina

```bash
npm start
```

Visit http://localhost:3001 and Nina will now save everything to Supabase!