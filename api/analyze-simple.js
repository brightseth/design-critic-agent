const Anthropic = require('@anthropic-ai/sdk');

function generateVariedCritiques() {
  const jobsCritiques = [
    [
      { type: 'negative', text: 'This design tries to do everything and therefore does nothing well. Focus on ONE primary action.' },
      { type: 'positive', text: 'The color palette shows restraint - this is good.' },
      { type: 'negative', text: 'Users shouldn\'t have to think about what to do next. Make it obvious.' }
    ],
    [
      { type: 'positive', text: 'Clean typography choice - it doesn\'t compete with the content.' },
      { type: 'negative', text: 'Too many visual layers. Strip away everything that doesn\'t serve the core purpose.' },
      { type: 'neutral', text: 'Remember: simplicity is not about less, it\'s about better.' }
    ],
    [
      { type: 'negative', text: 'This feels like a committee designed it. Where\'s the soul, the emotional connection?' },
      { type: 'positive', text: 'Good use of contrast to guide attention.' },
      { type: 'negative', text: 'Innovation means saying no to a thousand things. What are you saying no to here?' }
    ],
    [
      { type: 'positive', text: 'The layout has breathing room - it doesn\'t feel cramped.' },
      { type: 'negative', text: 'Every element should earn its place. Several here feel decorative rather than functional.' },
      { type: 'neutral', text: 'Think different: how would you solve this with half the elements?' }
    ]
  ];

  const maedaCritiques = [
    [
      { type: 'neutral', text: 'REDUCE: Count your elements. Can you achieve the same goal with fewer?' },
      { type: 'negative', text: 'ORGANIZE: Related items aren\'t grouped logically - proximity creates relationships.' },
      { type: 'positive', text: 'TIME: Loading appears fast, good for user patience.' }
    ],
    [
      { type: 'positive', text: 'LEARN: The interface feels learnable - good use of familiar patterns.' },
      { type: 'negative', text: 'DIFFERENCES: Important elements don\'t stand out enough from less important ones.' },
      { type: 'neutral', text: 'CONTEXT: Consider how this will be used - desktop? mobile? different mindsets.' }
    ],
    [
      { type: 'negative', text: 'EMOTION: This design feels mechanical. Where\'s the human warmth?' },
      { type: 'positive', text: 'TRUST: Consistent spacing builds confidence in the system.' },
      { type: 'neutral', text: 'FAILURE: What happens when something goes wrong? Plan for edge cases.' }
    ],
    [
      { type: 'neutral', text: 'THE ONE: What\'s the single most important thing here? Everything else should support it.' },
      { type: 'positive', text: 'REDUCE: Good restraint in color usage - less is more powerful.' },
      { type: 'negative', text: 'ORGANIZE: Information hierarchy needs work - use size, weight, and position.' }
    ]
  ];

  const airbnbCritiques = [
    [
      { type: 'negative', text: 'This doesn\'t feel welcoming. First impressions matter - how do you make someone feel at home?' },
      { type: 'positive', text: 'Nice use of rounded corners - they feel friendlier than sharp edges.' },
      { type: 'neutral', text: 'Consider adding more human elements - faces, stories, personal touches.' }
    ],
    [
      { type: 'positive', text: 'Good accessibility considerations in color contrast.' },
      { type: 'negative', text: 'The tone feels corporate. How can you make this more conversational?' },
      { type: 'neutral', text: 'Trust is built through consistency - ensure your spacing and alignment are perfect.' }
    ],
    [
      { type: 'neutral', text: 'Think global: how does this work for different cultures and languages?' },
      { type: 'positive', text: 'Clear calls-to-action help users feel confident about next steps.' },
      { type: 'negative', text: 'Missing emotional hooks - what makes people excited to engage?' }
    ]
  ];

  const instagramCritiques = [
    [
      { type: 'negative', text: 'Would this stop the scroll? The visual hook isn\'t strong enough for social media.' },
      { type: 'positive', text: 'Good mobile-first thinking - thumb-friendly interaction zones.' },
      { type: 'neutral', text: 'Content should be the hero. Is your UI competing or supporting?' }
    ],
    [
      { type: 'positive', text: 'Fast visual scan - users can process this quickly.' },
      { type: 'negative', text: 'Needs more visual punch for shareability. What makes this Instagram-worthy?' },
      { type: 'neutral', text: 'Think in stories: how does this connect to people\'s personal narratives?' }
    ],
    [
      { type: 'neutral', text: 'Micro-interactions could add delight - small moments that make people smile.' },
      { type: 'positive', text: 'Clean, uncluttered approach works well for focus.' },
      { type: 'negative', text: 'Missing that \'wow\' factor. What makes this special or memorable?' }
    ]
  ];

  const iveCritiques = [
    [
      { type: 'negative', text: 'The materials don\'t feel honest. What is this interface trying to be?' },
      { type: 'positive', text: 'Edges and transitions show attention to craft.' },
      { type: 'neutral', text: 'Consider the relationship between form and function - is every detail purposeful?' }
    ],
    [
      { type: 'positive', text: 'Good understanding of negative space as a design element.' },
      { type: 'negative', text: 'Some details feel applied rather than integral to the design.' },
      { type: 'neutral', text: 'The best design disappears - does this feel inevitable or constructed?' }
    ],
    [
      { type: 'neutral', text: 'Think about the object\'s essence - strip away everything that isn\'t essential to its being.' },
      { type: 'positive', text: 'Thoughtful proportions create a sense of quality.' },
      { type: 'negative', text: 'The surface treatment could be more refined - it\'s in the details that quality is felt.' }
    ]
  ];

  // Randomly select one critique set from each expert
  const selectedJobsCritique = jobsCritiques[Math.floor(Math.random() * jobsCritiques.length)];
  const selectedMaedaCritique = maedaCritiques[Math.floor(Math.random() * maedaCritiques.length)];
  const selectedAirbnbCritique = airbnbCritiques[Math.floor(Math.random() * airbnbCritiques.length)];
  const selectedInstagramCritique = instagramCritiques[Math.floor(Math.random() * instagramCritiques.length)];
  const selectedIveCritique = iveCritiques[Math.floor(Math.random() * iveCritiques.length)];

  return [
    {
      name: 'Steve Jobs',
      avatar: 'SJ',
      title: 'Simplicity & Focus',
      focus: 'Examining the soul and emotional impact of your design',
      score: Math.floor(Math.random() * 25) + 70,
      points: selectedJobsCritique
    },
    {
      name: 'John Maeda',
      avatar: 'JM',
      title: 'Laws of Simplicity',
      focus: 'Systematically applying the 10 Laws of Simplicity',
      score: Math.floor(Math.random() * 25) + 75,
      points: selectedMaedaCritique
    },
    {
      name: 'Airbnb Design',
      avatar: 'AB',
      title: 'Human Connection',
      focus: 'Evaluating trust, belonging, and inclusive design',
      score: Math.floor(Math.random() * 25) + 70,
      points: selectedAirbnbCritique
    },
    {
      name: 'Instagram Aesthetic',
      avatar: 'IG',
      title: 'Visual Impact',
      focus: 'Analyzing thumb-stopping power and social engagement',
      score: Math.floor(Math.random() * 25) + 65,
      points: selectedInstagramCritique
    },
    {
      name: 'Jony Ive',
      avatar: 'JI',
      title: 'Craft & Detail',
      focus: 'Examining materiality, craft, and purposeful details',
      score: Math.floor(Math.random() * 25) + 75,
      points: selectedIveCritique
    }
  ];
}

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

  // Generate varied critiques from different expert pools
  const mockCritiques = generateVariedCritiques();

  return {
    critique: mockCritiques,
    scores: {
      simplicity: mockCritiques[0].score,
      usability: mockCritiques[1].score, 
      emotion: Math.floor(Math.random() * 30) + 70,
      craft: Math.floor(Math.random() * 30) + 70
    },
    recommendations: [
      {
        priority: 'high',
        title: 'Simplify Visual Hierarchy',
        description: 'Reduce competing elements and establish clearer focal points for better user guidance.'
      }
    ]
  };

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
    console.error('Claude API error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      stack: error.stack
    });
    
    return {
      critique: [{
        name: 'API Error',
        avatar: 'ER',
        title: 'Connection Issue',
        focus: 'Troubleshooting API connection',
        score: 0,
        points: [
          { type: 'negative', text: `Error: ${error.message}` },
          { type: 'negative', text: `Status: ${error.status || 'Unknown'}` },
          { type: 'negative', text: `Type: ${error.type || 'Unknown'}` },
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
  console.log('Request size (approx):', JSON.stringify(req.body).length);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, imageUrl } = req.body;
    
    // Check payload size
    if (imageData && imageData.length > 2 * 1024 * 1024) { // 2MB limit for base64
      return res.status(413).json({ 
        error: 'Image too large',
        message: 'Please compress your image to under 1MB before uploading' 
      });
    }
    
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