// Nina Algorithm Configuration Management
// This module allows dynamic adjustment of Nina's curation parameters

const fs = require('fs').promises;
const path = require('path');

// Default configuration
const DEFAULT_CONFIG = {
  algorithm_version: 'v2.1',
  last_updated: new Date().toISOString(),
  
  // Core dimensions with enhanced metadata
  dimensions: {
    paris_photo_ready: {
      weight: 30,
      name: 'Paris Photo Readiness',
      description: 'Wall presence at 80-120cm viewing distance. Must read clearly at 3-5m and hold detail up close.',
      benchmarks: [
        'Would Zwirner or Gagosian hang this?',
        'Survives comparison to main floor galleries',
        'Commands attention in gallery context'
      ],
      scoring_guide: {
        90: 'Museum acquisition quality',
        80: 'Blue-chip gallery standard',
        70: 'Regional gallery worthy',
        60: 'Group show potential',
        50: 'Student/amateur level'
      },
      historical_mean: 62,
      target_distribution: 'normal_strict'
    },
    
    ai_criticality: {
      weight: 25,
      name: 'AI-Criticality',
      description: 'Embeds stance on dataset politics, bias, consent. Not just using AI, but challenging AI systems.',
      benchmarks: [
        'Trevor Paglen\'s ImageNet critiques',
        'Stephanie Dinkins family-trained models',
        'Jake Elwes Zizi project'
      ],
      scoring_guide: {
        90: 'Paradigm-shifting critique',
        80: 'Clear dataset politics stance',
        70: 'Questions AI methodology',
        60: 'Acknowledges AI limitations',
        50: 'Uses AI without critique'
      },
      historical_mean: 58,
      target_distribution: 'bimodal' // Either high critique or low
    },
    
    conceptual_strength: {
      weight: 20,
      name: 'Conceptual Strength',
      description: 'Posthuman and cyberfeminist clarity. Identity as construction/performance.',
      benchmarks: [
        'Donna Haraway cyborg manifesto',
        'Judith Butler performativity',
        'Legacy Russell glitch feminism'
      ],
      scoring_guide: {
        90: 'Theoretical breakthrough',
        80: 'Rigorous concept execution',
        70: 'Clear theoretical grounding',
        60: 'Surface-level engagement',
        50: 'Confused or derivative'
      },
      historical_mean: 59,
      target_distribution: 'normal'
    },
    
    technical_excellence: {
      weight: 15,
      name: 'Technical Excellence',
      description: 'Light, color, tonal control, composition, edge discipline. No cheap "AI gloss".',
      benchmarks: [
        'Annie Leibovitz lighting control',
        'Nadav Kander precision',
        'Platon-level technical mastery'
      ],
      scoring_guide: {
        90: 'Master photographer level',
        80: 'Professional commercial standard',
        70: 'Competent technique',
        60: 'Basic technical skills',
        50: 'Technical limitations visible'
      },
      historical_mean: 65,
      target_distribution: 'normal'
    },
    
    cultural_dialogue: {
      weight: 10,
      name: 'Cultural Dialogue',
      description: 'Legible conversation with artistic lineage. Not pastiche, but genuine dialogue.',
      benchmarks: [
        'Cindy Sherman staged identity',
        'Wolfgang Tillmans intimacy',
        'Amalia Ulman performance'
      ],
      scoring_guide: {
        90: 'Redefines art historical conversation',
        80: 'Meaningful dialogue with precedents',
        70: 'Clear reference understanding',
        60: 'Basic art awareness',
        50: 'Disconnected from context'
      },
      historical_mean: 55,
      target_distribution: 'skewed_low'
    }
  },
  
  // Curatorial stance presets
  curatorial_presets: {
    paris_photo_2024: {
      description: 'Standard Paris Photo Digital Sector criteria',
      dimension_adjustments: {}, // No changes from default
      threshold_adjustments: {
        include_min: 0.75,
        maybe_min: 0.55
      },
      brutality_level: 0.8,
      experimental_bonus: false
    },
    
    biennale_experimental: {
      description: 'More experimental, concept-weighted approach',
      dimension_adjustments: {
        conceptual_strength: { weight: 30 }, // +10
        ai_criticality: { weight: 30 },      // +5
        paris_photo_ready: { weight: 20 }   // -10
      },
      threshold_adjustments: {
        include_min: 0.70,
        maybe_min: 0.50
      },
      brutality_level: 0.6,
      experimental_bonus: true
    },
    
    commercial_gallery: {
      description: 'Commercial viability weighted',
      dimension_adjustments: {
        technical_excellence: { weight: 25 }, // +10
        paris_photo_ready: { weight: 35 },   // +5
        ai_criticality: { weight: 15 }       // -10
      },
      threshold_adjustments: {
        include_min: 0.78,
        maybe_min: 0.65
      },
      brutality_level: 0.9,
      experimental_bonus: false
    },
    
    student_portfolio: {
      description: 'Educational context, more encouraging',
      dimension_adjustments: {
        conceptual_strength: { weight: 25 }, // +5
        cultural_dialogue: { weight: 15 }    // +5
      },
      threshold_adjustments: {
        include_min: 0.65,
        maybe_min: 0.45
      },
      brutality_level: 0.4,
      experimental_bonus: true
    }
  },
  
  // Dynamic penalty system
  penalty_matrix: {
    critical_failures: {
      no_ethics_documentation: -15,
      clear_bias_amplification: -20,
      stolen_dataset_use: -25
    },
    
    technical_issues: {
      artifacting: -10,
      weak_print_quality: -10,
      halo_edges: -7,
      morphological_errors: -7,
      resolution_limits: -5
    },
    
    conceptual_problems: {
      derivative_work: -8,
      unclear_process: -5,
      surface_aesthetics_only: -10,
      orientalist_gaze: -15
    },
    
    formal_issues: {
      poor_composition: -5,
      bad_lighting: -7,
      color_management_fail: -5,
      cropping_errors: -3
    }
  },
  
  // Bonus system
  bonus_matrix: {
    innovation: {
      novel_ai_technique: 5,
      original_dataset_creation: 8,
      technical_breakthrough: 10
    },
    
    social_impact: {
      marginalized_voice_amplification: 5,
      ethical_ai_demonstration: 7,
      accessibility_consideration: 3
    },
    
    curatorial_excellence: {
      perfect_exhibition_scale: 3,
      compelling_wall_text_potential: 2,
      strong_series_coherence: 5
    }
  },
  
  // Context-aware adjustments
  contextual_modifiers: {
    submission_context: {
      open_call: { brutality_multiplier: 1.2 },
      invited_artist: { brutality_multiplier: 0.8 },
      emerging_artist: { bonus_experimental: 3 },
      established_artist: { penalty_derivative: -5 }
    },
    
    batch_characteristics: {
      high_variance: { normalize_aggressively: true },
      low_variance: { expand_dynamic_range: true },
      bimodal_distribution: { emphasize_peaks: true }
    }
  },
  
  // Learning and adaptation parameters
  adaptation: {
    enabled: true,
    learning_rate: 0.05,
    feedback_weight: 0.3,
    historical_calibration: true,
    drift_detection_threshold: 15
  }
};

