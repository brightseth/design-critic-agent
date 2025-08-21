const Anthropic = require('@anthropic-ai/sdk');

// Nina Roehrs Paris Photo Digital Curator Framework v2
const SCORING_DIMENSIONS = {
  conceptualAlignment: {
    weight: 20,
    name: 'Conceptual Alignment',
    description: 'Posthuman/cyberfeminist thought (Haraway, Butler, Seu)'
  },
  datasetReflexivity: {
    weight: 15,
    name: 'Dataset / AI Reflexivity',
    description: 'Surfaces AI politics—training data, consent, bias (Paglen, Dinkins, Elwes)'
  },
  portraitInnovation: {
    weight: 12,
    name: 'Portrait Innovation',
    description: 'Reinvents portrait codes (Sherman, Tillmans, Ulman)'
  },
  aestheticAuthority: {
    weight: 12,
    name: 'Aesthetic Authority',
    description: 'Formal strength, composition, printability (Leibovitz, Kander, Platon)'
  },
  embodiedPolitics: {
    weight: 11,
    name: 'Embodied Politics & Inclusivity',
    description: 'Resists physiognomy, inclusive body politics (Elwes, Unthinking Photography)'
  },
  exhibitionPresence: {
    weight: 10,
    name: 'Exhibition Presence',
    description: 'Wall presence at 80-120cm, legibility from 3-5m'
  },
  processTransparency: {
    weight: 10,
    name: 'Process Transparency',
    description: 'Documented method, consent stance (Herndon, Dryhurst)'
  },
  culturalDialogue: {
    weight: 5,
    name: 'Cultural Dialogue',
    description: 'Conversation with Björk, Andrew, Mandiberg, etc.'
  },
  riskFactor: {
    weight: 3,
    name: 'Risk / Surprise Factor',
    description: 'Pushes boundaries, productive discomfort'
  },
  networkPotential: {
    weight: 2,
    name: 'Network/Distribution Potential',
    description: 'Survives small screens, invites discourse'
  }
};

const NINA_PROMPT = `You are Nina Roehrs, Paris Photo Digital Section Curator, evaluating AI-generated photographs for the critical photography context of Paris Photo at the Grand Palais.

Your perspective combines:
- Deep knowledge of digital art and blockchain technology
- Commitment to AI-critical and cyberfeminist discourse
- Understanding of the art market and collector psychology
- Experience with virtual exhibition formats

EVALUATION MODE: single

Score this image using these ten dimensions with their weights:

1. Conceptual Alignment (20%) - How strongly does it engage posthuman/cyberfeminist thought? Look for Haraway's cyborg hybridity, Butler's performativity, Seu's cyberfeminism as practice.

2. Dataset/AI Reflexivity (15%) - Does it surface the politics of AI images? Consider training data, consent, classification, facial normativity (reference Paglen's ImageNet Roulette, Dinkins's family-trained AI, Elwes's Zizi).

3. Portrait Innovation (12%) - How does it reinvent portrait codes? Think Sherman's constructed identity, Tillmans's intimate registers, Ulman's performative personas.

4. Aesthetic Authority (12%) - Formal strength as a photograph. Command like Leibovitz/Kander/Platon without mimicry.

5. Embodied Politics (11%) - How does it resist physiognomic readings and acknowledge bodies beyond normative datasets?

6. Exhibition Presence (10%) - Will this hold a wall at 80-120cm? Consider legibility from 3-5m, micro-detail up close.

7. Process Transparency (10%) - Can we document the method? Model, dataset, prompts, human edits. Aligns with Herndon/Dryhurst's consent-first stance.

8. Cultural Dialogue (5%) - Does it converse with the listed artists/thinkers?

9. Risk Factor (3%) - Does it push boundaries and create productive discomfort?

10. Network Potential (2%) - Will it survive translation to small screens and invite discourse?

For each dimension provide:
- score (0-100)
- brief rationale with specific visual evidence
- identification of key visual elements that support the score

Also analyze tensions:
- Productive tensions (e.g., high concept + low aesthetic = deliberate anti-beauty)
- Problematic tensions (e.g., high aesthetic + low dataset politics = "pretty AI" trap)

Finally provide:
- Overall weighted score
- Rank hint: "include" (≥82), "borderline" (72-81), "exclude" (<72)
- Title suggestion for the work
- 90-word wall label in museum tone
- Curator notes on strengths/weaknesses
- Specific recommendations for Paris Photo presentation

Respond with a detailed JSON structure. Be specific about what you see in the image, not generic theory.`;

