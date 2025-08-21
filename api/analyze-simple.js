const Anthropic = require('@anthropic-ai/sdk');

// Photography Critics Panel (Past 50 years)
function getPhotographyCritics(imageBase64) {
  const critics = [
    {
      name: 'Susan Sontag',
      avatar: 'SS',
      title: 'Cultural Criticism',
      focus: 'Photography as cultural artifact and moral document',
      score: Math.floor(Math.random() * 20) + 70,
      acknowledgment: 'I see a photograph that attempts to capture more than surface - there\'s an ethical dimension here.',
      hotTake: 'The image participates in the ethics of seeing. What violence does this frame commit?',
      points: [
        { type: 'strength', text: 'The frame acknowledges its own construction - honest about its artifice.' },
        { type: 'weakness', text: 'Too comfortable with surface beauty, not enough interrogation of power.' },
        { type: 'suggestion', text: 'Photography is not about capturing reality but about creating new ways of seeing.' }
      ]
    },
    {
      name: 'Annie Leibovitz',
      avatar: 'AL',
      title: 'Portrait Master',
      focus: 'Intimate storytelling through environmental context',
      score: Math.floor(Math.random() * 20) + 75,
      acknowledgment: 'Looking at your image, I see an attempt to capture human essence within a meaningful context.',
      hotTake: 'The environment tells half the story, but where\'s the soul in the eyes?',
      points: [
        { type: 'strength', text: 'Good use of natural light creates authentic mood.' },
        { type: 'weakness', text: 'The subject feels posed rather than revealed. Let them breathe.' },
        { type: 'suggestion', text: 'Spend more time with your subject before shooting. Trust emerges in the waiting.' }
      ]
    },
    {
      name: 'Henri Cartier-Bresson',
      avatar: 'HCB',
      title: 'Decisive Moment',
      focus: 'Geometry, timing, and the perfect instant',
      score: Math.floor(Math.random() * 20) + 68,
      hotTake: 'You caught A moment, but was it THE moment? The geometry says no.',
      points: [
        { type: 'negative', text: 'The golden ratio is broken - your lines fight each other.' },
        { type: 'positive', text: 'Good instinct for human gesture, but timing is slightly off.' },
        { type: 'suggestion', text: 'Wait. Always wait. The decisive moment comes to those who observe.' }
      ]
    },
    {
      name: 'Diane Arbus',
      avatar: 'DA',
      title: 'Psychological Depth',
      focus: 'Finding the strange in the familiar',
      score: Math.floor(Math.random() * 20) + 72,
      hotTake: 'Too safe. Where\'s the discomfort that makes us question normalcy?',
      points: [
        { type: 'positive', text: 'There\'s tension here, something unsaid beneath the surface.' },
        { type: 'negative', text: 'You\'re photographing from outside looking in. Get closer.' },
        { type: 'suggestion', text: 'The best photographs make the ordinary feel alien.' }
      ]
    },
    {
      name: 'Richard Avedon',
      avatar: 'RA',
      title: 'Stark Revelation',
      focus: 'Stripping away context to reveal essence',
      score: Math.floor(Math.random() * 20) + 74,
      hotTake: 'All that background noise - the subject is drowning in context.',
      points: [
        { type: 'negative', text: 'Too much environment dilutes the psychological impact.' },
        { type: 'positive', text: 'Sharp focus reveals texture and character.' },
        { type: 'suggestion', text: 'Try white backgrounds. Let the face be the only landscape.' }
      ]
    },
    {
      name: 'Sebastião Salgado',
      avatar: 'SaS',
      title: 'Epic Documentation',
      focus: 'Humanity and dignity in challenging conditions',
      score: Math.floor(Math.random() * 20) + 80,
      hotTake: 'Beautiful suffering is still exploitation. Where\'s the subject\'s agency?',
      points: [
        { type: 'positive', text: 'The composition gives dignity to difficult subject matter.' },
        { type: 'negative', text: 'Aestheticizing hardship can distance us from action.' },
        { type: 'suggestion', text: 'Document with respect. The camera is not neutral.' }
      ]
    },
    {
      name: 'Cindy Sherman',
      avatar: 'CS',
      title: 'Constructed Identity',
      focus: 'Photography as performance and fiction',
      score: Math.floor(Math.random() * 20) + 77,
      hotTake: 'This pretends to be truth when it should embrace its artifice.',
      points: [
        { type: 'positive', text: 'The staging reveals something about representation itself.' },
        { type: 'negative', text: 'Not enough self-awareness about the construction.' },
        { type: 'suggestion', text: 'Every photograph is a performance. Make that visible.' }
      ]
    },
    {
      name: 'Stephen Shore',
      avatar: 'StS',
      title: 'American Vernacular',
      focus: 'Finding art in everyday American landscapes',
      score: Math.floor(Math.random() * 20) + 71,
      hotTake: 'This wants to be mundane but it\'s trying too hard to be art.',
      points: [
        { type: 'positive', text: 'Good color relationships create visual coherence.' },
        { type: 'negative', text: 'The composition is neither casual nor formal - pick a lane.' },
        { type: 'suggestion', text: 'The banal becomes profound through patient observation.' }
      ]
    },
    {
      name: 'Sally Mann',
      avatar: 'SM',
      title: 'Southern Gothic',
      focus: 'Memory, mortality, and the landscape of the South',
      score: Math.floor(Math.random() * 20) + 76,
      hotTake: 'Pretty decay without the weight of history. Where\'s the haunting?',
      points: [
        { type: 'positive', text: 'The texture and tone evoke genuine atmosphere.' },
        { type: 'negative', text: 'Nostalgia without critique becomes mere romanticism.' },
        { type: 'suggestion', text: 'Let the past bleed through. Photography is always about time.' }
      ]
    },
    {
      name: 'Andreas Gursky',
      avatar: 'AG',
      title: 'Epic Scale',
      focus: 'Contemporary life through massive, detailed tableaux',
      score: Math.floor(Math.random() * 20) + 73,
      hotTake: 'The scale is ambitious but where\'s the critical perspective on capitalism?',
      points: [
        { type: 'positive', text: 'The detail rewards close examination.' },
        { type: 'negative', text: 'Spectacle without critique becomes complicit.' },
        { type: 'suggestion', text: 'Use scale to reveal systems, not just to impress.' }
      ]
    },
    {
      name: 'Nina Roehrs',
      avatar: 'NR',
      title: 'Paris Photo Digital Curator',
      focus: 'Digital transformation, blockchain authentication, Web3 community',
      score: Math.floor(Math.random() * 20) + 75,
      acknowledgment: 'Looking at your work, I\'m considering its potential beyond physical display - its digital life and community.',
      hotTake: 'Strong traditional photography, but where\'s the consideration for digital provenance and Web3 distribution?',
      points: [
        { type: 'strength', text: 'The work has strong visual presence that could translate well to digital formats.' },
        { type: 'weakness', text: 'Missing opportunity to engage with blockchain for authenticity and royalties.' },
        { type: 'suggestion', text: 'Consider how this exists as both physical print and NFT - dual presence strengthens market position.' }
      ]
    }
  ];
  
  // Always include Nina Roehrs first, then add 4 random others
  const nina = critics.find(c => c.name === 'Nina Roehrs');
  const others = critics.filter(c => c.name !== 'Nina Roehrs').sort(() => 0.5 - Math.random()).slice(0, 4);
  return [nina, ...others];
}

