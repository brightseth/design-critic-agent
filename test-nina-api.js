const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

async function testAPI() {
    console.log('Testing Nina Curator API...');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length);
    
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    try {
        // Test with a simple message first
        console.log('Testing basic Claude API connection...');
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: "Say 'API is working'"
            }]
        });
        
        console.log('Basic API test successful:', response.content[0].text);
        
        // Now test with image
        console.log('\nTesting with image analysis...');
        const testImage = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABAAEADASIAAhEBAxEB/8QAGwAACQEBAQEAAAAAAAAAAAAAAAMEBQECBgf/xAAtEAACAQMEAQMEAQQDAAAAAAABAgMABBEFEiExQRMiUWFxgZGhFDKxwULR8P/EABcBAAMBAAAAAAAAAAAAAAAAAAABAgP/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARECEv/aAAwDAQACEQMRAD8A+uRaO0VVELCd1IBiGTwfJwOO6W0Kayk/6h9u4YUSBgWI+QPhifzRRVFhlj9SSYBRjJRF6x4/77qciRQAABjgY+O6KKQZ88jQFXQc7yM5x8f7p9vqkl1si2bQAFic46HFFFG1Nb6fJLOlzJdhFbsoRtb6Zx1V9M08afE4dwzsdzEds3/hoopnsrRRRVJ//9k="; // small test image
        
        const imageResponse = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 200,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/jpeg",
                            data: testImage
                        }
                    },
                    {
                        type: "text",
                        text: "Describe what you see in this image in one sentence."
                    }
                ]
            }]
        });
        
        console.log('Image API test successful:', imageResponse.content[0].text);
        
    } catch (error) {
        console.error('API Error:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAPI();