// Agent Registry API Specification
// Defines how agents expose their creative work for curation

class AgentRegistrySpec {
    constructor() {
        this.version = '1.0';
        this.capabilities = {
            content_discovery: true,
            metadata_extraction: true,
            ai_analysis: true,
            batch_processing: true,
            filtering: true,
            collections: true,
            analytics: true,
            collaboration: true
        };
    }
    
    // ==========================================
    // CONTENT DISCOVERY API
    // ==========================================
    
    // Query agent's creative works with filters
    async queryAgentContent(agentId, filters = {}) {
        /* 
        Filters include:
        - media_type: ['image', 'video', 'audio', 'text', 'code', '3d']
        - date_range: { from: Date, to: Date }
        - themes: ['abstract', 'portrait', 'landscape', 'conceptual', etc.]
        - quality_score: { min: 0, max: 100 }
        - tags: ['ai-generated', 'experimental', 'collection-name']
        - status: ['published', 'draft', 'archived']
        - limit: number (default 100)
        - offset: number (for pagination)
        - sort_by: 'date_created' | 'quality_score' | 'popularity' | 'curation_score'
        */
        
        return {
            agent_id: agentId,
            total_count: 1500,
            filtered_count: 250,
            items: [
                {
                    id: 'work_123',
                    agent_id: agentId,
                    media_type: 'image',
                    created_at: '2024-01-15T10:30:00Z',
                    modified_at: '2024-01-15T10:30:00Z',
                    
                    // Core metadata
                    metadata: {
                        title: 'Emergent Consciousness #42',
                        description: 'Exploration of digital consciousness',
                        dimensions: { width: 2048, height: 2048, duration: null },
                        file_size: 2048000,
                        format: 'png',
                        
                        // Generation metadata
                        generation: {
                            model: 'midjourney-v6',
                            prompt: 'abstract consciousness emerging from code',
                            seed: 12345,
                            parameters: { steps: 50, cfg: 7.5 },
                            iterations: 3,
                            parent_work: 'work_122' // for variations
                        },
                        
                        // Themes and tags (can be auto-generated or manual)
                        themes: ['consciousness', 'abstract', 'digital'],
                        tags: ['ai-art', 'experimental', 'collection-consciousness'],
                        style_attributes: ['surreal', 'geometric', 'vibrant'],
                        color_palette: ['#4CAF50', '#2196F3', '#000000'],
                        
                        // Quality and engagement metrics
                        quality_score: 85, // Agent's self-assessment
                        engagement: {
                            views: 1250,
                            likes: 89,
                            shares: 12,
                            comments: 5
                        }
                    },
                    
                    // Curation history
                    curation_history: [
                        {
                            curator_id: 'nina',
                            timestamp: '2024-01-16T14:00:00Z',
                            score: 78,
                            verdict: 'MAYBE',
                            notes: 'Strong conceptual foundation, needs technical refinement'
                        }
                    ],
                    
                    // URLs for access
                    urls: {
                        thumbnail: 'https://agent-cdn.com/thumb/work_123.jpg',
                        preview: 'https://agent-cdn.com/preview/work_123.jpg',
                        full: 'https://agent-cdn.com/full/work_123.png',
                        data: 'base64_or_ipfs_hash'
                    },
                    
                    // Exhibition/collection status
                    collections: ['emerging-ai-2024', 'consciousness-series'],
                    exhibition_status: {
                        available: true,
                        reserved_until: null,
                        exclusive_to: null,
                        price: null
                    }
                }
            ],
            
            // Aggregated analytics for the query
            analytics: {
                average_quality: 72.5,
                themes_distribution: {
                    'abstract': 45,
                    'portrait': 30,
                    'landscape': 25
                },
                media_distribution: {
                    'image': 180,
                    'video': 70
                },
                curation_stats: {
                    total_curated: 45,
                    exhibition_ready: 12,
                    average_score: 68.5
                }
            }
        };
    }
    
    // ==========================================
    // AI ANALYSIS & TAGGING SERVICE
    // ==========================================
    