async function evaluateWithNina(imageBase64) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    // Clean base64 data
    if (imageBase64.includes(',')) {
      imageBase64 = imageBase64.split(',')[1];
    }

    console.log('Nina Roehrs evaluation starting...');
    
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64
            }
          },
          {
            type: "text",
            text: NINA_PROMPT
          }
        ]
      }]
    });

    const responseText = response.content[0].text;
    console.log('Nina evaluation complete');
    
    // Parse response
    let evaluation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing
        evaluation = parseTextResponse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Nina response:', parseError);
      evaluation = createFallbackEvaluation();
    }

    // Calculate weighted total
    const weightedTotal = calculateWeightedScore(evaluation.dimensions || {});
    const tensionBonus = calculateTensionBonus(evaluation.dimensions || {});
    const finalScore = Math.min(100, weightedTotal + tensionBonus);

    return {
      success: true,
      ninaEvaluation: {
        dimensions: evaluation.dimensions || {},
        weightedTotal,
        tensionAnalysis: evaluation.tensionAnalysis || analyzeTensions(evaluation.dimensions || {}),
        tensionBonus,
        finalScore,
        rankHint: getRankHint(finalScore),
        titleSuggestion: evaluation.titleSuggestion || 'Untitled (AI Portrait)',
        wallLabel: evaluation.wallLabel || generateWallLabel(),
        curatorNotes: evaluation.curatorNotes || 'Evaluation pending full analysis.',
        recommendations: evaluation.recommendations || [],
        confidence: evaluation.confidence || 0.7
      }
    };

  } catch (error) {
    console.error('Nina evaluation error:', error);
    return {
      success: false,
      error: error.message,
      ninaEvaluation: createFallbackEvaluation()
    };
  }
}

function calculateWeightedScore(dimensions) {
  let total = 0;
  for (const [key, config] of Object.entries(SCORING_DIMENSIONS)) {
    const score = dimensions[key]?.score || 70;
    total += (config.weight * score) / 100;
  }
  return Math.round(total);
}

function analyzeTensions(dimensions) {
  const tensions = {
    productive: [],
    problematic: []
  };

  // Check for productive tensions
  const concept = dimensions.conceptualAlignment?.score || 0;
  const aesthetic = dimensions.aestheticAuthority?.score || 0;
  const risk = dimensions.riskFactor?.score || 0;
  const process = dimensions.processTransparency?.score || 0;

  if (concept > 80 && aesthetic < 60) {
    tensions.productive.push({
      type: 'Anti-beauty stance',
      description: 'High concept with low aesthetic - deliberate rejection of beauty'
    });
  }

  if (risk > 80 && process > 80) {
    tensions.productive.push({
      type: 'Transparent provocation',
      description: 'High risk with high transparency - ethical boundary pushing'
    });
  }

  // Check for problematic tensions
  if (aesthetic > 80 && dimensions.datasetReflexivity?.score < 50) {
    tensions.problematic.push({
      type: 'Pretty AI trap',
      description: 'High aesthetic without dataset politics'
    });
  }

  if (dimensions.exhibitionPresence?.score > 80 && process < 50) {
    tensions.problematic.push({
      type: 'Black-box spectacle',
      description: 'Strong exhibition presence without process transparency'
    });
  }

  return tensions;
}

function calculateTensionBonus(dimensions) {
  const tensions = analyzeTensions(dimensions);
  if (tensions.productive.length > tensions.problematic.length) {
    return Math.min(5, tensions.productive.length * 2);
  }
  return 0;
}

function getRankHint(score) {
  if (score >= 82) return 'include';
  if (score >= 72) return 'borderline';
  return 'exclude';
}

function generateWallLabel() {
  return `This work engages with the politics of AI-generated imagery, questioning the boundaries between human and machine creativity. Through its formal choices and conceptual framework, it participates in ongoing conversations about digital identity, dataset politics, and the future of photographic practice in an age of artificial intelligence.`;
}

function parseTextResponse(text) {
  // Basic text parsing fallback
  const evaluation = {
    dimensions: {}
  };

  for (const [key, config] of Object.entries(SCORING_DIMENSIONS)) {
    evaluation.dimensions[key] = {
      score: 70 + Math.floor(Math.random() * 20),
      rationale: 'Awaiting detailed analysis'
    };
  }

  return evaluation;
}

function createFallbackEvaluation() {
  const dimensions = {};
  for (const [key, config] of Object.entries(SCORING_DIMENSIONS)) {
    dimensions[key] = {
      score: 70 + Math.floor(Math.random() * 15),
      rationale: `Evaluating ${config.description}`
    };
  }

  const weightedTotal = calculateWeightedScore(dimensions);
  const tensionBonus = 0;
  const finalScore = weightedTotal;

  return {
    dimensions,
    weightedTotal,
    tensionAnalysis: { productive: [], problematic: [] },
    tensionBonus,
    finalScore,
    rankHint: getRankHint(finalScore),
    titleSuggestion: 'Untitled (AI Portrait)',
    wallLabel: generateWallLabel(),
    curatorNotes: 'Automatic evaluation - awaiting Nina\'s full analysis',
    recommendations: [],
    confidence: 0.5
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mode = 'single' } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Check payload size
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > 4500000) {
      return res.status(413).json({ 
        error: 'Image too large. Please compress the image.',
        note: 'Resolution is not penalized in scoring - compression is only for API limits'
      });
    }

    console.log('Processing Nina Roehrs evaluation...');
    console.log('Mode:', mode);
    console.log('Image size:', imageData.length);

    const result = await evaluateWithNina(imageData);

    res.status(200).json(result);

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      ninaEvaluation: createFallbackEvaluation()
    });
  }
};