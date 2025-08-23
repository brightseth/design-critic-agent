#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const ninaStorage = require('./lib/supabase');

async function testStorage() {
  console.log('\n🧪 Testing Nina Storage Connection\n');
  console.log('━'.repeat(50));
  
  // Check configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📋 Configuration Check:');
  console.log(`   Supabase URL: ${supabaseUrl ? '✓ Configured' : '✗ Missing'}`);
  console.log(`   Supabase Key: ${supabaseKey ? '✓ Configured' : '✗ Missing'}`);
  console.log(`   Storage Mode: ${ninaStorage.useSupabase ? '🌐 Supabase' : '💾 In-Memory'}`);
  console.log();
  
  if (!ninaStorage.useSupabase) {
    console.log('⚠️  Running in fallback mode (in-memory storage)');
    console.log('   Data will not persist between sessions.');
    console.log('   Run: node setup-storage.js to configure Supabase\n');
  }
  
  // Test saving an evaluation
  console.log('🎨 Testing Evaluation Save...');
  try {
    const testEval = {
      weighted_total: 0.85,
      verdict: 'INCLUDE',
      i_see: 'A test evaluation for storage verification',
      gate: {
        compositional_integrity: true,
        artifact_control: true,
        ethics_process: 'present'
      },
      scores_raw: {
        paris_photo_ready: 8.5,
        ai_criticality: 9.0,
        conceptual_strength: 8.0,
        technical_excellence: 7.5,
        cultural_dialogue: 7.0
      },
      rationales: {
        paris_photo_ready: 'Strong gallery presence',
        ai_criticality: 'Pushes AI boundaries'
      },
      flags: ['innovative', 'exhibition_ready'],
      confidence: 0.90,
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    };
    
    const saved = await ninaStorage.saveEvaluation(testEval, 'test_artist');
    console.log(`   ✓ Evaluation saved with ID: ${saved.id}`);
    
    // Test retrieving evaluations
    console.log('\n📊 Testing Evaluation Retrieval...');
    const evaluations = await ninaStorage.getEvaluations('test_artist', 5);
    console.log(`   ✓ Retrieved ${evaluations.length} evaluation(s)`);
    
    // Test style fingerprint
    console.log('\n🎯 Testing Style Fingerprint...');
    const fingerprint = {
      total_samples: 1,
      characteristics: {
        dominant_themes: ['abstract', 'geometric'],
        color_palette: ['monochrome', 'high_contrast'],
        technical_approach: ['minimalist', 'precise']
      },
      scoring_tendencies: {
        avg_scores: {
          paris_photo_ready: 8.5,
          ai_criticality: 9.0,
          conceptual_strength: 8.0,
          technical_excellence: 7.5,
          cultural_dialogue: 7.0
        },
        success_threshold: 0.75,
        preferred_dimensions: ['ai_criticality', 'conceptual_strength']
      }
    };
    
    const savedFingerprint = await ninaStorage.saveFingerprint(fingerprint, 'test_artist');
    if (savedFingerprint) {
      console.log('   ✓ Style fingerprint saved');
    }
    
    const retrievedFingerprint = await ninaStorage.getFingerprint('test_artist');
    if (retrievedFingerprint) {
      console.log('   ✓ Style fingerprint retrieved');
    }
    
    console.log('\n' + '━'.repeat(50));
    console.log('✅ Storage tests completed successfully!\n');
    
    if (ninaStorage.useSupabase) {
      console.log('🎉 Supabase is properly configured and working!');
      console.log('   You can now use Nina with persistent storage.');
      console.log('   Check your Supabase dashboard to see the test data.\n');
    } else {
      console.log('💡 To enable persistent storage:');
      console.log('   1. Run: node setup-storage.js');
      console.log('   2. Follow the setup wizard');
      console.log('   3. Run this test again to verify\n');
    }
    
  } catch (error) {
    console.error('\n❌ Storage test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env.local file has correct credentials');
    console.log('   2. Ensure your Supabase project is active');
    console.log('   3. Verify the database tables were created');
    console.log('   4. Check your internet connection\n');
  }
  
  process.exit(0);
}

testStorage().catch(console.error);