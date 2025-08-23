// Nina Prompt Enhancement System - Co-Creative AI Partner
// Real-time suggestions, style mixing, and failure analysis for prompt optimization

const NinaLearning = require('./nina-learning');

class NinaPromptEnhancement {
  constructor() {
    this.learning = new NinaLearning();
    this.promptHistory = [];
    this.successfulElements = {};
    this.styleLibrary = {};
    this.activeSuggestions = [];
  }

  // REAL-TIME PROMPT SUGGESTIONS
  async getSuggestions(currentPrompt, context = {}) {
    const suggestions = {
      timestamp: new Date().toISOString(),
      current_prompt: currentPrompt,
      improvements: [],
      alternatives: [],
      success_probability: 0,
      missing_elements: [],
      risk_factors: []
    };

    // Analyze current prompt
    const analysis = await this.analyzePrompt(currentPrompt);
    
    // Get contextual suggestions based on what's working
    suggestions.improvements = await this.generateImprovements(analysis, context);
    
    // Generate alternative approaches
    suggestions.alternatives = await this.generateAlternatives(currentPrompt, analysis);
    
    // Predict success probability
    suggestions.success_probability = await this.predictSuccess(analysis);
    
    // Identify missing critical elements
    suggestions.missing_elements = this.identifyMissingElements(analysis);
    
    // Identify risk factors
    suggestions.risk_factors = this.identifyRisks(analysis);
    
    this.activeSuggestions.push(suggestions);
    return suggestions;
  }

  // Analyze prompt structure and content
  async analyzePrompt(prompt) {
    const analysis = {
      elements: {
        subject: this.extractSubject(prompt),
        style: this.extractStyle(prompt),
        technique: this.extractTechnique(prompt),
        concept: this.extractConcept(prompt),
        composition: this.extractComposition(prompt),
        mood: this.extractMood(prompt)
      },
      nina_criteria: {
        has_ai_critique: this.checkAICritique(prompt),
        has_conceptual_depth: this.checkConceptualDepth(prompt),
        has_technical_specs: this.checkTechnicalSpecs(prompt),
        has_exhibition_focus: this.checkExhibitionFocus(prompt)
      },
      complexity_score: this.calculateComplexity(prompt),
      specificity_score: this.calculateSpecificity(prompt),
      innovation_score: await this.calculateInnovation(prompt)
    };
    
    return analysis;
  }

