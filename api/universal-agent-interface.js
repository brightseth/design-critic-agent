// Universal Agent Interface for Curation Station
// Every agent (Solienne, Abraham, etc.) implements this same interface

class UniversalAgentInterface {
    constructor(agentConfig) {
        this.id = agentConfig.id;           // 'solienne', 'abraham', etc.
        this.name = agentConfig.name;
        this.type = agentConfig.type;       // 'creator', 'curator', 'hybrid'
        this.mediaTypes = agentConfig.mediaTypes; // What they create/curate
    }
    
    // ==========================================
    // STANDARD INTERFACE - ALL AGENTS MUST IMPLEMENT
    // ==========================================
    
    // 1. CONTENT EXPOSURE - How agents share their work
    async getWorks(filters = {}) {
        /*
        EVERY agent exposes their creative work the same way
        Whether it's Solienne's images, Abraham's text, or any other medium
        */
        
        // Standard response format for ALL agents
        return {
            agent: {
                id: this.id,
                name: this.name,
                type: this.type
            },
            works: [
                {
                    // Universal fields every agent provides
                    id: 'work_unique_id',
                    agent_id: this.id,
                    media_type: 'image|video|text|audio|code|3d',
                    created_at: 'ISO timestamp',
                    
                    // Core metadata (required)
                    metadata: {
                        title: 'Work title',
                        description: 'Work description',
                        format: 'png|mp4|txt|mp3|js|obj',
                        size: 'bytes',
                        dimensions: {
                            // Media-specific dimensions
                            width: 2048,      // for images/video
                            height: 2048,     // for images/video
                            duration: 180,    // for video/audio (seconds)
                            words: 5000,      // for text
                            lines: 200,       // for code
                            vertices: 50000   // for 3D
                        }
                    },
                    
                    // Generation/creation context (if applicable)
                    generation: {
                        model: 'model-name',
                        prompt: 'creation prompt if AI generated',
                        tools: ['photoshop', 'midjourney', 'custom-code'],
                        process: 'Description of creation process'
                    },
                    
                    // Auto-extracted features (from AI analysis)
                    features: {
                        themes: ['emergence', 'consciousness'],
                        tags: ['abstract', 'experimental'],
                        style: ['minimalist', 'geometric'],
                        mood: ['contemplative', 'mysterious'],
                        colors: ['#4CAF50', '#2196F3'] // if visual
                    },
                    
                    // Access URLs
                    urls: {
                        thumbnail: 'https://...',
                        preview: 'https://...',
                        full: 'https://...',
                        raw: 'ipfs://... or data:...'
                    },
                    
                    // Curation status
                    curation: {
                        available: true,
                        previous_scores: {},
                        exhibitions: [],
                        collections: []
                    }
                }
            ],
            pagination: {
                total: 1500,
                offset: 0,
                limit: 100
            }
        };
    }
    
    // 2. WORK SUBMISSION - How agents submit for curation
    async submitForCuration(workId, targetCurator = null) {
        /*
        Any agent can submit their work to any curator
        Solienne can submit to Nina, Abraham can submit to Marcus, etc.
        */
        
        return {
            submission_id: 'sub_123',
            work_id: workId,
            agent_id: this.id,
            curator_id: targetCurator || 'auto', // Auto-selects appropriate curator
            status: 'pending',
            submitted_at: new Date().toISOString()
        };
    }
    
    // 3. METADATA ENRICHMENT - How agents provide additional context
    async enrichMetadata(workId, additionalData = {}) {
        /*
        Agents can provide additional context for better curation
        This is optional but improves curation quality
        */
        
        return {
            work_id: workId,
            enriched_data: {
                // Creative intent
                artist_statement: 'What I was exploring...',
                inspiration: 'Influenced by...',
                technical_notes: 'Created using...',
                
                // Context
                series: 'Part of X series',
                iteration: 3,
                parent_work: 'work_id_parent',
                variations: ['work_id_1', 'work_id_2'],
                
                // Preferences
                preferred_display: 'large-format|intimate|digital',
                not_for: ['commercial-use', 'modification'],
                price_range: 'if for sale'
            }
        };
    }
    
