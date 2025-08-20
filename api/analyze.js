const Anthropic = require('@anthropic-ai/sdk');
const sharp = require('sharp');

async function processImageFromUrl(imageUrl) {
  try {
    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const buffer = await response.buffer();
    const processedBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    return processedBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

async function processImageFromFile(fileBuffer) {
  try {
    const processedBuffer = await sharp(fileBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    return processedBuffer.toString('base64');
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

async function generateCritiqueWithClaude(imageBase64, depth = 'standard', focus = 'all') {
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));
  
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo-mode') {
    console.log('Using demo mode - no API key');
    return generateDemoCritique();
  }

  // Initialize Anthropic client with the API key
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompts = {
    jobs: `You are Steve Jobs critiquing this design. Focus on simplicity, clarity, and emotional impact. 
           Be direct, passionate, and uncompromising about quality. Look for unnecessary complexity, 
           unclear hierarchy, and missed opportunities for elegance. Rate 1-100 and give 3-5 specific points.`,
    
    maeda: `You are John Maeda applying your Laws of Simplicity to this design. Systematically evaluate:
            REDUCE, ORGANIZE, TIME, LEARN, DIFFERENCES, CONTEXT, EMOTION, TRUST, FAILURE, and THE ONE.
            Be methodical and educational. Rate 1-100 and give 3-5 specific observations.`,
    
    airbnb: `You are from Airbnb's design team evaluating this for trust, belonging, and human connection.
             Look for warmth, accessibility, and elements that make people feel welcome and safe.
             Consider cultural sensitivity and inclusive design. Rate 1-100 and give 3-5 points.`,
    
    instagram: `You are from Instagram's design team focusing on visual impact and mobile-first thinking.
                Evaluate thumb-stopping power, content hierarchy, and social sharing potential.
                Consider speed, delight, and viral appeal. Rate 1-100 and give 3-5 points.`,
    
    ive: `You are Jony Ive examining this design for craft, materiality, and honest expression.
          Look at edges, transitions, purposeful details, and the relationship between form and function.
          Consider what this design is trying to be. Rate 1-100 and give 3-5 points.`
  };

  const depthInstructions = {
    quick: "Provide concise, high-level feedback.",
    standard: "Provide detailed analysis with specific examples.",
    deep: "Provide comprehensive critique with actionable recommendations."
  };

  const focusInstructions = {
    all: "Consider all aspects of the design",
    visual: "Focus primarily on visual design elements",
    ux: "Focus on user experience and usability",
    emotion: "Focus on emotional impact and brand feeling",
    technical: "Focus on technical execution and craft"
  };

  try {
    const critiques = await Promise.all(
      Object.entries(prompts).map(async ([critic, prompt]) => {
        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
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
                text: `${prompt}
                
                Analysis depth: ${depthInstructions[depth]}
                Focus area: ${focusInstructions[focus]}
                
                Format your response as JSON:
                {
                  "name": "${critic === 'jobs' ? 'Steve Jobs' : critic === 'maeda' ? 'John Maeda' : critic === 'airbnb' ? 'Airbnb Design' : critic === 'instagram' ? 'Instagram Aesthetic' : 'Jony Ive'}",
                  "avatar": "${critic === 'jobs' ? 'SJ' : critic === 'maeda' ? 'JM' : critic === 'airbnb' ? 'AB' : critic === 'instagram' ? 'IG' : 'JI'}",
                  "title": "${critic === 'jobs' ? 'Simplicity & Focus' : critic === 'maeda' ? 'Simplicity Laws' : critic === 'airbnb' ? 'Human Connection' : critic === 'instagram' ? 'Visual Impact' : 'Craft & Detail'}",
                  "focus": "Brief description of what you're analyzing...",
                  "score": 85,
                  "points": [
                    {"type": "positive", "text": "Specific positive observation..."},
                    {"type": "negative", "text": "Specific area for improvement..."}
                  ]
                }`
              }
            ]
          }]
        });

        try {
          return JSON.parse(message.content[0].text);
        } catch (parseError) {
          // Fallback if JSON parsing fails
          return {
            name: critic === 'jobs' ? 'Steve Jobs' : critic === 'maeda' ? 'John Maeda' : critic === 'airbnb' ? 'Airbnb Design' : critic === 'instagram' ? 'Instagram Aesthetic' : 'Jony Ive',
            avatar: critic === 'jobs' ? 'SJ' : critic === 'maeda' ? 'JM' : critic === 'airbnb' ? 'AB' : critic === 'instagram' ? 'IG' : 'JI',
            title: critic === 'jobs' ? 'Simplicity & Focus' : critic === 'maeda' ? 'Simplicity Laws' : critic === 'airbnb' ? 'Human Connection' : critic === 'instagram' ? 'Visual Impact' : 'Craft & Detail',
            focus: "Analyzing your design through expert lens...",
            score: Math.floor(Math.random() * 30) + 70,
            points: [
              { type: "neutral", text: message.content[0].text.substring(0, 200) + "..." }
            ]
          };
        }
      })
    );

    // Calculate overall scores
    const scores = {
      simplicity: Math.round(critiques.filter(c => c.name.includes('Jobs') || c.name.includes('Maeda')).reduce((sum, c) => sum + c.score, 0) / 2),
      usability: Math.round(critiques.filter(c => c.name.includes('Airbnb')).reduce((sum, c) => sum + c.score, 0) / 1),
      emotion: Math.round(critiques.filter(c => c.name.includes('Instagram')).reduce((sum, c) => sum + c.score, 0) / 1),
      craft: Math.round(critiques.filter(c => c.name.includes('Ive')).reduce((sum, c) => sum + c.score, 0) / 1)
    };

    // Generate recommendations based on lowest scores
    const recommendations = generateRecommendations(critiques, scores);

    return {
      critique: critiques,
      scores,
      recommendations
    };

  } catch (error) {
    console.error('Claude API error:', error);
    return generateDemoCritique();
  }
}

