# ARCHIVED NINA FEATURES
## Preserved for potential future reintroduction
## Archived: August 24, 2025

---

## REMOVED FROM MAIN INTERFACE (/index.html)

### Playoff Mode
- **What it did**: Tournament-style bracket competition between images
- **Code location**: Lines 500-700 in old index.html
- **Why removed**: Redundant with A/B comparison in unified interface
- **Reintroduction potential**: Could add as "Tournament" sub-mode in COMPARE

### Three-Mode Selector
- **What it did**: Radio buttons for Single/Batch/Playoff modes
- **Why removed**: Simplified to automatic detection (1 image = single, multiple = batch)
- **Reintroduction potential**: Not needed, auto-detection is better

### Complex Modal Dialogs
- **What it did**: Pop-up windows for various inputs
- **Why removed**: Disrupted flow, annoying UX
- **Reintroduction potential**: Use inline forms instead

---

## REMOVED FROM STUDIO (/nina-studio.html)

### Video Analysis Tab
- **What it did**: Evaluated motion art and video files
- **Code location**: /api/nina-video-analyzer.js
- **Why removed**: Edge case, added complexity, rarely used
- **Key logic**: Frame extraction, temporal coherence analysis
- **Reintroduction potential**: Could be separate specialized tool

### Style Fingerprint Tab
- **What it did**: Visualized artist's dimensional preferences
- **Code location**: Lines 1100-1200 in nina-studio.html
- **Why removed**: Overcomplicated, learning happens automatically now
- **Key features**: Radar charts, preference evolution tracking
- **Reintroduction potential**: Could add as data viz in REFINE mode

### Series Analysis Tab
- **What it did**: Analyzed coherence of 5-20 image series
- **Code location**: Integration with /api/nina-curation.js
- **Why removed**: Merged into COLLECT mode
- **Key features**: Narrative flow, thematic consistency
- **Reintroduction potential**: Already integrated into collections

### Prompt Lab Tab
- **What it did**: Tested and enhanced prompts
- **Code location**: /api/nina-prompt-enhancement.js
- **Why removed**: Moved to CREATE mode as core feature
- **Key features**: Success probability, dimensional optimization
- **Reintroduction potential**: Now core feature, not separate

### Learning & Feedback Tab
- **What it did**: Manual feedback on evaluations
- **Code location**: /api/nina-learning.js integration
- **Why removed**: Learning now automatic based on user selections
- **Key features**: Upvote/downvote, preference learning
- **Reintroduction potential**: Implicit in CURATE actions

---

## COMPLEX FEATURES SIMPLIFIED

### Multi-Role Collections
- **Original**: hero/anchor/supporting/contextual roles
- **Simplified to**: selected/not selected
- **Saved logic**: Role assignment algorithm based on scores

### Weighted Dimension Adjustments
- **Original**: Sliders to adjust Paris Photo/AI-Criticality/etc weights
- **Simplified to**: Fixed optimal weights
- **Saved config**: Original weight calculations in nina-config.js

### Success Pattern Tracking
- **Original**: Complex pattern matching across evaluations
- **Simplified to**: Top 3 patterns shown in REFINE
- **Saved logic**: Pattern extraction algorithms

### Batch Normalization Options
- **Original**: Z-score, percentile, raw score options
- **Simplified to**: Automatic best method
- **Saved logic**: Statistical normalization functions

---

## API ENDPOINTS CONSOLIDATED

### Removed Endpoints
- `/api/nina-video-analyzer.js` - Archived
- `/api/nina-prompt-enhancement.js` - Integrated into main
- `/api/nina-learning.js` - Made implicit

### Consolidated Into
- `/api/nina.js` - Single endpoint with action parameter

---

## UI COMPONENTS ARCHIVED

### Complex Visualizations
- Radar charts for fingerprints
- Bracket visualizations for playoffs  
- Temporal evolution graphs
- Dimension bar charts

### Interaction Patterns
- Drag to reorder series
- Slider adjustments
- Modal confirmations
- Multi-step wizards

---

## DATABASE SCHEMA PRESERVED

Original Supabase schema saved in `setup-supabase.sql` includes:
- evaluations table (keep)
- collections table (keep)
- learning_feedback table (archive)
- style_fingerprints table (archive)
- success_patterns table (archive)

---

## REINTRODUCTION PRIORITY

If we want to bring features back, priority order:

1. **Tournament Mode** - Fun, engaging, differentiator
2. **Style Visualization** - Good for presentations
3. **Prompt Success Probability** - Valuable for creators
4. **Video Analysis** - Only if demand emerges
5. **Complex Roles** - Probably never needed

---

## PRESERVED CODE SNIPPETS

### Pattern Recognition Algorithm
```javascript
// From nina-learning.js - finds what makes images successful
function extractSuccessPatterns(evaluations) {
    const patterns = evaluations
        .filter(e => e.weighted_total > 0.85)
        .reduce((acc, eval) => {
            // Complex pattern extraction logic
            return acc;
        }, {});
    return patterns;
}
```

### Coherence Calculation
```javascript
// From nina-curation.js - checks if series works together
function calculateSeriesCoherence(images) {
    // Narrative flow, color consistency, thematic unity
    return coherenceScore;
}
```

### Prompt Enhancement
```javascript
// From nina-prompt-enhancement.js - optimizes for success
function enhancePrompt(basePrompt, artistProfile) {
    // Adds dimensional optimizations
    return enhancedPrompt;
}
```

---

## NOTES FOR REINTRODUCTION

When bringing features back:
1. Start with user demand/feedback
2. Implement as sub-features, not new tabs
3. Keep the core simple
4. Progressive disclosure (advanced features hidden by default)
5. Measure usage before adding complexity

---

*This archive ensures we can resurrect any feature if needed while keeping Nina clean and focused.*