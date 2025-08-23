#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupSupabase() {
  console.log('\n🎨 Nina Storage Setup Wizard\n');
  console.log('This will help you configure Supabase for persistent storage.\n');
  
  // Check if .env.local already exists
  const envExists = fs.existsSync('.env.local');
  if (envExists) {
    const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Keeping existing configuration.');
      process.exit(0);
    }
  }
  
  console.log('\n📦 Step 1: Supabase Project Setup');
  console.log('----------------------------------------');
  console.log('1. Go to https://supabase.com and create a new project');
  console.log('2. Wait for it to initialize (~2 minutes)');
  console.log('3. Get your project credentials from Settings → API\n');
  
  const projectUrl = await question('Enter your Supabase Project URL: ');
  const anonKey = await question('Enter your Supabase Anon/Public Key: ');
  const serviceKey = await question('Enter your Supabase Service Role Key: ');
  
  console.log('\n🤖 Step 2: Anthropic API Key');
  console.log('----------------------------------------');
  const anthropicKey = await question('Enter your Anthropic API Key: ');
  
  console.log('\n🎨 Step 3: Artist Configuration');
  console.log('----------------------------------------');
  const artistId = await question('Enter default artist ID (or press Enter for "default_artist"): ') || 'default_artist';
  
  // Create .env.local file
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${projectUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_KEY=${serviceKey}

# Anthropic API Key
ANTHROPIC_API_KEY=${anthropicKey}

# Artist Configuration
DEFAULT_ARTIST_ID=${artistId}
`;
  
  fs.writeFileSync('.env.local', envContent);
  console.log('\n✅ Created .env.local with your configuration');
  
  console.log('\n📊 Step 4: Database Setup');
  console.log('----------------------------------------');
  console.log('Now you need to:');
  console.log('1. Go to your Supabase dashboard → SQL Editor');
  console.log('2. Copy the contents of setup-supabase.sql');
  console.log('3. Paste and run it in the SQL editor');
  console.log('4. This will create all necessary tables\n');
  
  const openSQL = await question('Would you like to open setup-supabase.sql now? (Y/n): ');
  if (openSQL.toLowerCase() !== 'n') {
    try {
      if (process.platform === 'darwin') {
        execSync('open setup-supabase.sql');
      } else if (process.platform === 'win32') {
        execSync('start setup-supabase.sql');
      } else {
        execSync('xdg-open setup-supabase.sql');
      }
      console.log('Opened setup-supabase.sql in your default editor');
    } catch (err) {
      console.log('Please manually open setup-supabase.sql and copy its contents');
    }
  }
  
  console.log('\n🖼️  Step 5: Storage Bucket Setup');
  console.log('----------------------------------------');
  console.log('In your Supabase dashboard:');
  console.log('1. Go to Storage');
  console.log('2. Create a new bucket called "nina-images"');
  console.log('3. Make it PUBLIC (toggle the public switch)');
  console.log('4. Set allowed MIME types to: image/jpeg, image/png, image/webp\n');
  
  console.log('\n🚀 Step 6: Test Your Setup');
  console.log('----------------------------------------');
  console.log('Start the server with: npm start');
  console.log('Then test Nina with an image evaluation');
  console.log('Check your Supabase dashboard to see if data is being saved!\n');
  
  console.log('✨ Setup complete! Nina now has persistent storage.\n');
  
  rl.close();
}

setupSupabase().catch(console.error);