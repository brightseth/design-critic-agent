# Design Critic Agent 🎨

An AI-powered design critique tool that channels the wisdom of legendary design masters including Steve Jobs, John Maeda, Jony Ive, and modern design teams from Airbnb and Instagram.

## Features

- **Multi-perspective Critique**: Get design feedback from 5 different expert viewpoints
- **Interactive Upload**: Drag & drop images or paste URLs
- **Smart Analysis**: Configurable depth and focus areas
- **Actionable Feedback**: Specific, prioritized recommendations
- **Beautiful Interface**: Clean, dark design that puts your work first

## Design Philosophies

### Steve Jobs - Simplicity & Focus
- "Simplicity is the ultimate sophistication"
- Remove until it breaks, then add back only what's essential
- Clear hierarchy and confident typography

### John Maeda - Laws of Simplicity
- Reduce, organize, time, learn, differences, context, emotion, trust, failure, and the one
- Systematic approach to achieving simplicity

### Airbnb Design - Human Connection
- Design for trust, community, and belonging
- Every pixel should make people feel welcome
- Warm, conversational tone

### Instagram Aesthetic - Visual Impact
- Thumb-stopping power for mobile-first world
- Content is king, minimize chrome
- Speed and delight matter

### Jony Ive - Craft & Detail
- "It should feel inevitable, not designed"
- Material honesty and refined edges
- Purpose-driven details

## Quick Start

### Simple Version (Static HTML)
```bash
# Clone or download the project
cd design-critic-agent

# Open in browser
open index.html
```

### Enhanced Version (With Server)
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the server
npm start

# Open browser
open http://localhost:3000
```

## File Structure

```
design-critic-agent/
├── index.html              # Simple standalone version
├── index-enhanced.html     # Advanced version with API features
├── server.js              # Express server for file handling
├── package.json           # Node.js dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## API Integration (Optional)

To enable AI-powered critiques, add your API keys to `.env`:

```bash
# For Claude API
ANTHROPIC_API_KEY=your_key_here

# Or OpenAI API
OPENAI_API_KEY=your_key_here
```

## Usage

1. **Upload Design**: Drag & drop an image or paste a URL
2. **Configure Analysis**: Choose depth (quick/standard/deep) and focus area
3. **Get Critiques**: Receive feedback from multiple expert perspectives
4. **Review Scores**: See overall assessment across key dimensions
5. **Follow Recommendations**: Get prioritized action items

## Supported Formats

- **Images**: JPG, PNG, GIF, WebP (max 10MB)
- **Sources**: Local files, URLs, drag & drop

## Design Categories

The tool evaluates designs across multiple dimensions:

- **Simplicity**: Clarity, focus, visual hierarchy
- **Usability**: Intuitive navigation, accessibility
- **Emotional Impact**: Trust, delight, human connection
- **Craftsmanship**: Polish, attention to detail, consistency

## Development

### Adding New Critics
1. Create critic profile in `generateCritique()` function
2. Define their focus areas and evaluation criteria
3. Add avatar and title
4. Include specific feedback patterns

### Customizing Analysis
- Modify critique generation in `server.js`
- Adjust scoring algorithms
- Add new evaluation categories
- Integrate with vision APIs

## Contributing

Suggestions for improvement:

1. **Real AI Integration**: Connect with Claude, GPT-4V, or other vision models
2. **More Critics**: Add perspectives from Dieter Rams, Paula Scher, etc.
3. **Industry Specifics**: Mobile app, web, print-specific critiques
4. **Collaboration**: Share critiques, team feedback
5. **Historical Tracking**: Save and compare iterations

## License

MIT License - Feel free to use and modify for your projects.

---

*"Design is not just what it looks like and feels like. Design is how it works."* - Steve Jobs