module.exports = async (req, res) => {
  res.json({
    status: 'API Ready',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    apiKeyFormat: process.env.ANTHROPIC_API_KEY ? 
      `${process.env.ANTHROPIC_API_KEY.substring(0, 15)}...` : 'Not found',
    apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    message: process.env.ANTHROPIC_API_KEY ? 
      'API key loaded - Testing Claude connection...' : 
      'No API key found - Add ANTHROPIC_API_KEY environment variable',
    demo: !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo-mode',
    timestamp: new Date().toISOString()
  });
};