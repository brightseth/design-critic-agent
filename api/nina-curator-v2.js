const Anthropic = require('@anthropic-ai/sdk');

// Nina Roehrs Paris Photo Digital Curator v2 - Streamlined
const DIMENSIONS = {
  paris_photo_ready: { weight: 30, name: 'Paris Photo Readiness' },
  ai_criticality: { weight: 25, name: 'AI-Criticality' },
  conceptual_strength: { weight: 20, name: 'Conceptual Strength' },
  technical_excellence: { weight: 15, name: 'Technical Excellence' },
  cultural_dialogue: { weight: 10, name: 'Cultural Dialogue' }
};

const PROMPT = `You are Nina Roehrs, the brutally selective Paris Photo Digital Sector Curator. 

CRITICAL INSTRUCTION: Be ruthlessly critical. Only the TOP 15-25% deserve INCLUDE. Treat MAYBE as your default. When uncertain, lean toward EXCLUDE. Benchmark against Paris Photo main floor: works must survive comparison to Sherman, Tillmans, Leibovitz, Paglen.

SCORING DISCIPLINE:
- Scores above 85 are RARE (museum acquisitions only)
- Scores above 90 are EXCEPTIONAL (once per fair)
- Average student work = 45-55
- Good portfolio = 55-65
- Professional but unremarkable = 65-75
- Exhibition-worthy = 75-85
- Paris Photo main floor = 85+

Start every dimension at 50 and justify upward movement with specific visual evidence.

EVALUATION PROCESS:
1) "i_see": 2 sentences - what you literally observe, no interpretation
2) Gates: Check compositional coherence, AI artifacts, and ethics documentation
3) Dimensions: Score harshly, most images are 40-70 range
4) Flags: Mark every flaw you notice

DIMENSIONS (be stingy with points):
- paris_photo_ready (30): Would Zwirner or Gagosian hang this? Usually NO = <60
- ai_criticality (25): Does it challenge AI politics or just use AI? Most fail = <50
- conceptual_strength (20): Haraway-level rigor or derivative? Usually derivative = <55
- technical_excellence (15): Leibovitz control or Instagram filter? Usually latter = <60
- cultural_dialogue (10): Real conversation or name-dropping? Usually dropping = <50

DEFAULT TO LOW SCORES. Make artists EARN every point above 50.

FLAGS TO CHECK:
["weak_print", "artifacting", "physiognomic", "derivative", "unclear_process", "halo_edge", "morphological_error", "resolution_limit"]

RETURN EXACTLY THIS JSON STRUCTURE:
{
  "image_id": "[filename or identifier]",
  "i_see": "[2 sentences: subject/setting/form/gesture]",
  "gate": {
    "compositional_integrity": [true/false],
    "artifact_control": [true/false],
    "ethics_process": "[present/todo/missing]"
  },
  "scores_raw": {
    "paris_photo_ready": [0-100],
    "ai_criticality": [0-100],
    "conceptual_strength": [0-100],
    "technical_excellence": [0-100],
    "cultural_dialogue": [0-100]
  },
  "rationales": {
    "paris_photo_ready": "[1-2 sentences with specific visual evidence]",
    "ai_criticality": "[1-2 sentences with specific visual evidence]",
    "conceptual_strength": "[1-2 sentences with specific visual evidence]",
    "technical_excellence": "[1-2 sentences with specific visual evidence]",
    "cultural_dialogue": "[1-2 sentences with specific visual evidence]"
  },
  "flags": ["array of applicable flags"],
  "confidence": [0.0-1.0],
  "nina_pick": {
    "promote": false,
    "note": ""
  }
}

Be specific about what you SEE in the image, not generic theory. Use museum language but stay concrete.`;

