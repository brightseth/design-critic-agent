const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Create a small test image
    const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    
    console.log('Testing Claude Vision with real image...');
    
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: testImage
            }
          },
          {
            type: "text",
            text: "What do you see in this image? Be very brief."
          }
        ]
      }]
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Claude Vision API working!',
      response: response.content[0].text,
      model: response.model,
      usage: response.usage
    });
    
  } catch (error) {
    console.error('Vision test error:', error);
    return res.status(200).json({
      status: 'error',
      message: error.message,
      errorType: error.name,
      errorStatus: error.status,
      errorCode: error.error?.error?.code,
      fullError: JSON.stringify(error, null, 2)
    });
  }
};