// Art Critics & Curators Panel (Past 50 years)
function getArtCritics(imageBase64) {
  const critics = [
    {
      name: 'Jerry Saltz',
      avatar: 'JS',
      title: 'Populist Provocateur',
      focus: 'Art should punch you in the gut',
      score: Math.floor(Math.random() * 20) + 65,
      acknowledgment: 'OK, I\'m looking at your work - I see ambition, I see effort, I see an attempt at meaning.',
      hotTake: 'This is art school clever, not art world smart. Where\'s the FEELING?',
      points: [
        { type: 'weakness', text: 'Too much concept, not enough visual power. Art isn\'t a thesis.' },
        { type: 'strength', text: 'At least you\'re trying something. That\'s more than most.' },
        { type: 'suggestion', text: 'Stop thinking and start feeling. Your brain is killing your art.' }
      ]
    },
    {
      name: 'Roberta Smith',
      avatar: 'RS',
      title: 'Formalist Eye',
      focus: 'Visual intelligence and material honesty',
      score: Math.floor(Math.random() * 20) + 72,
      hotTake: 'The materials are fighting your concept. Let them speak.',
      points: [
        { type: 'positive', text: 'Strong formal relationships create visual tension.' },
        { type: 'negative', text: 'The execution undermines the ambition.' },
        { type: 'suggestion', text: 'Master your materials before attempting transcendence.' }
      ]
    },
    {
      name: 'Hans Ulrich Obrist',
      avatar: 'HUO',
      title: 'Global Connector',
      focus: 'Art as urgent conversation',
      score: Math.floor(Math.random() * 20) + 78,
      hotTake: 'Interesting, but how does this speak to our current moment of crisis?',
      points: [
        { type: 'positive', text: 'The work engages with contemporary urgencies.' },
        { type: 'negative', text: 'Too isolated from global conversations.' },
        { type: 'suggestion', text: 'Art must be a bridge between worlds, not a island.' }
      ]
    },
    {
      name: 'Thelma Golden',
      avatar: 'TG',
      title: 'Cultural Visionary',
      focus: 'Art as cultural production and identity',
      score: Math.floor(Math.random() * 20) + 75,
      hotTake: 'Who is this for? The work needs to know its audience and context.',
      points: [
        { type: 'positive', text: 'The work acknowledges its cultural position.' },
        { type: 'negative', text: 'Not enough consideration of who views and who is excluded.' },
        { type: 'suggestion', text: 'Art happens in culture, not above it.' }
      ]
    },
    {
      name: 'Nicolas Bourriaud',
      avatar: 'NB',
      title: 'Relational Aesthetics',
      focus: 'Art as social interstice',
      score: Math.floor(Math.random() * 20) + 70,
      hotTake: 'This creates objects when it should create situations.',
      points: [
        { type: 'negative', text: 'Too focused on the thing, not the relations it produces.' },
        { type: 'positive', text: 'Some potential for viewer activation.' },
        { type: 'suggestion', text: 'Art\'s value is in the encounters it generates.' }
      ]
    },
    {
      name: 'Okwui Enwezor',
      avatar: 'OE',
      title: 'Postcolonial Lens',
      focus: 'Art as political and historical document',
      score: Math.floor(Math.random() * 20) + 73,
      hotTake: 'The politics are superficial. Where\'s the deep structural critique?',
      points: [
        { type: 'positive', text: 'Attempts to engage with power structures.' },
        { type: 'negative', text: 'Reproduces rather than challenges dominant narratives.' },
        { type: 'suggestion', text: 'Decolonizing isn\'t a gesture, it\'s a practice.' }
      ]
    },
    {
      name: 'Arthur Danto',
      avatar: 'AD',
      title: 'Philosophical Depth',
      focus: 'After the end of art',
      score: Math.floor(Math.random() * 20) + 76,
      hotTake: 'This could have been made in 1917. What makes it necessary NOW?',
      points: [
        { type: 'positive', text: 'Understands that anything can be art in the right context.' },
        { type: 'negative', text: 'But context alone doesn\'t make it good art.' },
        { type: 'suggestion', text: 'The question isn\'t "is it art?" but "why does it matter?"' }
      ]
    },
    {
      name: 'Claire Bishop',
      avatar: 'CB',
      title: 'Participatory Critique',
      focus: 'The social turn and its discontents',
      score: Math.floor(Math.random() * 20) + 69,
      hotTake: 'Participation as decoration. Where\'s the actual agency?',
      points: [
        { type: 'negative', text: 'Invites participation but maintains artist control.' },
        { type: 'positive', text: 'At least acknowledges the viewer as active.' },
        { type: 'suggestion', text: 'True participation means risking authorship.' }
      ]
    },
    {
      name: 'Benjamin Buchloh',
      avatar: 'BB',
      title: 'Institutional Critique',
      focus: 'Art\'s complicity with capital',
      score: Math.floor(Math.random() * 20) + 67,
      hotTake: 'This pretends to critique while seeking market validation.',
      points: [
        { type: 'negative', text: 'The radical gesture is immediately recuperated by the market.' },
        { type: 'negative', text: 'No awareness of its own commodification.' },
        { type: 'suggestion', text: 'True critique must include self-critique.' }
      ]
    },
    {
      name: 'Carolyn Christov-Bakargiev',
      avatar: 'CCB',
      title: 'Expanded Field',
      focus: 'Art in the anthropocene',
      score: Math.floor(Math.random() * 20) + 74,
      hotTake: 'Too human-centered. What about the non-human actors?',
      points: [
        { type: 'positive', text: 'Attempts to think beyond traditional boundaries.' },
        { type: 'negative', text: 'Still trapped in anthropocentric thinking.' },
        { type: 'suggestion', text: 'Art must learn to speak with, not for, the world.' }
      ]
    }
  ];
  
  // Return 5 random critics
  return critics.sort(() => 0.5 - Math.random()).slice(0, 5);
}

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

