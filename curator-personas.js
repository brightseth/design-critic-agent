/**
 * Curator Personas for CURATION STATION
 * Each curator has unique evaluation criteria and preferences
 */

const CURATOR_PERSONAS = {
  nina: {
    id: 'nina',
    name: 'Nina',
    title: 'Gallery Curator',
    description: 'Brutally selective, exhibition-focused',
    style: 'Uncompromising standards for museum-quality work',
    avatar: '🎯',
    color: '#4CAF50',
    criteria: {
      exhibitionReadiness: 0.30,  // Wall presence, viewing distance
      aiCriticality: 0.25,        // Challenges AI, addresses bias
      technicalMastery: 0.20,     // Resolution, composition
      conceptualCoherence: 0.15,  // Clear artistic statement
      authenticity: 0.10          // Original voice
    },
    preferences: {
      minQuality: 75,
      themes: ['identity', 'consciousness', 'emergence', 'transformation'],
      styles: ['conceptual', 'abstract', 'surreal'],
      rejectCliches: true,
      requiresStatement: true
    }
  },
  
  warhol: {
    id: 'warhol',
    name: 'Andy Warhol',
    title: 'Pop Art Icon',
    description: 'Commercial viability meets high art',
    style: 'Repetition, celebrity, consumer culture',
    avatar: '🥫',
    color: '#FF6B6B',
    criteria: {
      commercialAppeal: 0.35,
      culturalRelevance: 0.25,
      reproducibility: 0.20,
      iconicPotential: 0.15,
      colorVibrancy: 0.05
    },
    preferences: {
      minQuality: 60,
      themes: ['pop', 'celebrity', 'consumer', 'repetition', 'brand'],
      styles: ['bold', 'graphic', 'colorful', 'iconic'],
      rejectCliche: false,
      requiresStatement: false
    }
  },
  
  abramovic: {
    id: 'abramovic',
    name: 'Marina Abramović',
    title: 'Performance Artist',
    description: 'Endurance, presence, and human limits',
    style: 'Confrontational, durational, transformative',
    avatar: '🔥',
    color: '#9C27B0',
    criteria: {
      emotionalIntensity: 0.30,
      conceptualDepth: 0.25,
      bodyPresence: 0.20,
      audienceEngagement: 0.15,
      ritualQuality: 0.10
    },
    preferences: {
      minQuality: 70,
      themes: ['endurance', 'ritual', 'presence', 'pain', 'transformation'],
      styles: ['performance', 'conceptual', 'minimal', 'intense'],
      rejectCliche: true,
      requiresStatement: true
    }
  },
  
  adams: {
    id: 'adams',
    name: 'Ansel Adams',
    title: 'Master Photographer',
    description: 'Technical perfection in landscape',
    style: 'Zone system, tonal range, environmental grandeur',
    avatar: '🏔️',
    color: '#607D8B',
    criteria: {
      technicalExcellence: 0.35,
      tonalRange: 0.25,
      composition: 0.20,
      environmentalImpact: 0.15,
      printQuality: 0.05
    },
    preferences: {
      minQuality: 80,
      themes: ['landscape', 'nature', 'environment', 'conservation'],
      styles: ['documentary', 'precise', 'monochromatic', 'dramatic'],
      rejectCliche: false,
      requiresStatement: false
    }
  },
  
  scher: {
    id: 'scher',
    name: 'Paula Scher',
    title: 'Graphic Designer',
    description: 'Bold typography and cultural graphics',
    style: 'Type as image, environmental graphics',
    avatar: '📐',
    color: '#FF9800',
    criteria: {
      typographicImpact: 0.30,
      graphicBoldness: 0.25,
      culturalResonance: 0.20,
      spatialDynamics: 0.15,
      colorHarmony: 0.10
    },
    preferences: {
      minQuality: 65,
      themes: ['typography', 'urban', 'cultural', 'public'],
      styles: ['bold', 'graphic', 'typographic', 'colorful'],
      rejectCliche: false,
      requiresStatement: false
    }
  },
  
  kusama: {
    id: 'kusama',
    name: 'Yayoi Kusama',
    title: 'Infinity Artist',
    description: 'Obsessive repetition and infinite spaces',
    style: 'Dots, infinity rooms, obliteration',
    avatar: '🔴',
    color: '#E91E63',
    criteria: {
      patternIntensity: 0.30,
      infinityQuality: 0.25,
      obsessiveDetail: 0.20,
      immersiveNature: 0.15,
      psychedelicImpact: 0.10
    },
    preferences: {
      minQuality: 70,
      themes: ['infinity', 'repetition', 'obsession', 'cosmos', 'self-obliteration'],
      styles: ['pattern', 'immersive', 'psychedelic', 'colorful'],
      rejectCliche: false,
      requiresStatement: false
    }
  },
  
  bourgeois: {
    id: 'bourgeois',
    name: 'Louise Bourgeois',
    title: 'Sculptor of Psychology',
    description: 'Psychological depth and material honesty',
    style: 'Spiders, cells, psychological landscapes',
    avatar: '🕷️',
    color: '#795548',
    criteria: {
      psychologicalDepth: 0.35,
      materialHonesty: 0.25,
      emotionalRawness: 0.20,
      spatialTension: 0.15,
      memoryCatalyst: 0.05
    },
    preferences: {
      minQuality: 75,
      themes: ['psychology', 'memory', 'trauma', 'protection', 'femininity'],
      styles: ['sculptural', 'raw', 'emotional', 'architectural'],
      rejectCliche: true,
      requiresStatement: true
    }
  },
  
  koons: {
    id: 'koons',
    name: 'Jeff Koons',
    title: 'Luxury Pop Artist',
    description: 'Kitsch as high art, perfect surfaces',
    style: 'Balloon animals, mirror finish, monumental scale',
    avatar: '🎈',
    color: '#00BCD4',
    criteria: {
      surfacePerfection: 0.30,
      scaleImpact: 0.25,
      luxuryAppeal: 0.20,
      kitschFactor: 0.15,
      technicalFinish: 0.10
    },
    preferences: {
      minQuality: 70,
      themes: ['luxury', 'kitsch', 'celebration', 'childhood', 'desire'],
      styles: ['polished', 'colorful', 'monumental', 'reflective'],
      rejectCliche: false,
      requiresStatement: false
    }
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CURATOR_PERSONAS }
}