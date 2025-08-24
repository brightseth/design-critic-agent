# CRIT - Curation Layer Web Experience

## Project Identity

**Project Name**: CRIT  
**Purpose**: Curation layer web experience for trainers to curate and select AI-generated outputs for public presentation  
**Core Function**: Empowering trainers with tools to evaluate, organize, and publish curated collections  

## What is CRIT?

CRIT is the critical curation layer that sits between AI generation and public presentation. It provides trainers with sophisticated tools to:

- **Evaluate** outputs using multi-dimensional scoring
- **Organize** selections into coherent collections
- **Curate** exhibitions for various presentation formats
- **Train** AI systems through feedback loops
- **Publish** approved content for public consumption

## Key Users

### Primary: Trainers
- Art directors curating for exhibitions
- Content managers selecting for publication
- Gallery owners building collections
- Creative directors assembling portfolios
- AI trainers improving model outputs

### Secondary: Viewers
- Public accessing curated collections
- Collectors browsing approved works
- Artists seeking feedback
- Researchers studying curation patterns

## Core Features

### 1. Evaluation Engine
- Multi-dimensional scoring system
- Customizable evaluation criteria
- Batch processing capabilities
- A/B comparison tools

### 2. Curation Workflow
- **Intake**: Import outputs from various sources
- **Review**: Systematic evaluation process
- **Organize**: Collection building tools
- **Refine**: Iterative selection refinement
- **Publish**: Export to various formats

### 3. Trainer Tools
- Personal preference learning
- Custom scoring weights
- Feedback collection
- Performance analytics
- Collaboration features

### 4. Output Formats
- Web galleries
- PDF catalogs
- Exhibition layouts
- Social media posts
- API endpoints
- Frame displays

## Architecture

```
CRIT System
├── Input Layer (accepts outputs from AI systems)
├── Evaluation Layer (scoring and analysis)
├── Curation Layer (selection and organization)
├── Training Layer (feedback and learning)
└── Output Layer (publication and distribution)
```

## Integration Points

- **AI Generators**: Accepts outputs from Solienne, DALL-E, Midjourney, etc.
- **Storage Systems**: Supabase for collections, IPFS for permanence
- **Publishing Platforms**: Vercel, Gallery sites, Social media
- **Analytics**: Track curation patterns and preferences
- **Collaboration**: Multi-trainer workflows

## Unique Value Proposition

CRIT transforms the overwhelming volume of AI-generated content into carefully curated, exhibition-quality collections. It's not just a rating system - it's a complete curation workflow that learns from trainer preferences and elevates the best outputs for public presentation.

## Technical Stack

- **Frontend**: Modern web interface with drag-drop support
- **Backend**: Node.js API with modular architecture
- **Storage**: Supabase for data, CDN for media
- **AI**: Claude API for enhanced analysis
- **Deployment**: Vercel for global distribution

## Workflow Example

1. **Trainer logs into CRIT**
2. **Imports batch of AI outputs** (images, videos, etc.)
3. **Reviews using evaluation tools** (scoring, comparison)
4. **Selects best pieces** for collection
5. **Organizes into themed groups**
6. **Adds context and metadata**
7. **Publishes to chosen format** (web, PDF, API)
8. **Tracks public engagement**
9. **Feeds data back** to improve AI generation

## Success Metrics

- Time to curate (efficiency)
- Selection quality scores
- Public engagement rates
- Trainer satisfaction
- Collection coherence
- Feedback loop effectiveness

## Vision

CRIT becomes the industry standard for AI output curation, providing the critical human layer that transforms machine creativity into meaningful cultural contributions. Every major AI art exhibition, publication, and collection passes through CRIT's curation layer.

## Current Status

Transitioning from "Nina Design Critic Agent" to CRIT - expanding focus from single-agent critique to comprehensive curation layer for all trainers working with AI-generated content.