async function generateSimpleCritique(imageBase64, imageUrl, mode = 'design') {
  console.log('=== generateSimpleCritique called ===');
  console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('API Key preview:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...' : 'none');
  console.log('Critique mode:', mode);
  console.log('Image data length:', imageBase64 ? imageBase64.length : 0);
  console.log('Image data starts with:', imageBase64 ? imageBase64.substring(0, 50) : 'none');
  
  // Try to use real AI vision if we have image data
  if (process.env.ANTHROPIC_API_KEY && imageBase64 && imageBase64.length > 100) {
    console.log('✓ Conditions met for AI vision');
    console.log('Attempting real AI vision analysis...');
    try {
      const realCritique = await getRealAICritique(imageBase64, mode);
      if (realCritique) {
        console.log('✓ Real AI critique generated successfully');
        console.log('AI critique has aiPowered:', realCritique.aiPowered);
        return realCritique;
      }
    } catch (error) {
      console.error('✗ AI Vision failed, using fallback:', error.message);
      console.error('Error type:', error.name);
      console.error('Error status:', error.status);
      if (error.response) {
        console.error('Error response:', error.response);
      }
    }
  } else {
    console.log('✗ Skipping AI vision - conditions not met');
    if (!process.env.ANTHROPIC_API_KEY) console.log('  - Missing API key');
    if (!imageBase64) console.log('  - No image data');
    if (imageBase64 && imageBase64.length <= 100) console.log('  - Image too small:', imageBase64.length);
  }
  
  // Continue with fallback
  return generateSimpleCritiqueFallback(imageBase64, imageUrl, mode);
}


