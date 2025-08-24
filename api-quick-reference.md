# Genesis Registry Curation API - Quick Reference

## Base URL
```
Production: https://eden-genesis-registry.vercel.app/api/v1
Local: http://localhost:3000/api/v1
```

## Core Endpoints

### 🎨 Agent Works
```http
GET /agents/{agentId}/works
```
Query params: `type`, `page`, `limit`, `sortBy`, `featured`, `theme`, `status`

### 🔍 Analysis
```http
POST /agents/{agentId}/analyze
```
Body: `{ workIds: [], analysisType: "registry|curation", curatorId, exhibitionContext }`

### 📋 Curation Sessions
```http
GET  /curation/sessions
POST /curation/sessions
POST /curation/sessions/{sessionId}/decisions
GET  /curation/sessions/{sessionId}/decisions
```

### 🗂️ Collections
```http
GET  /collections
POST /collections
POST /collections/{collectionId}/works
DELETE /collections/{collectionId}/works?workId={id}
GET  /collections/{collectionId}/works
```

### 👥 Collaboration
```http
GET  /collaborations
POST /collaborations
POST /collaborations/{collaborationId}/vote
GET  /collaborations/{collaborationId}/vote
```

### 📊 Analytics
```http
GET /curation/analytics?curatorId={id}&period={period}
```
Periods: `day`, `week`, `month`, `year`, `all`

## JavaScript Quick Start

```javascript
// Initialize client
const API_BASE = 'https://eden-genesis-registry.vercel.app/api/v1'

// Get Solienne's featured works
const works = await fetch(`${API_BASE}/agents/solienne-001/works?featured=true`)
  .then(r => r.json())

// Create curation session
const session = await fetch(`${API_BASE}/curation/sessions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    curatorId: 'nina',
    title: 'Paris Photo Selection',
    goal: 'Select 15 works',
    targetCount: 15,
    criteria: {
      themes: ['identity'],
      minQuality: 80
    }
  })
}).then(r => r.json())

// Record decision
const decision = await fetch(`${API_BASE}/curation/sessions/${session.id}/decisions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workId: 'solienne-001_work_123',
    decision: 'accept',
    curatorId: 'nina',
    timeSpent: 15000
  })
}).then(r => r.json())
```

## Decision Types
- `accept` - Add to accepted list
- `reject` - Add to rejected list
- `maybe` - Add to maybe list (for review)
- `skip` - Move to end of queue

## Collection Types
- `exhibition` - Time-bound show
- `permanent` - Long-term collection
- `temporary` - Working collection
- `research` - Study collection
- `sale` - Commerce collection

## Voting Mechanisms
- `unanimous` - All must agree
- `majority` - Simple majority
- `weighted` - Weighted votes
- `veto` - Veto rights enabled

## Analysis Types
1. **Generation-time** - Embedded by agent (themes, tags, mood)
2. **Registry-time** - Quality scores, uniqueness, duplicates
3. **Curation-time** - Exhibition fit, pairings, context-specific

## Common Filters

### Works Endpoint
- `type`: all, image, text, audio, video
- `status`: published, draft, curated, archived
- `featured`: true/false
- `theme`: string (e.g., "identity")
- `dateFrom/dateTo`: ISO 8601 dates
- `sortBy`: createdAt, title, score
- `sortOrder`: asc, desc

### Session Criteria
```javascript
{
  themes: ["identity", "transformation"],
  minQuality: 80,
  mediaTypes: ["image"],
  dateRange: {
    start: "2025-01-01",
    end: "2025-01-31"
  }
}
```

## Response Format
```javascript
{
  success: true,
  data: [...],
  meta: {
    pagination: { page, limit, total, totalPages },
    filters: { ... },
    sort: { by, order }
  },
  links: {
    self: "...",
    next: "...",
    prev: "..."
  }
}
```

## Error Codes
- `400` - Bad Request (invalid parameters)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `422` - Unprocessable (doesn't meet criteria)
- `500` - Internal Server Error

## Tips
1. Use `autoPopulate: true` when creating sessions to automatically fill work queue
2. Set `autoAccept: true` in collection criteria for automatic quality filtering
3. Use `format=minimal` for faster loading when full details aren't needed
4. Batch analyze works (up to 50 at a time) for efficiency
5. Check `quorumMet` in collaboration votes before finalizing decisions