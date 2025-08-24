# NINA Curation API Documentation

## Overview
The NINA API provides programmatic access to professional AI art curation capabilities. Evaluate images and videos for gallery exhibition readiness using the same brutal selectivity as the web interface.

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
Optional API key authentication via `X-API-Key` header. Set `NINA_API_KEYS` environment variable to enable.

## Rate Limits
- 30 requests per minute
- 500 requests per hour  
- 5000 requests per day

## Endpoints

### Status Check
```http
GET /api/v1/status
```

Returns API status and available endpoints.

**Response:**
```json
{
  "success": true,
  "status": "operational",
  "version": "1.0",
  "endpoints": {...},
  "rate_limits": {...}
}
```

### Evaluate Single Image
```http
POST /api/v1/curate
```

**Request:**
```json
{
  "action": "evaluate",
  "data": {
    "image": "base64_string_or_url"
  }
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "image_id": "filename.jpg",
    "verdict": "INCLUDE|MAYBE|EXCLUDE",
    "weighted_total": 0.75,
    "scores_raw": {
      "exhibition_readiness": 75,
      "ai_criticality": 80,
      "conceptual_strength": 70,
      "technical_excellence": 75,
      "cultural_dialogue": 65
    },
    "rationales": {...},
    "i_see": "Visual description...",
    "flags": ["weak_print", "derivative"]
  }
}
```

### Batch Evaluation
```http
POST /api/v1/curate
```

Evaluate up to 10 images in a single request.

**Request:**
```json
{
  "action": "evaluate_batch",
  "data": {
    "images": [
      {"id": "img1", "data": "base64_or_url"},
      {"id": "img2", "data": "base64_or_url"}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "evaluations": [...],
  "summary": {
    "total": 10,
    "successful": 10,
    "average_score": 72.5,
    "exhibition_ready": 2
  }
}
```

### Compare Images
```http
POST /api/v1/curate
```

Perform head-to-head comparison of multiple images.

**Request:**
```json
{
  "action": "compare",
  "data": {
    "images": ["base64_or_url_1", "base64_or_url_2", "..."]
  }
}
```

**Response:**
```json
{
  "success": true,
  "rankings": [
    {"rank": 1, "id": "img2", "score": 85.5, "verdict": "INCLUDE"},
    {"rank": 2, "id": "img1", "score": 72.3, "verdict": "MAYBE"}
  ],
  "comparisons": [
    {
      "pair": ["img1", "img2"],
      "winner": "img2",
      "margin": 13.2,
      "scores": {"img1": 72.3, "img2": 85.5}
    }
  ]
}
```

### Analyze Video
```http
POST /api/v1/curate
```

Analyze video content for exhibition potential.

**Request:**
```json
{
  "action": "analyze_video",
  "data": {
    "video": "base64_or_url",
    "duration": 30,
    "resolution": "1920x1080",
    "isLoop": true
  }
}
```

## Scoring Dimensions

### Exhibition Readiness (30%)
Gallery wall presence at 80-120cm viewing distance. Museum-grade exhibition quality.

### AI-Criticality (25%)
Embeds stance on dataset politics, bias, consent. Not just using AI, but challenging it.

### Conceptual Strength (20%)
Posthuman and cyberfeminist clarity. Identity as construction/performance.

### Technical Excellence (15%)
Light, color, tonal control, composition. No cheap AI gloss.

### Cultural Dialogue (10%)
Legible conversation with artistic lineage. Not pastiche.

## Score Interpretation

- **85%+** - Exhibition Ready (major gallery consideration)
- **75-84%** - Gallery-Ready (needs minor refinement)
- **65-74%** - Portfolio-Level (solid but needs development)
- **Below 65%** - Needs significant work

## Example Usage

### Python
```python
import requests
import base64

# Evaluate an image
with open('artwork.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode()

response = requests.post('http://localhost:3001/api/v1/curate', 
    json={
        'action': 'evaluate',
        'data': {'image': f'data:image/jpeg;base64,{image_base64}'}
    },
    headers={'X-API-Key': 'your-api-key'}
)

result = response.json()
print(f"Score: {result['evaluation']['weighted_total'] * 100:.1f}%")
print(f"Verdict: {result['evaluation']['verdict']}")
```

### JavaScript
```javascript
const response = await fetch('http://localhost:3001/api/v1/curate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key'
    },
    body: JSON.stringify({
        action: 'evaluate',
        data: { image: imageDataUrl }
    })
});

const result = await response.json();
console.log(`Score: ${result.evaluation.weighted_total * 100}%`);
```

### cURL
```bash
curl -X POST http://localhost:3001/api/v1/curate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "action": "evaluate",
    "data": {
      "image": "https://example.com/artwork.jpg"
    }
  }'
```

## Error Codes

- `400` - Bad Request (missing or invalid parameters)
- `401` - Unauthorized (invalid API key)
- `429` - Rate limit exceeded
- `500` - Internal server error

## Setting Up API Keys

Set environment variable with comma-separated key:name pairs:
```bash
export NINA_API_KEYS="key123:ClientName,key456:AnotherClient"
```

## Notes

- Images can be provided as base64 strings or URLs
- Maximum file size: 4MB for Vercel deployment
- Supports JPEG, PNG, GIF, WebP formats
- Video analysis is in beta with limited frame extraction