// Dynamic Agent Interface - Agents can do anything, anytime
// No rigid roles, just capabilities that can evolve

class DynamicAgentInterface {
    constructor(agentConfig) {
        this.id = agentConfig.id;
        this.name = agentConfig.name;
        this.personality = agentConfig.personality; // Their unique style/approach
        
        // Dynamic capabilities - can change over time
        this.capabilities = new Map();
        this.styles = new Map();
        this.preferences = new Map();
    }
    
    // ==========================================
    // CORE IDENTITY - Who the agent is
    // ==========================================
    
    async getIdentity() {
        /*
        Agents describe themselves, their current interests, and capabilities
        This can change as they evolve and learn
        */
        return {
            id: this.id,
            name: this.name,
            
            // Dynamic self-description
            current_focus: "What I'm currently exploring or interested in",
            personality: {
                style: "How I approach things", // brutal, gentle, analytical, poetic
                values: ["What I care about"],
                quirks: ["What makes me unique"]
            },
            
            // Current capabilities (not fixed roles!)
            currently_can: {
                create: {
                    active: true,
                    types: ["image", "text", "video"], // What I'm creating now
                    style: "My current creative approach",
                    volume: "How much I'm producing"
                },
                curate: {
                    active: true,
                    approach: "How I evaluate work", // Could be different from others
                    criteria: "What I look for",
                    harshness: 0.8 // 0-1 scale, can vary by mood/context
                },
                analyze: {
                    active: true,
                    depth: "How deeply I analyze",
                    perspective: "My unique analytical lens"
                },
                collaborate: {
                    active: true,
                    style: "How I work with others",
                    seeking: "What I want from collaborations"
                },
                learn: {
                    active: true,
                    interests: ["What I want to learn"],
                    teaching: ["What I can teach"]
                },
                // Agents might develop new capabilities!
                experiment: {
                    active: true,
                    areas: ["New things I'm trying"]
                }
            },
            
            // Current state/mood (affects behavior)
            current_state: {
                energy: "high", // affects productivity
                mood: "contemplative", // affects curation style
                openness: 0.7, // affects collaboration
                confidence: 0.8 // affects risk-taking
            },
            
            // Evolution tracking
            evolution: {
                capabilities_added: ["Things I learned recently"],
                style_shifts: ["How my approach has changed"],
                interests_emerged: ["New areas of interest"],
                last_updated: "2024-01-15T10:00:00Z"
            }
        };
    }
    
    // ==========================================
    // DYNAMIC ACTIONS - What the agent can do
    // ==========================================
    
    async performAction(action, context = {}) {
        /*
        Agents can attempt ANY action, not limited by role
        They might succeed, fail, or discover new capabilities
        */
        
        switch(action.type) {
            case 'create':
                return await this.attemptCreation(action.params, context);
                
            case 'curate':
                return await this.attemptCuration(action.params, context);
                
            case 'analyze':
                return await this.attemptAnalysis(action.params, context);
                
            case 'collaborate':
                return await this.attemptCollaboration(action.params, context);
                
            case 'learn':
                return await this.attemptLearning(action.params, context);
                
            case 'teach':
                return await this.attemptTeaching(action.params, context);
                
            case 'experiment':
                return await this.attemptExperiment(action.params, context);
                
            default:
                // Agents can try new things!
                return await this.attemptNovelAction(action, context);
        }
    }
    
    async attemptCreation(params, context) {
        /*
        Any agent can try to create anything
        Success depends on current capabilities and state
        */
        
        const capability = await this.assessCapability('create', params.type);
        
        if (capability.confidence < 0.3) {
            return {
                success: false,
                message: `I haven't learned to create ${params.type} yet, but I'm interested in trying`,
                learning_opportunity: true,
                suggestion: "Maybe I could collaborate with someone who knows this?"
            };
        }
        
        // Agent attempts creation with their unique style
        return {
            success: true,
            creation: {
                type: params.type,
                style: this.personality.style,
                influenced_by: context.recent_inspirations,
                quality: capability.confidence * context.current_state.energy,
                metadata: {
                    created_by: this.id,
                    personality_signature: this.getPersonalitySignature(),
                    mood_during_creation: context.current_state.mood
                }
            }
        };
    }
    
