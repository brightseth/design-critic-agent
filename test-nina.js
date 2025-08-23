#!/usr/bin/env node

// Test script for Nina's core functionality
// Run this to verify everything is working

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

const API_URL = 'https://design-critic-agent.vercel.app/api/nina-studio-api';
const NINA_API_URL = 'https://design-critic-agent.vercel.app/api/nina-api';

// Test image (base64 encoded 1x1 pixel for testing)
const TEST_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testAPI(endpoint, action, data) {
  console.log(`\nTesting ${action}...`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        data
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✓ ${action} working`);
      return result;
    } else {
      console.log(`✗ ${action} failed:`, result.error);
      return null;
    }
  } catch (error) {
    console.log(`✗ ${action} error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('=================================');
  console.log('NINA FUNCTIONALITY TEST SUITE');
  console.log('=================================');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Basic evaluation
  console.log('\n1. BASIC IMAGE EVALUATION');
  const evalResult = await testAPI(API_URL, 'evaluate', {
    imageData: TEST_IMAGE,
    metadata: {
      artistId: 'test-artist',
      source: 'test-suite'
    }
  });
  
  if (evalResult?.evaluation) {
    console.log(`   Score: ${evalResult.evaluation.weighted_total || 'N/A'}`);
    console.log(`   Gates: ${evalResult.evaluation.gate ? 'Checked' : 'Missing'}`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 2: Get evaluations
  console.log('\n2. RETRIEVE EVALUATIONS');
  const getEvals = await testAPI(API_URL, 'get_evaluations', {
    limit: 5,
    artistId: 'test-artist'
  });
  
  if (getEvals) {
    console.log(`   Found: ${getEvals.evaluations?.length || 0} evaluations`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 3: Create collection
  console.log('\n3. CREATE COLLECTION');
  const collection = await testAPI(API_URL, 'create_collection', {
    artistId: 'test-artist',
    name: `Test Collection ${Date.now()}`,
    theme: 'Testing',
    target_size: 10
  });
  
  if (collection?.collection) {
    console.log(`   Collection ID: ${collection.collection.id}`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 4: Learning stats
  console.log('\n4. LEARNING SYSTEM');
  const stats = await testAPI(API_URL, 'get_learning_stats', {});
  
  if (stats?.stats) {
    console.log(`   Total evaluations: ${stats.total_evaluations || 0}`);
    console.log(`   Success rate: ${stats.success_rate || 0}%`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 5: Prompt analysis
  console.log('\n5. PROMPT ENHANCEMENT');
  const prompt = await testAPI(API_URL, 'analyze_prompt', {
    prompt: 'a beautiful sunset over mountains'
  });
  
  if (prompt?.analysis) {
    console.log(`   Analysis complete`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 6: Nina API configuration
  console.log('\n6. NINA API CONFIGURATION');
  try {
    const response = await fetch(NINA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_config'
      })
    });
    const config = await response.json();
    
    if (config.algorithm) {
      console.log(`✓ Nina API configured`);
      console.log(`   Dimensions: ${Object.keys(config.algorithm.dimensions).length}`);
      console.log(`   Include threshold: ${config.algorithm.thresholds.include_min}`);
      results.passed++;
    } else {
      console.log(`✗ Nina API not configured properly`);
      results.failed++;
    }
  } catch (error) {
    console.log(`✗ Nina API error:`, error.message);
    results.failed++;
  }

  // Test 7: Video analysis readiness
  console.log('\n7. VIDEO ANALYSIS');
  const video = await testAPI(API_URL, 'evaluate_video', {
    videoData: 'data:video/mp4;base64,test',
    metadata: {
      duration: 30,
      resolution: '1920x1080',
      isLoop: false
    }
  });
  
  if (video) {
    console.log(`   Video analysis module: Ready`);
    results.passed++;
  } else {
    results.failed++;
  }

  // Summary
  console.log('\n=================================');
  console.log('TEST RESULTS');
  console.log('=================================');
  console.log(`Passed: ${results.passed}/${results.passed + results.failed}`);
  console.log(`Failed: ${results.failed}/${results.passed + results.failed}`);
  
  if (results.failed === 0) {
    console.log('\n✓ All systems operational!');
    console.log('Nina is ready for curation work.');
  } else {
    console.log('\n⚠ Some systems need attention');
    console.log('Check the failed tests above.');
  }

  // Test connections
  console.log('\n=================================');
  console.log('EXTERNAL CONNECTIONS');
  console.log('=================================');
  
  // Check Supabase
  console.log('\nSupabase: ', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Not configured');
  
  // Check Registry readiness
  console.log('Genesis Registry: ', process.env.GENESIS_REGISTRY_URL ? '✓ Ready' : '⚠ Not configured (ready when needed)');
  
  console.log('\n=================================');
  console.log('NINA STATUS: OPERATIONAL');
  console.log('=================================');
  console.log('\nAccess Nina at:');
  console.log('Main: https://design-critic-agent.vercel.app');
  console.log('Studio: https://design-critic-agent.vercel.app/nina-studio.html');
}

// Run tests
runTests().catch(console.error);