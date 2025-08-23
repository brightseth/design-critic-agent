// Nina Curation Workflows - Advanced Collection Management
// Tools for building exhibitions, comparing variations, and ensuring series coherence

const NinaLearning = require('./nina-learning');

class NinaCuration {
  constructor() {
    this.collections = {};
    this.comparisons = [];
    this.series = {};
    this.learning = new NinaLearning();
  }

  // COLLECTION BUILDER
  async createCollection(name, theme, targetSize = 20) {
    const collection = {
      id: `collection_${Date.now()}`,
      name: name,
      theme: theme,
      created: new Date().toISOString(),
      target_size: targetSize,
      images: [],
      statistics: {
        avg_score: 0,
        score_range: { min: 100, max: 0 },
        dominant_themes: [],
        coherence_score: 0
      },
      curatorial_statement: '',
      exhibition_ready: false
    };

    this.collections[collection.id] = collection;
    return collection;
  }

  // Add image to collection with automatic grouping
  async addToCollection(collectionId, image, evaluation) {
    const collection = this.collections[collectionId];
    if (!collection) throw new Error('Collection not found');

    // Enhanced image object with metadata
    const collectionImage = {
      id: image.id || `img_${Date.now()}`,
      added: new Date().toISOString(),
      image_data: image,
      evaluation: evaluation,
      collection_role: this.determineRole(evaluation, collection),
      thematic_tags: this.extractThemes(evaluation),
      relationships: []
    };

    collection.images.push(collectionImage);
    
    // Update collection statistics
    await this.updateCollectionStats(collection);
    
    // Check coherence with existing images
    if (collection.images.length > 1) {
      await this.analyzeCoherence(collection);
    }

    // Generate grouping suggestions
    const groups = await this.suggestGroupings(collection);
    collection.suggested_groupings = groups;

    return {
      collection: collection,
      image_role: collectionImage.collection_role,
      coherence_impact: collection.statistics.coherence_score
    };
  }

  // Determine what role this image plays in the collection
  determineRole(evaluation, collection) {
    const score = evaluation.weighted_total;
    const existingScores = collection.images.map(img => img.evaluation.weighted_total);
    
    if (score >= 0.85) return 'hero';
    if (score >= 0.75) return 'anchor';
    if (score >= 0.65) return 'supporting';
    if (score >= 0.55) return 'contextual';
    return 'consideration';
  }

  // Extract thematic elements from evaluation
  extractThemes(evaluation) {
    const themes = [];
    const description = evaluation.i_see.toLowerCase();
    
    // Technical themes
    if (description.includes('portrait') || description.includes('figure')) themes.push('portraiture');
    if (description.includes('landscape') || description.includes('environment')) themes.push('landscape');
    if (description.includes('abstract')) themes.push('abstract');
    
    // Conceptual themes
    if (evaluation.scores_raw.ai_criticality > 70) themes.push('ai-critical');
    if (evaluation.scores_raw.conceptual_strength > 70) themes.push('conceptual');
    if (description.includes('identity')) themes.push('identity');
    if (description.includes('posthuman') || description.includes('cyborg')) themes.push('posthuman');
    
    // Visual themes
    if (description.includes('minimal')) themes.push('minimal');
    if (description.includes('complex') || description.includes('layered')) themes.push('complex');
    if (description.includes('geometric')) themes.push('geometric');
    if (description.includes('organic')) themes.push('organic');
    
    return themes;
  }