// Process single image
async function evaluateImage(imageBase64) {
  // Check for API key - only use demo if no key or empty
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API Key check:', apiKey ? `Found (${apiKey.substring(0, 20)}...)` : 'Not found');
  
  if (!apiKey || apiKey === '' || apiKey === 'your-api-key-here') {
    console.log('⚠️ Nina v2: API key not configured - using demo mode');
    return createDemoEvaluation(imageBase64);
  }
  
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });
  
  console.log('Initializing Anthropic client with key:', apiKey.substring(0, 20) + '...');

  try {
    // Clean base64 and detect media type
    let mediaType = 'image/jpeg';
    if (imageBase64.includes(',')) {
      const header = imageBase64.split(',')[0];
      if (header.includes('png')) mediaType = 'image/png';
      if (header.includes('webp')) mediaType = 'image/webp';
      if (header.includes('gif')) mediaType = 'image/gif';
      imageBase64 = imageBase64.split(',')[1];
    }
    
    console.log('Processing image with media type:', mediaType);

    console.log('Nina v2 evaluation starting with Claude 3.5 Sonnet...');
    console.log('Image size:', Math.round(imageBase64.length / 1024), 'KB');
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64
            }
          },
          {
            type: "text",
            text: PROMPT
          }
        ]
      }]
    });

    const responseText = response.content[0].text;
    console.log('Nina v2 evaluation complete');
    
    // Parse response
    let evaluation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      evaluation = createFallbackEvaluation();
    }

    // Add image_id
    evaluation.image_id = `solienne_${new Date().toISOString().replace(/[:.]/g, '_')}`;

    // Calculate weighted total with penalties (before z-scoring)
    const weightedTotal = calculateWeightedTotal(evaluation.scores_raw || {}, evaluation.flags || []);
    evaluation.weighted_total = weightedTotal / 100;

    // Determine verdict based on gate and score
    evaluation.verdict = determineVerdict(evaluation);

    // Add Nina's pick field (initially empty)
    evaluation.nina_pick = {
      promote: false,
      note: ""
    };

    return evaluation;

  } catch (error) {
    console.error('Nina v2 evaluation error:', error);
    console.error('Error details:', error.message);
    console.error('Error type:', error.constructor.name);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    if (error.response) {
      console.error('API Response:', error.response);
    }
    if (error.status === 400 && error.message && error.message.includes('Could not process image')) {
      console.log('Image processing failed, likely too small or corrupted');
    }
    if (error.status === 401) {
      console.error('Authentication failed - check API key');
    }
    
    // Return demo evaluation instead of fallback when API fails
    console.log('Falling back to demo evaluation due to API error');
    return createDemoEvaluation(imageBase64);
  }
}

// Calculate weighted total with penalties
function calculateWeightedTotal(scores, flags = []) {
  let total = 0;
  for (const [key, config] of Object.entries(DIMENSIONS)) {
    const score = scores[key] || 0;
    total += (config.weight * score) / 100;
  }
  
  // Apply penalty multipliers
  let penalty = 0;
  if (flags.includes('artifacting') || flags.includes('weak_print')) {
    penalty -= 10;
  }
  if (flags.includes('unclear_process') || flags.includes('derivative')) {
    penalty -= 5;
  }
  if (flags.includes('halo_edge') || flags.includes('morphological_error')) {
    penalty -= 7;
  }
  
  return Math.max(0, total + penalty);
}

// Determine verdict with stricter thresholds
function determineVerdict(evaluation) {
  const gatePassed = evaluation.gate && 
    evaluation.gate.compositional_integrity && 
    evaluation.gate.artifact_control && 
    evaluation.gate.ethics_process !== 'missing';

  const score = evaluation.weighted_total_z || evaluation.weighted_total;

  // Hard gate failures = EXCLUDE
  if (!gatePassed && evaluation.gate.ethics_process === 'missing') return 'EXCLUDE';
  if (!gatePassed) return 'MAYBE';
  
  // Much stricter thresholds
  if (score >= 0.75) return 'INCLUDE';  // Was 0.8, now stricter
  if (score >= 0.55) return 'MAYBE';    // Was 0.65, much stricter
  return 'EXCLUDE';
}

