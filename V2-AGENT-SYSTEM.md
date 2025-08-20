# Design Critic Agent System - Version 2 Documentation

## Overview
Version 2 introduces a revolutionary multi-agent conversation system where legendary design, photography, and art critics engage in dynamic debates about uploaded work. Unlike v1's static critiques, v2 creates realistic conversations with tension, agreement, interruptions, and consensus-building.

## System Architecture

### Core Components

#### 1. Agent Profiles (`/v2-agents/`)
Detailed JSON profiles for each critic containing:
- **Background**: Position, known works, philosophy, education, era
- **Personality**: Traits, temperament, openness, assertiveness, stubbornness, humor scores
- **Expertise**: Primary/secondary skills and weak spots
- **Critique Methodology**: How they approach analysis
- **Biases**: What they love, dislike, and what triggers them
- **Communication Style**: Greetings, agreement/disagreement patterns, catchphrases
- **Relationships**: Dynamics with other critics (respect, tension, common ground)

#### 2. Conversation Engine (`/v2-agents/conversation-engine.js`)
Orchestrates multi-phase conversations:
- **Phase 1: Initial Observations** - Each critic's first impression
- **Phase 2: Cross-Examination** - Critics respond to each other
- **Phase 3: Debate** - Heated discussion on disagreements
- **Phase 4: Consensus** - Finding common ground

Features:
- Reaction calculation based on personality and relationships
- Interruption mechanics for high-intensity moments
- Heat level monitoring with moderator intervention
- Dynamic speaking order and natural flow

#### 3. Conversation UI (`/v2-conversation-ui.html`)
Interactive interface featuring:
- Drag-and-drop image upload
- Agent selection across three modes (Design/Photo/Art)
- Real-time conversation animation
- Phase indicators and heat meter
- Message intensity visualization

#### 4. API Endpoint (`/api/v2-conversation.js`)
Serverless function that:
- Accepts image and selected agents
- Uses Claude Vision API to analyze artwork
- Generates contextual multi-agent conversations
- Returns structured conversation data

## Agent Roster

### Design Critics
1. **Paula Scher** - Typography as Architecture
   - Bold, direct, impatient with timidity
   - "Typography IS the image here!"
   - Loves: Bold typography, public impact, breaking grids with purpose

2. **Massimo Vignelli** - Discipline & Timelessness
   - Disciplined, systematic, authoritative
   - "The grid is the underwear of design"
   - Loves: Grids, Helvetica, systematic thinking, timelessness

3. **Steve Jobs** - Simplicity & Soul
   - Perfectionist, visionary, demanding
   - "Simplicity is the ultimate sophistication"
   - Loves: Radical simplicity, perfect details, intuitive design

### Photography Critics
1. **Ansel Adams** - Master of Light & Shadow
   - Meticulous, technical, passionate environmentalist
   - "You don't take a photograph, you make it"
   - Loves: Perfect blacks, Zone System, natural light

2. **Annie Leibovitz** - Narrative & Celebrity
   - Intense, perfectionist, storyteller
   - "What's the narrative here?"
   - Loves: Elaborate production, intimate moments, bold concepts

3. **Henri Cartier-Bresson** - The Decisive Moment
   - Observant, patient, philosophical
   - "Photography is the decisive moment"
   - Loves: Geometric composition, authenticity, black & white

### Art Critics
1. **Marina Abramović** - The Body as Medium
   - Intense, fearless, spiritual, confrontational
   - "The artist must be present"
   - Loves: Presence, risk, duration, vulnerability

2. **Andy Warhol** - Surface & Celebrity
   - Enigmatic, observant, detached, prophetic
   - "Art is what you can get away with"
   - Loves: Celebrity, repetition, commercial imagery

3. **Frida Kahlo** - Pain as Power
   - Fierce, passionate, honest, defiant
   - "I paint my own reality"
   - Loves: Raw honesty, cultural pride, personal mythology

## Relationship Dynamics

### Key Tensions
- **Paula Scher vs Massimo Vignelli**: Scale and expression vs restraint and discipline
- **Steve Jobs vs Everyone**: Simplicity uber alles vs other priorities
- **Marina Abramović vs Andy Warhol**: Depth and presence vs surface and absence
- **Ansel Adams vs Henri Cartier-Bresson**: Planned perfection vs spontaneous moments

