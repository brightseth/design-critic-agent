import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';
import { CURATORS } from '../curator-config.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function compressImage(buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  let pipeline = image;
  if (metadata.width > 1024 || metadata.height > 1024) {
    pipeline = pipeline.resize(1024, 1024, { 
      fit: 'inside',
      withoutEnlargement: true 
    });
  }
  
  return pipeline.jpeg({ quality: 85 }).toBuffer();
}

function buildPrompt(curator) {
  return `You are ${curator.name}, the ${curator.role}. ${curator.personality}

CRITICAL INSTRUCTION: Be ruthlessly critical. Only the TOP ${curator.acceptanceRate} deserve INCLUDE.

You're evaluating work for ${curator.venue}. Start with the assumption that most work is mediocre (score ~${curator.scoring.startingScore}).

SCORING DISCIPLINE:
- Scores above 85 are RARE (museum acquisitions only)
- Average student work = 45-55
- Good portfolio = 55-65  
- Professional but unremarkable = 65-75
- Exhibition-worthy = 75-85
- Scores below 40 indicate serious flaws

Benchmark against: ${curator.scoring.benchmarks.join(', ')}

YOUR RESPONSE MUST BE VALID JSON:
{
  "immediate_reaction": "I see [2-3 sentences describing EXACTLY what you observe]",
  "dimensions": {
    ${Object.entries(curator.scoring.dimensions).map(([key, val]) => 
      `"${key}": { "score": [0-100], "rationale": "[Brief explanation]" }`
    ).join(',\n    ')}
  },
  "gates": {
    ${Object.entries(curator.gates).map(([key, val]) => 
      `"${key}": { "score": [0-10], "flag": [true/false if below ${val.threshold}] }`
    ).join(',\n    ')}
  },
  "verdict": "INCLUDE/EXCLUDE/MAYBE",
  "brief": "[One sentence summary]"
}`;
}

function calculateWeightedTotal(response, curator) {
  const dimensions = curator.scoring.dimensions;
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [key, config] of Object.entries(dimensions)) {
    const score = response.dimensions[key]?.score || 0;
    weightedSum += score * config.weight;
    totalWeight += config.weight;
  }
  
  let baseScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  
  // Apply penalties
  for (const [key, config] of Object.entries(curator.gates)) {
    if (response.gates[key]?.flag) {
      baseScore += config.penalty;
    }
  }
  
  return Math.max(0, Math.min(100, baseScore));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType, curatorId = 'nina' } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({ error: 'Missing image or mimeType' });
    }

    const curator = CURATORS[curatorId];
    if (!curator) {
      return res.status(400).json({ error: `Unknown curator: ${curatorId}` });
    }

    // Check for demo mode
    const isDemoMode = !process.env.ANTHROPIC_API_KEY || 
                      process.env.ANTHROPIC_API_KEY === 'your-api-key-here';

    if (isDemoMode) {
      return res.status(200).json({
        immediate_reaction: `I see [DEMO MODE - ${curator.name}]: Abstract composition with dynamic forms...`,
        dimensions: Object.fromEntries(
          Object.keys(curator.scoring.dimensions).map(key => [
            key, { score: 50 + Math.random() * 30, rationale: "Demo evaluation" }
          ])
        ),
        gates: Object.fromEntries(
          Object.keys(curator.gates).map(key => [
            key, { score: 7, flag: false }
          ])
        ),
        weighted_total: 65,
        verdict: "MAYBE",
        brief: `Demo mode - Real ${curator.name} analysis requires API key`,
        demo_mode: true
      });
    }

    // Process real image
    const imageBuffer = Buffer.from(image, 'base64');
    const compressedBuffer = await compressImage(imageBuffer);
    const compressedBase64 = compressedBuffer.toString('base64');

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: compressedBase64,
              },
            },
            {
              type: 'text',
              text: buildPrompt(curator),
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const response = JSON.parse(jsonMatch[0]);
    response.weighted_total = calculateWeightedTotal(response, curator);
    response.curator = curator.name;
    response.venue = curator.venue;

    res.status(200).json(response);
  } catch (error) {
    console.error('Curator API Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
}