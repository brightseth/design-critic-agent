const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ready',
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();
    
    // Test 1: Check if we have API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(200).json({
        success: false,
        error: 'No API key configured',
        duration: Date.now() - startTime
      });
    }

    // Test 2: Try to initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Test 3: Try a simple API call with minimal data
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Use faster model for testing
      max_tokens: 100,
      messages: [{
        role: "user",
        content: "Say 'test successful' in 3 words exactly"
      }]
    });

    return res.status(200).json({
      success: true,
      response: response.content[0].text,
      duration: Date.now() - startTime,
      model: "claude-3-haiku-20240307"
    });

  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
  }
};