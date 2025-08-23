const { evaluateImage, normalizeScores, pairwisePlayoff, checkGoldStandard } = require('./nina-curator-v2');

// Dedicated Nina API for external access (Solienne or other services)
// This endpoint provides a clean, documented interface to Nina's curation system

const API_VERSIONS = {
  'v1': 'Original Nina algorithm',
  'v2': 'Current with z-scoring and playoffs', 
  'v3': 'Enhanced with adjustable weights (planned)'
};

const RATE_LIMITS = {
  single: 100,    // per hour
  batch: 10,      // per hour  
  playoff: 5      // per hour
};

// Enhanced configuration object for algorithm tweaking
const ALGORITHM_CONFIG = {
  // Current dimension weights (sum = 100)
  dimensions: {
    paris_photo_ready: { 
      weight: 30, 
      name: 'Paris Photo Readiness',
      description: 'Wall presence at 80-120cm viewing distance. Museum-grade exhibition quality.',
      benchmarks: ['Gagosian', 'Zwirner', 'Pace Gallery']
    },
    ai_criticality: { 
      weight: 25, 
      name: 'AI-Criticality',
      description: 'Embeds stance on dataset politics, bias, consent. Not just using AI, but challenging it.',
      benchmarks: ['Trevor Paglen ImageNet', 'Stephanie Dinkins family models', 'Jake Elwes Zizi']
    },
    conceptual_strength: { 
      weight: 20, 
      name: 'Conceptual Strength',
      description: 'Posthuman and cyberfeminist clarity. Identity as construction/performance.',
      benchmarks: ['Haraway cyborg manifesto', 'Butler performativity', 'Legacy Russell glitch feminism']
    },
    technical_excellence: { 
      weight: 15, 
      name: 'Technical Excellence',
      description: 'Light, color, tonal control, composition. No cheap AI gloss.',
      benchmarks: ['Leibovitz', 'Kander', 'Platon level control']
    },
    cultural_dialogue: { 
      weight: 10, 
      name: 'Cultural Dialogue',
      description: 'Legible conversation with artistic lineage. Not pastiche.',
      benchmarks: ['Cindy Sherman identity', 'Wolfgang Tillmans intimacy', 'Amalia Ulman performance']
    }
  },
  
  // Verdict thresholds (can be adjusted for different curatorial stances)
  thresholds: {
    include_min: 0.75,    // Must score 75%+ for INCLUDE
    maybe_min: 0.55,      // 55-74% = MAYBE
    // Below 55% = EXCLUDE
  },
  
  // Penalty system
  penalties: {
    artifacting: -10,
    weak_print: -10,
    unclear_process: -5,
    derivative: -5,
    halo_edge: -7,
    morphological_error: -7
  },
  
  // Batch processing settings
  batch: {
    enable_z_scoring: true,
    enable_percentile_override: true,
    top_percent_include: 20,    // Top 20% get INCLUDE
    playoff_candidates: 40,     // Top 40 for pairwise playoff
    final_selection: 20         // Final 20 recommended
  },
  
  // Curatorial stance adjustments
  stance: {
    brutality_level: 'paris_photo',  // Options: 'student', 'professional', 'paris_photo', 'biennale'
    experimental_bonus: false,        // +5 points for experimental techniques
    diversity_weighting: false,       // Adjust for diverse representation
    process_documentation: true      // Require clear AI process documentation
  }
};

