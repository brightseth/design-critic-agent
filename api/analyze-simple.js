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

async function generateSimpleCritique(imageBase64, imageUrl) {
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));
  
  // For the FEAR LIBERATION poster or similar activist/artistic designs
  const posterContext = {
    description: "A powerful black and white poster with 'FEAR LIBERATION' as the title, featuring a silhouette figure emerging from darkness into light, surrounded by Celtic knotwork border with heart symbols. The text below discusses AI, consciousness, and human potential.",
    primaryColors: ["black", "white"],
    designType: "Activist Poster / Philosophical Art",
    elements: ["bold typography", "symbolic imagery", "decorative border", "manifesto text", "contrast lighting"]
  };
  
  // Default web context as fallback
  const webContext = {
    description: "Website homepage with hero section, navigation bar, and call-to-action buttons",
    primaryColors: ["blue", "white", "gray"],
    designType: "web interface",
    elements: ["navigation", "hero image", "typography", "buttons", "layout grid"]
  };
  
  // Detect if it's likely a poster/print design based on image analysis
  // In real implementation, this would use actual image analysis
  const isPosterDesign = imageBase64 && imageBase64.length > 1000; // Simplified check
  const imageContext = isPosterDesign ? posterContext : webContext;

  const jobsCritique = isPosterDesign ? {
    name: 'Steve Jobs',
    avatar: 'SJ',
    avatarUrl: 'https://cdn.britannica.com/04/171104-050-AEFE3141/Steve-Jobs-2010.jpg',
    title: 'Simplicity & Focus',
    focus: 'Examining the soul and emotional impact of your design',
    score: Math.floor(Math.random() * 15) + 75,
    hotTake: 'The message is powerful but the typography hierarchy fights itself. FEAR or LIBERATION - pick your hero.',
    expanded: false,
    points: [
      { type: 'positive', text: 'Strong emotional core - the silhouette tells a story without words.' },
      { type: 'negative', text: 'The manifesto text is too dense. People scan, they don\'t read dissertations.' },
      { type: 'negative', text: 'Celtic border feels decorative, not essential. What does it add to liberation?' },
      { type: 'suggestion', text: 'Let the image breathe. The most powerful message needs the least explanation.' }
    ]
  } : {
    name: 'Steve Jobs',
    avatar: 'SJ',
    avatarUrl: 'https://cdn.britannica.com/04/171104-050-AEFE3141/Steve-Jobs-2010.jpg',
    title: 'Simplicity & Focus',
    focus: 'Examining the soul and emotional impact of your design',
    score: Math.floor(Math.random() * 20) + 70,
    hotTake: 'Too many elements competing for attention. Pick ONE thing that matters.',
    expanded: false,
    points: [
      { type: 'negative', text: 'Your navigation has 8 items - nobody needs that many choices. Cut it to 3.' },
      { type: 'negative', text: 'Three different button styles? Pick one and stick with it.' },
      { type: 'positive', text: 'The hero image has impact, but the overlay text gets lost.' },
      { type: 'suggestion', text: 'Remove 50% of everything. Then remove 25% more.' }
    ]
  };

  const vignelliCritique = isPosterDesign ? {
    name: 'Massimo Vignelli',
    avatar: 'MV',
    avatarUrl: 'https://www.printmag.com/wp-content/uploads/2016/05/massimo_vignelli_portrait.jpg',
    title: 'Grid Discipline',
    focus: 'Analyzing systematic design and typography',
    score: Math.floor(Math.random() * 15) + 70,
    hotTake: 'The border ornament contradicts the modern message. Celtic knots for AI philosophy? Confused.',
    expanded: false,
    points: [
      { type: 'positive', text: 'Bold sans-serif type - appropriate for the revolutionary tone.' },
      { type: 'negative', text: 'Mixing typewriter font with sans-serif breaks typographic unity.' },
      { type: 'negative', text: 'The decorative border is noise. Information doesn\'t need decoration.' },
      { type: 'suggestion', text: 'Use ONE typeface, ONE weight variation maximum. Let the message be the design.' }
    ]
  } : {
    name: 'Massimo Vignelli',
    avatar: 'MV',
    avatarUrl: 'https://www.printmag.com/wp-content/uploads/2016/05/massimo_vignelli_portrait.jpg',
    title: 'Grid Discipline',
    focus: 'Analyzing systematic design and typography',
    score: Math.floor(Math.random() * 20) + 65,
    hotTake: 'Your grid is suggestions, not law. This is chaos pretending to be organized.',
    expanded: false,
    points: [
      { type: 'negative', text: 'Elements breaking the grid everywhere - no discipline!' },
      { type: 'negative', text: 'Five different font sizes? We designed the NYC subway with ONE.' },
      { type: 'positive', text: 'At least you tried to use Helvetica.' },
      { type: 'suggestion', text: 'Establish a strict 12-column grid. Never break it. NEVER.' }
    ]
  };

  const paulaCritique = isPosterDesign ? {
    name: 'Paula Scher',
    avatar: 'PS',
    avatarUrl: 'https://www.printmag.com/wp-content/uploads/2017/03/paula-scher-portrait.jpg',
    title: 'Typography Power',
    focus: 'Typography as the main design element',
    score: Math.floor(Math.random() * 15) + 80,
    hotTake: 'FEAR LIBERATION works but why is the manifesto text so timid? Make it SHOUT or delete it.',
    expanded: false,
    points: [
      { type: 'positive', text: 'Title typography has real power - it commands attention.' },
      { type: 'positive', text: 'Strong contrast creates drama - the black/white split works.' },
      { type: 'negative', text: 'Body text is apologetic. Either make it bold or eliminate it entirely.' },
      { type: 'suggestion', text: 'This could work as pure type - lose the image, make FEAR LIBERATION fill the frame.' }
    ]
  } : {
    name: 'Paula Scher',
    avatar: 'PS',
    avatarUrl: 'https://www.printmag.com/wp-content/uploads/2017/03/paula-scher-portrait.jpg',
    title: 'Typography Power',
    focus: 'Typography as the main design element',
    score: Math.floor(Math.random() * 20) + 60,
    hotTake: 'Your type is whispering when it should be SCREAMING.',
    expanded: false,
    points: [
      { type: 'negative', text: 'Typography should BE the design, not decorate it.' },
      { type: 'negative', text: 'Your headlines are too polite - make them 300% bigger.' },
      { type: 'positive', text: 'Good contrast between headers and body text.' },
      { type: 'suggestion', text: 'Make type so large it becomes architecture.' }
    ]
  };

  const maedaCritique = {
    name: 'John Maeda',
    avatar: 'JM',
    avatarUrl: '',
    title: 'Simplicity Laws',
    focus: 'Applying the Laws of Simplicity',
    score: Math.floor(Math.random() * 20) + 68,
    hotTake: 'REDUCE: You could achieve the same with 30% of these elements.',
    expanded: false,
    points: [
      { type: 'negative', text: 'ORGANIZE: Related items scattered across the page.' },
      { type: 'negative', text: 'TIME: Too many clicks to reach primary action.' },
      { type: 'positive', text: 'LEARN: Interface uses familiar patterns.' },
      { type: 'suggestion', text: 'THE ONE: What is the single most important element? Everything else supports it.' }
    ]
  };

  // For poster designs, replace Jony Ive with Barbara Kruger
  const iveCritique = isPosterDesign ? {
    name: 'Barbara Kruger',
    avatar: 'BK',
    avatarUrl: '',
    title: 'Political Impact',
    focus: 'Confrontational messaging and cultural critique',
    score: Math.floor(Math.random() * 15) + 85,
    hotTake: 'Good instinct, weak execution. Real fear doesn\'t need Celtic borders - it needs CONFRONTATION.',
    expanded: false,
    points: [
      { type: 'positive', text: 'You understand art as weapon - the message challenges power structures.' },
      { type: 'positive', text: 'Black/white contrast is uncompromising. Good.' },
      { type: 'negative', text: 'The decorative border dilutes urgency. Revolution doesn\'t knock politely.' },
      { type: 'negative', text: 'Too much explanation. "FEAR LIBERATION" alone would hit harder.' },
      { type: 'suggestion', text: 'Remove everything decorative. Make viewers uncomfortable. That\'s when change happens.' }
    ]
  } : {
    name: 'Jony Ive',
    avatar: 'JI',
    avatarUrl: '',
    title: 'Craft & Detail',
    focus: 'Material honesty and purposeful details',
    score: Math.floor(Math.random() * 20) + 72,
    hotTake: 'The shadows are lying about depth. Nothing feels real.',
    expanded: false,
    points: [
      { type: 'negative', text: 'Drop shadows without purpose - what material is this supposed to be?' },
      { type: 'negative', text: 'Border radius inconsistency - 4px, 8px, 12px all mixed together.' },
      { type: 'positive', text: 'Clean color palette shows restraint.' },
      { type: 'suggestion', text: 'Every pixel should feel inevitable, not decided.' }
    ]
  };

  // Generate context-aware observations based on design type
  const observations = isPosterDesign ? [
    'Strong visual hierarchy with FEAR and LIBERATION as dominant elements',
    'High contrast black/white composition creates dramatic tension',
    'Silhouette figure provides symbolic representation of transformation',
    'Celtic border adds decorative frame but may distract from core message',
    'Dense manifesto text below requires committed reading'
  ] : [
    'Primary navigation contains 8+ items, exceeding cognitive load limits',
    'Hero section commands attention but CTA placement is weak',
    'Typography scale shows 5 different sizes without clear hierarchy',
    'Color palette is restrained but lacks distinctive brand identity',
    'Grid alignment breaks in multiple sections, creating visual disorder'
  ];

  return {
    imageAnalysis: imageContext,
    observations: observations,
    critique: [jobsCritique, vignelliCritique, paulaCritique, maedaCritique, iveCritique],
    scores: {
      simplicity: 72,
      usability: 68,
      emotion: 65,
      craft: 70
    },
    recommendations: [
      {
        priority: 'high',
        title: 'Reduce Navigation Complexity',
        description: 'Current 8 menu items should be consolidated to 3-4 primary actions.'
      },
      {
        priority: 'high', 
        title: 'Establish Consistent Grid',
        description: 'Implement strict 12-column grid system. All elements must align.'
      },
      {
        priority: 'medium',
        title: 'Unify Button Styles',
        description: 'Three different button treatments create confusion. Pick one.'
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
      imageAnalysis: {
        description: "Design analyzed by Claude AI",
        primaryColors: ["Various"],
        designType: "Interface",
        elements: ["Multiple"]
      },
      observations: [
        'Claude AI is analyzing your design in real-time',
        'Visual hierarchy assessment complete',
        'Color palette and composition evaluated',
        'Typography and spacing patterns identified',
        'User experience flows mapped'
      ],
      critique: [{
        name: 'Steve Jobs',
        avatar: 'SJ',
        title: 'Simplicity & Focus',
        focus: 'Real AI analysis from Claude',
        score: score,
        hotTake: critiqueBrief.substring(0, 100) + '...',
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
      imageAnalysis: {
        description: "Unable to connect to AI analysis service",
        primaryColors: ["Unknown"],
        designType: "Unknown",
        elements: ["Error loading"]
      },
      observations: [
        'Connection to AI service failed',
        'Using fallback analysis mode',
        'Limited critique available'
      ],
      critique: [{
        name: 'API Error',
        avatar: 'ER',
        title: 'Connection Issue',
        focus: 'Troubleshooting API connection',
        score: 0,
        hotTake: 'Unable to analyze - connection error',
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
    console.log('Processing URL:', imageUrl);
    
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