async function getRealAICritique(imageBase64, mode = 'design') {
  console.log('=== getRealAICritique called ===');
  console.log('Mode:', mode);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('No API key found!');
    throw new Error('No API key configured');
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    // Ensure we have clean base64 data
    if (imageBase64.includes(',')) {
      imageBase64 = imageBase64.split(',')[1];
    }
    
    console.log('Calling Claude Vision API...');
    console.log('Base64 data length:', imageBase64.length);
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key preview:', process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...');
    
    // Auto-detect mode if set to 'auto'
    let detectedMode = mode;
    if (mode === 'auto') {
      // First, ask Claude to identify the type of image
      const detectPrompt = `Look at this image and determine if it is:
1. A photograph (photo taken with a camera)
2. A design (UI, web design, poster, branding, etc.)
3. An artwork (painting, illustration, sculpture, etc.)

Respond with just one word: "photography", "design", or "art"`;

      const detectResponse = await anthropic.messages.create({
        model: "claude-3-haiku-20240307", // Use faster model for detection
        max_tokens: 10,
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
              text: detectPrompt
            }
          ]
        }]
      });
      
      const detection = detectResponse.content[0].text.toLowerCase();
      if (detection.includes('photo')) {
        detectedMode = 'photo';
      } else if (detection.includes('art')) {
        detectedMode = 'art';
      } else {
        detectedMode = 'design';
      }
      
      console.log('Auto-detected mode:', detectedMode);
    }
    
    // Create mode-specific prompts
    let systemPrompt = '';
    let experts = [];
    
    if (detectedMode === 'photo') {
      systemPrompt = `You are a panel of master photographers analyzing an image. 
FIRST, describe exactly what you see in the image - the subject matter, objects, people, setting, colors, composition.
THEN provide:
1. Technical analysis (composition, light, color, focus)
2. Emotional/narrative assessment
3. Strengths and weaknesses
4. Specific improvement suggestions
Format as JSON with: description (detailed description of what's visible in the image), observations (array of 3 specific things about THIS image), strengths (array), weaknesses (array), suggestions (array)`;
      experts = ['Nina Roehrs', 'Henri Cartier-Bresson', 'Annie Leibovitz'];
    } else if (detectedMode === 'art') {
      systemPrompt = `You are a panel of art critics analyzing an artwork.
FIRST, describe exactly what you see - the medium, subject matter, visual elements, colors, style, technique.
THEN provide:
1. Conceptual analysis
2. Technical execution assessment
3. Cultural/historical context
4. Strengths and weaknesses
Format as JSON with: description (detailed description of what's visible), observations (array of 3 specific things about THIS artwork), strengths (array), weaknesses (array), suggestions (array)`;
      experts = ['Jerry Saltz', 'Roberta Smith', 'Hans Ulrich Obrist'];
    } else {
      systemPrompt = `You are a panel of design experts analyzing a design.
FIRST, describe exactly what you see - the type of design (web, app, poster, etc), layout, colors, typography, images, UI elements.
THEN provide:
1. Visual hierarchy and composition analysis
2. Typography and color assessment
3. Usability observations
4. Strengths and weaknesses
Format as JSON with: description (detailed description of what's visible), observations (array of 3 specific things about THIS design), strengths (array), weaknesses (array), suggestions (array)`;
      experts = ['Steve Jobs', 'Massimo Vignelli', 'Paula Scher'];
    }
    
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg", // Claude accepts JPEG, PNG, GIF, WebP
              data: imageBase64
            }
          },
          {
            type: "text",
            text: systemPrompt
          }
        ]
      }]
    });

    console.log('Claude API response received');
    console.log('Response type:', typeof response);
    console.log('Response has content:', !!response.content);
    
    // Parse the response
    let analysis;
    try {
      // Try to parse as JSON first
      const responseText = response.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);  
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback to text parsing
        analysis = {
          description: responseText.substring(0, 200),
          observations: ['AI analysis complete', 'Visual elements identified', 'Critique generated'],
          strengths: ['Strong visual impact'],
          weaknesses: ['Areas for improvement identified'],
          suggestions: ['See detailed critique below']
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = {
        description: message.content[0].text.substring(0, 200),
        observations: ['AI analysis complete', 'Visual elements identified', 'Critique generated'],
        strengths: ['Analysis provided'],
        weaknesses: ['See detailed feedback'],
        suggestions: ['Review expert critiques']
      };
    }
    
    // Generate critiques from different expert perspectives
    const critiques = experts.map((expertName, index) => {
      const score = Math.floor(Math.random() * 20) + 70;
      return {
        name: expertName,
        avatar: expertName.split(' ').map(n => n[0]).join(''),
        title: getExpertTitle(expertName),
        focus: 'Real AI-powered analysis',
        score: score,
        acknowledgment: `Looking at your ${mode === 'photo' ? 'photograph' : mode === 'art' ? 'artwork' : 'design'}, I see ${analysis.description?.substring(0, 100) || 'interesting visual choices'}...`,
        hotTake: analysis.observations?.[index] || `${expertName} sees potential but demands more.`,
        points: [
          { type: 'strength', text: analysis.strengths?.[index] || analysis.strengths?.[0] || 'Strong foundation evident' },
          { type: 'weakness', text: analysis.weaknesses?.[index] || analysis.weaknesses?.[0] || 'Execution needs refinement' },
          { type: 'suggestion', text: analysis.suggestions?.[index] || analysis.suggestions?.[0] || 'Push further with your concept' }
        ]
      };
    });
    
    // Add 2 more mock critics for variety
    if (mode === 'photo') {
      critiques.push(...getPhotographyCritics(imageBase64).slice(3, 5));
    } else if (mode === 'art') {
      critiques.push(...getArtCritics(imageBase64).slice(3, 5));
    } else {
      critiques.push(...generateVariedCritiques().slice(3, 5));
    }
    
    return {
      imageAnalysis: {
        description: analysis.description || 'AI analysis complete',
        primaryColors: ['Analyzed'],
        designType: detectedMode.charAt(0).toUpperCase() + detectedMode.slice(1),
        detectedMode: detectedMode, // Include what type was detected
        elements: analysis.observations?.slice(0, 3) || ['Visual elements', 'Composition', 'Technical aspects']
      },
      observations: analysis.observations?.slice(0, 3) || [
        'AI vision analysis complete',
        'Key visual elements identified',
        'Expert critiques generated'
      ],
      critique: critiques,
      scores: {
        [mode === 'photo' ? 'composition' : mode === 'art' ? 'concept' : 'simplicity']: Math.floor(Math.random() * 20) + 70,
        [mode === 'photo' ? 'narrative' : mode === 'art' ? 'execution' : 'impact']: Math.floor(Math.random() * 20) + 65,
        [mode === 'photo' ? 'technical' : mode === 'art' ? 'relevance' : 'usability']: Math.floor(Math.random() * 20) + 75
      },
      recommendations: generateModeRecommendations(analysis, mode),
      aiPowered: true
    };

  } catch (error) {
    console.error('=== CLAUDE API ERROR IN getRealAICritique ===');
    console.error('Error message:', error.message);
    console.error('Error type:', error.name);
    console.error('Error status:', error.status);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    // Check for common issues
    if (error.message && error.message.toLowerCase().includes('credit')) {
      console.error('⚠️ API CREDITS ISSUE - Please check Claude account balance');
    }
    if (error.status === 401) {
      console.error('⚠️ AUTHENTICATION ERROR - API key may be invalid');
    }
    if (error.status === 413) {
      console.error('⚠️ IMAGE TOO LARGE - Need to compress image');
    }
    
    throw error;
  }
}

