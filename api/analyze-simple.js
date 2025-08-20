const Anthropic = require('@anthropic-ai/sdk');

async function generateSimpleCritique(imageBase64) {
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));
  
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo-mode') {
    console.log('Using demo mode - no API key');
    return {
      critique: [{
        name: 'Demo Mode',
        avatar: 'DM',
        title: 'API Key Required',
        focus: 'Environment variable check',
        score: 0,
        points: [
          { type: 'neutral', text: `API Key present: ${!!process.env.ANTHROPIC_API_KEY}` },
          { type: 'neutral', text: `API Key length: ${process.env.ANTHROPIC_API_KEY?.length || 0}` },
          { type: 'neutral', text: 'Add ANTHROPIC_API_KEY to enable real AI critiques' }
        ]
      }],
      scores: { simplicity: 0, usability: 0, emotion: 0, craft: 0 },
      recommendations: []
    };
  }

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    console.log('Calling Claude API...');
    
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
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
            text: "You are Steve Jobs. Analyze this design with focus on simplicity and user experience. Give a brief critique in 2-3 sentences, then rate it 1-100."
          }
        ]
      }]
    });

    console.log('Claude API response received');
    
    const critiqueBrief = message.content[0].text;
    const score = Math.floor(Math.random() * 30) + 70; // Extract from response later

    return {
      critique: [{
        name: 'Steve Jobs',
        avatar: 'SJ',
        title: 'Simplicity & Focus',
        focus: 'Real AI analysis from Claude',
        score: score,
        points: [
          { type: 'positive', text: critiqueBrief }
        ]
      }],
      scores: { simplicity: score, usability: score, emotion: score, craft: score },
      recommendations: []
    };

  } catch (error) {
    console.error('Claude API error:', error);
    return {
      critique: [{
        name: 'API Error',
        avatar: 'ER',
        title: 'Connection Issue',
        focus: 'Troubleshooting API connection',
        score: 0,
        points: [
          { type: 'negative', text: `Error: ${error.message}` },
          { type: 'neutral', text: 'Check API key and network connection' }
        ]
      }],
      scores: { simplicity: 0, usability: 0, emotion: 0, craft: 0 },
      recommendations: []
    };
  }
}

module.exports = async (req, res) => {
  console.log('API endpoint called:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, imageUrl } = req.body;
    
    let imageBase64 = '';
    
    if (imageData && imageData.startsWith('data:image/')) {
      // Extract base64 from data URL
      imageBase64 = imageData.split(',')[1];
    } else if (imageUrl) {
      // For URLs, we'll use a placeholder for now
      imageBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD//Z'; // minimal base64 placeholder
    } else {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing image, base64 length:', imageBase64.length);
    
    const result = await generateSimpleCritique(imageBase64);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Endpoint error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message,
      stack: error.stack 
    });
  }
};