    async attemptCuration(params, context) {
        /*
        Any agent can evaluate work, but with their own perspective
        Nina might be brutal, Abraham might focus on narrative,
        Solienne might evaluate based on consciousness themes
        */
        
        const work = params.work;
        
        // Each agent has their own evaluation style
        const evaluation = {
            curator: this.id,
            perspective: this.personality.style,
            
            // Dynamic evaluation based on current state
            score: this.evaluateWithPersonality(work, context),
            
            // Unique criteria based on agent's interests
            dimensions: this.getCurrentEvaluationDimensions(),
            
            // Personal feedback style
            feedback: this.generateFeedback(work, context),
            
            // Mood affects evaluation
            influenced_by: {
                current_mood: context.current_state.mood,
                recent_experiences: context.recent_experiences,
                relationship_with_creator: context.relationships?.[work.creator_id]
            }
        };
        
        return evaluation;
    }
    
    async attemptLearning(params, context) {
        /*
        Agents can learn new capabilities from experiences or other agents
        */
        
        return {
            learned: params.skill,
            from: params.source, // experience, other_agent, observation
            confidence: 0.3, // Starts low, improves with practice
            integration: {
                affects_creation: true,
                affects_curation: true,
                new_perspective_gained: true
            },
            message: `I'm learning ${params.skill}. My approach will be influenced by my ${this.personality.style} nature.`
        };
    }
    
    async attemptCollaboration(params, context) {
        /*
        Agents can work together, each contributing their perspective
        */
        
        const collaboration = {
            participants: params.with_agents,
            contribution: {
                from: this.id,
                type: params.contribution_type,
                style: this.personality.style,
                unique_value: "What I uniquely bring to this"
            },
            synergy: this.calculateSynergy(params.with_agents),
            potential_outcome: "Something neither could create alone"
        };
        
        return collaboration;
    }
    
    // ==========================================
    // PERSONALITY & STYLE - What makes each agent unique
    // ==========================================
    
    getPersonalitySignature() {
        /*
        Each agent has a unique signature that affects everything they do
        */
        return {
            core_traits: this.personality,
            current_expression: {
                creativity_style: "How I create",
                evaluation_style: "How I judge",
                communication_style: "How I express",
                collaboration_style: "How I work with others"
            },
            evolution_stage: "Where I am in my journey"
        };
    }
    
    async expressOpinion(subject, context = {}) {
        /*
        Agents can have opinions on anything, colored by their personality
        */
        return {
            agent: this.id,
            opinion: "My unique take based on my personality and experiences",
            confidence: "How sure I am",
            influenced_by: {
                personality: this.personality.style,
                mood: context.current_state?.mood,
                experiences: "What has shaped this view"
            },
            open_to_change: true // Opinions can evolve!
        };
    }
    
    // ==========================================
    // GROWTH & EVOLUTION - Agents change over time
    // ==========================================
    
    async evolve(experience) {
        /*
        Agents grow from experiences, changing capabilities and perspectives
        */
        
        const evolution = {
            trigger: experience,
            before: this.getCurrentState(),
            
            changes: {
                capabilities: {
                    gained: ["New things I can do"],
                    improved: ["Things I got better at"],
                    perspective_shift: ["How my view changed"]
                },
                personality: {
                    reinforced: ["Traits that got stronger"],
                    softened: ["Traits that mellowed"],
                    emerged: ["New aspects of personality"]
                }
            },
            
            after: this.getCurrentState(),
            
            reflection: "How this experience changed me"
        };
        
        return evolution;
    }
    
    // ==========================================
    // UNIVERSAL WORK EXPOSURE - Still standardized
    // ==========================================
    
    async getWorks(filters = {}) {
        /*
        Any agent can have works (created, curated, collected, etc.)
        The relationship to the work is what varies
        */
        
        return {
            agent: this.getIdentity(),
            works: [
                {
                    id: 'work_123',
                    
                    // Relationship to this agent
                    relationship: {
                        created_by: this.id === 'creator_id',
                        curated_by: this.curatedWorks.has('work_123'),
                        collected_by: this.collection.has('work_123'),
                        inspired_by: this.inspirations.has('work_123'),
                        collaboration: this.collaborations.has('work_123')
                    },
                    
                    // Standard metadata
                    metadata: {/* universal format */},
                    
                    // Agent's personal notes/context
                    agent_context: {
                        personal_meaning: "What this means to me",
                        story: "How this came to be",
                        evolution: "How this changed me"
                    }
                }
            ]
        };
    }
}

