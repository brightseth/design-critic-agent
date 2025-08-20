const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  try {
    console.log('Testing Claude API...');
    console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        success: false,
        error: 'No API key found',
        hasKey: false
      });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Simple text message test (no image)
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: "Hello, respond with just 'API working' if you can see this message."
      }]
    });

    res.json({
      success: true,
      hasKey: true,
      apiKeyLength: process.env.ANTHROPIC_API_KEY.length,
      response: message.content[0].text,
      model: message.model
    });

  } catch (error) {
    console.error('Claude test error:', error);
    res.json({
      success: false,
      error: error.message,
      status: error.status,
      type: error.type,
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0
    });
  }
};