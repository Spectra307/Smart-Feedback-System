// Quick script to verify environment variables are loaded correctly
// Run with: node verify-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  
  console.log('📄 .env file found!\n');
  console.log('Contents:');
  console.log('─'.repeat(50));
  
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  
  let hasUrl = false;
  let hasKey = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL')) {
      hasUrl = true;
      const value = trimmed.split('=')[1]?.trim() || '';
      console.log(`✅ VITE_SUPABASE_URL=${value.substring(0, 40)}...`);
    } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY')) {
      hasKey = true;
      const value = trimmed.split('=')[1]?.trim() || '';
      console.log(`✅ VITE_SUPABASE_ANON_KEY=${value.substring(0, 20)}...`);
    } else if (trimmed.startsWith('VITE_')) {
      console.log(`ℹ️  ${trimmed.split('=')[0]}`);
    }
  });
  
  console.log('─'.repeat(50));
  
  if (!hasUrl) {
    console.log('\n❌ ERROR: VITE_SUPABASE_URL not found in .env file');
    console.log('   Add: VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co');
  }
  
  if (!hasKey) {
    console.log('\n❌ ERROR: VITE_SUPABASE_ANON_KEY not found in .env file');
    console.log('   Add: VITE_SUPABASE_ANON_KEY=your_anon_key_here');
  }
  
  if (hasUrl && hasKey) {
    console.log('\n✅ All required environment variables are present!');
    console.log('   Make sure to restart the dev server (npm run dev) after any changes.');
  }
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('❌ .env file not found!');
    console.log('\nPlease create a .env file in the project root with:');
    console.log('VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co');
    console.log('VITE_SUPABASE_ANON_KEY=your_anon_key_here');
  } else {
    console.error('Error reading .env file:', error.message);
  }
}