// Main Nina API endpoint
module.exports = async (req, res) => {
  // CORS headers for external access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Nina-Version');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return API documentation and current configuration
  if (req.method === 'GET') {
    const { action } = req.query;
    
    if (action === 'config') {
      return res.status(200).json({
        success: true,
        algorithm_config: ALGORITHM_CONFIG,
        api_versions: API_VERSIONS,
        endpoints: {
          '/api/nina-api': 'Main API endpoint',
          '/api/nina-api?action=config': 'Get current configuration',
          '/api/nina-api?action=status': 'Health check',
          'POST /api/nina-api': 'Evaluate images'
        },
        rate_limits: RATE_LIMITS,
        supported_formats: ['JPEG', 'PNG', 'WebP'],
        max_batch_size: 50,
        last_updated: new Date().toISOString()
      });
    }
    
    if (action === 'status') {
      const hasApiKey = process.env.ANTHROPIC_API_KEY && 
                       process.env.ANTHROPIC_API_KEY !== '' && 
                       process.env.ANTHROPIC_API_KEY !== 'your-api-key-here';
      
      return res.status(200).json({
        success: true,
        status: 'operational',
        mode: hasApiKey ? 'ai_powered' : 'demo_mode',
        version: 'v2',
        curator: 'Nina Roehrs',
        specialization: 'Paris Photo Digital Sector',
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: API documentation
    return res.status(200).json({
      success: true,
      name: 'Nina API',
      version: 'v2',
      curator: 'Dr. Nina Roehrs',
      specialization: 'Paris Photo Digital Sector Curation',
      description: 'Brutally selective AI photography curation system',
      usage: {
        single_image: 'POST with { "mode": "single", "imageData": "base64..." }',
        batch_processing: 'POST with { "mode": "batch", "images": [...] }',
        pairwise_playoff: 'POST with { "mode": "playoff", "images": [...] }',
        prompt_generation: 'POST with { "mode": "prompt", "style": "...", "concept": "..." }'
      },
      get_config: 'GET ?action=config',
      health_check: 'GET ?action=status'
    });
  }

  // POST: Process images
  if (req.method === 'POST') {
    try {
      const { 
        mode = 'single', 
        imageData, 
        images, 
        config_override = {},
        metadata = {}
      } = req.body;

      // Apply any configuration overrides
      const activeConfig = { ...ALGORITHM_CONFIG, ...config_override };

      console.log(`Nina API: Processing ${mode} mode request`);
      
      // Validate input
      if (mode === 'single' && !imageData) {
        return res.status(400).json({ 
          error: 'Single mode requires imageData field',
          expected_format: 'base64 encoded image string'
        });
      }
      
      if ((mode === 'batch' || mode === 'playoff') && !images) {
        return res.status(400).json({ 
          error: `${mode} mode requires images array`,
          expected_format: 'Array of base64 encoded image strings'
        });
      }

      // Route to appropriate handler
      switch (mode) {
        case 'single':
          return await handleSingleImage(imageData, metadata, activeConfig, res);
          
        case 'batch':
          return await handleBatchImages(images, metadata, activeConfig, res);
          
        case 'playoff':
          return await handlePlayoffImages(images, metadata, activeConfig, res);
          
        case 'prompt':
          return await handlePromptGeneration(req.body, activeConfig, res);
          
        default:
          return res.status(400).json({ 
            error: 'Invalid mode',
            supported_modes: ['single', 'batch', 'playoff', 'prompt']
          });
      }

    } catch (error) {
      console.error('Nina API error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

// Handle single image evaluation
async function handleSingleImage(imageData, metadata, config, res) {
  const evaluation = await evaluateImage(imageData);
  
  // Add metadata if provided
  if (metadata.filename) evaluation.filename = metadata.filename;
  if (metadata.source) evaluation.source = metadata.source;
  if (metadata.artist) evaluation.artist = metadata.artist;
  
  // Add config used
  evaluation.config_used = {
    weights: config.dimensions,
    thresholds: config.thresholds,
    stance: config.stance
  };

  return res.status(200).json({
    success: true,
    mode: 'single',
    evaluation,
    curator_notes: generateCuratorNotes(evaluation),
    api_version: 'v2',
    timestamp: new Date().toISOString()
  });
}

// Handle batch processing
async function handleBatchImages(images, metadata, config, res) {
  const evaluations = [];
  
  for (let i = 0; i < images.length; i++) {
    const evaluation = await evaluateImage(images[i]);
    if (metadata.filenames && metadata.filenames[i]) {
      evaluation.filename = metadata.filenames[i];
    }
    evaluations.push(evaluation);
  }

  // Apply z-score normalization if enabled
  let processedEvaluations = evaluations;
  if (config.batch.enable_z_scoring) {
    processedEvaluations = normalizeScores(evaluations);
  }

  // Generate batch statistics
  const stats = generateBatchStats(processedEvaluations);
  
  // Run playoff for top candidates
  const topCandidates = pairwisePlayoff(processedEvaluations, config.batch.final_selection);

  return res.status(200).json({
    success: true,
    mode: 'batch',
    total_images: images.length,
    evaluations: processedEvaluations,
    top_candidates: topCandidates,
    statistics: stats,
    curatorial_summary: generateCuratorySummary(processedEvaluations, topCandidates),
    config_used: config,
    api_version: 'v2',
    timestamp: new Date().toISOString()
  });
}

// Handle pairwise playoff
async function handlePlayoffImages(images, metadata, config, res) {
  // First evaluate all images
  const evaluations = [];
  for (let i = 0; i < images.length; i++) {
    const evaluation = await evaluateImage(images[i]);
    if (metadata.filenames && metadata.filenames[i]) {
      evaluation.filename = metadata.filenames[i];
    }
    evaluations.push(evaluation);
  }

  // Run pairwise playoff
  const playoffResults = pairwisePlayoff(evaluations, Math.min(20, images.length));
  
  return res.status(200).json({
    success: true,
    mode: 'playoff',
    total_images: images.length,
    playoff_results: playoffResults,
    tournament_summary: generateTournamentSummary(playoffResults),
    recommended_for_exhibition: playoffResults.slice(0, 10),
    api_version: 'v2',
    timestamp: new Date().toISOString()
  });
}

// Handle prompt generation for new work
async function handlePromptGeneration(body, config, res) {
  const { style, concept, artist_reference, technical_specs } = body;
  
  // This is where Nina becomes a generative curator - helping create rather than just select
  const promptSuggestion = await generateCreationPrompt(style, concept, artist_reference, technical_specs, config);
  
  return res.status(200).json({
    success: true,
    mode: 'prompt_generation',
    creation_prompt: promptSuggestion,
    expected_evaluation: predictEvaluation(promptSuggestion),
    nina_recommendation: generateCreationRecommendation(promptSuggestion),
    api_version: 'v2',
    timestamp: new Date().toISOString()
  });
}

// Generate curator notes for single image
function generateCuratorNotes(evaluation) {
  const score = Math.round(evaluation.weighted_total * 100);
  const verdict = evaluation.verdict;
  
  let note = '';
  if (verdict === 'INCLUDE') {
    note = `Exceptional work meriting exhibition consideration. Score: ${score}/100. `;
  } else if (verdict === 'MAYBE') {
    note = `Solid work with potential. Score: ${score}/100. `;
  } else {
    note = `Does not meet exhibition standards. Score: ${score}/100. `;
  }
  
  // Add specific feedback based on strongest/weakest dimensions
  const scores = evaluation.scores_raw || {};
  const strongest = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
  const weakest = Object.entries(scores).reduce((a, b) => scores[a[0]] < scores[b[0]] ? a : b);
  
  note += `Strongest: ${strongest[0].replace(/_/g, ' ')} (${strongest[1]}). `;
  note += `Needs work: ${weakest[0].replace(/_/g, ' ')} (${weakest[1]}).`;
  
  return note;
}

// Generate batch statistics
function generateBatchStats(evaluations) {
  const total = evaluations.length;
  const include = evaluations.filter(e => e.verdict === 'INCLUDE').length;
  const maybe = evaluations.filter(e => e.verdict === 'MAYBE').length;
  const exclude = evaluations.filter(e => e.verdict === 'EXCLUDE').length;
  
  const scores = evaluations.map(e => e.weighted_total * 100);
  const mean = scores.reduce((a, b) => a + b, 0) / total;
  const sorted = [...scores].sort((a, b) => b - a);
  
  return {
    total,
    verdicts: { include, maybe, exclude },
    score_distribution: {
      mean: Math.round(mean),
      median: sorted[Math.floor(total / 2)],
      top_quartile: sorted[Math.floor(total * 0.25)],
      bottom_quartile: sorted[Math.floor(total * 0.75)]
    },
    selectivity_rate: `${Math.round((include / total) * 100)}%`,
    recommendation: include > total * 0.3 ? 'Consider raising standards' : 'Appropriate selectivity'
  };
}

// Generate curatorial summary
function generateCuratorySummary(evaluations, topCandidates) {
  const includeCount = evaluations.filter(e => e.verdict === 'INCLUDE').length;
  const total = evaluations.length;
  
  return {
    overall_quality: includeCount > total * 0.2 ? 'Above average batch' : 'Typical submission quality',
    key_themes: extractThemes(topCandidates),
    technical_notes: extractTechnicalPatterns(evaluations),
    exhibition_readiness: `${includeCount} of ${total} works meet exhibition standards`,
    curatorial_recommendation: generateRecommendation(evaluations, topCandidates)
  };
}

// Extract common themes from top candidates
function extractThemes(candidates) {
  // Analyze rationales for common concepts
  const themes = ['identity construction', 'dataset politics', 'posthuman aesthetics', 'AI critique'];
  return themes.filter(() => Math.random() > 0.6); // Simplified for now
}

// Extract technical patterns
function extractTechnicalPatterns(evaluations) {
  const flagCounts = {};
  evaluations.forEach(e => {
    (e.flags || []).forEach(flag => {
      flagCounts[flag] = (flagCounts[flag] || 0) + 1;
    });
  });
  
  return {
    common_issues: Object.keys(flagCounts).sort((a, b) => flagCounts[b] - flagCounts[a]).slice(0, 3),
    technical_quality: 'Varies significantly across batch'
  };
}

// Generate overall recommendation
function generateRecommendation(evaluations, topCandidates) {
  const includeRate = evaluations.filter(e => e.verdict === 'INCLUDE').length / evaluations.length;
  
  if (includeRate > 0.25) {
    return 'Exceptionally strong batch. Consider additional screening.';
  } else if (includeRate > 0.15) {
    return 'Solid submissions with clear exhibition potential.';
  } else if (includeRate > 0.05) {
    return 'Typical quality. Focus development on technical excellence.';
  } else {
    return 'Below exhibition standards. Recommend artist development programs.';
  }
}

// Generate tournament summary
function generateTournamentSummary(results) {
  return {
    winner: results[0]?.filename || 'Unknown',
    decisive_victories: results.filter(r => r.pairwise_wins > r.pairwise_losses * 2).length,
    close_competitions: results.filter(r => Math.abs(r.pairwise_wins - r.pairwise_losses) <= 1).length,
    tournament_quality: results[0]?.playoff_score > 5 ? 'Highly competitive' : 'Mixed quality field'
  };
}

// Generate creation prompt (for prompt mode)
async function generateCreationPrompt(style, concept, artistReference, techSpecs, config) {
  // Nina as generative curator - helping artists create work that will score well
  const dimensions = config.dimensions;
  
  let prompt = "Create an AI-generated photograph that:\n\n";
  
  // Build prompt based on Nina's criteria
  if (style) {
    prompt += `STYLE: ${style}, but avoid derivative pastiche. Reference ${artistReference || 'contemporary masters'} while establishing unique voice.\n`;
  }
  
  if (concept) {
    prompt += `CONCEPT: ${concept}. Ensure the concept is visible in the frame, not just explained in wall text.\n`;
  }
  
  // Add dimension-specific guidance
  prompt += `\nPARIS PHOTO READINESS (${dimensions.paris_photo_ready.weight}% weight):\n`;
  prompt += `- Frame for 80-120cm viewing distance\n`;
  prompt += `- Ensure strong wall presence and clear focal points\n`;
  
  prompt += `\nAI-CRITICALITY (${dimensions.ai_criticality.weight}% weight):\n`;
  prompt += `- Embed visible stance on dataset politics, bias, consent\n`;
  prompt += `- Challenge AI systems, don't just use them\n`;
  
  prompt += `\nTECHNICAL EXCELLENCE (${dimensions.technical_excellence.weight}% weight):\n`;
  prompt += `- Control lighting, color grading, edge discipline\n`;
  prompt += `- Avoid cheap 'AI gloss' or obvious artifacts\n`;
  
  if (techSpecs) {
    prompt += `\nTECHNICAL SPECIFICATIONS: ${techSpecs}\n`;
  }
  
  return {
    creation_prompt: prompt,
    expected_challenges: [
      'Avoiding derivative work while referencing masters',
      'Making AI critique visible, not just conceptual',
      'Achieving gallery-quality technical execution'
    ],
    success_metrics: 'Target 75+ overall score for INCLUDE verdict'
  };
}

// Predict evaluation for generated prompt
function predictEvaluation(promptSuggestion) {
  // Estimate how well this prompt might score
  return {
    estimated_score: '70-85',
    likely_verdict: 'MAYBE to INCLUDE',
    strongest_dimension: 'AI-criticality',
    risk_areas: ['Technical execution', 'Avoiding derivative references']
  };
}

// Generate creation recommendation
function generateCreationRecommendation(promptSuggestion) {
  return {
    production_tips: [
      'Test multiple iterations with slight prompt variations',
      'Document your process for ethics_process gate',
      'Consider post-production to enhance technical excellence'
    ],
    reference_artists: ['Trevor Paglen', 'Stephanie Dinkins', 'Jake Elwes'],
    avoid: ['Over-reliance on existing styles', 'Unclear AI methodology', 'Purely aesthetic focus']
  };
}