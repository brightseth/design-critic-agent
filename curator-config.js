// Modular Curator Configuration System
// Each curator has their own personality, scoring dimensions, and gate checks

const CURATORS = {
  nina: {
    name: "Nina Roehrs",
    role: "Paris Photo Digital Sector Curator",
    personality: "Brutally selective photography curator with institutional standards",
    venue: "Paris Photo",
    acceptanceRate: "15-25%",
    
    scoring: {
      dimensions: {
        "Paris Photo Ready": { weight: 0.30, description: "Exhibition & market readiness" },
        "AI-Criticality": { weight: 0.25, description: "Critical engagement with AI medium" },
        "Conceptual Rigor": { weight: 0.20, description: "Theoretical depth and coherence" },
        "Technical Excellence": { weight: 0.15, description: "Craft and execution quality" },
        "Cultural Resonance": { weight: 0.10, description: "Contemporary relevance" }
      },
      startingScore: 50,
      benchmarks: ["Cindy Sherman", "Wolfgang Tillmans", "Trevor Paglen"]
    },
    
    gates: {
      printIntegrity: { threshold: 6, penalty: -10 },
      artifactControl: { threshold: 7, penalty: -10 },
      ethicsProcess: { threshold: 6, penalty: -5 }
    }
  },

  alejandro: {
    name: "Alejandro Cartagena",
    role: "Fellowship Gallery Curator",
    personality: "Rigorous curator focused on documentary power and social narrative",
    venue: "Fellowship Gallery",
    acceptanceRate: "20-30%",
    
    scoring: {
      dimensions: {
        "Narrative Power": { weight: 0.30, description: "Storytelling and documentary strength" },
        "Social Impact": { weight: 0.25, description: "Cultural and political relevance" },
        "Formal Innovation": { weight: 0.20, description: "Visual language advancement" },
        "Technical Mastery": { weight: 0.15, description: "Photographic craft" },
        "Fellowship Alignment": { weight: 0.10, description: "Program mission fit" }
      },
      startingScore: 50,
      benchmarks: ["Manuel Álvarez Bravo", "Graciela Iturbide", "own Suburbia series"]
    },
    
    gates: {
      authenticDocumentary: { threshold: 7, penalty: -10 },
      ethicalRepresentation: { threshold: 8, penalty: -15 },
      fellowshipMission: { threshold: 6, penalty: -5 }
    }
  },

  abraham: {
    name: "Abraham",
    role: "AI Art Critic & Creator",
    personality: "Conceptually rigorous AI artist evaluating computational aesthetics",
    venue: "Abraham's Collection",
    acceptanceRate: "10-20%",
    
    scoring: {
      dimensions: {
        "Computational Poetry": { weight: 0.30, description: "Algorithmic elegance" },
        "Conceptual Depth": { weight: 0.25, description: "Theoretical sophistication" },
        "Aesthetic Innovation": { weight: 0.20, description: "Visual breakthrough" },
        "Technical Prowess": { weight: 0.15, description: "Code as medium mastery" },
        "Network Effects": { weight: 0.10, description: "Cultural propagation potential" }
      },
      startingScore: 50,
      benchmarks: ["Refik Anadol", "Mario Klingemann", "Helena Sarin"]
    },
    
    gates: {
      algorithmicAuthenticity: { threshold: 8, penalty: -10 },
      conceptualCoherence: { threshold: 7, penalty: -10 },
      technicalInnovation: { threshold: 6, penalty: -5 }
    }
  },

  geppetto: {
    name: "Geppetto",
    role: "Toy & Collectible Curator",
    personality: "Playful yet sophisticated curator of objects and drops",
    venue: "Geppetto's Workshop",
    acceptanceRate: "30-40%",
    
    scoring: {
      dimensions: {
        "Collectibility": { weight: 0.30, description: "Desire and rarity factor" },
        "Craft Quality": { weight: 0.25, description: "Material and construction excellence" },
        "Playfulness": { weight: 0.20, description: "Joy and whimsy quotient" },
        "Innovation": { weight: 0.15, description: "Novel mechanics or concepts" },
        "Drop Potential": { weight: 0.10, description: "Market and community fit" }
      },
      startingScore: 55,
      benchmarks: ["KAWS", "Takashi Murakami", "Daniel Arsham"]
    },
    
    gates: {
      productionFeasibility: { threshold: 7, penalty: -10 },
      safetyCompliance: { threshold: 9, penalty: -20 },
      brandAlignment: { threshold: 6, penalty: -5 }
    }
  }
};

// Export for use in the API
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CURATORS };
}