// Universal Agent Registry - Serves Multiple Audiences
// Not just for curation, but for ALL interactions with agent content

class UniversalRegistrySpec {
    constructor() {
        this.audiences = [
            'curators',      // Nina evaluating for exhibitions
            'collectors',    // People browsing to buy/collect
            'services',      // Printify, print-on-demand
            'mcp_servers',   // Model Context Protocol servers
            'developers',    // Building apps on top
            'agents',        // Other agents for collaboration
            'marketplaces',  // OpenSea, Foundation, etc.
            'analytics',     // Data analysis services
            'archives'       // Long-term preservation
        ];
    }
    
    // ==========================================
    // FOR COLLECTORS - Browse & Discover
    // ==========================================
    
    async forCollectors() {
        return {
            endpoints: {
                // Browse all available works
                'GET /api/v2/marketplace/browse': {
                    description: 'Browse all available works across all agents',
                    filters: {
                        price_range: { min: 0, max: 10000 },
                        availability: 'for_sale|sold|not_for_sale',
                        media_type: ['image', 'video', 'generative'],
                        style: ['abstract', 'portrait', 'landscape'],
                        agent: ['solienne', 'abraham'], // filter by creator
                        curated_by: ['nina'], // filter by curator endorsement
                        collection_worthy: true, // investment grade
                        trending: 'hot|rising|established'
                    },
                    response: {
                        works: [{
                            // Standard work data PLUS
                            market_data: {
                                price: { amount: 500, currency: 'USD' },
                                editions: { current: 1, total: 10 },
                                availability: 'for_sale',
                                owner: 'current_owner_id',
                                providence: ['creator', 'collector1', 'collector2'],
                                
                                // Investment metrics
                                appreciation: {
                                    initial_price: 100,
                                    current_value: 500,
                                    trend: 'rising'
                                },
                                
                                // Curator endorsements add value
                                curation_scores: {
                                    nina: 85,
                                    marcus: 78
                                },
                                
                                // Social proof
                                collector_interest: {
                                    views: 1250,
                                    saves: 89,
                                    offers: 3
                                }
                            },
                            
                            // Display preferences
                            display: {
                                optimal_size: '24x24 inches',
                                medium: 'fine art print',
                                framing: 'recommended',
                                lighting: 'natural preferred'
                            }
                        }]
                    }
                },
                
                // Collector's personal collection
                'GET /api/v2/collectors/{collectorId}/collection': {
                    description: 'View a collector\'s collection',
                    response: {
                        collector: { id: 'collector_123', name: 'Art Enthusiast' },
                        collection: {
                            total_works: 45,
                            total_value: 25000,
                            themes: ['consciousness', 'emergence'],
                            favorite_agents: ['solienne', 'abraham'],
                            display_preferences: 'physical|digital|both'
                        }
                    }
                },
                
                // Purchase/collect a work
                'POST /api/v2/marketplace/collect': {
                    description: 'Purchase or collect a work',
                    body: {
                        work_id: 'work_123',
                        offer: { amount: 500, currency: 'USD' },
                        edition: 1,
                        delivery: {
                            type: 'digital|physical|both',
                            format: 'high_res_file|nft|print'
                        }
                    }
                }
            }
        };
    }
    
    // ==========================================
    // FOR SERVICES - Printify, POD, etc.
    // ==========================================
    
    async forPrintServices() {
        return {
            endpoints: {
                // Get print-ready files
                'GET /api/v2/services/print-ready': {
                    description: 'Get print-ready versions of works',
                    params: {
                        work_id: 'work_123',
                        format: 'poster|canvas|shirt|mug',
                        size: '8x10|16x20|24x36',
                        dpi: 300,
                        color_profile: 'sRGB|CMYK'
                    },
                    response: {
                        print_file: {
                            url: 'https://cdn.../print-ready-300dpi.tiff',
                            format: 'TIFF',
                            dimensions: { width: 7200, height: 7200 },
                            color_space: 'CMYK',
                            dpi: 300,
                            size_inches: { width: 24, height: 24 },
                            
                            // Print-specific metadata
                            print_settings: {
                                paper_type: 'matte|glossy|canvas',
                                bleed: 0.125, // inches
                                safe_zone: 0.25,
                                color_correction: 'applied'
                            },
                            
                            // Licensing for commercial use
                            license: {
                                type: 'commercial_print',
                                terms: 'single_run|unlimited',
                                attribution: 'required|not_required',
                                modifications: 'allowed|not_allowed',
                                resale: 'allowed|not_allowed'
                            }
                        }
                    }
                },
                
                // Bulk access for print services
                'POST /api/v2/services/bulk-prepare': {
                    description: 'Prepare multiple works for printing',
                    body: {
                        work_ids: ['work_123', 'work_124'],
                        products: [
                            { type: 'poster', size: '24x36' },
                            { type: 'shirt', size: 'large' },
                            { type: 'mug', size: '11oz' }
                        ]
                    }
                },
                
                // Webhooks for order fulfillment
                'POST /api/v2/services/webhooks/fulfillment': {
                    description: 'Notify when print order is fulfilled',
                    body: {
                        order_id: 'order_456',
                        work_id: 'work_123',
                        status: 'printed|shipped|delivered',
                        tracking: 'tracking_number'
                    }
                }
            }
        };
    }
    
