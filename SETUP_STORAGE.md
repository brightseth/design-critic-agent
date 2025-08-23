# Setting Up Persistent Storage for Nina

## Quick Setup with Supabase (Recommended)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a name, password, and region
4. Wait for the project to initialize (~2 minutes)

### 2. Set Up Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `setup-supabase.sql`
3. Paste and run it in the SQL editor
4. This creates all necessary tables and relationships

### 3. Set Up Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `nina-images`
3. Make it PUBLIC (toggle the public switch)
4. Set allowed MIME types to: `image/jpeg, image/png, image/webp`

### 4. Get Your API Keys

1. Go to Settings → API in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://[your-project].supabase.co`
   - **Anon/Public Key**: For client-side operations
   - **Service Role Key**: For server-side operations (keep secret!)

### 5. Configure Environment

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
ANTHROPIC_API_KEY=your-anthropic-key
```

### 6. Deploy to Vercel with Environment Variables

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add all the variables from `.env.local`
4. Redeploy:
```bash
vercel --prod
```

## What You Get

With Supabase configured, Nina now has:

### ✅ **Persistent Storage**
- All evaluations saved permanently
- Feedback history preserved
- Collections maintained across sessions
- Series and comparisons stored

### ✅ **Image Storage**
- Images uploaded to Supabase Storage
- Public URLs for display
- Automatic optimization

### ✅ **Learning Memory**
- Nina remembers all feedback
- Style fingerprints persist
- Success patterns accumulate
- Systematic bias detection improves over time

### ✅ **Multi-User Support**
- Each artist gets their own profile
- Separate evaluations and collections
- Individual style fingerprints
- Private feedback loops

## Optional: Enable Authentication

To add user accounts:

1. Go to Authentication in Supabase
2. Enable Email/Password or OAuth providers
3. Uncomment the RLS (Row Level Security) sections in `setup-supabase.sql`
4. Re-run the SQL to enable security policies

## Testing Your Setup

1. Visit your Nina interface
2. Upload an image for evaluation
3. Check Supabase dashboard → Table Editor → evaluations
4. You should see your evaluation saved!

## Fallback Mode

If Supabase is not configured, Nina automatically falls back to in-memory storage:
- Works for testing
- Data lost on refresh
- No image persistence
- Single user only

## Troubleshooting

### Images not uploading?
- Check Storage bucket is PUBLIC
- Verify MIME types include image formats
- Check Service Role Key is correct

### Evaluations not saving?
- Verify database tables were created
- Check API keys in environment variables
- Look for errors in browser console

### Learning not working?
- Ensure learning_memory table exists
- Check feedback is being saved
- Verify artist_id is consistent

## Next Steps

Once storage is working:

1. **Import existing data**: Use Supabase's CSV import for bulk data
2. **Set up backups**: Enable Point-in-Time Recovery in Supabase
3. **Add authentication**: Implement user accounts for multi-artist support
4. **Enable real-time**: Use Supabase real-time for live updates
5. **Add CDN**: Configure Supabase Storage with a CDN for faster image delivery

## Alternative Storage Options

### Vercel KV + Blob Storage
```javascript
// Install: npm install @vercel/kv @vercel/blob
// Simpler but costs more at scale
```

### MongoDB Atlas + Cloudinary
```javascript
// Install: npm install mongodb cloudinary
// Better for complex queries, great image management
```

### Firebase
```javascript
// Install: npm install firebase
// Good real-time features, Google ecosystem
```

The architecture is designed to be storage-agnostic - just implement the same interface as `lib/supabase.js`!