function generateRecommendations(critiques, scores) {
  const recommendations = [];
  
  // Find lowest scoring areas
  const sortedScores = Object.entries(scores).sort(([,a], [,b]) => a - b);
  
  sortedScores.slice(0, 3).forEach(([area, score]) => {
    if (score < 80) {
      let rec = {};
      switch (area) {
        case 'simplicity':
          rec = {
            priority: 'high',
            title: 'Simplify Visual Hierarchy',
            description: 'Reduce visual complexity and establish clearer focal points. Users should instantly know where to look.'
          };
          break;
        case 'usability':
          rec = {
            priority: 'high',
            title: 'Improve User Experience',
            description: 'Enhance navigation, accessibility, and overall user flow to create a more intuitive experience.'
          };
          break;
        case 'emotion':
          rec = {
            priority: 'medium',
            title: 'Strengthen Emotional Connection',
            description: 'Add elements that create trust, delight, and human connection with your audience.'
          };
          break;
        case 'craft':
          rec = {
            priority: 'medium',
            title: 'Refine Technical Execution',
            description: 'Polish details, improve consistency, and ensure all elements serve their intended purpose.'
          };
          break;
      }
      recommendations.push(rec);
    }
  });

  return recommendations;
}

function generateDemoCritique() {
  return {
    critique: [
      {
        name: 'Steve Jobs',
        avatar: 'SJ',
        title: 'Simplicity & Focus',
        focus: 'Demo mode - Connect API key for real analysis',
        score: Math.floor(Math.random() * 30) + 70,
        points: [
          { type: 'neutral', text: 'Demo mode active - Add ANTHROPIC_API_KEY environment variable for real AI-powered critiques of your actual design.' }
        ]
      }
    ],
    scores: {
      simplicity: 75,
      usability: 80,
      emotion: 70,
      craft: 85
    },
    recommendations: [
      {
        priority: 'high',
        title: 'Enable AI Analysis',
        description: 'Add your Anthropic API key to get real, personalized design critiques powered by Claude AI.'
      }
    ]
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, imageData, depth = 'standard', focus = 'all' } = req.body;
    
    let imageBase64;
    
    if (imageUrl) {
      imageBase64 = await processImageFromUrl(imageUrl);
    } else if (imageData) {
      // Assume imageData is base64 encoded
      const buffer = Buffer.from(imageData.split(',')[1], 'base64');
      imageBase64 = await processImageFromFile(buffer);
    } else {
      return res.status(400).json({ error: 'No image provided' });
    }

    const result = await generateCritiqueWithClaude(imageBase64, depth, focus);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
};