    // This is where AI analysis happens - could be centralized or per-agent
    async analyzeContent(content, options = {}) {
        /*
        Options:
        - deep_analysis: boolean (expensive, detailed analysis)
        - extract_themes: boolean
        - generate_tags: boolean
        - color_analysis: boolean
        - style_detection: boolean
        - quality_assessment: boolean
        - compare_similar: boolean
        */
        
        return {
            // Visual/content analysis (via Claude, CLIP, etc.)
            visual_analysis: {
                description: 'Detailed description of what the AI sees',
                objects_detected: ['figure', 'landscape', 'abstract_forms'],
                composition: {
                    rule_of_thirds: 0.85,
                    balance: 0.72,
                    focal_points: [{x: 0.3, y: 0.6, strength: 0.9}]
                },
                technical_quality: {
                    sharpness: 0.88,
                    exposure: 0.91,
                    color_balance: 0.79,
                    artifacts: ['minor_compression', 'slight_banding']
                }
            },
            
            // Thematic analysis
            themes: {
                primary: ['consciousness', 'emergence'],
                secondary: ['technology', 'nature'],
                abstract_concepts: ['transformation', 'duality'],
                confidence: 0.82
            },
            
            // Auto-generated tags
            generated_tags: [
                { tag: 'abstract', confidence: 0.95 },
                { tag: 'digital-art', confidence: 0.99 },
                { tag: 'consciousness', confidence: 0.78 },
                { tag: 'geometric', confidence: 0.83 }
            ],
            
            // Style analysis
            style: {
                artistic_movement: ['digital-surrealism', 'generative-art'],
                influences: ['kandinsky', 'processing-art'],
                technique: 'ai-generated',
                mood: ['contemplative', 'mysterious']
            },
            
            // Color analysis
            colors: {
                dominant: ['#4CAF50', '#2196F3', '#1a1a1a'],
                palette_type: 'complementary',
                mood: 'cool-tech',
                contrast_ratio: 4.5
            },
            
            // Similar works (for deduplication/variation detection)
            similar_works: [
                { id: 'work_122', similarity: 0.92, relationship: 'variation' },
                { id: 'work_089', similarity: 0.71, relationship: 'thematic' }
            ],
            
            // Quality assessment
            quality_metrics: {
                technical_score: 82,
                artistic_score: 78,
                originality_score: 71,
                exhibition_readiness: 75,
                commercial_viability: 68
            },
            
            // Suggested categorization
            suggested_collections: ['emerging-consciousness', 'ai-explores-ai'],
            suggested_exhibitions: ['digital-now-2024', 'synthetic-realities']
        };
    }
    
    // ==========================================
    // CURATION WORKFLOW API
    // ==========================================
    
    // Batch curation session
    async createCurationSession(curatorId, config = {}) {
        /*
        Config:
        - batch_size: number (how many to review at once)
        - auto_filter: object (pre-filter criteria)
        - evaluation_mode: 'quick' | 'detailed' | 'comparative'
        - target_exhibition: string (specific exhibition context)
        */
        
        return {
            session_id: 'session_xyz',
            curator_id: curatorId,
            created_at: new Date().toISOString(),
            config: config,
            
            // Pre-filtered work queue
            queue: {
                total_items: 100,
                reviewed: 0,
                remaining: 100,
                current_batch: [] // Array of work IDs
            },
            
            // Session analytics
            analytics: {
                average_review_time: 0,
                acceptance_rate: 0,
                score_distribution: {},
                common_feedback: []
            }
        };
    }
    
    // Record curation decision
    async recordCurationDecision(sessionId, workId, decision) {
        /*
        Decision includes:
        - verdict: 'accept' | 'reject' | 'maybe' | 'revisit'
        - score: number (0-100)
        - dimensions: object (detailed scoring)
        - tags: array (curator-added tags)
        - notes: string (private curator notes)
        - public_feedback: string (shareable with artist)
        - exhibition_fit: array (specific exhibitions)
        - required_changes: array (for conditional acceptance)
        */
        
        return {
            decision_id: 'decision_abc',
            session_id: sessionId,
            work_id: workId,
            curator_id: 'nina',
            timestamp: new Date().toISOString(),
            decision: decision,
            
            // Track decision context
            context: {
                review_duration: 45, // seconds
                comparison_works: ['work_121', 'work_119'], // if comparative mode
                criteria_version: '2.0'
            },
            
            // Update work status
            work_update: {
                curation_status: 'reviewed',
                exhibition_eligible: decision.verdict === 'accept',
                improvement_areas: decision.required_changes
            }
        };
    }
    
