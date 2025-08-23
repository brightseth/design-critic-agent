// Nina Learning System - Adaptive Curation Intelligence
// This module enables Nina to learn from feedback and improve over time

const fs = require('fs').promises;
const path = require('path');

class NinaLearning {
  constructor(dataPath = './nina-learning-data') {
    this.dataPath = dataPath;
    this.memory = {
      feedback_history: [],
      style_fingerprints: {},
      success_patterns: [],
      failure_patterns: [],
      artist_preferences: {},
      exhibition_outcomes: [],
      prompt_effectiveness: {}
    };
    this.initialized = false;
  }

  // Initialize learning system
  async initialize() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataPath, { recursive: true });
      
      // Load existing memory
      await this.loadMemory();
      
      this.initialized = true;
      console.log('Nina Learning System initialized');
    } catch (error) {
      console.error('Failed to initialize Nina Learning:', error);
    }
  }

  // Load memory from disk
  async loadMemory() {
    try {
      const memoryFile = path.join(this.dataPath, 'nina-memory.json');
      const data = await fs.readFile(memoryFile, 'utf8');
      this.memory = JSON.parse(data);
      console.log(`Loaded ${this.memory.feedback_history.length} feedback entries`);
    } catch (error) {
      console.log('No existing memory found, starting fresh');
    }
  }

  // Save memory to disk
  async saveMemory() {
    try {
      const memoryFile = path.join(this.dataPath, 'nina-memory.json');
      await fs.writeFile(memoryFile, JSON.stringify(this.memory, null, 2));
      
      // Also create backup
      const backupFile = path.join(this.dataPath, `nina-memory-${Date.now()}.json`);
      await fs.writeFile(backupFile, JSON.stringify(this.memory, null, 2));
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  }

  // FEEDBACK LOOP SYSTEM
  async recordFeedback(evaluation, userFeedback) {
    const feedback = {
      id: `feedback_${Date.now()}`,
      timestamp: new Date().toISOString(),
      original_evaluation: evaluation,
      user_feedback: userFeedback,
      adjustments: this.calculateAdjustments(evaluation, userFeedback)
    };

    this.memory.feedback_history.push(feedback);
    
    // Update pattern recognition
    if (userFeedback.agree === false) {
      await this.analyzeDisagreement(evaluation, userFeedback);
    }
    
    // Learn from successful predictions
    if (userFeedback.agree === true && evaluation.weighted_total > 0.75) {
      await this.recordSuccessPattern(evaluation);
    }

    await this.saveMemory();
    return feedback;
  }

  // Calculate what adjustments Nina should make based on feedback
  calculateAdjustments(evaluation, feedback) {
    const adjustments = {
      dimension_weights: {},
      threshold_changes: {},
      new_patterns: []
    };

    // If user thinks score is too low
    if (feedback.suggested_score > evaluation.weighted_total * 100) {
      const diff = feedback.suggested_score - (evaluation.weighted_total * 100);
      
      // Identify which dimensions user values more
      if (feedback.reasons) {
        feedback.reasons.forEach(reason => {
          if (reason.dimension) {
            adjustments.dimension_weights[reason.dimension] = {
              current: evaluation.scores_raw[reason.dimension],
              suggested: reason.suggested_score,
              learning_rate: 0.1
            };
          }
        });
      }
    }

    // Learn from verdict disagreements
    if (feedback.suggested_verdict !== evaluation.verdict) {
      adjustments.threshold_changes = {
        current_verdict: evaluation.verdict,
        suggested_verdict: feedback.suggested_verdict,
        score: evaluation.weighted_total
      };
    }

    return adjustments;
  }

  // Analyze disagreements to find patterns
  async analyzeDisagreement(evaluation, feedback) {
    const pattern = {
      timestamp: new Date().toISOString(),
      image_characteristics: evaluation.i_see,
      nina_verdict: evaluation.verdict,
      user_verdict: feedback.suggested_verdict,
      dimension_gaps: {}
    };

    // Find largest gaps in dimension scoring
    Object.keys(evaluation.scores_raw).forEach(dim => {
      if (feedback.dimension_scores && feedback.dimension_scores[dim]) {
        const gap = feedback.dimension_scores[dim] - evaluation.scores_raw[dim];
        if (Math.abs(gap) > 10) {
          pattern.dimension_gaps[dim] = gap;
        }
      }
    });

    this.memory.failure_patterns.push(pattern);
    
    // If we see repeated patterns, adjust base scoring
    await this.detectSystematicBias();
  }

  // Detect if Nina has systematic biases
  async detectSystematicBias() {
    const recentFailures = this.memory.failure_patterns.slice(-20);
    const biases = {};

    recentFailures.forEach(failure => {
      Object.entries(failure.dimension_gaps).forEach(([dim, gap]) => {
        if (!biases[dim]) biases[dim] = [];
        biases[dim].push(gap);
      });
    });

    // Calculate average bias per dimension
    const systematicBias = {};
    Object.entries(biases).forEach(([dim, gaps]) => {
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      if (Math.abs(avgGap) > 5) {
        systematicBias[dim] = avgGap;
      }
    });

    if (Object.keys(systematicBias).length > 0) {
      console.log('Systematic bias detected:', systematicBias);
      return systematicBias;
    }

    return null;
  }

  // STYLE FINGERPRINTING
  async createStyleFingerprint(artistId, imageSet) {
    const fingerprint = {
      artist_id: artistId,
      created: new Date().toISOString(),
      total_samples: imageSet.length,
      characteristics: {
        color_palette: [],
        compositional_patterns: [],
        recurring_themes: [],
        technical_preferences: [],
        conceptual_markers: []
      },
      scoring_tendencies: {
        avg_scores: {},
        preferred_dimensions: [],
        success_threshold: 0
      }
    };

    // Analyze the image set
    for (const image of imageSet) {
      // Extract patterns from evaluations
      if (image.evaluation) {
        // Track scoring patterns
        Object.entries(image.evaluation.scores_raw).forEach(([dim, score]) => {
          if (!fingerprint.scoring_tendencies.avg_scores[dim]) {
            fingerprint.scoring_tendencies.avg_scores[dim] = [];
          }
          fingerprint.scoring_tendencies.avg_scores[dim].push(score);
        });

        // Extract visual patterns from i_see descriptions
        if (image.evaluation.i_see) {
          const patterns = this.extractVisualPatterns(image.evaluation.i_see);
          patterns.forEach(p => {
            if (!fingerprint.characteristics.compositional_patterns.includes(p)) {
              fingerprint.characteristics.compositional_patterns.push(p);
            }
          });
        }
      }
    }

    // Calculate averages and identify preferences
    Object.entries(fingerprint.scoring_tendencies.avg_scores).forEach(([dim, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      fingerprint.scoring_tendencies.avg_scores[dim] = avg;
      
      if (avg > 70) {
        fingerprint.scoring_tendencies.preferred_dimensions.push(dim);
      }
    });

    // Calculate success threshold (what score this artist typically achieves)
    const allScores = imageSet.map(img => img.evaluation?.weighted_total || 0);
    fingerprint.scoring_tendencies.success_threshold = 
      allScores.reduce((a, b) => a + b, 0) / allScores.length;

    this.memory.style_fingerprints[artistId] = fingerprint;
    await this.saveMemory();
    
    return fingerprint;
  }

  // Extract visual patterns from descriptions
  extractVisualPatterns(description) {
    const patterns = [];
    
    // Look for compositional keywords
    const compositionalTerms = [
      'centered', 'diagonal', 'symmetrical', 'asymmetrical', 
      'minimal', 'complex', 'layered', 'geometric', 'organic'
    ];
    
    compositionalTerms.forEach(term => {
      if (description.toLowerCase().includes(term)) {
        patterns.push(term);
      }
    });

    // Look for thematic elements
    const thematicTerms = [
      'portrait', 'landscape', 'abstract', 'figurative',
      'identity', 'technology', 'nature', 'urban'
    ];
    
    thematicTerms.forEach(term => {
      if (description.toLowerCase().includes(term)) {
        patterns.push(`theme:${term}`);
      }
    });

    return patterns;
  }

  // Apply style fingerprint to adjust evaluation
  async applyStyleFingerprint(evaluation, artistId) {
    const fingerprint = this.memory.style_fingerprints[artistId];
    if (!fingerprint) return evaluation;

    const adjusted = { ...evaluation };
    
    // Adjust scores based on artist's typical performance
    Object.entries(fingerprint.scoring_tendencies.avg_scores).forEach(([dim, avgScore]) => {
      if (adjusted.scores_raw[dim]) {
        // If this dimension typically scores high for this artist, be slightly more generous
        if (avgScore > 70 && adjusted.scores_raw[dim] < avgScore) {
          adjusted.scores_raw[dim] = Math.min(100, adjusted.scores_raw[dim] + 5);
          adjusted.fingerprint_adjusted = true;
        }
      }
    });

    // Add context about artist's style
    adjusted.artist_context = {
      typical_score: fingerprint.scoring_tendencies.success_threshold,
      strong_dimensions: fingerprint.scoring_tendencies.preferred_dimensions,
      style_markers: fingerprint.characteristics.compositional_patterns
    };

    return adjusted;
  }

  // SUCCESS TRACKING
  async recordSuccessPattern(evaluation) {
    const pattern = {
      id: `success_${Date.now()}`,
      timestamp: new Date().toISOString(),
      score: evaluation.weighted_total,
      verdict: evaluation.verdict,
      key_factors: this.extractKeyFactors(evaluation),
      visual_description: evaluation.i_see,
      high_scoring_dimensions: this.getHighScoringDimensions(evaluation)
    };

    this.memory.success_patterns.push(pattern);
    
    // Update prompt effectiveness if available
    if (evaluation.prompt_used) {
      await this.updatePromptEffectiveness(evaluation.prompt_used, evaluation.weighted_total);
    }

    await this.saveMemory();
    return pattern;
  }

  // Extract key factors that led to success
  extractKeyFactors(evaluation) {
    const factors = [];
    
    // High scoring dimensions
    Object.entries(evaluation.scores_raw).forEach(([dim, score]) => {
      if (score >= 80) {
        factors.push({
          dimension: dim,
          score: score,
          rationale: evaluation.rationales[dim]
        });
      }
    });

    // Clean gates
    if (evaluation.gate.compositional_integrity && 
        evaluation.gate.artifact_control && 
        evaluation.gate.ethics_process === 'present') {
      factors.push({ type: 'clean_gates', value: 'All gates passed' });
    }

    // No penalties
    if (!evaluation.flags || evaluation.flags.length === 0) {
      factors.push({ type: 'no_penalties', value: 'No flags raised' });
    }

    return factors;
  }

  // Get dimensions that scored 70+
  getHighScoringDimensions(evaluation) {
    return Object.entries(evaluation.scores_raw)
      .filter(([dim, score]) => score >= 70)
      .map(([dim, score]) => ({ dimension: dim, score }));
  }

  // Track prompt effectiveness
  async updatePromptEffectiveness(prompt, score) {
    const promptKey = this.generatePromptKey(prompt);
    
    if (!this.memory.prompt_effectiveness[promptKey]) {
      this.memory.prompt_effectiveness[promptKey] = {
        prompt: prompt,
        uses: 0,
        scores: [],
        avg_score: 0,
        success_rate: 0
      };
    }

    const effectiveness = this.memory.prompt_effectiveness[promptKey];
    effectiveness.uses++;
    effectiveness.scores.push(score);
    effectiveness.avg_score = effectiveness.scores.reduce((a, b) => a + b, 0) / effectiveness.scores.length;
    effectiveness.success_rate = effectiveness.scores.filter(s => s >= 0.75).length / effectiveness.scores.length;

    await this.saveMemory();
  }

  // Generate a key from prompt for tracking
  generatePromptKey(prompt) {
    // Extract key terms from prompt
    const keyTerms = prompt.toLowerCase()
      .match(/\b(portrait|landscape|abstract|identity|technology|cyborg|posthuman)\b/g);
    
    return keyTerms ? keyTerms.sort().join('_') : 'generic';
  }

  // RECOMMENDATION ENGINE
  async getRecommendations(currentEvaluation) {
    const recommendations = {
      improvements: [],
      similar_successes: [],
      prompt_suggestions: [],
      dimension_focus: []
    };

    // Find similar successful works
    recommendations.similar_successes = this.findSimilarSuccesses(currentEvaluation);

    // Identify improvement areas
    if (currentEvaluation.weighted_total < 0.75) {
      recommendations.improvements = this.identifyImprovements(currentEvaluation);
    }

    // Suggest prompts based on success patterns
    recommendations.prompt_suggestions = await this.suggestPrompts(currentEvaluation);

    // Recommend which dimensions to focus on
    recommendations.dimension_focus = this.recommendDimensionFocus(currentEvaluation);

    return recommendations;
  }

  // Find similar images that scored well
  findSimilarSuccesses(evaluation) {
    const similar = [];
    const evalPatterns = this.extractVisualPatterns(evaluation.i_see);

    this.memory.success_patterns.forEach(success => {
      const successPatterns = this.extractVisualPatterns(success.visual_description);
      const overlap = evalPatterns.filter(p => successPatterns.includes(p)).length;
      
      if (overlap >= 2) {
        similar.push({
          ...success,
          similarity_score: overlap / evalPatterns.length
        });
      }
    });

    return similar.sort((a, b) => b.similarity_score - a.similarity_score).slice(0, 3);
  }

  // Identify specific improvements
  identifyImprovements(evaluation) {
    const improvements = [];

    // Check gates first
    if (!evaluation.gate.compositional_integrity) {
      improvements.push({
        priority: 'high',
        area: 'composition',
        suggestion: 'Focus on compositional coherence - ensure all elements work together',
        potential_gain: 10
      });
    }

    if (!evaluation.gate.artifact_control) {
      improvements.push({
        priority: 'high',
        area: 'technical',
        suggestion: 'Address AI artifacts - refine generation parameters or post-process',
        potential_gain: 15
      });
    }

    // Check low-scoring dimensions
    Object.entries(evaluation.scores_raw).forEach(([dim, score]) => {
      if (score < 60) {
        improvements.push({
          priority: 'medium',
          area: dim,
          current_score: score,
          suggestion: this.getDimensionImprovement(dim, score),
          potential_gain: 70 - score
        });
      }
    });

    return improvements.sort((a, b) => b.potential_gain - a.potential_gain);
  }

  // Get specific improvement suggestion for dimension
  getDimensionImprovement(dimension, currentScore) {
    const suggestions = {
      paris_photo_ready: 'Strengthen wall presence - consider scale, impact, and gallery context',
      ai_criticality: 'Embed AI critique visibly in the work - show dataset politics or bias examination',
      conceptual_strength: 'Clarify conceptual framework - make ideas visible in composition',
      technical_excellence: 'Refine technical execution - focus on lighting, color grading, edge control',
      cultural_dialogue: 'Strengthen art historical references while maintaining originality'
    };

    return suggestions[dimension] || 'Focus on improving this dimension';
  }

  // Suggest prompts based on patterns
  async suggestPrompts(evaluation) {
    const suggestions = [];

    // Find high-performing prompt patterns
    const topPrompts = Object.values(this.memory.prompt_effectiveness)
      .filter(p => p.success_rate > 0.7)
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, 3);

    topPrompts.forEach(prompt => {
      suggestions.push({
        base_prompt: prompt.prompt,
        avg_score: prompt.avg_score,
        success_rate: prompt.success_rate,
        modification_hint: 'Adapt this successful pattern to your concept'
      });
    });

    return suggestions;
  }

  // Recommend which dimensions to focus on
  recommendDimensionFocus(evaluation) {
    const recommendations = [];
    const weights = {
      paris_photo_ready: 0.30,
      ai_criticality: 0.25,
      conceptual_strength: 0.20,
      technical_excellence: 0.15,
      cultural_dialogue: 0.10
    };

    Object.entries(evaluation.scores_raw).forEach(([dim, score]) => {
      const potential = (100 - score) * weights[dim];
      const effort = score < 50 ? 'high' : score < 70 ? 'medium' : 'low';
      
      recommendations.push({
        dimension: dim,
        current_score: score,
        weight: weights[dim],
        potential_impact: potential,
        effort_required: effort,
        roi: potential / (effort === 'high' ? 3 : effort === 'medium' ? 2 : 1)
      });
    });

    return recommendations.sort((a, b) => b.roi - a.roi);
  }

  // Get learning statistics
  async getStats() {
    return {
      total_feedback: this.memory.feedback_history.length,
      style_fingerprints: Object.keys(this.memory.style_fingerprints).length,
      success_patterns: this.memory.success_patterns.length,
      failure_patterns: this.memory.failure_patterns.length,
      prompt_patterns: Object.keys(this.memory.prompt_effectiveness).length,
      last_updated: this.memory.feedback_history[this.memory.feedback_history.length - 1]?.timestamp || 'Never'
    };
  }
}

module.exports = NinaLearning;