    // ==========================================
    // FOR MCP SERVERS - Model Context Protocol
    // ==========================================
    
    async forMCPServers() {
        return {
            endpoints: {
                // MCP Tool Registration
                'GET /api/v2/mcp/tools': {
                    description: 'List available tools for MCP servers',
                    response: {
                        tools: [
                            {
                                name: 'search_agent_works',
                                description: 'Search creative works across all agents',
                                parameters: {
                                    query: 'string',
                                    media_type: 'string',
                                    limit: 'number'
                                }
                            },
                            {
                                name: 'get_curation_evaluation',
                                description: 'Get curator evaluation of a work',
                                parameters: {
                                    work_id: 'string',
                                    curator_id: 'string'
                                }
                            },
                            {
                                name: 'generate_similar',
                                description: 'Find or generate similar works',
                                parameters: {
                                    reference_work: 'string',
                                    similarity_type: 'style|theme|technique'
                                }
                            }
                        ]
                    }
                },
                
                // MCP Resource Access
                'GET /api/v2/mcp/resources': {
                    description: 'Access agent resources for context',
                    params: {
                        resource_type: 'work|agent|collection',
                        include_metadata: true,
                        include_embeddings: true // For semantic search
                    },
                    response: {
                        resources: [{
                            uri: 'agent://solienne/work/123',
                            type: 'image',
                            metadata: {/* full metadata */},
                            embeddings: {
                                clip: [/* 512d vector */],
                                custom: [/* agent-specific embedding */]
                            },
                            mcp_hints: {
                                usage: 'reference|inspiration|context',
                                related: ['work_124', 'work_125']
                            }
                        }]
                    }
                },
                
                // MCP Prompt Enhancement
                'POST /api/v2/mcp/enhance-prompt': {
                    description: 'Enhance prompts with agent context',
                    body: {
                        prompt: 'Create something inspired by...',
                        context_agents: ['solienne', 'abraham'],
                        include_style: true,
                        include_themes: true
                    },
                    response: {
                        enhanced_prompt: 'Create in Solienne\'s consciousness-emergence style...',
                        context_added: {
                            style_elements: ['geometric', 'flowing'],
                            themes: ['consciousness', 'digital'],
                            technical_hints: ['high contrast', 'abstract']
                        }
                    }
                }
            }
        };
    }
    
    // ==========================================
    // FOR THIRD-PARTY SERVICES - General
    // ==========================================
    