  // Extract subject from prompt
  extractSubject(prompt) {
    const subjects = [];
    const subjectTerms = [
      'portrait', 'figure', 'landscape', 'abstract', 'still life',
      'architecture', 'street', 'documentary', 'conceptual'
    ];
    
    subjectTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        subjects.push(term);
      }
    });
    
    return subjects.length > 0 ? subjects : ['undefined subject'];
  }

  // Extract style references
  extractStyle(prompt) {
    const styles = [];
    const styleMarkers = [
      { term: 'cindy sherman', style: 'constructed identity' },
      { term: 'tillmans', style: 'intimate documentary' },
      { term: 'paglen', style: 'data archaeology' },
      { term: 'minimal', style: 'minimalist' },
      { term: 'baroque', style: 'baroque complexity' },
      { term: 'surreal', style: 'surrealist' }
    ];
    
    styleMarkers.forEach(marker => {
      if (prompt.toLowerCase().includes(marker.term)) {
        styles.push(marker.style);
      }
    });
    
    return styles;
  }

  // Extract technique specifications
  extractTechnique(prompt) {
    const techniques = [];
    const techTerms = [
      'high contrast', 'soft focus', 'long exposure', 'double exposure',
      'glitch', 'datamosh', 'generative', 'procedural', 'hybrid'
    ];
    
    techTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        techniques.push(term);
      }
    });
    
    return techniques;
  }

  // Extract conceptual elements
  extractConcept(prompt) {
    const concepts = [];
    const conceptTerms = [
      'identity', 'posthuman', 'cyborg', 'surveillance', 'bias',
      'dataset', 'algorithm', 'synthetic', 'authentic', 'performance'
    ];
    
    conceptTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        concepts.push(term);
      }
    });
    
    return concepts;
  }

  // Extract composition instructions
  extractComposition(prompt) {
    const compositions = [];
    const compTerms = [
      'centered', 'rule of thirds', 'diagonal', 'symmetrical',
      'asymmetrical', 'golden ratio', 'leading lines', 'framed'
    ];
    
    compTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        compositions.push(term);
      }
    });
    
    return compositions;
  }

  // Extract mood/atmosphere
  extractMood(prompt) {
    const moods = [];
    const moodTerms = [
      'dramatic', 'ethereal', 'dystopian', 'utopian', 'melancholic',
      'euphoric', 'tense', 'serene', 'chaotic', 'harmonious'
    ];
    
    moodTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        moods.push(term);
      }
    });
    
    return moods;
  }

  // Check for AI critique elements
  checkAICritique(prompt) {
    const critiqueTerms = [
      'bias', 'dataset', 'training', 'algorithm', 'synthetic',
      'artificial', 'machine learning', 'neural', 'gan', 'diffusion'
    ];
    
    return critiqueTerms.some(term => prompt.toLowerCase().includes(term));
  }

  // Check conceptual depth
  checkConceptualDepth(prompt) {
    const conceptTerms = [
      'identity', 'posthuman', 'cyborg', 'performance', 'construct',
      'simulacra', 'hyperreal', 'embodiment', 'agency', 'otherness'
    ];
    
    const count = conceptTerms.filter(term => prompt.toLowerCase().includes(term)).length;
    return count >= 2;
  }

  // Check technical specifications
  checkTechnicalSpecs(prompt) {
    return prompt.match(/\d+x\d+|high res|4k|8k|medium format|large format/i) !== null;
  }

  // Check exhibition focus
  checkExhibitionFocus(prompt) {
    const exhibitionTerms = [
      'gallery', 'exhibition', 'wall', 'print', 'display',
      'museum', 'collection', 'series', 'installation'
    ];
    
    return exhibitionTerms.some(term => prompt.toLowerCase().includes(term));
  }

  // Calculate prompt complexity
  calculateComplexity(prompt) {
    const words = prompt.split(/\s+/).length;
    const clauses = prompt.split(/[,;:]/).length;
    const complexity = (words / 10) + (clauses * 2);
    return Math.min(100, complexity * 5);
  }

  // Calculate specificity
  calculateSpecificity(prompt) {
    let score = 0;
    
    // Check for specific technical details
    if (prompt.match(/f\/\d+(\.\d+)?|ISO\s*\d+|\d+mm/)) score += 20;
    
    // Check for specific color descriptions
    if (prompt.match(/#[0-9A-F]{6}|rgb\(|hsl\(/i)) score += 15;
    
    // Check for specific artist references
    if (prompt.match(/in the style of|inspired by|reference:/i)) score += 15;
    
    // Check for detailed descriptions
    if (prompt.split(',').length > 5) score += 25;
    
    // Check for quality modifiers
    if (prompt.match(/highly detailed|photorealistic|masterpiece|award-winning/i)) score += 10;
    
    // Check for negative prompts
    if (prompt.includes('--no') || prompt.includes('avoid')) score += 15;
    
    return Math.min(100, score);
  }

  // Calculate innovation score
  async calculateInnovation(prompt) {
    // Check against common patterns
    const commonPatterns = [
      'portrait of a', 'landscape with', 'in the style of',
      'highly detailed', 'award winning', 'trending on'
    ];
    
    let score = 100;
    commonPatterns.forEach(pattern => {
      if (prompt.toLowerCase().includes(pattern)) {
        score -= 10;
      }
    });
    
    // Bonus for unique combinations
    const analysis = await this.analyzePrompt(prompt);
    if (analysis.elements.concept.length > 2) score += 15;
    if (analysis.nina_criteria.has_ai_critique) score += 20;
    
    return Math.max(0, Math.min(100, score));
  }

  // Generate improvements for current prompt
  async generateImprovements(analysis, context) {
    const improvements = [];
    
    // Add missing Nina criteria
    if (!analysis.nina_criteria.has_ai_critique) {
      improvements.push({
        type: 'add_ai_critique',
        priority: 'high',
        suggestion: 'Add AI-critical element',
        example: 'revealing dataset bias through [your concept]',
        impact: '+15 to ai_criticality score'
      });
    }
    
    if (!analysis.nina_criteria.has_conceptual_depth) {
      improvements.push({
        type: 'deepen_concept',
        priority: 'high',
        suggestion: 'Add conceptual framework',
        example: 'exploring posthuman identity construction through...',
        impact: '+10 to conceptual_strength score'
      });
    }
    
    if (!analysis.nina_criteria.has_exhibition_focus) {
      improvements.push({
        type: 'add_exhibition_context',
        priority: 'medium',
        suggestion: 'Frame for gallery presentation',
        example: 'composed for 100cm gallery wall viewing distance',
        impact: '+10 to paris_photo_ready score'
      });
    }
    
    // Improve specificity
    if (analysis.specificity_score < 60) {
      improvements.push({
        type: 'increase_specificity',
        priority: 'medium',
        suggestion: 'Add specific technical or visual details',
        example: 'specific lighting (3-point, Rembrandt, etc.), exact colors, precise composition',
        impact: 'Better control over output'
      });
    }
    
    // Add composition if missing
    if (analysis.elements.composition.length === 0) {
      improvements.push({
        type: 'add_composition',
        priority: 'medium',
        suggestion: 'Specify compositional structure',
        example: 'diagonal tension, rule of thirds, centered symmetry',
        impact: 'Stronger compositional_integrity gate'
      });
    }
    
    return improvements;
  }

  // Generate alternative approaches
  async generateAlternatives(currentPrompt, analysis) {
    const alternatives = [];
    
    // Conceptual pivot
    if (analysis.elements.concept.length > 0) {
      alternatives.push({
        type: 'conceptual_pivot',
        description: 'Flip the conceptual approach',
        original_concept: analysis.elements.concept[0],
        alternative: this.flipConcept(analysis.elements.concept[0]),
        full_prompt: this.rebuildPrompt(currentPrompt, 'concept', this.flipConcept(analysis.elements.concept[0]))
      });
    }
    
    // Style fusion
    if (this.successfulElements.styles) {
      const topStyles = Object.entries(this.successfulElements.styles || {})
        .sort((a, b) => b[1].success_rate - a[1].success_rate)
        .slice(0, 2);
      
      if (topStyles.length > 0) {
        alternatives.push({
          type: 'style_fusion',
          description: 'Blend with successful style',
          suggested_style: topStyles[0][0],
          success_rate: topStyles[0][1].success_rate,
          full_prompt: this.addStyleToPrompt(currentPrompt, topStyles[0][0])
        });
      }
    }
    
    // Technical variation
    alternatives.push({
      type: 'technical_variation',
      description: 'Alternative technical approach',
      suggestion: this.suggestTechnicalVariation(analysis.elements.technique),
      full_prompt: this.rebuildPrompt(currentPrompt, 'technique', this.suggestTechnicalVariation(analysis.elements.technique))
    });
    
    return alternatives;
  }

  // Flip conceptual approach
  flipConcept(concept) {
    const flips = {
      'identity': 'anonymity',
      'authentic': 'synthetic',
      'human': 'posthuman',
      'individual': 'collective',
      'organic': 'algorithmic',
      'natural': 'artificial',
      'reality': 'simulation'
    };
    
    return flips[concept] || `inverse-${concept}`;
  }

  // Rebuild prompt with modification
  rebuildPrompt(original, elementType, newElement) {
    // Simple replacement for demonstration
    // In production, this would be more sophisticated
    return `${original}, ${elementType === 'concept' ? 'exploring' : 'using'} ${newElement}`;
  }

  // Add style to prompt
  addStyleToPrompt(prompt, style) {
    return `${prompt}, incorporating ${style} aesthetic principles`;
  }

  // Suggest technical variation
  suggestTechnicalVariation(currentTechniques) {
    const allTechniques = [
      'high contrast dramatic lighting',
      'soft diffused natural light',
      'long exposure motion blur',
      'multiple exposure layering',
      'glitch art aesthetics',
      'photogrammetry scanning'
    ];
    
    // Find techniques not currently used
    const unused = allTechniques.filter(t => 
      !currentTechniques.some(ct => t.includes(ct))
    );
    
    return unused[Math.floor(Math.random() * unused.length)] || 'experimental technique';
  }

  // Predict success probability
  async predictSuccess(analysis) {
    let probability = 50; // Base probability
    
    // Nina criteria boosts
    if (analysis.nina_criteria.has_ai_critique) probability += 15;
    if (analysis.nina_criteria.has_conceptual_depth) probability += 10;
    if (analysis.nina_criteria.has_technical_specs) probability += 5;
    if (analysis.nina_criteria.has_exhibition_focus) probability += 10;
    
    // Complexity and specificity balance
    if (analysis.complexity_score > 40 && analysis.complexity_score < 80) probability += 5;
    if (analysis.specificity_score > 60) probability += 5;
    
    // Innovation bonus
    if (analysis.innovation_score > 70) probability += 10;
    
    return Math.min(95, probability);
  }

  // Identify missing elements
  identifyMissingElements(analysis) {
    const missing = [];
    
    if (analysis.elements.subject.includes('undefined subject')) {
      missing.push({
        element: 'subject',
        importance: 'high',
        suggestion: 'Define clear subject matter (portrait, landscape, abstract, etc.)'
      });
    }
    
    if (analysis.elements.style.length === 0) {
      missing.push({
        element: 'style',
        importance: 'medium',
        suggestion: 'Add stylistic reference or aesthetic direction'
      });
    }
    
    if (analysis.elements.mood.length === 0) {
      missing.push({
        element: 'mood',
        importance: 'low',
        suggestion: 'Specify emotional tone or atmosphere'
      });
    }
    
    if (!analysis.nina_criteria.has_ai_critique) {
      missing.push({
        element: 'ai_critique',
        importance: 'critical',
        suggestion: 'Include AI-critical element for Nina\'s standards'
      });
    }
    
    return missing;
  }

  // Identify risk factors
  identifyRisks(analysis) {
    const risks = [];
    
    if (analysis.complexity_score > 90) {
      risks.push({
        type: 'over_complexity',
        severity: 'medium',
        description: 'Prompt may be too complex, leading to confused output',
        mitigation: 'Simplify to core elements'
      });
    }
    
    if (analysis.specificity_score < 30) {
      risks.push({
        type: 'under_specification',
        severity: 'high',
        description: 'Prompt too vague, output will be unpredictable',
        mitigation: 'Add specific details and constraints'
      });
    }
    
    if (analysis.innovation_score < 30) {
      risks.push({
        type: 'derivative',
        severity: 'high',
        description: 'Prompt follows overused patterns, likely to produce cliché',
        mitigation: 'Add unique twist or unexpected combination'
      });
    }
    
    if (!analysis.nina_criteria.has_conceptual_depth) {
      risks.push({
        type: 'shallow_concept',
        severity: 'critical',
        description: 'Lacks conceptual depth for exhibition standards',
        mitigation: 'Embed theoretical framework or critical stance'
      });
    }
    
    return risks;
  }

  // STYLE MIXER
  async mixStyles(style1, style2, blendRatio = 0.5) {
    const mixed = {
      id: `mix_${Date.now()}`,
      source_styles: [style1, style2],
      blend_ratio: blendRatio,
      created: new Date().toISOString(),
      prompt_template: '',
      expected_characteristics: [],
      predicted_score: 0
    };
    
    // Extract characteristics from each style
    const chars1 = await this.extractStyleCharacteristics(style1);
    const chars2 = await this.extractStyleCharacteristics(style2);
    
    // Blend characteristics based on ratio
    mixed.expected_characteristics = this.blendCharacteristics(chars1, chars2, blendRatio);
    
    // Generate prompt template
    mixed.prompt_template = this.generateMixedPrompt(chars1, chars2, blendRatio);
    
    // Predict performance
    mixed.predicted_score = await this.predictMixedStyleScore(mixed);
    
    this.styleLibrary[mixed.id] = mixed;
    return mixed;
  }

  // Extract style characteristics
  async extractStyleCharacteristics(style) {
    // This would ideally analyze successful examples of this style
    // For now, using predefined characteristics
    const styleDB = {
      'cindy_sherman': {
        visual: ['staged', 'theatrical', 'costume', 'persona'],
        conceptual: ['identity construction', 'gender performance', 'cultural critique'],
        technical: ['studio lighting', 'medium format', 'color film aesthetic']
      },
      'trevor_paglen': {
        visual: ['documentary', 'surveillance aesthetic', 'data visualization'],
        conceptual: ['AI criticism', 'dataset archaeology', 'hidden systems'],
        technical: ['long lens', 'infrared', 'computational photography']
      },
      'wolfgang_tillmans': {
        visual: ['intimate', 'casual', 'everyday sublime'],
        conceptual: ['queer identity', 'community', 'ephemeral beauty'],
        technical: ['available light', 'various formats', 'experimental printing']
      }
    };
    
    return styleDB[style] || {
      visual: ['undefined'],
      conceptual: ['undefined'],
      technical: ['undefined']
    };
  }

  // Blend characteristics
  blendCharacteristics(chars1, chars2, ratio) {
    const blended = {
      visual: [],
      conceptual: [],
      technical: []
    };
    
    // Take proportional elements from each
    const count1 = Math.ceil(chars1.visual.length * ratio);
    const count2 = Math.ceil(chars2.visual.length * (1 - ratio));
    
    blended.visual = [
      ...chars1.visual.slice(0, count1),
      ...chars2.visual.slice(0, count2)
    ];
    
    blended.conceptual = [
      ...chars1.conceptual.slice(0, Math.ceil(chars1.conceptual.length * ratio)),
      ...chars2.conceptual.slice(0, Math.ceil(chars2.conceptual.length * (1 - ratio)))
    ];
    
    blended.technical = [
      ...chars1.technical.slice(0, Math.ceil(chars1.technical.length * ratio)),
      ...chars2.technical.slice(0, Math.ceil(chars2.technical.length * (1 - ratio)))
    ];
    
    return blended;
  }

  // Generate mixed prompt template
  generateMixedPrompt(chars1, chars2, ratio) {
    const primary = ratio >= 0.5 ? chars1 : chars2;
    const secondary = ratio >= 0.5 ? chars2 : chars1;
    
    let prompt = `Create an image that primarily draws from ${primary.conceptual[0]}, `;
    prompt += `incorporating ${secondary.visual[0]} visual elements. `;
    prompt += `Technical approach: blend ${primary.technical[0]} with ${secondary.technical[0]}. `;
    prompt += `The composition should balance ${primary.visual.join(', ')} `;
    prompt += `with subtle references to ${secondary.conceptual[0]}. `;
    prompt += `Maintain exhibition quality for gallery presentation.`;
    
    return prompt;
  }

  // Predict mixed style score
  async predictMixedStyleScore(mixed) {
    // Base score
    let score = 60;
    
    // Bonus for innovative combinations
    if (mixed.expected_characteristics.conceptual.includes('AI criticism')) score += 10;
    if (mixed.expected_characteristics.conceptual.includes('identity construction')) score += 5;
    
    // Technical excellence potential
    if (mixed.expected_characteristics.technical.length > 2) score += 5;
    
    // Coherence check (do the styles complement?)
    const coherence = this.assessStyleCoherence(mixed.source_styles);
    score += coherence * 10;
    
    return Math.min(85, score);
  }

  // Assess if styles work well together
  assessStyleCoherence(styles) {
    // Complementary pairs
    const goodPairs = [
      ['cindy_sherman', 'trevor_paglen'], // Both critique systems
      ['wolfgang_tillmans', 'cindy_sherman'], // Both explore identity
    ];
    
    const pair = styles.sort().join('_');
    return goodPairs.some(gp => gp.sort().join('_') === pair) ? 1 : 0.5;
  }

  // FAILURE ANALYSIS
  async analyzeFailure(evaluation, originalPrompt) {
    const analysis = {
      id: `failure_${Date.now()}`,
      timestamp: new Date().toISOString(),
      evaluation: evaluation,
      prompt: originalPrompt,
      failure_points: [],
      root_causes: [],
      improvement_plan: [],
      alternative_approaches: []
    };
    
    // Identify specific failure points
    analysis.failure_points = this.identifyFailurePoints(evaluation);
    
    // Determine root causes
    analysis.root_causes = await this.determineRootCauses(evaluation, originalPrompt);
    
    // Generate improvement plan
    analysis.improvement_plan = this.generateImprovementPlan(analysis.failure_points, analysis.root_causes);
    
    // Suggest alternative approaches
    analysis.alternative_approaches = await this.suggestAlternativeApproaches(originalPrompt, analysis.root_causes);
    
    // Learn from this failure
    await this.learning.recordFeedback(evaluation, {
      agree: false,
      suggested_score: evaluation.weighted_total * 100 + 20,
      reasons: analysis.root_causes
    });
    
    return analysis;
  }

  // Identify specific failure points
  identifyFailurePoints(evaluation) {
    const failures = [];
    
    // Gate failures
    if (!evaluation.gate.compositional_integrity) {
      failures.push({
        type: 'gate_failure',
        gate: 'compositional_integrity',
        severity: 'critical',
        description: 'Composition lacks coherence or intentionality'
      });
    }
    
    if (!evaluation.gate.artifact_control) {
      failures.push({
        type: 'gate_failure',
        gate: 'artifact_control',
        severity: 'critical',
        description: 'Visible AI artifacts compromise quality'
      });
    }
    
    // Low dimension scores
    Object.entries(evaluation.scores_raw).forEach(([dim, score]) => {
      if (score < 50) {
        failures.push({
          type: 'dimension_failure',
          dimension: dim,
          score: score,
          severity: score < 40 ? 'critical' : 'high',
          description: `${dim} significantly below standard`
        });
      }
    });
    
    // Flag issues
    if (evaluation.flags && evaluation.flags.length > 0) {
      evaluation.flags.forEach(flag => {
        failures.push({
          type: 'flag_issue',
          flag: flag,
          severity: 'medium',
          description: `Flagged for ${flag}`
        });
      });
    }
    
    return failures;
  }

  // Determine root causes
  async determineRootCauses(evaluation, prompt) {
    const causes = [];
    const promptAnalysis = await this.analyzePrompt(prompt);
    
    // Prompt-related causes
    if (!promptAnalysis.nina_criteria.has_ai_critique) {
      causes.push({
        category: 'prompt_deficiency',
        cause: 'Missing AI-critical element',
        impact: 'Low ai_criticality score',
        evidence: evaluation.scores_raw.ai_criticality < 50
      });
    }
    
    if (promptAnalysis.specificity_score < 40) {
      causes.push({
        category: 'prompt_deficiency',
        cause: 'Insufficient specificity',
        impact: 'Unpredictable output',
        evidence: 'Low specificity score in prompt'
      });
    }
    
    // Technical causes
    if (evaluation.gate && !evaluation.gate.artifact_control) {
      causes.push({
        category: 'technical_issue',
        cause: 'Generation parameters need adjustment',
        impact: 'AI artifacts present',
        evidence: 'Failed artifact control gate'
      });
    }
    
    // Conceptual causes
    if (evaluation.scores_raw.conceptual_strength < 50) {
      causes.push({
        category: 'conceptual_weakness',
        cause: 'Concept not visible in output',
        impact: 'Low conceptual strength score',
        evidence: `Score: ${evaluation.scores_raw.conceptual_strength}`
      });
    }
    
    return causes;
  }

  // Generate improvement plan
  generateImprovementPlan(failures, causes) {
    const plan = [];
    
    // Address critical failures first
    const criticalFailures = failures.filter(f => f.severity === 'critical');
    
    criticalFailures.forEach(failure => {
      if (failure.type === 'gate_failure') {
        plan.push({
          priority: 1,
          action: `Fix ${failure.gate}`,
          specific_steps: this.getGateFixSteps(failure.gate),
          expected_improvement: '+20-30 points'
        });
      } else if (failure.type === 'dimension_failure') {
        plan.push({
          priority: 2,
          action: `Improve ${failure.dimension}`,
          specific_steps: this.getDimensionImprovementSteps(failure.dimension),
          expected_improvement: `+${60 - failure.score} points potential`
        });
      }
    });
    
    // Address root causes
    causes.forEach(cause => {
      if (cause.category === 'prompt_deficiency') {
        plan.push({
          priority: 3,
          action: 'Revise prompt',
          specific_steps: [`Add ${cause.cause}`, 'Increase specificity', 'Include exhibition context'],
          expected_improvement: 'Better control and alignment'
        });
      }
    });
    
    return plan.sort((a, b) => a.priority - b.priority);
  }

  // Get steps to fix gate issues
  getGateFixSteps(gate) {
    const fixes = {
      'compositional_integrity': [
        'Ensure clear focal point',
        'Check element relationships',
        'Remove conflicting elements',
        'Strengthen compositional structure'
      ],
      'artifact_control': [
        'Adjust generation parameters',
        'Use higher quality settings',
        'Apply post-processing cleanup',
        'Try different seed/iteration'
      ],
      'ethics_process': [
        'Document AI methodology',
        'Specify dataset sources',
        'Add consent/bias statement',
        'Include process transparency'
      ]
    };
    
    return fixes[gate] || ['Review and address gate requirements'];
  }

  // Get dimension improvement steps
  getDimensionImprovementSteps(dimension) {
    const improvements = {
      'paris_photo_ready': [
        'Frame for gallery wall impact',
        'Ensure 80-120cm viewing distance clarity',
        'Strengthen visual presence',
        'Add sophisticated color grading'
      ],
      'ai_criticality': [
        'Embed dataset politics visibly',
        'Show AI process critique',
        'Question algorithmic assumptions',
        'Reveal bias or consent issues'
      ],
      'conceptual_strength': [
        'Make concept visible in frame',
        'Add theoretical depth',
        'Connect to critical discourse',
        'Avoid surface aesthetics'
      ],
      'technical_excellence': [
        'Improve lighting control',
        'Refine edge quality',
        'Enhance color management',
        'Eliminate technical flaws'
      ],
      'cultural_dialogue': [
        'Reference art history thoughtfully',
        'Avoid pastiche',
        'Create genuine dialogue',
        'Show contemporary relevance'
      ]
    };
    
    return improvements[dimension] || ['Focus on improving this dimension'];
  }

  // Suggest alternative approaches
  async suggestAlternativeApproaches(originalPrompt, rootCauses) {
    const alternatives = [];
    
    // Complete rethink
    alternatives.push({
      type: 'complete_pivot',
      description: 'Start fresh with different approach',
      suggestion: await this.generateFreshApproach(rootCauses),
      rationale: 'Current approach has fundamental issues'
    });
    
    // Incremental improvement
    alternatives.push({
      type: 'incremental',
      description: 'Fix specific issues in current approach',
      suggestion: this.fixSpecificIssues(originalPrompt, rootCauses),
      rationale: 'Current approach has potential with fixes'
    });
    
    // Hybrid approach
    alternatives.push({
      type: 'hybrid',
      description: 'Combine current approach with successful patterns',
      suggestion: await this.createHybridApproach(originalPrompt),
      rationale: 'Leverage proven successful elements'
    });
    
    return alternatives;
  }

  // Generate fresh approach
  async generateFreshApproach(rootCauses) {
    let freshPrompt = 'Create an AI-critical photograph that ';
    
    // Address each root cause
    if (rootCauses.some(c => c.cause.includes('AI-critical'))) {
      freshPrompt += 'explicitly reveals dataset bias through visual metaphor, ';
    }
    
    if (rootCauses.some(c => c.cause.includes('specificity'))) {
      freshPrompt += 'using precise technical specifications: dramatic chiaroscuro lighting, ';
    }
    
    if (rootCauses.some(c => c.category === 'conceptual_weakness')) {
      freshPrompt += 'embodying posthuman identity construction as visible formal element, ';
    }
    
    freshPrompt += 'composed for 100cm gallery presentation with strong wall presence.';
    
    return freshPrompt;
  }

  // Fix specific issues in prompt
  fixSpecificIssues(prompt, rootCauses) {
    let fixed = prompt;
    
    rootCauses.forEach(cause => {
      if (cause.cause === 'Missing AI-critical element') {
        fixed += ', revealing algorithmic bias through composition';
      }
      if (cause.cause === 'Insufficient specificity') {
        fixed += ', precise technical execution with controlled lighting';
      }
      if (cause.category === 'conceptual_weakness') {
        fixed += ', concept manifested through visual form not just subject';
      }
    });
    
    return fixed;
  }

  // Create hybrid approach
  async createHybridApproach(originalPrompt) {
    // Get successful patterns from learning system
    const stats = await this.learning.getStats();
    
    let hybrid = originalPrompt;
    
    // Add elements from successful patterns
    if (stats.success_patterns > 0) {
      hybrid += ', incorporating proven successful elements: ';
      hybrid += 'strong compositional structure, ';
      hybrid += 'visible AI critique, ';
      hybrid += 'gallery-ready presentation';
    }
    
    return hybrid;
  }

  // Track prompt effectiveness over time
  async trackEffectiveness(prompt, evaluation) {
    const tracking = {
      prompt: prompt,
      evaluation: evaluation,
      timestamp: new Date().toISOString(),
      score: evaluation.weighted_total,
      verdict: evaluation.verdict
    };
    
    this.promptHistory.push(tracking);
    
    // Update successful elements library
    if (evaluation.weighted_total >= 0.75) {
      const analysis = await this.analyzePrompt(prompt);
      
      // Record successful elements
      analysis.elements.style.forEach(style => {
        if (!this.successfulElements.styles) this.successfulElements.styles = {};
        if (!this.successfulElements.styles[style]) {
          this.successfulElements.styles[style] = { count: 0, total_score: 0, success_rate: 0 };
        }
        this.successfulElements.styles[style].count++;
        this.successfulElements.styles[style].total_score += evaluation.weighted_total;
        this.successfulElements.styles[style].success_rate = 
          this.successfulElements.styles[style].total_score / this.successfulElements.styles[style].count;
      });
    }
    
    return tracking;
  }
}

module.exports = NinaPromptEnhancement;