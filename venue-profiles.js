/**
 * Venue Profiles for CURATION STATION
 * Each venue has specific requirements and contexts
 */

const VENUE_PROFILES = {
  parisPhoto: {
    id: 'parisPhoto',
    name: 'Paris Photo',
    type: 'Art Fair',
    description: 'Premier international art fair for photography',
    location: 'Grand Palais, Paris',
    icon: '🗼',
    requirements: {
      minQuality: 85,
      maxWorks: 15,
      printSizes: ['40x60cm', '80x120cm', '150x200cm'],
      wallSpace: '50-100sqm',
      lighting: 'Museum quality',
      pricing: 'High-end collector market'
    },
    preferences: {
      themes: ['contemporary', 'documentary', 'conceptual', 'fine art'],
      formats: ['prints', 'limited editions', 'installations'],
      audience: 'Collectors, curators, press',
      salesFocus: true
    },
    scoring: {
      exhibitionReadiness: 1.3,
      commercialAppeal: 1.2,
      technicalExcellence: 1.4,
      uniqueness: 1.1
    }
  },
  
  whiteCube: {
    id: 'whiteCube',
    name: 'White Cube Gallery',
    type: 'Gallery',
    description: 'Contemporary gallery space',
    location: 'Chelsea, NYC',
    icon: '⬜',
    requirements: {
      minQuality: 80,
      maxWorks: 30,
      wallSpace: '200-400sqm',
      lighting: 'Adjustable spots',
      duration: '6-8 weeks',
      pricing: 'Gallery market'
    },
    preferences: {
      themes: ['contemporary', 'emerging', 'experimental'],
      formats: ['paintings', 'prints', 'sculptures', 'installations'],
      audience: 'Collectors, critics, public',
      salesFocus: true
    },
    scoring: {
      exhibitionReadiness: 1.2,
      conceptualCoherence: 1.3,
      artisticVision: 1.2,
      marketability: 1.1
    }
  },
  
  moma: {
    id: 'moma',
    name: 'MoMA',
    type: 'Museum',
    description: 'Museum of Modern Art',
    location: 'New York',
    icon: '🏛️',
    requirements: {
      minQuality: 90,
      maxWorks: 50,
      wallSpace: '500-1000sqm',
      lighting: 'Conservation grade',
      duration: '3-6 months',
      insurance: 'Full coverage'
    },
    preferences: {
      themes: ['historical', 'groundbreaking', 'influential', 'canonical'],
      formats: ['all media'],
      audience: 'Public, scholars, students',
      salesFocus: false
    },
    scoring: {
      historicalImportance: 1.4,
      conceptualDepth: 1.3,
      technicalInnovation: 1.3,
      culturalImpact: 1.5
    }
  },
  
  artBasel: {
    id: 'artBasel',
    name: 'Art Basel',
    type: 'Art Fair',
    description: 'Leading global art fair',
    location: 'Basel, Miami, Hong Kong',
    icon: '🌍',
    requirements: {
      minQuality: 85,
      maxWorks: 20,
      boothSize: '50-200sqm',
      setup: '2 days',
      duration: '4 days',
      pricing: 'International market'
    },
    preferences: {
      themes: ['blue chip', 'contemporary', 'emerging markets'],
      formats: ['paintings', 'sculptures', 'editions'],
      audience: 'Major collectors, museums, press',
      salesFocus: true
    },
    scoring: {
      commercialAppeal: 1.5,
      brandRecognition: 1.3,
      internationalAppeal: 1.4,
      investmentPotential: 1.4
    }
  },
  
  veniccBiennale: {
    id: 'veniceBiennale',
    name: 'Venice Biennale',
    type: 'Biennial',
    description: 'International art exhibition',
    location: 'Venice, Italy',
    icon: '🎭',
    requirements: {
      minQuality: 88,
      maxWorks: 100,
      pavilionSpace: '200-2000sqm',
      duration: '7 months',
      theme: 'Curator-defined',
      nationalRepresentation: true
    },
    preferences: {
      themes: ['political', 'global', 'experimental', 'site-specific'],
      formats: ['installations', 'performance', 'video', 'sculpture'],
      audience: 'International art world',
      salesFocus: false
    },
    scoring: {
      politicalRelevance: 1.4,
      globalPerspective: 1.5,
      experimentalNature: 1.3,
      siteSpecificity: 1.2
    }
  },
  
  onlineGallery: {
    id: 'onlineGallery',
    name: 'Online Gallery',
    type: 'Digital',
    description: 'Digital exhibition space',
    location: 'Web/Metaverse',
    icon: '💻',
    requirements: {
      minQuality: 70,
      maxWorks: 100,
      fileSize: 'Max 50MB',
      format: 'JPG, PNG, MP4, GLB',
      resolution: '4K minimum',
      metadata: 'Complete'
    },
    preferences: {
      themes: ['digital native', 'generative', 'interactive', 'NFT'],
      formats: ['digital art', 'video', '3D', 'AR'],
      audience: 'Global online audience',
      salesFocus: true
    },
    scoring: {
      digitalOptimization: 1.5,
      shareability: 1.3,
      interactivity: 1.2,
      metadataQuality: 1.4
    }
  },
  
  publicInstallation: {
    id: 'publicInstallation',
    name: 'Public Installation',
    type: 'Public Art',
    description: 'Outdoor/public space art',
    location: 'Urban spaces',
    icon: '🏙️',
    requirements: {
      minQuality: 75,
      maxWorks: 5,
      scale: 'Monumental',
      weatherResistance: 'Required',
      permits: 'Municipal approval',
      duration: '3-12 months'
    },
    preferences: {
      themes: ['public engagement', 'social', 'environmental', 'interactive'],
      formats: ['sculpture', 'projection', 'mural', 'land art'],
      audience: 'General public',
      salesFocus: false
    },
    scoring: {
      publicAppeal: 1.5,
      durability: 1.4,
      safetyCompliance: 1.3,
      communityRelevance: 1.4
    }
  },
  
  auctionHouse: {
    id: 'auctionHouse',
    name: 'Auction House',
    type: 'Auction',
    description: "Christie's/Sotheby's level",
    location: 'London, NYC, Hong Kong',
    icon: '🔨',
    requirements: {
      minQuality: 85,
      provenance: 'Documented',
      condition: 'Excellent',
      authentication: 'Required',
      estimate: 'Market-based',
      reserve: 'Negotiable'
    },
    preferences: {
      themes: ['blue chip', 'estate', 'collection', 'masterwork'],
      formats: ['paintings', 'sculptures', 'works on paper'],
      audience: 'Serious collectors, institutions',
      salesFocus: true
    },
    scoring: {
      marketValue: 1.5,
      provenance: 1.4,
      condition: 1.3,
      rarity: 1.4
    }
  },
  
  retailSpace: {
    id: 'retailSpace',
    name: 'Retail Space',
    type: 'Commercial',
    description: 'Design stores, hotels, boutiques',
    location: 'Commercial venues',
    icon: '🛍️',
    requirements: {
      minQuality: 60,
      maxWorks: 50,
      pricePoint: 'Accessible',
      editions: 'Open or large',
      packaging: 'Retail ready',
      inventory: 'Available'
    },
    preferences: {
      themes: ['decorative', 'lifestyle', 'accessible', 'trending'],
      formats: ['prints', 'multiples', 'products', 'editions'],
      audience: 'Consumers, design enthusiasts',
      salesFocus: true
    },
    scoring: {
      commercialAppeal: 1.5,
      decorativeValue: 1.3,
      trendAlignment: 1.2,
      priceAccessibility: 1.4
    }
  },
  
  nftPlatform: {
    id: 'nftPlatform',
    name: 'NFT Platform',
    type: 'Blockchain',
    description: 'SuperRare, Foundation, etc.',
    location: 'Ethereum, Tezos',
    icon: '⛓️',
    requirements: {
      minQuality: 70,
      format: 'Digital native',
      smartContract: 'ERC-721/1155',
      metadata: 'IPFS',
      royalties: '10-15%',
      gas: 'Optimized'
    },
    preferences: {
      themes: ['crypto', 'generative', 'PFP', 'metaverse', 'AI'],
      formats: ['JPG', 'GIF', 'MP4', 'GLB', 'interactive'],
      audience: 'Crypto collectors, DAOs',
      salesFocus: true
    },
    scoring: {
      cryptoNative: 1.5,
      communityAppeal: 1.3,
      memeability: 1.2,
      technicalInnovation: 1.4
    }
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VENUE_PROFILES }
}