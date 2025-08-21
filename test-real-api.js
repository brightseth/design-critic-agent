const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

async function testRealAPI() {
    console.log('Testing real API with proper image...');
    
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create a valid test image (1x1 red pixel PNG)
    const validImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

    try {
        console.log('Sending request to Claude...');
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 500,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/png",
                            data: validImage
                        }
                    },
                    {
                        type: "text",
                        text: "Describe this image in one sentence."
                    }
                ]
            }]
        });
        
        console.log('Success! Response:', response.content[0].text);
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

testRealAPI();