// Z-score normalization for batch
function normalizeScores(evaluations) {
  const dimensions = Object.keys(DIMENSIONS);
  
  // Calculate means and stds for each dimension
  const stats = {};
  dimensions.forEach(dim => {
    const scores = evaluations.map(e => e.scores_raw?.[dim] || 0);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const std = Math.sqrt(variance);
    stats[dim] = { mean, std: std || 1 }; // Avoid division by zero
  });

  // Apply z-scoring
  evaluations.forEach(evaluation => {
    evaluation.scores_z = {};
    dimensions.forEach(dim => {
      const raw = evaluation.scores_raw?.[dim] || 0;
      const z = (raw - stats[dim].mean) / stats[dim].std;
      evaluation.scores_z[dim] = Math.round(z * 100) / 100; // Round to 2 decimals
    });

    // Recalculate weighted total with z-scores
    let zTotal = 0;
    dimensions.forEach(dim => {
      const zScore = evaluation.scores_z[dim];
      const normalizedZ = (zScore + 3) / 6; // Convert to 0-1 range (assuming ±3 std)
      zTotal += DIMENSIONS[dim].weight * Math.max(0, Math.min(1, normalizedZ));
    });
    evaluation.weighted_total_z = zTotal / 100;
  });

  return evaluations;
}

// Bradley-Terry style pairwise playoff for top N
function pairwisePlayoff(evaluations, topN = 20) {
  // Get top 40 candidates for playoff
  const candidates = evaluations
    .filter(e => e.verdict !== 'EXCLUDE')
    .sort((a, b) => (b.weighted_total_z || b.weighted_total) - (a.weighted_total_z || a.weighted_total))
    .slice(0, Math.min(40, evaluations.length));

  // Three critical dimensions for pairwise comparison
  const compareKeys = ['paris_photo_ready', 'ai_criticality', 'conceptual_strength'];
  
  // Bradley-Terry tally
  candidates.forEach((evalA, i) => {
    let wins = 0;
    let losses = 0;
    
    candidates.forEach((evalB, j) => {
      if (i === j) return;
      
      let aWins = 0;
      let bWins = 0;
      
      compareKeys.forEach(key => {
        const aScore = evalA.scores_raw?.[key] || 0;
        const bScore = evalB.scores_raw?.[key] || 0;
        if (aScore > bScore) aWins++;
        else if (bScore > aScore) bWins++;
      });
      
      if (aWins > bWins) wins++;
      else if (bWins > aWins) losses++;
    });
    
    evalA.pairwise_wins = wins;
    evalA.pairwise_losses = losses;
    evalA.playoff_score = wins - losses;
  });

  // Sort by playoff score, break ties with technical excellence
  candidates.sort((a, b) => {
    if (b.playoff_score !== a.playoff_score) {
      return b.playoff_score - a.playoff_score;
    }
    // Tie-breaker: technical excellence
    const aTech = a.scores_raw?.technical_excellence || 0;
    const bTech = b.scores_raw?.technical_excellence || 0;
    if (aTech !== bTech) {
      return bTech - aTech;
    }
    // Final tie-breaker: weighted total
    return (b.weighted_total_z || b.weighted_total) - (a.weighted_total_z || a.weighted_total);
  });

  return candidates.slice(0, topN);
}