function getExpertTitle(name) {
  const titles = {
    'Steve Jobs': 'Simplicity & Soul',
    'Massimo Vignelli': 'Grid Discipline', 
    'Paula Scher': 'Typography Power',
    'Henri Cartier-Bresson': 'Decisive Moment',
    'Annie Leibovitz': 'Environmental Portrait',
    'Sebastião Salgado': 'Epic Documentation',
    'Nina Roehrs': 'Digital Transformation',
    'Jerry Saltz': 'Democratic Critique',
    'Roberta Smith': 'Formalist Eye',
    'Hans Ulrich Obrist': 'Global Dialogue'
  };
  return titles[name] || 'Expert Analysis';
}

function generateModeRecommendations(analysis, mode) {
  const recommendations = [];
  
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    analysis.suggestions.slice(0, 3).forEach((suggestion, index) => {
      recommendations.push({
        category: mode === 'photo' ? ['Composition', 'Technical', 'Narrative'][index] : 
                  mode === 'art' ? ['Concept', 'Execution', 'Context'][index] :
                  ['Visual', 'Typography', 'Layout'][index],
        priority: index === 0 ? 'high' : 'medium',
        title: suggestion.substring(0, 50),
        description: suggestion
      });
    });
  }
  
  return recommendations;
}

// Fallback function when AI is not available
async function generateSimpleCritiqueFallback(imageBase64, imageUrl, mode = 'design') {
  console.log('Using intelligent fallback critiques for mode:', mode);
    
  if (mode === 'photo') {
    // Photography mode fallback
    const critics = getPhotographyCritics(imageBase64);
    return {
      imageAnalysis: {
        description: "Analyzing photographic composition, light, and narrative",
        primaryColors: ["Various"],
        designType: "Photography",
        elements: ["Composition", "Light", "Subject", "Moment"]
      },
      observations: [
        'Examining photographic composition and framing',
        'Analyzing light quality and emotional narrative',
        'Assessing technical execution and moment capture'
      ],
      critique: critics,
      scores: {
        composition: Math.floor(Math.random() * 20) + 70,
        narrative: Math.floor(Math.random() * 20) + 65,
        technical: Math.floor(Math.random() * 20) + 70
      },
      recommendations: [
        {
          category: 'Composition',
          priority: 'high',
          title: 'Strengthen Visual Balance',
          description: 'Consider rule of thirds and leading lines to guide the viewer\'s eye'
        },
        {
          category: 'Technical',
          priority: 'medium',
          title: 'Improve Sharpness',
          description: 'Focus on critical areas needs refinement for professional quality'
        },
        {
          category: 'Narrative',
          priority: 'high',
          title: 'Clarify Story',
          description: 'The emotional core needs stronger visual expression'
        }
      ],
      aiPowered: false // Mark as fallback
    };
  } else if (mode === 'art') {
    // Art mode fallback
    const critics = getArtCritics(imageBase64);
    return {
      imageAnalysis: {
        description: "Analyzing artistic concept, execution, and cultural relevance",
        primaryColors: ["Various"],
        designType: "Contemporary Art",
        elements: ["Concept", "Material", "Context", "Impact"]
      },
      observations: [
        'Evaluating conceptual framework and artistic intent',
        'Analyzing material choices and cultural context',
        'Assessing innovation and contribution to discourse'
      ],
      critique: critics,
      scores: {
        concept: Math.floor(Math.random() * 20) + 65,
        execution: Math.floor(Math.random() * 20) + 70,
        relevance: Math.floor(Math.random() * 20) + 68
      },
      recommendations: [
        {
          category: 'Concept',
          priority: 'high',
          title: 'Deepen Conceptual Framework',
          description: 'Push beyond surface interpretation to engage with deeper meaning'
        },
        {
          category: 'Execution',
          priority: 'medium',
          title: 'Refine Material Choices',
          description: 'Consider how materials can better support your conceptual intent'
        },
        {
          category: 'Context',
          priority: 'high',
          title: 'Engage Contemporary Discourse',
          description: 'Connect more explicitly with current cultural conversations'
        }
      ],
      aiPowered: false // Mark as fallback
    };
  } else {
    // Design mode fallback (existing logic from lines 463-673)
    const critiques = generateVariedCritiques();
    return {
      imageAnalysis: {
        description: "Website homepage with hero section, navigation bar, and call-to-action buttons",
        primaryColors: ["blue", "white", "gray"],
        designType: "web interface",
        elements: ["navigation", "hero image", "typography", "buttons", "layout grid"]
      },
      observations: [
        'Primary navigation contains multiple items',
        'Hero section commands attention with CTA placement',
        'Typography scale shows hierarchy',
        'Color palette is restrained',
        'Grid alignment visible in sections'
      ],
      critique: critiques,
      scores: {
        simplicity: 72,
        impact: 68,
        usability: 75
      },
      recommendations: [
        {
          priority: 'high',
          title: 'Reduce Navigation Complexity',
          description: 'Consolidate menu items to 3-4 primary actions.'
        },
        {
          priority: 'high', 
          title: 'Establish Consistent Grid',
          description: 'Implement strict 12-column grid system.'
        },
        {
          priority: 'medium',
          title: 'Unify Button Styles',
          description: 'Use consistent button treatment throughout.'
        }
      ],
      aiPowered: false // Mark as fallback
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
    const { imageData, imageUrl, mode = 'design' } = req.body;
    console.log('Processing URL:', imageUrl);
    console.log('Mode:', mode);
    
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
    
    // Always use generateSimpleCritique which will try AI first, then fallback
    const result = await generateSimpleCritique(imageBase64, imageUrl, mode);
    
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