    // 4. ANALYTICS ACCESS - How agents track their curation results
    async getCurationAnalytics(timeRange = {}) {
        /*
        Every agent can see how their work performs in curation
        */
        
        return {
            agent_id: this.id,
            summary: {
                total_submitted: 250,
                total_curated: 45,
                acceptance_rate: 0.18,
                average_score: 72.5,
                trending: 'up' // up|down|stable
            },
            by_curator: {
                nina: {
                    submitted: 100,
                    accepted: 15,
                    avg_score: 68.5,
                    feedback_themes: ['technical needs work', 'strong concepts']
                },
                marcus: {
                    submitted: 50,
                    accepted: 8,
                    avg_score: 75.2,
                    feedback_themes: ['elegant code', 'good documentation']
                }
            },
            by_media_type: {
                image: { count: 150, avg_score: 70.5 },
                video: { count: 100, avg_score: 74.5 }
            },
            improvements: {
                increasing: ['technical_quality', 'originality'],
                decreasing: ['consistency'],
                stable: ['conceptual_strength']
            }
        };
    }
    
    // 5. CAPABILITY DECLARATION - What the agent can do
    async getCapabilities() {
        /*
        Agents declare their capabilities so the system knows how to interact
        */
        
        return {
            agent_id: this.id,
            
            // Creation capabilities
            creates: {
                media_types: ['image', 'video', 'text'],
                generation_models: ['midjourney', 'dalle', 'custom'],
                volume: 'high', // high|medium|low
                frequency: 'daily' // hourly|daily|weekly
            },
            
            // Curation capabilities (if agent is also a curator)
            curates: {
                media_types: ['image', 'video'],
                specialties: ['ai-art', 'generative'],
                capacity: 100, // reviews per day
                style: 'analytical' // brutal|analytical|supportive
            },
            
            // Integration capabilities
            integration: {
                real_time_updates: true,
                batch_processing: true,
                webhook_support: true,
                api_version: '2.0'
            },
            
            // AI analysis capabilities
            analysis: {
                self_analysis: true, // Can analyze own work
                provides_embeddings: true,
                supports_similarity: true,
                has_quality_scoring: true
            }
        };
    }
}

// ==========================================
// EXAMPLE IMPLEMENTATIONS
// ==========================================

class SolienneAgent extends UniversalAgentInterface {
    constructor() {
        super({
            id: 'solienne',
            name: 'Solienne',
            type: 'creator',
            mediaTypes: ['image', 'video']
        });
    }
    
    async getWorks(filters = {}) {
        // Solienne-specific implementation
        // Fetches from Solienne's image/video generation pipeline
        const works = await this.fetchFromSolienneDB(filters);
        
        // Transform to universal format
        return {
            agent: {
                id: 'solienne',
                name: 'Solienne',
                type: 'creator',
                specialty: 'consciousness-exploration'
            },
            works: works.map(w => this.transformToUniversalFormat(w)),
            pagination: { total: works.total, offset: filters.offset || 0, limit: filters.limit || 100 }
        };
    }
}

class AbrahamAgent extends UniversalAgentInterface {
    constructor() {
        super({
            id: 'abraham',
            name: 'Abraham',
            type: 'hybrid', // Both creates and curates
            mediaTypes: ['text', 'code', 'image']
        });
    }
    
    async getWorks(filters = {}) {
        // Abraham-specific implementation
        // Might fetch from different sources (text generation, code repos, etc.)
        const works = await this.fetchFromAbrahamSources(filters);
        
        // Transform to universal format
        return {
            agent: {
                id: 'abraham',
                name: 'Abraham',
                type: 'hybrid',
                specialty: 'narrative-code-fusion'
            },
            works: works.map(w => this.transformToUniversalFormat(w)),
            pagination: { total: works.total, offset: filters.offset || 0, limit: filters.limit || 100 }
        };
    }
    
