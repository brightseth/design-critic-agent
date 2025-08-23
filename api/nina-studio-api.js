// Nina Studio API - Unified endpoint for all Studio features
const NinaLearning = require('./nina-learning');
const NinaCuration = require('./nina-curation');
const NinaPromptEnhancement = require('./nina-prompt-enhancement');
const { evaluateImage } = require('./nina-curator-v2');
const NinaVideoAnalyzer = require('./nina-video-analyzer');
const ninaStorage = require('../lib/supabase');

// Initialize systems
const learning = new NinaLearning();
const curation = new NinaCuration();
const promptEnhancer = new NinaPromptEnhancement();
const videoAnalyzer = new NinaVideoAnalyzer();

// Fallback in-memory storage for when Supabase is unavailable
const memoryStorage = {
  evaluations: [],
  collections: [],
  comparisons: [],
  series: [],
  fingerprints: {},
  feedback: []
};

// Initialize learning system on startup
learning.initialize().catch(console.error);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, data } = req.body || {};

  try {
    switch (action) {
      // EVALUATION & LEARNING
      case 'evaluate':
        return await handleEvaluation(data, res);
      
      case 'get_evaluations':
        return await getEvaluations(data, res);
      
      case 'submit_feedback':
        return await handleFeedback(data, res);
      
      case 'get_learning_stats':
        return await getLearningStats(res);
      
      // COLLECTIONS
      case 'create_collection':
        return await createCollection(data, res);
      
      case 'add_to_collection':
        return await addToCollection(data, res);
      
      case 'get_collections':
        return await getCollections(data, res);
      
      case 'analyze_collection':
        return await analyzeCollection(data, res);
      
      case 'generate_curatorial_statement':
        return await generateStatement(data, res);
      
      // A/B TESTING
      case 'compare_variations':
        return await compareVariations(data, res);
      
      case 'get_comparisons':
        return await getComparisons(res);
      
      // SERIES COHERENCE
      case 'analyze_series':
        return await analyzeSeries(data, res);
      
      // PROMPT ENHANCEMENT
      case 'analyze_prompt':
        return await analyzePrompt(data, res);
      
      case 'get_prompt_suggestions':
        return await getPromptSuggestions(data, res);
      
      case 'mix_styles':
        return await mixStyles(data, res);
      
      case 'analyze_failure':
        return await analyzeFailure(data, res);
      
      // STYLE FINGERPRINT
      case 'get_fingerprint':
        return await getFingerprint(data, res);
      
      case 'update_fingerprint':
        return await updateFingerprint(data, res);
      
      // VIDEO ANALYSIS
      case 'evaluate_video':
        return await evaluateVideo(data, res);
      
      case 'compare_videos':
        return await compareVideos(data, res);
      
      default:
        return res.status(400).json({ 
          error: 'Unknown action', 
          available_actions: [
            'evaluate', 'get_evaluations', 'submit_feedback', 'get_learning_stats',
            'create_collection', 'add_to_collection', 'get_collections', 'analyze_collection',
            'compare_variations', 'analyze_series', 'analyze_prompt', 'get_fingerprint'
          ]
        });
    }
  } catch (error) {
    console.error('Nina Studio API error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// EVALUATION HANDLERS
async function handleEvaluation(data, res) {
  const { imageData, metadata = {} } = data;
  
  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // Evaluate image
  const evaluation = await evaluateImage(imageData);
  
  // Add metadata
  evaluation.metadata = metadata;
  evaluation.id = `eval_${Date.now()}`;
  evaluation.timestamp = new Date().toISOString();
  
  // Store evaluation
  storage.evaluations.push(evaluation);
  
  // Apply style fingerprint if artist ID provided
  if (metadata.artistId) {
    const adjusted = await learning.applyStyleFingerprint(evaluation, metadata.artistId);
    evaluation.fingerprint_adjusted = adjusted.fingerprint_adjusted;
    evaluation.artist_context = adjusted.artist_context;
  }
  
  // Track success patterns
  if (evaluation.weighted_total >= 0.75) {
    await learning.recordSuccessPattern(evaluation);
  }
  
  return res.status(200).json({
    success: true,
    evaluation,
    recommendations: await learning.getRecommendations(evaluation)
  });
}

async function getEvaluations(data, res) {
  const { limit = 20, offset = 0, artistId } = data || {};
  
  try {
    // Get from Supabase
    const evaluations = await ninaStorage.getEvaluations(artistId, limit, offset);
    
    return res.status(200).json({
      success: true,
      evaluations: evaluations || [],
      total: evaluations ? evaluations.length : 0
    });
  } catch (error) {
    console.error('Failed to get evaluations:', error);
    
    // Fallback to memory storage
    let evaluations = [...memoryStorage.evaluations];
    
    if (artistId) {
      evaluations = evaluations.filter(e => e.metadata?.artistId === artistId);
    }
    
    // Sort by timestamp (newest first)
    evaluations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return res.status(200).json({
      success: true,
      evaluations: evaluations.slice(offset, offset + limit),
      total: evaluations.length
    });
  }
}

// FEEDBACK HANDLERS
async function handleFeedback(data, res) {
  const { evaluationId, feedback } = data;
  
  const evaluation = storage.evaluations.find(e => e.id === evaluationId);
  if (!evaluation) {
    return res.status(404).json({ error: 'Evaluation not found' });
  }
  
  // Record feedback in learning system
  const result = await learning.recordFeedback(evaluation, feedback);
  
  // Store feedback
  storage.feedback.push({
    id: `feedback_${Date.now()}`,
    evaluationId,
    feedback,
    result,
    timestamp: new Date().toISOString()
  });
  
  // Check for systematic bias
  const bias = await learning.detectSystematicBias();
  
  return res.status(200).json({
    success: true,
    feedback_recorded: true,
    adjustments: result.adjustments,
    systematic_bias: bias
  });
}

async function getLearningStats(res) {
  const stats = await learning.getStats();
  
  return res.status(200).json({
    success: true,
    stats,
    total_evaluations: storage.evaluations.length,
    total_feedback: storage.feedback.length,
    success_rate: calculateSuccessRate()
  });
}

function calculateSuccessRate() {
  if (storage.evaluations.length === 0) return 0;
  const successful = storage.evaluations.filter(e => e.weighted_total >= 0.75).length;
  return Math.round((successful / storage.evaluations.length) * 100);
}

// COLLECTION HANDLERS
async function createCollection(data, res) {
  const { artistId, name, theme, target_size } = data;
  
  try {
    // Create collection in Supabase
    const collection = await ninaStorage.saveCollection({
      name: name,
      theme: theme || '',
      target_size: target_size || 20
    }, artistId);
    
    if (collection) {
      return res.status(200).json({
        success: true,
        collection
      });
    } else {
      throw new Error('Failed to save collection to database');
    }
  } catch (error) {
    console.error('Collection creation error:', error);
    
    // Fallback to in-memory storage
    const collection = {
      id: `coll_${Date.now()}`,
      name,
      theme: theme || '',
      target_size: target_size || 20,
      artist_id: artistId,
      created_at: new Date().toISOString(),
      collection_images: []
    };
    
    memoryStorage.collections.push(collection);
    
    return res.status(200).json({
      success: true,
      collection
    });
  }
}

async function addToCollection(data, res) {
  const { collectionId, evaluationId, role, tags } = data;
  
  try {
    // Add to collection in Supabase
    const result = await ninaStorage.addToCollection(collectionId, evaluationId, role, tags || []);
    
    if (result) {
      return res.status(200).json({
        success: true,
        result
      });
    } else {
      throw new Error('Failed to add to collection');
    }
  } catch (error) {
    console.error('Add to collection error:', error);
    
    // Fallback to memory storage
    const collection = memoryStorage.collections.find(c => c.id === collectionId);
    if (collection) {
      if (!collection.collection_images) collection.collection_images = [];
      collection.collection_images.push({ 
        evaluation_id: evaluationId, 
        role: role || 'supporting', 
        thematic_tags: tags || [] 
      });
      
      return res.status(200).json({
        success: true,
        result: true
      });
    }
    
    return res.status(404).json({
      success: false,
      error: 'Collection not found'
    });
  }
}

async function getCollections(data, res) {
  const { artistId } = data || {};
  
  try {
    // Get from Supabase
    const collections = await ninaStorage.getCollections(artistId);
    
    return res.status(200).json({
      success: true,
      collections: collections || []
    });
  } catch (error) {
    console.error('Failed to get collections:', error);
    
    // Fallback to memory storage
    let collections = [...memoryStorage.collections];
    
    if (artistId) {
      collections = collections.filter(c => c.artist_id === artistId);
    }
    
    return res.status(200).json({
      success: true,
      collections
    });
  }
}

async function analyzeCollection(data, res) {
  const { collectionId } = data;
  
  const collection = curation.collections[collectionId];
  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  
  const coherence = await curation.analyzeCoherence(collection);
  const groupings = await curation.suggestGroupings(collection);
  
  return res.status(200).json({
    success: true,
    coherence,
    groupings,
    exhibition_ready: collection.statistics.coherence_score >= 70
  });
}

async function generateStatement(data, res) {
  const { collectionId } = data;
  
  const statement = await curation.generateCuratorialStatement(collectionId);
  
  return res.status(200).json({
    success: true,
    statement
  });
}

// A/B TESTING HANDLERS
async function compareVariations(data, res) {
  const { variations, testCriteria } = data;
  
  // Evaluate each variation if needed
  const evaluatedVariations = await Promise.all(
    variations.map(async v => ({
      image: v.image,
      evaluation: v.evaluation || await evaluateImage(v.imageData)
    }))
  );
  
  const comparison = await curation.createComparison(evaluatedVariations, testCriteria);
  storage.comparisons.push(comparison);
  
  return res.status(200).json({
    success: true,
    comparison
  });
}

async function getComparisons(res) {
  return res.status(200).json({
    success: true,
    comparisons: storage.comparisons
  });
}

// SERIES HANDLERS
async function analyzeSeries(data, res) {
  const { images, seriesName } = data;
  
  // Evaluate all images if needed
  const evaluatedImages = await Promise.all(
    images.map(async img => ({
      ...img,
      evaluation: img.evaluation || await evaluateImage(img.imageData)
    }))
  );
  
  const series = await curation.evaluateSeries(evaluatedImages, seriesName);
  storage.series.push(series);
  
  return res.status(200).json({
    success: true,
    series
  });
}

// PROMPT HANDLERS
async function analyzePrompt(data, res) {
  const { prompt } = data;
  
  const analysis = await promptEnhancer.analyzePrompt(prompt);
  const suggestions = await promptEnhancer.getSuggestions(prompt);
  
  return res.status(200).json({
    success: true,
    analysis,
    suggestions
  });
}

async function getPromptSuggestions(data, res) {
  const { prompt, context } = data;
  
  const suggestions = await promptEnhancer.getSuggestions(prompt, context);
  
  return res.status(200).json({
    success: true,
    suggestions
  });
}

async function mixStyles(data, res) {
  const { style1, style2, blendRatio } = data;
  
  const mixed = await promptEnhancer.mixStyles(style1, style2, blendRatio);
  
  return res.status(200).json({
    success: true,
    mixed_prompt: mixed
  });
}

async function analyzeFailure(data, res) {
  const { evaluation, originalPrompt } = data;
  
  const analysis = await promptEnhancer.analyzeFailure(evaluation, originalPrompt);
  
  return res.status(200).json({
    success: true,
    failure_analysis: analysis
  });
}

// FINGERPRINT HANDLERS
async function getFingerprint(data, res) {
  const { artistId } = data;
  
  try {
    // Get from Supabase
    let fingerprint = await ninaStorage.getFingerprint(artistId);
    
    if (!fingerprint) {
      // Try to generate from existing evaluations
      const evaluations = await ninaStorage.getEvaluations(artistId, 100);
      
      if (evaluations && evaluations.length > 0) {
        fingerprint = await learning.createStyleFingerprint(artistId, evaluations);
        await ninaStorage.saveFingerprint(fingerprint, artistId);
      }
    }
    
    return res.status(200).json({
      success: true,
      fingerprint: fingerprint || null
    });
  } catch (error) {
    console.error('Failed to get fingerprint:', error);
    
    // Fallback to memory storage
    let fingerprint = memoryStorage.fingerprints[artistId];
    
    return res.status(200).json({
      success: true,
      fingerprint: fingerprint || null
    });
  }
}

async function updateFingerprint(data, res) {
  const { artistId } = data;
  
  const artistEvaluations = storage.evaluations.filter(e => 
    e.metadata?.artistId === artistId
  );
  
  if (artistEvaluations.length === 0) {
    return res.status(404).json({ error: 'No evaluations found for artist' });
  }
  
  const fingerprint = await learning.createStyleFingerprint(artistId, artistEvaluations);
  storage.fingerprints[artistId] = fingerprint;
  
  return res.status(200).json({
    success: true,
    fingerprint,
    samples_analyzed: artistEvaluations.length
  });
}

// VIDEO HANDLERS
async function evaluateVideo(data, res) {
  const { videoData, metadata = {} } = data;
  
  if (!videoData) {
    return res.status(400).json({ error: 'No video data provided' });
  }
  
  const evaluation = await videoAnalyzer.evaluateVideo(videoData, metadata);
  
  // Store in memory (would need Supabase video table)
  memoryStorage.evaluations.push(evaluation);
  
  return res.status(200).json({
    success: true,
    evaluation,
    format_suggestion: evaluation.exhibition_format
  });
}

async function compareVideos(data, res) {
  const { videos } = data;
  
  if (!videos || videos.length < 2) {
    return res.status(400).json({ error: 'At least 2 videos required for comparison' });
  }
  
  const comparison = await videoAnalyzer.compareVideos(videos);
  
  return res.status(200).json({
    success: true,
    comparison
  });
}