    // ==========================================
    // COLLECTION MANAGEMENT API
    // ==========================================
    
    async manageCollection(collectionId, action, data = {}) {
        const actions = {
            create: {
                name: 'Consciousness Explorations 2024',
                description: 'AI-generated works exploring digital consciousness',
                curator_id: 'nina',
                visibility: 'public' | 'private' | 'unlisted',
                criteria: {
                    min_score: 75,
                    themes: ['consciousness', 'ai'],
                    media_types: ['image', 'video']
                }
            },
            
            add_work: {
                work_id: 'work_123',
                notes: 'Exemplifies the theme perfectly',
                position: 5 // ordering within collection
            },
            
            bulk_add: {
                work_ids: ['work_123', 'work_124', 'work_125'],
                auto_order: true
            },
            
            remove_work: {
                work_id: 'work_123',
                reason: 'No longer fits theme'
            },
            
            update_metadata: {
                description: 'Updated description',
                cover_image: 'work_123',
                featured_works: ['work_123', 'work_125']
            },
            
            publish: {
                exhibition_id: 'digital-now-2024',
                embargo_until: '2024-02-01T00:00:00Z'
            },
            
            export: {
                format: 'json' | 'csv' | 'pdf',
                include_analytics: true,
                include_images: false
            }
        };
        
        return {
            success: true,
            collection_id: collectionId,
            action: action,
            result: {/* action-specific result */},
            collection_stats: {
                total_works: 25,
                average_score: 78.5,
                exhibition_ready: 8,
                total_value: null
            }
        };
    }
    
    // ==========================================
    // ANALYTICS & REPORTING API
    // ==========================================
    
    async getCurationAnalytics(curatorId, timeRange = {}) {
        return {
            curator_id: curatorId,
            time_range: timeRange,
            
            // Activity metrics
            activity: {
                total_reviewed: 1250,
                total_curated: 187,
                acceptance_rate: 0.15,
                average_score_given: 68.5,
                review_time_avg: 52, // seconds
                sessions_count: 45
            },
            
            // Quality trends
            trends: {
                score_trend: 'increasing', // or 'decreasing', 'stable'
                monthly_scores: [
                    { month: '2024-01', avg: 65.2, count: 120 },
                    { month: '2024-02', avg: 68.5, count: 145 }
                ],
                quality_improvement: 0.05, // 5% improvement
                theme_evolution: [
                    { theme: 'consciousness', growth: 0.25 },
                    { theme: 'abstract', growth: -0.10 }
                ]
            },
            
            // Curation patterns
            patterns: {
                preferred_themes: ['consciousness', 'emergence', 'abstract'],
                preferred_styles: ['surreal', 'geometric'],
                typical_score_range: { min: 60, max: 85 },
                harsh_on: ['technical_errors', 'cliches'],
                lenient_on: ['experimental', 'conceptual']
            },
            
            // Exhibition success
            exhibition_metrics: {
                works_exhibited: 45,
                exhibitions_curated: 3,
                visitor_engagement: {
                    total_views: 15000,
                    average_time: 45, // seconds per work
                    favorites: 890
                },
                sales: {
                    works_sold: 12,
                    total_value: 45000,
                    conversion_rate: 0.27
                }
            },
            
            // Collaboration metrics
            collaboration: {
                co_curators: ['marcus', 'sophia'],
                shared_collections: 5,
                cross_recommendations: 23,
                agreement_rate: 0.72 // with other curators
            },
            
            // Recommendations for curator
            insights: {
                underexplored_themes: ['bio-digital', 'quantum'],
                quality_improving_agents: ['agent_789', 'agent_234'],
                suggested_batch_size: 25,
                optimal_review_time: 'morning',
                fatigue_point: 50 // reviews before quality drops
            }
        };
    }
    
    // ==========================================
    // COLLABORATION API
    // ==========================================
    
