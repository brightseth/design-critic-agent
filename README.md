# Design Critic Agent 🎨

An AI-powered design critique platform featuring world-renowned design masters providing contextual feedback on visual work.

## Overview

Design Critic Agent offers two distinct experiences:
- **V1 Classic**: Individual critiques from 3 experts with personality modes (Balanced/Encouraging/Tough Love)
- **V2 Conversations**: Multi-agent debates where critics discuss and debate your work

## Features

### V1 Classic Mode
- **Three Critique Modes**: Design, Photography, Art
- **Expert Critics**: Steve Jobs, John Maeda, Paula Scher (Design); Ansel Adams, Annie Leibovitz, Henri Cartier-Bresson (Photography); Marina Abramović, Andy Warhol, Frida Kahlo (Art)
- **Personality Settings**: Balanced, Encouraging, Tough Love
- **Experience Levels**: First-timer, Student, Professional
- **Image Analysis**: Supports image upload and URL input
- **Progressive Disclosure**: Steve Jobs-inspired UI that reveals complexity gradually

### V2 Conversation Mode (Alpha)
- **Multi-Agent Debates**: Critics engage in dynamic conversations about your work
- **4-Phase Flow**: Initial Observations → Cross-examination → Debate → Consensus
- **Agent Personalities**: Each critic has unique biases, relationships, and perspectives
- **Custom Agent Creation**: Framework for adding new critics

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express (API routes)
- **AI Integration**: Claude Vision API (Anthropic)
- **Deployment**: Vercel serverless functions
- **Image Processing**: Client-side compression using Canvas API

## Project Structure

```
design-critic-agent/
├── index-hub.html                 # Landing page
├── index-enhanced-v4.html         # V1 Classic interface
├── v2-conversation-ui.html        # V2 Conversation interface
├── agent-manager.html             # Agent management UI
├── navigation-test.html          # Navigation testing page
├── test-all-features.html        # Feature testing page
│
├── api/
│   ├── analyze-simple.js         # Main API endpoint
│   └── analyze.js                 # Legacy endpoint
│
├── v2-agents/
│   ├── conversation-engine.js    # Multi-agent orchestration
│   ├── design-agents.js          # Design critic profiles
│   ├── photo-agents.js           # Photography critic profiles
│   └── art-agents.js             # Art critic profiles
│
├── public/
│   ├── steve-jobs.jpg
│   ├── john-maeda.jpg
│   └── paula-scher.jpg
│
├── package.json                   # Dependencies
├── vercel.json                    # Deployment config
└── .gitignore                     # Git ignore rules
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/design-critic-agent.git
cd design-critic-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## API Documentation

### POST /api/analyze-simple

Analyzes an uploaded image and returns critiques.

**Request Body:**
```json
{
  "image": "base64_encoded_image",
  "mode": "design|photography|art",
  "personality": "balanced|encouraging|tough-love",
  "experienceLevel": "first-timer|student|professional"
}
```

**Response:**
```json
{
  "success": true,
  "critiques": [
    {
      "critic": "Steve Jobs",
      "title": "Critique title",
      "content": "Detailed critique...",
      "keyPoints": ["Point 1", "Point 2"],
      "improvements": ["Suggestion 1", "Suggestion 2"]
    }
  ],
  "keyObservations": ["Observation 1", "Observation 2"]
}
```

## Development Roadmap

### Completed ✅
- [x] V1 Classic mode with 3 critique modes
- [x] 9 expert critics with unique personalities
- [x] Personality selector (Balanced/Encouraging/Tough Love)
- [x] Experience level adaptation
- [x] Image upload and URL input
- [x] Client-side image compression
- [x] Progressive disclosure UI
- [x] V2 conversation engine foundation
- [x] Navigation between V1 and V2

### In Progress 🚧
- [ ] Real Claude Vision API integration
- [ ] Multi-agent conversation refinement
- [ ] Agent personality tuning

### Planned 📋
- [ ] Custom agent training
- [ ] Stripe billing integration
- [ ] Public API with rate limiting
- [ ] Social sharing features
- [ ] Export critique as PDF
- [ ] Critique history
- [ ] User accounts

## Known Issues

1. **API Integration**: Currently using demo mode. Real Claude API key needed for production.
2. **Image Size**: Large images may cause API timeouts. Client-side compression helps but may need adjustment.
3. **Agent Conversations**: V2 conversation flow needs refinement for more natural debates.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| ANTHROPIC_API_KEY | Claude API key for image analysis | Yes |
| PORT | Server port (default: 3000) | No |
| NODE_ENV | Environment (development/production) | No |

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Testing

Run the test suite:
```bash
npm test
```

Test specific features:
- Navigation: Open `navigation-test.html`
- All features: Open `test-all-features.html`

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.

## Credits

Created with passion for design critique and AI-powered creativity.

---

**Note**: This project is in active development. V2 features are in alpha stage.