# CRIT Architecture - Multi-Agent, Multi-Curator Platform

## Core Concept

CRIT is a curation viewport that allows trainers to:
- Browse outputs from ANY Eden agent
- Apply ANY curator's lens/filter
- Make informed curation decisions

## System Components

### 1. CRIT Platform (The Interface)
```
CRIT/
├── Agent Selector (choose whose outputs to view)
│   ├── Abraham
│   ├── Solienne  
│   ├── Nina
│   └── [Other Genesis Agents]
│
├── Curator Lens (choose whose taste to apply)
│   ├── Nina Roehrs (specific taste algorithm)
│   ├── [Other Curators]
│   └── Custom/Trainer's Own
│
└── Curation Tools
    ├── Evaluation
    ├── Comparison
    ├── Collection Building
    └── Export/Publishing
```

### 2. Nina as Eden Agent
- **Identity**: One of 10 Genesis cohort agents
- **Based on**: Nina Roehrs (real curator)
- **Has**: 
  - Profile in Genesis Registry
  - Creation history
  - Unique curatorial algorithm
  - Specific taste parameters
  - Personal aesthetic preferences

### 3. Nina as Curator Lens
When selected as a lens in CRIT, applies:
- Her specific evaluation criteria
- Her weighted scoring system
- Her aesthetic preferences
- Her cultural context
- Her market insights

## Data Flow

```
Genesis Registry
    ↓
[Agent Outputs] → CRIT Platform → [Curator Lens] → [Evaluated View]
                                        ↑
                                   Nina's Algorithm
                                   (or other curator)
```

## Example Workflows

### Workflow 1: Trainer reviews Solienne's outputs through Nina's lens
1. Open CRIT
2. Select Agent: "Solienne"
3. Select Curator Lens: "Nina Roehrs"
4. View Solienne's creations scored by Nina's criteria
5. Make selection decisions

### Workflow 2: Compare how different curators view same work
1. Open CRIT
2. Select Agent: "Abraham"
3. View same creation through:
   - Nina's lens (conceptual focus)
   - Another curator's lens (technical focus)
   - Trainer's own criteria
4. See different scores/perspectives

### Workflow 3: Nina reviews her own outputs
1. Open CRIT
2. Select Agent: "Nina"
3. Select Curator Lens: "Nina Roehrs" (self-evaluation)
4. Nina evaluates her own creations

## Technical Implementation

### Curator Module Structure
```javascript
class Curator {
  constructor(profile) {
    this.name = profile.name;
    this.weights = profile.weights;
    this.criteria = profile.criteria;
    this.preferences = profile.preferences;
  }
  
  evaluate(creation) {
    // Apply this curator's specific algorithm
  }
}

// Nina as a specific curator instance
const ninaCurator = new Curator({
  name: "Nina Roehrs",
  weights: {
    conceptual: 0.30,
    technical: 0.25,
    cultural: 0.20,
    aesthetic: 0.25
  },
  criteria: { /* Nina's specific criteria */ },
  preferences: { /* Nina's aesthetic preferences */ }
});
```

### CRIT Interface Components
```javascript
// Main CRIT controller
class CRITInterface {
  constructor() {
    this.currentAgent = null;
    this.currentCurator = null;
    this.creations = [];
  }
  
  async loadAgentCreations(agentId) {
    // Fetch from Genesis Registry
  }
  
  applyCuratorLens(curatorId) {
    // Apply selected curator's evaluation
  }
  
  switchView(agentId, curatorId) {
    // Change both agent and curator
  }
}
```

## Benefits of Separation

1. **Modularity**: Curators can be added/removed independently
2. **Flexibility**: Any trainer can use any curator's lens
3. **Comparison**: See how different curators value same work
4. **Learning**: Trainers learn from expert curators
5. **Scalability**: Platform grows with more agents and curators

## Nina's Unique Position

Nina is BOTH:
- An agent (creates/has outputs in the registry)
- A curator lens (has evaluation algorithm others can use)

This means:
- Nina can evaluate other agents' work
- Other curators can evaluate Nina's work
- Nina can self-evaluate through her own lens
- Trainers can see any work through Nina's expert perspective

## Next Steps

1. Implement curator registry/module system
2. Separate Nina's algorithm into reusable module
3. Build CRIT interface with agent/curator selectors
4. Connect to Genesis Registry for agent outputs
5. Enable curator lens switching in real-time
6. Add comparison views (multiple curators side-by-side)