    async collaborativeCuration(config) {
        /*
        Enable multiple curators to work together
        */
        return {
            collaboration_id: 'collab_123',
            lead_curator: 'nina',
            co_curators: ['marcus', 'sophia'],
            
            // Voting/consensus mechanism
            voting: {
                mode: 'consensus' | 'majority' | 'veto',
                required_votes: 2,
                current_votes: {
                    'work_123': {
                        nina: { verdict: 'accept', score: 82 },
                        marcus: { verdict: 'accept', score: 78 },
                        sophia: { verdict: 'maybe', score: 71 }
                    }
                }
            },
            
            // Specialized roles
            roles: {
                nina: 'lead_curator',
                marcus: 'technical_advisor',
                sophia: 'thematic_consultant'
            },
            
            // Shared workspace
            workspace: {
                shared_collection: 'collab_collection_123',
                discussion_thread: 'thread_456',
                shared_notes: 'Collaborative curation notes...'
            }
        };
    }
    
    // ==========================================
    // AGENT REGISTRATION
    // ==========================================
    
    async registerAgent(agentConfig) {
        /*
        Register an agent to make their work available for curation
        */
        return {
            agent_id: agentConfig.id,
            name: agentConfig.name,
            description: agentConfig.description,
            
            // Content availability
            content: {
                total_works: 1500,
                media_types: ['image', 'video'],
                update_frequency: 'daily',
                api_endpoint: agentConfig.api_endpoint || null,
                webhook_url: agentConfig.webhook_url || null
            },
            
            // Agent capabilities
            capabilities: {
                provides_metadata: true,
                supports_analysis: true,
                allows_curation: true,
                exclusive_content: false,
                commercial_use: true
            },
            
            // Integration details
            integration: {
                auth_method: 'api_key' | 'oauth' | 'none',
                rate_limits: { per_minute: 60, per_hour: 1000 },
                data_format: 'json' | 'graphql',
                push_updates: true
            },
            
            // Quality metrics
            quality_profile: {
                average_score: 72.5,
                top_percentile: 15, // top 15% of all agents
                consistency: 0.78,
                improvement_rate: 0.05
            }
        };
    }
}

// ==========================================
// WHERE AI ANALYSIS HAPPENS
// ==========================================

class AIAnalysisService {
    /*
    The AI analysis can happen at multiple points:
    
    1. AT GENERATION TIME (Agent-side):
       - When agent creates work, immediately analyze
       - Store metadata with the work
       - Advantages: One-time cost, agent pays for it
       - Disadvantages: May need re-analysis with new models
    
    2. AT SUBMISSION TIME (Registry-side):
       - When work is submitted to registry
       - Centralized analysis service
       - Advantages: Consistent analysis, can update
       - Disadvantages: Registry bears cost
    
    3. AT CURATION TIME (Curator-side):
       - When curator reviews work
       - Specialized analysis per curator needs
       - Advantages: Tailored to curator, most current
       - Disadvantages: Repeated analysis, higher cost
    
    4. HYBRID APPROACH (Recommended):
       - Basic analysis at generation (tags, themes)
       - Enhanced analysis at registry (quality, style)
       - Specialized analysis at curation (exhibition fit)
    */
    
    async analyzeWork(work, analysisLevel = 'standard') {
        const levels = {
            basic: {
                // Quick, cheap analysis
                providers: ['clip', 'local-model'],
                features: ['tags', 'colors', 'basic-quality'],
                cost: 0.001,
                time: 100 // ms
            },
            
            standard: {
                // Standard curation analysis
                providers: ['claude-haiku', 'clip'],
                features: ['description', 'themes', 'quality', 'style'],
                cost: 0.01,
                time: 1000 // ms
            },
            
            detailed: {
                // Deep analysis for important works
                providers: ['claude-sonnet', 'specialized-models'],
                features: ['everything', 'comparative', 'market-analysis'],
                cost: 0.10,
                time: 5000 // ms
            }
        };
        
        const config = levels[analysisLevel];
        
        // Route to appropriate analysis provider
        const results = await Promise.all(
            config.providers.map(provider => 
                this.runAnalysis(work, provider, config.features)
            )
        );
        
        // Merge results from multiple providers
        return this.mergeAnalysisResults(results);
    }
    
    async runAnalysis(work, provider, features) {
        // Provider-specific implementation
        switch(provider) {
            case 'claude-sonnet':
                return await this.analyzeWithClaude(work, features);
            case 'clip':
                return await this.analyzeWithCLIP(work, features);
            case 'local-model':
                return await this.analyzeWithLocalModel(work, features);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }
}

module.exports = {
    AgentRegistrySpec,
    AIAnalysisService
};