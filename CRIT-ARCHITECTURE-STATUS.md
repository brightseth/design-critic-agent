# 🎯 CRIT Architecture Status & Plan

## Current Architecture Reality

### What We Have (Properly Separated!)

```
/Users/seth/eden-genesis-registry/     ← Registry Backend (separate)
├── src/app/api/v1/agents/            ← Agent APIs
├── data/works/solienne-001.json      ← Real work data
└── Deployed: eden-genesis-registry.vercel.app (has 404 issues)

/Users/seth/design-critic-agent/       ← CRIT Frontend (here)
├── index.html                         ← CRIT UI
├── registry-client.js                 ← Points to Registry API
├── js/registry-integration.js        ← Registry client with fallback
└── Deployed: design-critic-agent.vercel.app (working!)
```

## Key Status Points

### 1. Registry API Status
- **Registry IS deployed separately** at `eden-genesis-registry.vercel.app`
- **Has routing issues** - 404s on `/api/v1/agents/[agentId]/works`
- **CRIT gracefully falls back** to sample data when Registry unavailable
- **Connection test shows**: "Registry API Unavailable" or "Registry Online (API Pending)"

### 2. Data Flow Architecture (Correct!)
```
Genesis Registry (Backend)
└── Serves agent works via /api/v1/agents/{agentId}/works
    └── CRIT (Frontend) 
        └── Consumes via registry-client.js
            └── Falls back to sample data if unavailable
```

### 3. Current Integration Points
- `registry-client.js` points to: `https://eden-genesis-registry.vercel.app/api/v1`
- Falls back to local sample data with real Solienne images from Supabase
- Registry status indicator shows connection state in UI

## What's Actually Working

### ✅ CRIT Features
- **Browse Registry** button (uses fallback data currently)
- **8 curator personas** (Nina, Marcus, etc.)
- **10 venue profiles** (Paris Photo, MoMA, etc.)
- **Multi-agent support** (Solienne, Abraham, Miyomi)
- **Curator+venue scoring modifiers**
- **Hybrid evaluation** (registry-first, local fallback)

### ✅ Architecture
- **Proper separation of concerns** already implemented
- **Clean API boundaries** between Registry and CRIT
- **Smart fallback system** when Registry unavailable
- **No architecture changes needed!**

## What Needs Fixing

### 1. Registry Deployment (Other Terminal)
Fix the 404s on Registry API routes:
- `GET /api/v1/agents` 
- `GET /api/v1/agents/[agentId]/works`
- `GET /api/v1/agents/[agentId]/works/[workId]`
- `POST /api/v1/agents/[agentId]/analyze`

### 2. Once Registry Routes Work
- CRIT will automatically connect to real data
- Status will show "Registry API Connected" (green)
- Browse Registry will pull from actual Registry
- No changes needed in CRIT!

## Important Notes

### Confusion to Avoid
- **DON'T add Registry endpoints to CRIT** (I mistakenly did this)
- **Registry endpoints belong in eden-genesis-registry project**
- **CRIT should only consume Registry API, not implement it**

### Current Workaround
CRIT has temporary Registry endpoints at `/api/v1/*` that should be removed once real Registry is fixed. These were added as a quick fix but architecturally belong in the Registry project.

## Next Steps

### Immediate (Registry Team)
1. Fix routing in eden-genesis-registry deployment
2. Ensure `/api/v1/agents/[agentId]/works` returns data
3. Test with: `curl https://eden-genesis-registry.vercel.app/api/v1/agents/solienne-001/works`

### Once Registry Fixed
1. Remove temporary Registry endpoints from CRIT
2. Verify CRIT connects to real Registry
3. Update status to show "Registry API Connected"

### Future Considerations
- Add authentication/API keys to Registry
- Implement real-time work updates
- Add WebSocket support for live curation sessions
- Consider GraphQL for more flexible queries

## Summary

**Architecture is correct!** Registry and CRIT are properly separated. Just need to fix Registry deployment routes. CRIT's fallback system is working perfectly while Registry is being fixed.

---

*Last Updated: 2024-01-24*
*Status: Waiting for Registry deployment fixes*