### Common Ground
- **Technical Masters**: Adams, Vignelli, Jobs on precision
- **Storytellers**: Leibovitz, Kahlo, Scher on narrative power
- **Revolutionaries**: Warhol, Abramović, Jobs on changing the game

## Conversation Mechanics

### Reaction Calculation
```javascript
calculateReaction(statement) {
    let intensity = basePersonality.assertiveness;
    
    if (triggers.includes(statement.topic)) {
        intensity *= 1.5;
    }
    
    if (relationship[speaker].tension > 0.7) {
        intensity *= (1 + relationship.tension);
    }
    
    return { shouldRespond, intensity, type };
}
```

### Interruption Logic
- Occurs when intensity > 0.8 and assertiveness > 0.7
- More likely between critics with high tension
- Adds dramatic moments to conversations

### Heat Level Management
- Tracks conversation intensity
- Triggers moderator intervention at > 0.8
- Affects subsequent exchange intensity

## Usage Examples

### Starting a Conversation
1. Upload artwork (image file or URL)
2. Select 2-4 critics from any mode
3. Click "Start Conversation"
4. Watch as critics engage in multi-phase discussion

### API Integration
```javascript
const response = await fetch('/api/v2-conversation', {
    method: 'POST',
    body: JSON.stringify({
        image: base64Image,
        agentIds: ['paula-scher', 'massimo-vignelli', 'steve-jobs'],
        mode: 'design'
    })
});

const { conversation } = await response.json();
// Returns array of message objects with speaker, content, intensity, phase
```

## Key Improvements Over V1

1. **Dynamic Interactions**: Critics respond to each other, not just the work
2. **Personality-Driven**: Each critic maintains their unique voice and biases
3. **Relationship Modeling**: Historical tensions and respect affect conversations
4. **Phase-Based Flow**: Structured progression from observation to consensus
5. **Emotional Intelligence**: Heat levels, interruptions, and moderator intervention
6. **Contextual Responses**: Uses actual image analysis, not canned responses

## Technical Stack

- **Frontend**: Vanilla JavaScript with modern CSS animations
- **Backend**: Vercel serverless functions
- **AI**: Claude 3.5 Sonnet with Vision capabilities
- **Data**: JSON-based agent profiles
- **Architecture**: Event-driven conversation engine

## Future Enhancements

### Planned Features
- Real-time streaming of conversation generation
- Voice synthesis for each critic
- Historical conversation archive
- Custom agent creation tools
- Collaborative critique sessions
- Learning from user feedback

### Potential Agents to Add
- **Design**: Dieter Rams, Milton Glaser, Saul Bass
- **Photography**: Richard Avedon, Dorothea Lange, Robert Capa
- **Art**: Basquiat, Picasso, Yayoi Kusama

## Configuration

### Environment Variables
```
ANTHROPIC_API_KEY=your-api-key-here
```

### Agent Customization
Modify JSON profiles to adjust:
- Personality scores (0-1 scale)
- Catchphrases and communication styles
- Relationship dynamics
- Critique methodologies

## Performance Optimization

- Agents profiles cached in memory
- Conversation generation uses streaming where possible
- Image compression before API calls
- Lazy loading of agent data

## Deployment

### Vercel Deployment
```bash
vercel --prod
```

### Files Structure
```
/v2-agents/
  ├── *.json (agent profiles)
  └── conversation-engine.js
/api/
  └── v2-conversation.js
v2-conversation-ui.html
```

## Testing

Open `v2-conversation-ui.html` locally or visit deployed URL. The system includes fallback conversations for testing without API keys.

## Credits

Created as part of the Design Critic Agent project, exploring how AI can simulate the perspectives and interactions of legendary creative critics. Each agent profile is based on extensive research into their published works, interviews, and documented philosophies.

---

*"The life of a designer is a life of fight against ugliness"* - Massimo Vignelli

*"I want to be a machine"* - Andy Warhol  

*"Photography is nothing, it's life that interests me"* - Henri Cartier-Bresson