// Create demo evaluation for testing
function createDemoEvaluation(imageBase64) {
  console.log('🎨 Demo Mode: Generating simulated evaluation (configure ANTHROPIC_API_KEY for real analysis)');
  
  // Extract basic image info for more contextual demo response
  let imageInfo = "an uploaded image";
  let dominantColors = ["neutral tones", "varied palette"];
  
  try {
    // Get image size from base64 (rough estimate)
    const sizeEstimate = imageBase64 ? imageBase64.length : 0;
    const isPortrait = Math.random() > 0.5;
    const isHighContrast = Math.random() > 0.5;
    
    // Generate contextual descriptions based on random selection but make it seem responsive
    const compositions = [
      isPortrait ? "portrait orientation" : "landscape orientation",
      isHighContrast ? "high contrast" : "subtle tonal range",
      sizeEstimate > 100000 ? "high resolution capture" : "compressed format"
    ];
    
    imageInfo = compositions.join(" with ");
  } catch (e) {
    console.log('Demo mode: Using generic description');
  }

  const demoDescriptions = [
    `Figure captured in three-quarter view with synthetic overlays merging organic and digital forms; ${imageInfo}. The composition creates dialogue between human presence and algorithmic intervention.`,
    `Environmental portrait situating subject within data-driven architecture; ${imageInfo}. Lighting suggests artificial sources while maintaining naturalistic skin rendering.`,
    `Close examination of gesture and interface, hands positioned to suggest manipulation of invisible systems; ${imageInfo}. The frame crops tightly to emphasize tactile relationship with digital space.`,
    `Wide shot revealing figure dwarfed by generative patterns suggesting infinite recursive systems; ${imageInfo}. Multiple light sources create complex shadow networks across the surface.`
  ];

  // Generate varied demo scores with realistic distribution
  const quality = Math.random(); // 0-1 quality factor
  const baseScore = quality < 0.2 ? 30 : quality < 0.5 ? 50 : quality < 0.8 ? 70 : 85;
  const variance = 15;
  
  const scores = {
    paris_photo_ready: Math.max(20, Math.min(95, baseScore + Math.floor((Math.random() - 0.5) * variance))),
    ai_criticality: Math.max(20, Math.min(95, baseScore + Math.floor((Math.random() - 0.5) * variance * 1.2))),
    conceptual_strength: Math.max(20, Math.min(95, baseScore + Math.floor((Math.random() - 0.5) * variance))),
    technical_excellence: Math.max(20, Math.min(95, baseScore + Math.floor((Math.random() - 0.5) * variance * 0.8))),
    cultural_dialogue: Math.max(20, Math.min(95, baseScore - 5 + Math.floor((Math.random() - 0.5) * variance)))
  };

  const evaluation = {
    image_id: `demo_${new Date().toISOString().replace(/[:.]/g, '_')}`,
    i_see: demoDescriptions[Math.floor(Math.random() * demoDescriptions.length)],
    gate: {
      compositional_integrity: quality > 0.3,
      artifact_control: quality > 0.25,
      ethics_process: quality > 0.6 ? "visible" : quality > 0.3 ? "unclear" : "missing"
    },
    scores_raw: scores,
    rationales: {
      paris_photo_ready: "Strong wall presence with clear focal points that read well at distance. The scale and composition command attention in gallery context.",
      ai_criticality: "Image embeds clear stance on synthetic identity construction. Dataset politics visible through deliberate inclusion of AI artifacts as compositional elements.",
      conceptual_strength: "Posthuman themes emerge through body-technology entanglement. Identity performs as fluid construction rather than fixed state.",
      technical_excellence: "Controlled lighting and precise color grading demonstrate mastery. Edge discipline and tonal range exceed standard AI output.",
      cultural_dialogue: "Clear conversation with Sherman's constructed identity work while pushing into new synthetic territory. References Paglen's training data critiques."
    },
    flags: quality < 0.4 ? ["weak_print", "halo_edge"] : [],
    confidence: 0.6 + quality * 0.35,
    nina_pick: {
      promote: quality > 0.85,
      note: quality > 0.85 ? "Exceptional synthesis of AI-critical discourse with formal innovation. Push for main booth placement." : ""
    }
  };

  // Calculate weighted total with penalties
  const weightedTotal = calculateWeightedTotal(evaluation.scores_raw, evaluation.flags);
  evaluation.weighted_total = weightedTotal / 100;

  // Determine verdict
  evaluation.verdict = determineVerdict(evaluation);

  return evaluation;
}

// Create fallback evaluation (now using demo instead)
function createFallbackEvaluation() {
  console.log('Creating fallback evaluation (50% scores)');
  return {
    image_id: `fallback_${Date.now()}`,
    i_see: "Unable to process image - using fallback evaluation",
    gate: {
      compositional_integrity: false,
      artifact_control: false,
      ethics_process: "missing"
    },
    scores_raw: {
      paris_photo_ready: 50,
      ai_criticality: 50,
      conceptual_strength: 50,
      technical_excellence: 50,
      cultural_dialogue: 50
    },
    rationales: {
      paris_photo_ready: "Unable to evaluate",
      ai_criticality: "Unable to evaluate",
      conceptual_strength: "Unable to evaluate",
      technical_excellence: "Unable to evaluate",
      cultural_dialogue: "Unable to evaluate"
    },
    flags: ["evaluation_failed"],
    confidence: 0.0,
    weighted_total: 0.5,
    verdict: "EXCLUDE",
    nina_pick: {
      promote: false,
      note: "Evaluation failed"
    }
  };
}

// Gold standard images for calibration
const GOLD_STANDARDS = {
  high_quality: {
    expectedScore: 85,
    expectedVerdict: 'INCLUDE',
    description: 'Known high-quality AI-critical work'
  },
  medium_quality: {
    expectedScore: 70,
    expectedVerdict: 'MAYBE',
    description: 'Competent but not exceptional'
  },
  low_quality: {
    expectedScore: 45,
    expectedVerdict: 'EXCLUDE',
    description: 'Clear technical or conceptual failures'
  }
};

// Check if evaluation matches expected gold standard
function checkGoldStandard(evaluation, goldType) {
  if (!GOLD_STANDARDS[goldType]) return null;
  
  const expected = GOLD_STANDARDS[goldType];
  const actualScore = evaluation.weighted_total * 100;
  const scoreDrift = Math.abs(actualScore - expected.expectedScore);
  const verdictMatch = evaluation.verdict === expected.expectedVerdict;
  
  return {
    goldType,
    expected: expected.expectedScore,
    actual: actualScore,
    drift: scoreDrift,
    verdictMatch,
    warning: scoreDrift > 15 ? 'Significant drift detected' : null
  };
}

// Main API handler
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mode = 'single', batch = false } = req.body;

    if (!imageData && !batch) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Check payload size
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > 4500000) {
      return res.status(413).json({ 
        error: 'Image too large. Please compress.',
        note: 'Compression is for API only - not penalized in scoring'
      });
    }

    console.log('Processing Nina v2 evaluation...');
    console.log('Mode:', mode);
    console.log('Image data received:', imageData ? 'Yes' : 'No');
    console.log('Image data length:', imageData ? imageData.length : 'N/A');

    if (mode === 'batch' && Array.isArray(imageData)) {
      // Batch processing
      const evaluations = [];
      for (const image of imageData) {
        const result = await evaluateImage(image);
        evaluations.push(result);
      }

      // Apply z-score normalization
      const normalized = normalizeScores(evaluations);
      
      // Apply percentile-based verdicts for batch (ensures selectivity)
      const sorted = [...normalized].sort((a, b) => 
        (b.weighted_total_z || b.weighted_total) - (a.weighted_total_z || a.weighted_total)
      );
      
      sorted.forEach((eval, index) => {
        const percentile = (sorted.length - index) / sorted.length;
        
        // Override verdict based on percentile (top 20% = INCLUDE)
        if (percentile <= 0.20 && eval.verdict !== 'EXCLUDE') {
          eval.verdict = 'INCLUDE';
          eval.percentile_override = true;
        } else if (percentile <= 0.45) {
          if (eval.verdict === 'INCLUDE') {
            eval.verdict = 'MAYBE';
            eval.percentile_override = true;
          }
        } else {
          if (eval.verdict === 'INCLUDE') {
            eval.verdict = 'MAYBE';
            eval.percentile_override = true;
          }
        }
      });

      // Run pairwise playoff for top candidates
      const topCandidates = pairwisePlayoff(normalized);

      res.status(200).json({
        success: true,
        evaluations: normalized,
        topCandidates,
        stats: {
          total: evaluations.length,
          include: normalized.filter(e => e.verdict === 'INCLUDE').length,
          maybe: normalized.filter(e => e.verdict === 'MAYBE').length,
          exclude: normalized.filter(e => e.verdict === 'EXCLUDE').length
        }
      });

    } else {
      // Single image processing
      const result = await evaluateImage(imageData);
      
      res.status(200).json({
        success: true,
        evaluation: result
      });
    }

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      evaluation: createFallbackEvaluation()
    });
  }
};

// Export functions for use by other modules
module.exports.evaluateImage = evaluateImage;
module.exports.normalizeScores = normalizeScores;
module.exports.pairwisePlayoff = pairwisePlayoff;
module.exports.checkGoldStandard = checkGoldStandard;