  // Update collection statistics
  async updateCollectionStats(collection) {
    const scores = collection.images.map(img => img.evaluation.weighted_total);
    
    collection.statistics.avg_score = scores.reduce((a, b) => a + b, 0) / scores.length;
    collection.statistics.score_range.min = Math.min(...scores);
    collection.statistics.score_range.max = Math.max(...scores);
    
    // Find dominant themes
    const allThemes = {};
    collection.images.forEach(img => {
      img.thematic_tags.forEach(theme => {
        allThemes[theme] = (allThemes[theme] || 0) + 1;
      });
    });
    
    collection.statistics.dominant_themes = Object.entries(allThemes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, count, percentage: (count / collection.images.length) * 100 }));
  }

  // Analyze coherence between images
  async analyzeCoherence(collection) {
    let coherenceScore = 100;
    const issues = [];
    
    // Check score variance (too much variance = less coherent)
    const scores = collection.images.map(img => img.evaluation.weighted_total);
    const variance = this.calculateVariance(scores);
    if (variance > 0.2) {
      coherenceScore -= 20;
      issues.push('High score variance between pieces');
    }
    
    // Check thematic consistency
    const themeConsistency = this.checkThemeConsistency(collection);
    if (themeConsistency < 0.5) {
      coherenceScore -= 15;
      issues.push('Inconsistent themes across collection');
    }
    
    // Check visual style consistency
    const styleConsistency = await this.checkStyleConsistency(collection);
    if (styleConsistency < 0.6) {
      coherenceScore -= 15;
      issues.push('Visual styles vary too much');
    }
    
    collection.statistics.coherence_score = Math.max(0, coherenceScore);
    collection.coherence_issues = issues;
    
    return coherenceScore;
  }

  // Calculate statistical variance
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  // Check thematic consistency
  checkThemeConsistency(collection) {
    if (collection.images.length < 2) return 1;
    
    // Find themes that appear in at least 50% of images
    const themeFrequency = {};
    collection.images.forEach(img => {
      img.thematic_tags.forEach(theme => {
        themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
      });
    });
    
    const consistentThemes = Object.entries(themeFrequency)
      .filter(([theme, count]) => count >= collection.images.length * 0.5);
    
    return consistentThemes.length > 0 ? consistentThemes.length / Object.keys(themeFrequency).length : 0;
  }

  // Check visual style consistency
  async checkStyleConsistency(collection) {
    // Compare i_see descriptions for stylistic similarities
    const descriptions = collection.images.map(img => img.evaluation.i_see.toLowerCase());
    
    // Look for common visual descriptors
    const visualTerms = ['minimal', 'complex', 'geometric', 'organic', 'centered', 'diagonal', 'symmetrical'];
    const commonTerms = visualTerms.filter(term => 
      descriptions.filter(desc => desc.includes(term)).length >= descriptions.length * 0.4
    );
    
    return commonTerms.length / visualTerms.length;
  }

  // Suggest groupings within collection
  async suggestGroupings(collection) {
    const groups = {
      by_score: this.groupByScore(collection),
      by_theme: this.groupByTheme(collection),
      by_role: this.groupByRole(collection),
      optimal_sequence: await this.findOptimalSequence(collection)
    };
    
    return groups;
  }

  // Group images by score tiers
  groupByScore(collection) {
    return {
      heroes: collection.images.filter(img => img.evaluation.weighted_total >= 0.85),
      anchors: collection.images.filter(img => img.evaluation.weighted_total >= 0.75 && img.evaluation.weighted_total < 0.85),
      supporting: collection.images.filter(img => img.evaluation.weighted_total >= 0.65 && img.evaluation.weighted_total < 0.75),
      contextual: collection.images.filter(img => img.evaluation.weighted_total < 0.65)
    };
  }

  // Group images by dominant themes
  groupByTheme(collection) {
    const themeGroups = {};
    
    collection.images.forEach(img => {
      img.thematic_tags.forEach(theme => {
        if (!themeGroups[theme]) themeGroups[theme] = [];
        themeGroups[theme].push(img);
      });
    });
    
    return themeGroups;
  }

  // Group by assigned roles
  groupByRole(collection) {
    const roleGroups = {};
    
    collection.images.forEach(img => {
      const role = img.collection_role;
      if (!roleGroups[role]) roleGroups[role] = [];
      roleGroups[role].push(img);
    });
    
    return roleGroups;
  }

  // Find optimal display sequence
  async findOptimalSequence(collection) {
    if (collection.images.length <= 1) return collection.images;
    
    // Start with highest scoring image
    const sorted = [...collection.images].sort((a, b) => 
      b.evaluation.weighted_total - a.evaluation.weighted_total
    );
    
    const sequence = [sorted[0]];
    const remaining = sorted.slice(1);
    
    // Build sequence by alternating scores and themes
    while (remaining.length > 0) {
      const last = sequence[sequence.length - 1];
      
      // Find image that creates good rhythm
      let bestNext = null;
      let bestScore = -1;
      
      remaining.forEach(img => {
        let rhythmScore = 0;
        
        // Prefer score variation (not too similar)
        const scoreDiff = Math.abs(img.evaluation.weighted_total - last.evaluation.weighted_total);
        if (scoreDiff > 0.1 && scoreDiff < 0.3) rhythmScore += 2;
        
        // Prefer some thematic connection
        const sharedThemes = img.thematic_tags.filter(t => last.thematic_tags.includes(t)).length;
        if (sharedThemes > 0 && sharedThemes < last.thematic_tags.length) rhythmScore += 1;
        
        if (rhythmScore > bestScore) {
          bestScore = rhythmScore;
          bestNext = img;
        }
      });
      
      if (bestNext) {
        sequence.push(bestNext);
        remaining.splice(remaining.indexOf(bestNext), 1);
      } else {
        sequence.push(remaining.shift());
      }
    }
    
    return sequence;
  }

  // A/B TESTING MODE
  async createComparison(variations, testCriteria = 'overall_score') {
    const comparison = {
      id: `comparison_${Date.now()}`,
      created: new Date().toISOString(),
      variations: variations.map((v, idx) => ({
        id: `var_${idx}`,
        image: v.image,
        evaluation: v.evaluation,
        metrics: this.extractMetrics(v.evaluation)
      })),
      test_criteria: testCriteria,
      results: null
    };
    
    // Run comparison
    comparison.results = await this.runComparison(comparison);
    
    this.comparisons.push(comparison);
    return comparison;
  }

  // Extract relevant metrics for comparison
  extractMetrics(evaluation) {
    return {
      overall_score: evaluation.weighted_total,
      dimensions: evaluation.scores_raw,
      gates_passed: (
        evaluation.gate.compositional_integrity && 
        evaluation.gate.artifact_control && 
        evaluation.gate.ethics_process === 'present'
      ),
      verdict: evaluation.verdict,
      flags: evaluation.flags || []
    };
  }

  // Run the comparison analysis
  async runComparison(comparison) {
    const results = {
      winner: null,
      ranking: [],
      analysis: {},
      recommendations: []
    };
    
    // Sort by test criteria
    const sorted = [...comparison.variations].sort((a, b) => {
      if (comparison.test_criteria === 'overall_score') {
        return b.metrics.overall_score - a.metrics.overall_score;
      }
      // Add other criteria as needed
      return 0;
    });
    
    results.ranking = sorted.map(v => v.id);
    results.winner = sorted[0].id;
    
    // Analyze differences
    results.analysis = {
      score_spread: Math.max(...sorted.map(v => v.metrics.overall_score)) - 
                   Math.min(...sorted.map(v => v.metrics.overall_score)),
      unanimous_winner: sorted[0].metrics.overall_score - sorted[1].metrics.overall_score > 0.1,
      key_differences: this.identifyKeyDifferences(sorted)
    };
    
    // Generate recommendations
    results.recommendations = await this.generateComparisonRecommendations(sorted);
    
    return results;
  }

  // Identify what makes variations different
  identifyKeyDifferences(variations) {
    const differences = [];
    
    if (variations.length < 2) return differences;
    
    const best = variations[0];
    const others = variations.slice(1);
    
    // Compare dimensions
    Object.keys(best.metrics.dimensions).forEach(dim => {
      const bestScore = best.metrics.dimensions[dim];
      const avgOthers = others.reduce((sum, v) => sum + v.metrics.dimensions[dim], 0) / others.length;
      
      if (bestScore - avgOthers > 10) {
        differences.push({
          type: 'dimension_advantage',
          dimension: dim,
          advantage: bestScore - avgOthers
        });
      }
    });
    
    // Compare gates
    if (best.metrics.gates_passed && !others.every(v => v.metrics.gates_passed)) {
      differences.push({
        type: 'gates_advantage',
        description: 'Winner passed all gates'
      });
    }
    
    return differences;
  }

  // Generate recommendations based on comparison
  async generateComparisonRecommendations(variations) {
    const recommendations = [];
    const best = variations[0];
    
    // What made the winner successful?
    recommendations.push({
      type: 'success_factors',
      message: `Winner scored ${(best.metrics.overall_score * 100).toFixed(1)}`,
      factors: this.extractSuccessFactors(best)
    });
    
    // How to improve others
    variations.slice(1).forEach(variant => {
      recommendations.push({
        type: 'improvement',
        variant: variant.id,
        suggestions: this.suggestImprovements(variant, best)
      });
    });
    
    return recommendations;
  }

  // Extract what made a variation successful
  extractSuccessFactors(variation) {
    const factors = [];
    
    // High scoring dimensions
    Object.entries(variation.metrics.dimensions).forEach(([dim, score]) => {
      if (score >= 75) {
        factors.push(`Strong ${dim}: ${score}`);
      }
    });
    
    // Clean gates
    if (variation.metrics.gates_passed) {
      factors.push('All quality gates passed');
    }
    
    return factors;
  }

  // Suggest how to improve a variation
  suggestImprovements(variation, best) {
    const improvements = [];
    
    // Dimension improvements
    Object.keys(variation.metrics.dimensions).forEach(dim => {
      const gap = best.metrics.dimensions[dim] - variation.metrics.dimensions[dim];
      if (gap > 10) {
        improvements.push(`Improve ${dim} (+${gap.toFixed(0)} potential)`);
      }
    });
    
    // Gate improvements
    if (best.metrics.gates_passed && !variation.metrics.gates_passed) {
      improvements.push('Address quality gate failures');
    }
    
    return improvements;
  }

  // SERIES COHERENCE EVALUATOR
  async evaluateSeries(images, seriesName) {
    const series = {
      id: `series_${Date.now()}`,
      name: seriesName,
      created: new Date().toISOString(),
      images: images,
      coherence_analysis: await this.analyzeSeriesCoherence(images),
      narrative_flow: await this.analyzeNarrativeFlow(images),
      exhibition_readiness: null,
      recommendations: []
    };
    
    // Determine if series is exhibition ready
    series.exhibition_readiness = this.assessExhibitionReadiness(series);
    
    // Generate recommendations
    series.recommendations = await this.generateSeriesRecommendations(series);
    
    this.series[series.id] = series;
    return series;
  }

  // Analyze coherence across a series
  async analyzeSeriesCoherence(images) {
    const analysis = {
      overall_coherence: 100,
      visual_consistency: 0,
      thematic_unity: 0,
      quality_consistency: 0,
      narrative_clarity: 0,
      issues: []
    };
    
    // Visual consistency
    const visualPatterns = images.map(img => this.extractVisualSignature(img.evaluation));
    analysis.visual_consistency = this.calculatePatternConsistency(visualPatterns);
    if (analysis.visual_consistency < 0.6) {
      analysis.overall_coherence -= 25;
      analysis.issues.push('Visual style varies too much across series');
    }
    
    // Thematic unity
    const themes = images.map(img => this.extractThemes(img.evaluation));
    analysis.thematic_unity = this.calculateThemeUnity(themes);
    if (analysis.thematic_unity < 0.5) {
      analysis.overall_coherence -= 20;
      analysis.issues.push('Themes are not consistent throughout series');
    }
    
    // Quality consistency
    const scores = images.map(img => img.evaluation.weighted_total);
    const qualityVariance = this.calculateVariance(scores);
    analysis.quality_consistency = 1 - Math.min(1, qualityVariance);
    if (qualityVariance > 0.2) {
      analysis.overall_coherence -= 15;
      analysis.issues.push('Quality varies significantly between pieces');
    }
    
    return analysis;
  }

  // Extract visual signature from evaluation
  extractVisualSignature(evaluation) {
    const signature = {
      composition: [],
      color: [],
      technique: []
    };
    
    const desc = evaluation.i_see.toLowerCase();
    
    // Composition markers
    ['centered', 'diagonal', 'symmetrical', 'asymmetrical', 'minimal', 'complex']
      .forEach(term => {
        if (desc.includes(term)) signature.composition.push(term);
      });
    
    // Technical markers
    ['sharp', 'soft', 'high contrast', 'low contrast', 'saturated', 'muted']
      .forEach(term => {
        if (desc.includes(term)) signature.technique.push(term);
      });
    
    return signature;
  }

  // Calculate consistency of visual patterns
  calculatePatternConsistency(patterns) {
    if (patterns.length < 2) return 1;
    
    // Find common elements across all patterns
    const allCompositions = patterns.map(p => p.composition).flat();
    const allTechniques = patterns.map(p => p.technique).flat();
    
    const compositionCounts = {};
    const techniqueCounts = {};
    
    allCompositions.forEach(c => compositionCounts[c] = (compositionCounts[c] || 0) + 1);
    allTechniques.forEach(t => techniqueCounts[t] = (techniqueCounts[t] || 0) + 1);
    
    // Find elements that appear in most images
    const consistentComposition = Object.entries(compositionCounts)
      .filter(([term, count]) => count >= patterns.length * 0.6).length;
    const consistentTechnique = Object.entries(techniqueCounts)
      .filter(([term, count]) => count >= patterns.length * 0.6).length;
    
    return (consistentComposition + consistentTechnique) / 
           (Object.keys(compositionCounts).length + Object.keys(techniqueCounts).length);
  }

  // Calculate thematic unity
  calculateThemeUnity(allThemes) {
    const flatThemes = allThemes.flat();
    const themeCounts = {};
    
    flatThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    
    // Find themes that appear in majority of images
    const unifyingThemes = Object.entries(themeCounts)
      .filter(([theme, count]) => count >= allThemes.length * 0.6);
    
    return unifyingThemes.length > 0 ? 
           unifyingThemes.length / Object.keys(themeCounts).length : 0;
  }

  // Analyze narrative flow through series
  async analyzeNarrativeFlow(images) {
    const flow = {
      has_arc: false,
      flow_type: 'undefined',
      key_moments: [],
      pacing_score: 0
    };
    
    const scores = images.map(img => img.evaluation.weighted_total);
    
    // Detect arc patterns
    if (this.isAscending(scores)) {
      flow.has_arc = true;
      flow.flow_type = 'crescendo';
    } else if (this.isDescending(scores)) {
      flow.has_arc = true;
      flow.flow_type = 'decrescendo';
    } else if (this.hasValleyShape(scores)) {
      flow.has_arc = true;
      flow.flow_type = 'journey';
    } else if (this.hasPeakShape(scores)) {
      flow.has_arc = true;
      flow.flow_type = 'climax';
    }
    
    // Identify key moments
    images.forEach((img, idx) => {
      if (img.evaluation.weighted_total >= 0.8) {
        flow.key_moments.push({
          position: idx,
          type: 'highlight',
          score: img.evaluation.weighted_total
        });
      }
    });
    
    // Calculate pacing (variation in rhythm)
    const transitions = [];
    for (let i = 1; i < scores.length; i++) {
      transitions.push(Math.abs(scores[i] - scores[i-1]));
    }
    flow.pacing_score = transitions.length > 0 ? 
      transitions.reduce((a, b) => a + b, 0) / transitions.length : 0;
    
    return flow;
  }

  // Check if scores are ascending
  isAscending(scores) {
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] < scores[i-1] - 0.1) return false;
    }
    return true;
  }

  // Check if scores are descending
  isDescending(scores) {
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[i-1] + 0.1) return false;
    }
    return true;
  }

  // Check for valley shape (high-low-high)
  hasValleyShape(scores) {
    if (scores.length < 3) return false;
    const midpoint = Math.floor(scores.length / 2);
    return scores[0] > scores[midpoint] && scores[scores.length-1] > scores[midpoint];
  }

  // Check for peak shape (low-high-low)
  hasPeakShape(scores) {
    if (scores.length < 3) return false;
    const midpoint = Math.floor(scores.length / 2);
    return scores[0] < scores[midpoint] && scores[scores.length-1] < scores[midpoint];
  }

  // Assess if series is ready for exhibition
  assessExhibitionReadiness(series) {
    const readiness = {
      is_ready: true,
      score: 100,
      requirements: {
        minimum_pieces: series.images.length >= 5,
        coherence: series.coherence_analysis.overall_coherence >= 70,
        quality_floor: Math.min(...series.images.map(img => img.evaluation.weighted_total)) >= 0.6,
        narrative: series.narrative_flow.has_arc
      },
      missing: []
    };
    
    // Check requirements
    Object.entries(readiness.requirements).forEach(([req, met]) => {
      if (!met) {
        readiness.is_ready = false;
        readiness.score -= 25;
        readiness.missing.push(req);
      }
    });
    
    return readiness;
  }

  // Generate recommendations for series
  async generateSeriesRecommendations(series) {
    const recommendations = [];
    
    // Coherence improvements
    if (series.coherence_analysis.overall_coherence < 80) {
      recommendations.push({
        type: 'coherence',
        priority: 'high',
        suggestion: 'Improve series coherence',
        specific_actions: series.coherence_analysis.issues
      });
    }
    
    // Narrative improvements
    if (!series.narrative_flow.has_arc) {
      recommendations.push({
        type: 'narrative',
        priority: 'medium',
        suggestion: 'Develop clearer narrative arc',
        options: ['Reorder for crescendo', 'Add transitional pieces', 'Strengthen key moments']
      });
    }
    
    // Quality improvements
    const weakPieces = series.images.filter(img => img.evaluation.weighted_total < 0.65);
    if (weakPieces.length > 0) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        suggestion: `Replace or improve ${weakPieces.length} weak pieces`,
        specific_pieces: weakPieces.map(p => p.id)
      });
    }
    
    // Exhibition readiness
    if (!series.exhibition_readiness.is_ready) {
      recommendations.push({
        type: 'exhibition',
        priority: 'critical',
        suggestion: 'Address exhibition requirements',
        missing_requirements: series.exhibition_readiness.missing
      });
    }
    
    return recommendations;
  }

  // Generate curatorial statement for collection
  async generateCuratorialStatement(collectionId) {
    const collection = this.collections[collectionId];
    if (!collection) throw new Error('Collection not found');
    
    const statement = {
      title: collection.name,
      theme: collection.theme,
      overview: `This collection of ${collection.images.length} works explores ${collection.theme} through a lens of AI-critical discourse and posthuman aesthetics.`,
      key_works: collection.images.filter(img => img.collection_role === 'hero' || img.collection_role === 'anchor')
        .map(img => ({
          id: img.id,
          role: img.collection_role,
          significance: this.describeSignificance(img)
        })),
      thematic_threads: collection.statistics.dominant_themes,
      curatorial_vision: await this.formulateCuratorialVision(collection),
      exhibition_notes: this.generateExhibitionNotes(collection)
    };
    
    collection.curatorial_statement = statement;
    return statement;
  }

  // Describe significance of a work
  describeSignificance(image) {
    const strengths = [];
    const eval = image.evaluation;
    
    if (eval.scores_raw.ai_criticality >= 75) {
      strengths.push('powerful AI critique');
    }
    if (eval.scores_raw.conceptual_strength >= 75) {
      strengths.push('strong conceptual framework');
    }
    if (eval.scores_raw.paris_photo_ready >= 75) {
      strengths.push('exceptional exhibition presence');
    }
    
    return `This work demonstrates ${strengths.join(', ')}, serving as ${image.collection_role === 'hero' ? 'a centerpiece' : 'an anchor'} for the collection.`;
  }

  // Formulate curatorial vision
  async formulateCuratorialVision(collection) {
    const themes = collection.statistics.dominant_themes.map(t => t.theme).join(', ');
    const avgScore = collection.statistics.avg_score;
    const coherence = collection.statistics.coherence_score;
    
    let vision = `This collection presents a ${coherence >= 80 ? 'highly coherent' : 'diverse'} exploration of ${themes}. `;
    
    if (avgScore >= 0.75) {
      vision += 'The consistently high quality across all works demonstrates mature artistic vision and technical mastery. ';
    } else if (avgScore >= 0.65) {
      vision += 'The works show strong potential with several standout pieces anchoring the collection. ';
    }
    
    vision += `The collection ${coherence >= 80 ? 'maintains strong thematic unity while' : 'explores varied approaches,'} engaging with contemporary discourses around AI, identity, and representation.`;
    
    return vision;
  }

  // Generate exhibition notes
  generateExhibitionNotes(collection) {
    const notes = {
      recommended_display: '',
      lighting_requirements: '',
      spacing_suggestions: '',
      visitor_flow: ''
    };
    
    // Display recommendations based on collection size
    if (collection.images.length <= 10) {
      notes.recommended_display = 'Single wall linear progression';
      notes.spacing_suggestions = '80-100cm between works';
    } else if (collection.images.length <= 20) {
      notes.recommended_display = 'Two-wall corner installation';
      notes.spacing_suggestions = '60-80cm between works, create visual breathing room';
    } else {
      notes.recommended_display = 'Full room installation with thematic groupings';
      notes.spacing_suggestions = 'Vary spacing to create rhythm, 50-100cm based on relationships';
    }
    
    notes.lighting_requirements = 'Gallery-standard lighting, 3000K color temperature, avoid direct spots on reflective surfaces';
    notes.visitor_flow = collection.suggested_groupings?.optimal_sequence ? 
      'Follow suggested sequence for narrative flow' : 
      'Allow open exploration with clear sight lines between related works';
    
    return notes;
  }
}

module.exports = NinaCuration;