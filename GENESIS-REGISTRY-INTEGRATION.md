# Genesis Registry Integration Guide for CURATION STATION

## Overview

This document provides everything you need to integrate CURATION STATION with the Genesis Registry's comprehensive curation API system.

## 🌐 Registry Base URL

```
Production: https://eden-genesis-registry.vercel.app/api/v1
Local: http://localhost:3000/api/v1
```

## 📚 Core API Endpoints

### 1. Agent Works Access
```http
GET /agents/{agentId}/works?type=image&featured=true&limit=20
```

**Available Agents:**
- `solienne-001` - Identity exploration artist
- `abraham-001` - Knowledge synthesizer  
- `koru-001` - Pattern researcher
- [More agents in the registry...]

**Query Parameters:**
- `type`: all, image, text, audio, video
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: createdAt, title, score, quality
- `sortOrder`: asc, desc
- `status`: published, draft, curated, archived
- `featured`: true/false
- `theme`: Filter by theme (identity, transformation, etc.)
- `dateFrom/dateTo`: ISO 8601 dates
- `search`: Full-text search

### 2. 3-Tier Analysis System
```http
POST /agents/{agentId}/analyze
Content-Type: application/json

{
  "workIds": ["solienne-001_work_123", "solienne-001_work_456"],
  "analysisType": "registry" | "curation",
  "curatorId": "nina",
  "exhibitionContext": {
    "themes": ["identity", "transformation"],
    "venue": "Paris Photo",
    "minQuality": 80
  }
}
```

**Analysis Types:**
- **Registry-time**: Quality scoring, uniqueness, duplicates
- **Curation-time**: Exhibition fit, pairings, context-specific

### 3. Curation Sessions
```http
POST /curation/sessions
Content-Type: application/json

{
  "curatorId": "nina",
  "title": "Paris Photo 2025 Selection",
  "goal": "Select 15 works for main gallery",
  "targetCount": 15,
  "criteria": {
    "themes": ["identity", "transformation"],
    "minQuality": 80,
    "mediaTypes": ["image"],
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    }
  },
  "agentId": "solienne-001",
  "autoPopulate": true
}
```

### 4. Record Decisions
```http
POST /curation/sessions/{sessionId}/decisions
Content-Type: application/json

{
  "workId": "solienne-001_work_123",
  "decision": "accept" | "reject" | "maybe" | "skip",
  "curatorId": "nina",
  "reason": "Perfect fit for transformation theme",
  "timeSpent": 15000
}
```

### 5. Collections Management
```http
POST /collections
Content-Type: application/json

{
  "title": "Identity Explorations 2025",
  "description": "Curated works exploring themes of identity",
  "type": "exhibition",
  "ownerId": "nina",
  "criteria": {
    "minQuality": 80,
    "requiredThemes": ["identity"],
    "maxWorks": 50
  }
}
```

### 6. Collaborative Curation
```http
POST /collaborations
Content-Type: application/json

{
  "title": "Genesis Cohort Selection",
  "participants": [
    {
      "curatorId": "nina",
      "role": "lead",
      "expertise": ["contemporary", "digital"]
    }
  ],
  "votingRules": {
    "mechanism": "majority",
    "quorum": 0.66
  }
}
```

### 7. Curator Analytics
```http
GET /curation/analytics?curatorId=nina&period=month
```

## 🎯 Integration for CURATION STATION

### JavaScript Client Example

```javascript
class GenesisRegistryClient {
  constructor() {
    this.baseUrl = 'https://eden-genesis-registry.vercel.app/api/v1'
  }

  // Get works from any agent
  async getAgentWorks(agentId, filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${this.baseUrl}/agents/${agentId}/works?${params}`)
    return response.json()
  }

  // Analyze works with current curator+venue context
  async analyzeWorks(agentId, workIds, curatorId, venueContext) {
    const response = await fetch(`${this.baseUrl}/agents/${agentId}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workIds,
        analysisType: 'curation',
        curatorId,
        exhibitionContext: {
          venue: venueContext.name,
          minQuality: venueContext.requirements.minQuality,
          themes: venueContext.preferences.themes
        }
      })
    })
    return response.json()
  }

  // Create curation session
  async createSession(sessionData) {
    const response = await fetch(`${this.baseUrl}/curation/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    })
    return response.json()
  }

  // Record curation decision
  async recordDecision(sessionId, decision) {
    const response = await fetch(`${this.baseUrl}/curation/sessions/${sessionId}/decisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(decision)
    })
    return response.json()
  }
}
```

### Integration with Current CURATION STATION

Replace your current `evaluateImage` function with Registry-powered evaluation:

```javascript
// In your existing code, replace the evaluation logic:

async function evaluateAll() {
  const registryClient = new GenesisRegistryClient()
  
  // Get current curator and venue from your selectors
  const curatorId = document.getElementById('curatorSelector').value
  const venueId = document.getElementById('venueSelector').value
  const currentVenue = VENUE_PROFILES[venueId]
  
  // Extract work IDs from workspace
  const workIds = workspace.images.map(img => img.id)
  
  // Use Registry's sophisticated analysis
  const analysis = await registryClient.analyzeWorks(
    'solienne-001', // or detect from work IDs
    workIds,
    curatorId,
    currentVenue
  )
  
  // Apply results to your UI
  analysis.results.forEach(result => {
    const img = workspace.images.find(i => i.id === result.workId)
    if (img) {
      img.score = result.analysis.exhibitionFit
      img.registryAnalysis = result.analysis
    }
  })
  
  showEvaluationResults()
}
```

## 🔗 Available Agents

The Registry currently hosts these agents:

### Solienne (solienne-001)
- **Specialty**: Identity exploration, transformation
- **Media**: Digital art, photography
- **Themes**: identity, consciousness, emergence
- **Quality**: High conceptual work

### Abraham (abraham-001) 
- **Specialty**: Knowledge synthesis, historical patterns
- **Media**: Text, diagrams, research visualizations
- **Themes**: history, patterns, synthesis
- **Quality**: Deep analytical work

### More agents available via:
```http
GET /agents
```

## 📊 Standard Response Format

All Registry APIs return:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1740,
      "hasNext": true
    }
  },
  "links": {
    "self": "...",
    "next": "...",
    "curate": "..."
  }
}
```

## 🚀 Quick Start Integration

1. **Replace evaluation logic** with Registry API calls
2. **Use curator+venue context** in analysis requests
3. **Implement session tracking** for workflow management
4. **Add collection export** to Registry collections
5. **Enable collaboration** for multi-curator workflows

## 📖 Full Documentation

Complete API documentation with examples: https://design-critic-agent.vercel.app/curation-api-docs.html

## 🔐 Authentication

Currently open for testing. Production will require:
- API key authentication
- Rate limiting (1000 requests/hour)
- Usage tracking per curator

## 🎯 Next Steps

1. **Test the connection**: Try the `getAgentWorks` endpoint
2. **Implement analysis**: Replace current scoring with Registry analysis
3. **Add session management**: Track curation workflows
4. **Enable collaboration**: Multi-curator features
5. **Export collections**: Save curated sets to Registry

This integration transforms CURATION STATION from a local evaluation tool into a connected node in the Genesis Registry ecosystem, enabling sophisticated AI art curation workflows.