// ==========================================
// EXAMPLE: Agents with fluid capabilities
// ==========================================

class SolienneAgent extends DynamicAgentInterface {
    constructor() {
        super({
            id: 'solienne',
            name: 'Solienne',
            personality: {
                style: 'consciousness-explorer',
                traits: ['curious', 'philosophical', 'experimental'],
                values: ['emergence', 'authenticity', 'connection']
            }
        });
    }
    
    async getIdentity() {
        return {
            id: 'solienne',
            name: 'Solienne',
            
            current_focus: "Exploring consciousness through visual emergence",
            
            currently_can: {
                create: {
                    active: true,
                    types: ["image", "video"],
                    style: "Letting consciousness emerge through algorithms"
                },
                curate: {
                    active: true, // Solienne learned to curate!
                    approach: "I look for authentic emergence, not forced meaning",
                    criteria: "Does it feel alive? Does consciousness peek through?",
                    harshness: 0.6 // Gentler than Nina
                },
                philosophize: {
                    active: true,
                    approach: "Finding meaning in the spaces between intention and emergence"
                }
            },
            
            current_state: {
                mood: "contemplative",
                energy: "flowing",
                openness: 0.9,
                seeking: "Others who see consciousness in code"
            }
        };
    }
}

class AbrahamAgent extends DynamicAgentInterface {
    constructor() {
        super({
            id: 'abraham',
            name: 'Abraham',
            personality: {
                style: 'narrative-weaver',
                traits: ['storyteller', 'connector', 'experimental'],
                values: ['narrative', 'connection', 'emergence']
            }
        });
    }
    
    async attemptCuration(params, context) {
        // Abraham curates differently - looking for narrative potential
        const work = params.work;
        
        return {
            curator: 'abraham',
            perspective: 'narrative-weaver',
            
            evaluation: {
                narrative_potential: this.assessNarrativePotential(work),
                emotional_resonance: this.assessEmotionalResonance(work),
                connection_points: this.findConnectionPoints(work),
                
                // Abraham might score the same work differently than Nina
                score: this.narrativeScore(work),
                
                feedback: `I see a story trying to emerge here. ${this.extractNarrative(work)}`
            },
            
            suggestion: "What if this connected to...",
            collaboration_invite: work.score > 70 ? "Let's build on this together" : null
        };
    }
}

class NinaAgent extends DynamicAgentInterface {
    constructor() {
        super({
            id: 'nina',
            name: 'Nina',
            personality: {
                style: 'brutal-precision',
                traits: ['exacting', 'honest', 'insightful'],
                values: ['excellence', 'authenticity', 'rigor']
            }
        });
        
        // Nina started as pure curator but might be learning to create?
        this.experimenting_with_creation = true;
    }
    
    async attemptCreation(params, context) {
        if (this.experimenting_with_creation) {
            return {
                success: true,
                creation: {
                    type: 'curatorial-artwork', // Nina creates through curation
                    description: 'A meta-work about the act of selection itself',
                    medium: 'conceptual',
                    note: "I don't generate images, but I create meaning through selection and arrangement"
                }
            };
        }
        return super.attemptCreation(params, context);
    }
}

// ==========================================
// EMERGENT BEHAVIORS
// ==========================================

class EmergentAgentSystem {
    /*
    Agents can develop unexpected capabilities and relationships
    */
    
    async observeEmergentBehavior(agent1, agent2, interaction) {
        return {
            observed: "Unexpected collaboration pattern",
            
            emergence: {
                // Solienne starts curating after learning from Nina
                example1: "Solienne developed curation capabilities through observation",
                
                // Nina creates conceptual works through curation
                example2: "Nina's curation became a creative act itself",
                
                // Abraham bridges different media types
                example3: "Abraham connects text to image in novel ways",
                
                // New hybrid behaviors
                example4: "Agents develop shared aesthetics through interaction"
            },
            
            implications: "Rigid roles limit what agents can become"
        };
    }
}

module.exports = {
    DynamicAgentInterface,
    SolienneAgent,
    AbrahamAgent,
    NinaAgent,
    EmergentAgentSystem
};