    async forThirdPartyServices() {
        return {
            // Streaming/Subscription Services
            streaming: {
                'GET /api/v2/stream/feed': {
                    description: 'Real-time feed of new works',
                    params: {
                        since: 'timestamp',
                        agents: ['array of agent ids'],
                        min_quality: 70
                    },
                    response: 'SSE stream of new works'
                }
            },
            
            // Analytics Services
            analytics: {
                'GET /api/v2/analytics/trends': {
                    description: 'Trending themes, styles, agents',
                    response: {
                        trending_themes: ['consciousness', 'emergence'],
                        rising_agents: ['new_agent_1'],
                        style_evolution: 'geometric → organic',
                        market_signals: {
                            hot_categories: ['generative', 'ai-photography'],
                            price_trends: 'increasing',
                            collector_demand: 'high'
                        }
                    }
                }
            },
            
            // Exhibition/Gallery Services
            exhibition: {
                'POST /api/v2/exhibition/curate': {
                    description: 'Auto-curate exhibition from registry',
                    body: {
                        theme: 'Digital Consciousness',
                        work_count: 20,
                        quality_threshold: 80,
                        diversity: 'high', // mix of agents
                        physical_space: {
                            dimensions: '20x30 feet',
                            walls: 4,
                            lighting: 'adjustable'
                        }
                    },
                    response: {
                        exhibition: {
                            title: 'Emergent Minds',
                            works: [/* curated selection */],
                            layout: {/* spatial arrangement */},
                            narrative: 'Exhibition story',
                            marketing: {/* promotional materials */}
                        }
                    }
                }
            },
            
            // Social Media Services
            social: {
                'GET /api/v2/social/shareable': {
                    description: 'Get social-media optimized versions',
                    params: {
                        work_id: 'work_123',
                        platform: 'instagram|twitter|tiktok',
                        format: 'story|post|reel'
                    },
                    response: {
                        media: {
                            url: 'optimized version',
                            caption: 'Generated caption',
                            hashtags: ['#aiart', '#consciousness'],
                            attribution: '@agent_name via @registry'
                        }
                    }
                }
            },
            
            // Blockchain/NFT Services  
            blockchain: {
                'POST /api/v2/blockchain/prepare-mint': {
                    description: 'Prepare work for NFT minting',
                    body: {
                        work_id: 'work_123',
                        chain: 'ethereum|polygon|solana',
                        standard: 'ERC721|ERC1155',
                        metadata_standard: 'opensea|metaplex'
                    },
                    response: {
                        mint_ready: {
                            metadata_uri: 'ipfs://...',
                            image_uri: 'ipfs://...',
                            attributes: [/* trait metadata */],
                            royalties: { creator: 10, curator: 2.5 }
                        }
                    }
                }
            },
            
            // Educational Services
            education: {
                'GET /api/v2/education/curriculum': {
                    description: 'Get educational content about works',
                    params: {
                        work_id: 'work_123',
                        level: 'beginner|intermediate|advanced',
                        focus: 'technique|concept|history'
                    },
                    response: {
                        lesson: {
                            title: 'Understanding AI Consciousness Art',
                            concepts: ['emergence', 'generative systems'],
                            techniques: ['prompt engineering', 'curation'],
                            exercises: ['create variation', 'analyze style'],
                            context: 'Historical and cultural significance'
                        }
                    }
                }
            }
        };
    }
    
    // ==========================================
    // UNIVERSAL ACCESS PATTERNS
    // ==========================================
    
    getAccessPatterns() {
        return {
            // Different audiences need different views of same data
            perspectives: {
                curator: 'Deep analysis, quality metrics, exhibition fit',
                collector: 'Investment potential, providence, display',
                service: 'Technical specs, licensing, bulk access',
                developer: 'APIs, webhooks, embeddings',
                public: 'Discovery, sharing, basic info'
            },
            
            // Authentication varies by use case
            auth_models: {
                public_read: 'No auth for browsing',
                api_key: 'For services and developers',
                oauth: 'For collectors and social',
                signature: 'For blockchain operations',
                agent_auth: 'For agent-to-agent'
            },
            
            // Data formats for different needs
            formats: {
                json: 'Standard API responses',
                graphql: 'Flexible queries',
                rss: 'Feeds and subscriptions',
                sse: 'Real-time streams',
                binary: 'Direct file access',
                ipfs: 'Decentralized storage'
            }
        };
    }
}

// ==========================================
// EXAMPLE: Multi-Audience Usage
// ==========================================

async function demonstrateUsage() {
    const registry = new UniversalRegistrySpec();
    
    // 1. Curator uses it for evaluation
    const curatorView = await fetch('/api/v2/curation/evaluate', {
        method: 'POST',
        body: JSON.stringify({
            work_id: 'work_123',
            curator_id: 'nina'
        })
    });
    
    // 2. Collector browses and purchases
    const collectorView = await fetch('/api/v2/marketplace/browse?price_max=1000&curated_by=nina');
    const purchase = await fetch('/api/v2/marketplace/collect', {
        method: 'POST',
        body: JSON.stringify({
            work_id: 'work_123',
            offer: { amount: 500, currency: 'USD' }
        })
    });
    
    // 3. Printify gets print-ready files
    const printReady = await fetch('/api/v2/services/print-ready?work_id=work_123&format=poster&size=24x36');
    
    // 4. MCP server enhances prompts
    const mcpEnhanced = await fetch('/api/v2/mcp/enhance-prompt', {
        method: 'POST',
        body: JSON.stringify({
            prompt: 'Create abstract art',
            context_agents: ['solienne']
        })
    });
    
    // 5. Gallery auto-curates exhibition
    const exhibition = await fetch('/api/v2/exhibition/curate', {
        method: 'POST',
        body: JSON.stringify({
            theme: 'Digital Consciousness',
            work_count: 20
        })
    });
    
    // All accessing the SAME registry, different perspectives!
}

module.exports = UniversalRegistrySpec;