class NinaConfig {
  constructor(configPath = './nina-config.json') {
    this.configPath = configPath;
    this.config = { ...DEFAULT_CONFIG };
    this.history = [];
  }
  
  // Load configuration from file
  async loadConfig() {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      this.config = { ...DEFAULT_CONFIG, ...JSON.parse(data) };
      console.log('Nina config loaded from', this.configPath);
    } catch (error) {
      console.log('Using default Nina config (no saved config found)');
    }
    return this.config;
  }
  
  // Save configuration to file
  async saveConfig() {
    try {
      this.config.last_updated = new Date().toISOString();
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('Nina config saved to', this.configPath);
    } catch (error) {
      console.error('Failed to save Nina config:', error);
    }
  }
  
  // Apply curatorial preset
  applyPreset(presetName) {
    const preset = this.config.curatorial_presets[presetName];
    if (!preset) {
      throw new Error(`Preset '${presetName}' not found`);
    }
    
    // Save current config to history
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'preset_applied',
      preset: presetName,
      previous_config: JSON.parse(JSON.stringify(this.config.dimensions))
    });
    
    // Apply dimension adjustments
    if (preset.dimension_adjustments) {
      for (const [dim, adjustments] of Object.entries(preset.dimension_adjustments)) {
        if (this.config.dimensions[dim] && adjustments.weight) {
          this.config.dimensions[dim].weight = adjustments.weight;
        }
      }
    }
    
    // Normalize weights to sum to 100
    this.normalizeWeights();
    
    console.log(`Applied preset: ${presetName}`);
    return this.config;
  }
  
  // Adjust individual dimension weight
  adjustDimension(dimensionName, newWeight, rationale = '') {
    if (!this.config.dimensions[dimensionName]) {
      throw new Error(`Dimension '${dimensionName}' not found`);
    }
    
    const oldWeight = this.config.dimensions[dimensionName].weight;
    this.config.dimensions[dimensionName].weight = newWeight;
    
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'dimension_adjusted',
      dimension: dimensionName,
      old_weight: oldWeight,
      new_weight: newWeight,
      rationale
    });
    
    this.normalizeWeights();
    console.log(`Adjusted ${dimensionName}: ${oldWeight}% → ${newWeight}%`);
    return this.config;
  }
  
  // Normalize dimension weights to sum to 100
  normalizeWeights() {
    const dimensions = this.config.dimensions;
    const totalWeight = Object.values(dimensions).reduce((sum, dim) => sum + dim.weight, 0);
    
    if (totalWeight !== 100) {
      const factor = 100 / totalWeight;
      Object.values(dimensions).forEach(dim => {
        dim.weight = Math.round(dim.weight * factor);
      });
      
      console.log('Normalized dimension weights to sum to 100%');
    }
  }
  
  // Add custom penalty/bonus
  addPenalty(category, name, value, description) {
    if (!this.config.penalty_matrix[category]) {
      this.config.penalty_matrix[category] = {};
    }
    
    this.config.penalty_matrix[category][name] = value;
    
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'penalty_added',
      category,
      name,
      value,
      description
    });
    
    console.log(`Added penalty: ${name} = ${value} in ${category}`);
  }
  
  addBonus(category, name, value, description) {
    if (!this.config.bonus_matrix[category]) {
      this.config.bonus_matrix[category] = {};
    }
    
    this.config.bonus_matrix[category][name] = value;
    
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'bonus_added',
      category,
      name,
      value,
      description
    });
    
    console.log(`Added bonus: ${name} = +${value} in ${category}`);
  }
  
  // Calculate final score with current config
  calculateScore(rawScores, flags = [], bonuses = []) {
    let total = 0;
    
    // Apply dimension weights
    for (const [dimName, dimConfig] of Object.entries(this.config.dimensions)) {
      const score = rawScores[dimName] || 0;
      total += (dimConfig.weight * score) / 100;
    }
    
    // Apply penalties
    let penalty = 0;
    flags.forEach(flag => {
      for (const category of Object.values(this.config.penalty_matrix)) {
        if (category[flag]) {
          penalty += category[flag];
        }
      }
    });
    
    // Apply bonuses
    let bonus = 0;
    bonuses.forEach(bonusFlag => {
      for (const category of Object.values(this.config.bonus_matrix)) {
        if (category[bonusFlag]) {
          bonus += category[bonusFlag];
        }
      }
    });
    
    return Math.max(0, Math.min(100, total + penalty + bonus));
  }
  
  // Generate configuration summary
  getSummary() {
    return {
      version: this.config.algorithm_version,
      last_updated: this.config.last_updated,
      dimension_weights: Object.fromEntries(
        Object.entries(this.config.dimensions).map(([key, dim]) => [key, dim.weight])
      ),
      available_presets: Object.keys(this.config.curatorial_presets),
      penalty_categories: Object.keys(this.config.penalty_matrix),
      bonus_categories: Object.keys(this.config.bonus_matrix),
      recent_changes: this.history.slice(-5)
    };
  }
  
  // Export config for API
  getApiConfig() {
    return {
      dimensions: this.config.dimensions,
      penalties: this.config.penalty_matrix,
      bonuses: this.config.bonus_matrix,
      presets: this.config.curatorial_presets
    };
  }
  
  // Backup current configuration
  createBackup(label = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
    const backupName = `nina_config_backup_${timestamp}_${label}`.replace(/__+/g, '_');
    
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'backup_created',
      backup_name: backupName,
      config_snapshot: JSON.parse(JSON.stringify(this.config))
    });
    
    return backupName;
  }
  
  // Restore from backup
  restoreBackup(backupName) {
    const backup = this.history.find(h => 
      h.action === 'backup_created' && h.backup_name === backupName
    );
    
    if (!backup) {
      throw new Error(`Backup '${backupName}' not found`);
    }
    
    this.config = backup.config_snapshot;
    this.history.push({
      timestamp: new Date().toISOString(),
      action: 'backup_restored',
      backup_name: backupName
    });
    
    console.log(`Restored from backup: ${backupName}`);
    return this.config;
  }
}

module.exports = { NinaConfig, DEFAULT_CONFIG };