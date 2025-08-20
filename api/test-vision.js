const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  try {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    const keyStart = process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...' : 'none';
    
    if (!hasKey) {
      return res.status(200).json({
        status: 'error',
        message: 'No API key found in environment',
        hasKey: false
      });
    }
    
    // Try to initialize client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Try a simple text-only request to verify the key works
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 10,
      messages: [{
        role: "user",
        content: "Say 'yes' if you can see this"
      }]
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'API key is valid and working',
      hasKey: true,
      keyPreview: keyStart,
      testResponse: response.content[0].text,
      visionSupported: true
    });
    
  } catch (error) {
    return res.status(200).json({
      status: 'error',
      message: error.message,
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      errorType: error.name,
      errorStatus: error.status
    });
  }
};