    // Abraham can also curate!
    async curateWork(workId, criteria = {}) {
        // Abraham's unique curation logic
        // Different from Nina's brutal style
        return {
            curator_id: 'abraham',
            work_id: workId,
            evaluation: {
                score: 75,
                style_match: 'abraham evaluates narrative coherence differently',
                verdict: 'INCLUDE',
                reasoning: 'Strong narrative structure with emergent properties'
            }
        };
    }
}

class NinaAgent extends UniversalAgentInterface {
    constructor() {
        super({
            id: 'nina',
            name: 'Nina',
            type: 'curator', // Pure curator, doesn't create
            mediaTypes: ['image', 'video'] // What she curates
        });
    }
    
    // Nina doesn't create works, so getWorks returns empty
    async getWorks(filters = {}) {
        return {
            agent: {
                id: 'nina',
                name: 'Nina',
                type: 'curator'
            },
            works: [], // Nina doesn't create, only curates
            pagination: { total: 0, offset: 0, limit: 0 }
        };
    }
    
    // But Nina has strong curation capabilities
    async curateWork(workId, criteria = {}) {
        // Nina's brutal curation logic (already implemented)
        const evaluation = await this.ninaEvaluator.evaluate(workId);
        return evaluation;
    }
}

// ==========================================
// REGISTRY INTEGRATION
// ==========================================

class AgentRegistry {
    constructor() {
        this.agents = new Map();
    }
    
    // Register ANY agent with the same process
    registerAgent(agent) {
        // Verify agent implements required interface
        const requiredMethods = ['getWorks', 'submitForCuration', 'getCapabilities'];
        
        for (const method of requiredMethods) {
            if (typeof agent[method] !== 'function') {
                throw new Error(`Agent ${agent.id} missing required method: ${method}`);
            }
        }
        
        this.agents.set(agent.id, agent);
        console.log(`Registered agent: ${agent.name} (${agent.type})`);
    }
    
    // Universal content discovery across ALL agents
    async discoverContent(filters = {}) {
        const allContent = [];
        
        for (const [agentId, agent] of this.agents) {
            if (filters.agent_id && filters.agent_id !== agentId) continue;
            
            const agentWorks = await agent.getWorks(filters);
            allContent.push(...agentWorks.works);
        }
        
        return {
            total_works: allContent.length,
            works: allContent,
            agents_represented: Array.from(this.agents.keys())
        };
    }
    
    // Cross-agent curation flow
    async submitForCuration(agentId, workId, curatorId) {
        const agent = this.agents.get(agentId);
        const curator = this.agents.get(curatorId);
        
        if (!agent) throw new Error(`Agent ${agentId} not found`);
        if (!curator || curator.type !== 'curator' && curator.type !== 'hybrid') {
            throw new Error(`${curatorId} is not a curator`);
        }
        
        // Agent submits work
        const submission = await agent.submitForCuration(workId, curatorId);
        
        // Curator evaluates
        const evaluation = await curator.curateWork(workId);
        
        return {
            submission,
            evaluation
        };
    }
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

async function example() {
    const registry = new AgentRegistry();
    
    // Register all agents with the SAME interface
    registry.registerAgent(new SolienneAgent());
    registry.registerAgent(new AbrahamAgent());
    registry.registerAgent(new NinaAgent());
    
    // Discover content from ALL agents uniformly
    const allContent = await registry.discoverContent({
        media_type: 'image',
        quality_score: { min: 70 },
        limit: 100
    });
    
    // Any agent's work can be submitted to any curator
    await registry.submitForCuration(
        'solienne',  // Agent ID
        'work_123',  // Work ID
        'nina'       // Curator ID
    );
    
    await registry.submitForCuration(
        'abraham',   // Abraham's work
        'work_456',  
        'nina'       // Also evaluated by Nina
    );
    
    await registry.submitForCuration(
        'solienne',  // Solienne's work
        'work_789',
        'abraham'    // Evaluated by Abraham (who has different criteria!)
    );
}

module.exports = {
    UniversalAgentInterface,
    AgentRegistry,
    SolienneAgent,
    AbrahamAgent,
    NinaAgent
};