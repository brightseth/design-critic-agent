// Test endpoint to verify API key is working
const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(200).json({
      status: 'error',
      message: 'No API key found in environment',
      hasKey: false
    });
  }
  
  try {
    const anthropic = new Anthropic({ apiKey });
    
    // Try a simple test message
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 10,
      messages: [{
        role: "user",
        content: "Say 'API working'"
      }]
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'API key is valid and working',
      hasKey: true,
      keyPrefix: apiKey.substring(0, 20) + '...',
      testResponse: response.content[0].text
    });
    
  } catch (error) {
    return res.status(200).json({
      status: 'error',
      message: 'API key found but request failed',
      hasKey: true,
      keyPrefix: apiKey.substring(0, 20) + '...',
      error: error.message,
      errorType: error.constructor.name
    });
  }
};