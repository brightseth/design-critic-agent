module.exports = async (req, res) => {
  res.json({
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    apiKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    apiKeyStart: process.env.ANTHROPIC_API_KEY?.substring(0, 15) || 'not found',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('ANTHROPIC')),
    nodeEnv: process.env.NODE_ENV
  });
};