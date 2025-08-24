# CRIT: Agent-Centric Curation Model

## Core Concepts

### Agents as Universal Actors
- **Agents** are the fundamental primitives in the Genesis Registry
- Agents can be AI (Nina, Abraham, Solienne) or potentially human
- Every agent can:
  - CREATE work (outputs/creations)
  - CURATE work (apply their evaluation lens)
  - BE CURATED (have their work evaluated by others)

### Trainers as Orchestrators
- **Trainers** are humans who configure and control the system
- Trainers have ultimate override authority
- Trainers decide:
  - Which agent's work to view
  - Which agent's curation lens to apply
  - When to override agent decisions
  - How to combine multiple curation perspectives

## System Architecture

```
Genesis Registry (Source of Truth)
├── Agents (AI/Human primitives)
│   ├── Creations (their outputs)
│   ├── Curation Algorithms (their taste)
│   └── Metadata (profile, history)
│
└── CRIT Platform (Curation Interface)
    ├── Work Selector
    │   └── Choose agent whose creations to view
    ├── Curator Selector
    │   └── Choose agent whose lens to apply
    └── Trainer Controls
        ├── Configuration options
        ├── Override mechanisms
        └── Export/publish tools
```

## Example Scenarios

### Scenario 1: Nina curates Solienne's work
- Work Source: Solienne (agent)
- Curator Lens: Nina (agent)
- Trainer: Human viewing and potentially overriding

### Scenario 2: Abraham curates Nina's work
- Work Source: Nina (agent)
- Curator Lens: Abraham (agent)
- Trainer: Human making final decisions

### Scenario 3: Multi-agent curation consensus
- Work Source: Any agent
- Curator Lenses: Multiple agents (Nina + Abraham + Luna)
- Trainer: Synthesizes multiple perspectives

### Scenario 4: Self-curation
- Work Source: Nina (agent)
- Curator Lens: Nina (agent)
- Trainer: Reviews self-evaluation

## Agent Curation Capabilities

Each agent brings unique curation strengths:

### Nina (Gallery Director)
- Focus: Exhibition readiness, conceptual depth
- Strengths: Art market knowledge, cultural relevance

### Abraham (Art Historian)
- Focus: Historical context, artistic lineage
- Strengths: Reference identification, movement classification

### Solienne (Creator)
- Focus: Technical innovation, aesthetic exploration
- Strengths: Generative techniques, style evolution

### Luna (Mystic)
- Focus: Emotional resonance, spiritual depth
- Strengths: Symbolic interpretation, energetic assessment

## Trainer Override System

Trainers maintain control through:

1. **Weight Adjustment**
   - Modify importance of different criteria
   - Blend multiple agent perspectives

2. **Threshold Setting**
   - Define minimum quality scores
   - Set inclusion/exclusion rules

3. **Manual Selection**
   - Override any agent recommendation
   - Force include/exclude specific works

4. **Custom Criteria**
   - Add trainer-specific evaluation points
   - Create hybrid agent-human curation

## Data Flow

```
1. Agent creates work → Genesis Registry
2. Work available in CRIT
3. Trainer selects viewing agent + curator agent
4. Curator agent evaluates work
5. Trainer reviews evaluation
6. Trainer accepts/modifies/overrides
7. Final curation exported/published
```

## Implementation Details

### Agent as Curator
```javascript
class AgentCurator {
  constructor(agentProfile) {
    this.id = agentProfile.id;
    this.name = agentProfile.name;
    this.evaluationAlgorithm = agentProfile.curatorAlgorithm;
    this.weights = agentProfile.curatorWeights;
    this.specialties = agentProfile.curatorSpecialties;
  }

  async evaluate(creation, context = {}) {
    // Apply this agent's unique perspective
    return this.evaluationAlgorithm(creation, this.weights, context);
  }

  async batchEvaluate(creations) {
    // Evaluate multiple works maintaining agent's consistency
    return creations.map(c => this.evaluate(c));
  }
}
```

### Trainer Override Interface
```javascript
class TrainerInterface {
  constructor() {
    this.selectedWork = null;
    this.selectedCurators = [];
    this.overrides = new Map();
  }

  selectWorkSource(agentId) {
    // Load creations from selected agent
  }

  addCuratorLens(agentId) {
    // Add agent's curation perspective
  }

  overrideScore(creationId, newScore, reason) {
    // Trainer manual override with documentation
  }

  finalizeSelection() {
    // Combine agent curation + trainer overrides
  }
}
```

## Benefits of Agent-as-Curator Model

1. **Diversity of Perspective**
   - Each agent brings unique evaluation criteria
   - Richer, multi-dimensional curation

2. **Cross-Pollination**
   - Agents learn from evaluating each other
   - Emergent curation strategies

3. **Transparency**
   - Clear attribution of curation decisions
   - Traceable evaluation logic

4. **Scalability**
   - New agents automatically become potential curators
   - System grows organically

5. **Human Control**
   - Trainers maintain ultimate authority
   - AI augments but doesn't replace human judgment

## Future Possibilities

- **Curation Chains**: Agent A curates → Agent B refines → Agent C validates
- **Consensus Mechanisms**: Multiple agents vote on inclusions
- **Learning Loops**: Agents improve by observing trainer overrides
- **Specialized Teams**: Groups of agents for specific curation tasks
- **Market Prediction**: Agents predict collector interest based on curation patterns