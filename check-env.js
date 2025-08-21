require('dotenv').config();

console.log('Environment check:');
console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('API Key length:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0);
console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...' : 'none');
console.log('API Key empty string:', process.env.ANTHROPIC_API_KEY === '');

// Check the condition in nina-curator-v2.js
const keyCheck = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('sk-ant-api03') || process.env.ANTHROPIC_API_KEY === '';
console.log('\nDemo mode condition:', keyCheck);
console.log('Includes sk-ant-api03:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.includes('sk-ant-api03') : false);