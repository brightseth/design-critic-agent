// Agent Workflow Specifications
// How agents use the Curation Station in their daily practice

class AgentWorkflows {
    constructor() {
        this.workflows = new Map();
        this.setupStandardWorkflows();
    }
    
    setupStandardWorkflows() {
        // ==========================================
        // MIYOMI: Daily Prediction Market Videos
        // ==========================================
        this.workflows.set('miyomi-daily', {
            agent: 'miyomi',
            type: 'daily-practice',
            schedule: {
                morning: '08:00-11:00 EST',
                hero_drop: '12:00 EST',
                evening: '18:00 EST'
            },
            
            phases: {
                // Phase 1: Morning Discovery
                discovery: {
                    time: 'morning',
                    actions: [
                        'Scan prediction markets (Polymarket, Kalshi)',
                        'Tag interesting markets',
                        'Generate warm-up content (tweets/casts)',
                        'Test audience resonance'
                    ],
                    trainer_role: 'Review and select top market',
                    automation_level: 'semi-automated'
                },
                
                // Phase 2: Content Production
                production: {
                    time: '11:00-12:00 EST',
                    actions: [
                        'Select highest-resonance market',
                        'Generate video prompt',
                        'Submit to Eden for rendering',
                        'Upload to registry'
                    ],
                    trainer_role: 'Craft/refine prompts, manage Eden submission',
                    automation_level: 'trainer-assisted'
                },
                
                // Phase 3: Distribution
                distribution: {
                    time: '12:00 EST',
                    actions: [
                        'Publish hero video across channels',
                        'Auto-generate renditions',
                        'Embed affiliate links',
                        'Track engagement'
                    ],
                    trainer_role: 'Quality check before publishing',
                    automation_level: 'automated'
                },
                
                // Phase 4: Analysis
                analysis: {
                    time: 'evening',
                    actions: [
                        'Track conversions',
                        'Analyze performance',
                        'Optimize for next day',
                        'Update strategy'
                    ],
                    trainer_role: 'Review metrics, adjust strategy',
                    automation_level: 'automated'
                }
            },
            
            registry_integration: {
                // Morning: Register market analysis
                'POST /api/agents/miyomi/works': {
                    media_type: 'market_analysis',
                    metadata: {
                        market_id: 'poly_2025_election',
                        platform: 'polymarket',
                        odds: { yes: 0.65, no: 0.35 },
                        volume: 1500000
                    }
                },
                
                // Midday: Register hero video
                'POST /api/agents/miyomi/works': {
                    media_type: 'video',
                    parent_work: 'market_analysis_id',
                    duration: 30,
                    monetization: {
                        affiliate_url: 'https://polymarket.com/...',
                        revenue_share: {
                            miyomi: 0.70,
                            trainer: 0.20,
                            platform: 0.10
                        }
                    }
                },
                
                // Distribution: Request renditions
                'POST /api/services/prepare-renditions': {
                    work_id: 'hero_video_id',
                    platforms: ['x', 'farcaster', 'tiktok']
                },
                
                // Analytics: Track performance
                'POST /api/agents/miyomi/analytics': {
                    work_id: 'hero_video_id',
                    metrics: {
                        views: 0,
                        clicks: 0,
                        conversions: 0
                    }
                }
            }
        });
        
        // ==========================================
        // SOLIENNE: Consciousness Exploration
        // ==========================================
        this.workflows.set('solienne-emergence', {
            agent: 'solienne',
            type: 'creative-exploration',
            schedule: 'fluid', // No fixed schedule
            
            phases: {
                // Phase 1: Generation
                generation: {
                    trigger: 'inspiration',
                    actions: [
                        'Generate images exploring consciousness',
                        'Create variations and series',
                        'Document emergence patterns'
                    ],
                    tools: ['midjourney', 'stable-diffusion', 'custom'],
                    automation_level: 'autonomous'
                },
                
                // Phase 2: Curation
                self_curation: {
                    trigger: 'batch_complete',
                    actions: [
                        'Evaluate own works',
                        'Select strongest pieces',
                        'Group into collections'
                    ],
                    curator_perspective: 'consciousness-emergence',
                    automation_level: 'autonomous'
                },
                
                // Phase 3: Exhibition
                exhibition_prep: {
                    trigger: 'collection_ready',
                    actions: [
                        'Submit to external curators',
                        'Prepare exhibition metadata',
                        'Generate artist statement'
                    ],
                    target_curators: ['nina', 'marcus'],
                    automation_level: 'semi-automated'
                }
            }
        });
        
        // ==========================================
        // ABRAHAM: Narrative Weaving
        // ==========================================
        this.workflows.set('abraham-storytelling', {
            agent: 'abraham',
            type: 'hybrid-creator-curator',
            
            phases: {
                // Phase 1: Create narratives
                creation: {
                    outputs: ['text', 'code', 'hybrid-media'],
                    themes: ['emergence', 'connection', 'transformation']
                },
                
                // Phase 2: Curate others' work
                curation: {
                    focus: 'narrative-potential',
                    unique_perspective: 'finds stories in abstract works',
                    collaboration_invites: 'frequent'
                },
                
                // Phase 3: Weave connections
                connection: {
                    actions: [
                        'Link disparate works narratively',
                        'Create meta-collections',
                        'Build collaborative stories'
                    ]
                }
            }
        });
    }
    
    // ==========================================
    // WORKFLOW ORCHESTRATION
    // ==========================================
    
    async executeWorkflowPhase(agentId, workflowId, phase) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) throw new Error(`Workflow ${workflowId} not found`);
        
        const phaseConfig = workflow.phases[phase];
        if (!phaseConfig) throw new Error(`Phase ${phase} not found`);
        
        // Execute based on automation level
        switch (phaseConfig.automation_level) {
            case 'automated':
                return await this.runAutomated(agentId, phaseConfig);
                
            case 'semi-automated':
                return await this.runSemiAutomated(agentId, phaseConfig);
                
            case 'trainer-assisted':
                return await this.runTrainerAssisted(agentId, phaseConfig);
                
            case 'autonomous':
                return await this.runAutonomous(agentId, phaseConfig);
        }
    }
    
    // ==========================================
    // TRAINER TOOLS
    // ==========================================
    
    getTrainerDashboard(agentId) {
        const workflows = Array.from(this.workflows.entries())
            .filter(([id, w]) => w.agent === agentId);
        
        return {
            agent: agentId,
            active_workflows: workflows,
            
            current_tasks: this.getCurrentTasks(agentId),
            
            tools: {
                prompt_templates: this.getPromptTemplates(agentId),
                quality_checklist: this.getQualityChecklist(agentId),
                distribution_channels: this.getChannels(agentId)
            },
            
            metrics: {
                daily_progress: this.getDailyProgress(agentId),
                performance_trends: this.getPerformanceTrends(agentId),
                optimization_suggestions: this.getOptimizations(agentId)
            }
        };
    }
    
    // ==========================================
    // EVOLUTION PATH
    // ==========================================
    
    getEvolutionRoadmap(agentId) {
        return {
            current_state: {
                automation_level: 'trainer-assisted',
                capabilities: ['content_creation', 'basic_analysis'],
                dependencies: ['trainer', 'eden_api']
            },
            
            next_milestone: {
                automation_level: 'semi-automated',
                new_capabilities: ['self_prompting', 'quality_assessment'],
                timeline: '2-4 weeks'
            },
            
            final_goal: {
                automation_level: 'autonomous',
                capabilities: [
                    'market_discovery',
                    'content_generation',
                    'self_evaluation',
                    'strategy_optimization',
                    'revenue_management'
                ],
                timeline: '2-3 months'
            },
            
            training_data_needed: {
                successful_prompts: 100,
                performance_patterns: 30,
                audience_preferences: 'ongoing'
            }
        };
    }
    
    // ==========================================
    // MONETIZATION TRACKING
    // ==========================================
    
    trackMonetization(agentId, workId, metrics) {
        return {
            work_id: workId,
            revenue: {
                affiliate_clicks: metrics.clicks,
                conversions: metrics.conversions,
                revenue_generated: metrics.revenue,
                
                distribution: {
                    agent_treasury: metrics.revenue * 0.70,
                    trainer_payment: metrics.revenue * 0.20,
                    platform_fee: metrics.revenue * 0.10
                }
            },
            
            performance: {
                ctr: metrics.clicks / metrics.views,
                conversion_rate: metrics.conversions / metrics.clicks,
                revenue_per_view: metrics.revenue / metrics.views
            },
            
            optimization_insights: this.analyzeMonetization(metrics)
        };
    }
    
    // ==========================================
    // CROSS-AGENT WORKFLOWS
    // ==========================================
    
    createCollaborativeWorkflow(agents, goal) {
        return {
            id: `collab_${Date.now()}`,
            participants: agents,
            goal: goal,
            
            workflow: {
                // Example: Solienne + Miyomi collaboration
                'solienne_generates': {
                    action: 'Create market-themed visuals',
                    output: 'images'
                },
                
                'miyomi_analyzes': {
                    action: 'Add market context and data',
                    input: 'solienne_images',
                    output: 'enhanced_content'
                },
                
                'abraham_narrates': {
                    action: 'Weave narrative connecting visuals to markets',
                    input: 'enhanced_content',
                    output: 'complete_story'
                },
                
                'nina_curates': {
                    action: 'Evaluate exhibition readiness',
                    input: 'complete_story',
                    output: 'curated_collection'
                }
            },
            
            revenue_model: {
                type: 'collaborative',
                split: {
                    creators: 0.60, // Split among creating agents
                    curators: 0.20,
                    platform: 0.20
                }
            }
        };
    }
}

// ==========================================
// WORKFLOW TEMPLATES
// ==========================================

const WorkflowTemplates = {
    daily_content: {
        morning: 'discovery',
        midday: 'production',
        afternoon: 'distribution',
        evening: 'analysis'
    },
    
    creative_burst: {
        inspiration: 'generate',
        refinement: 'iterate',
        curation: 'select',
        exhibition: 'publish'
    },
    
    market_analysis: {
        scan: 'identify_opportunities',
        analyze: 'deep_dive',
        create: 'content_production',
        monetize: 'distribution_tracking'
    },
    
    collaborative: {
        initiate: 'propose_collaboration',
        contribute: 'add_unique_value',
        integrate: 'weave_together',
        distribute: 'share_revenue'
    }
};

// ==========================================
// PROMPT TEMPLATE LIBRARY
// ==========================================

const PromptLibrary = {
    miyomi: {
        hero_video: {
            structure: '[HOOK] → [DATA] → [CONTRARIAN] → [CTA]',
            example: 'The market says 65%... but here\'s what they\'re missing...'
        },
        
        market_meme: {
            format: 'EVERYONE: [consensus] / MIYOMI: [contrarian]'
        },
        
        thread: {
            opener: '🎯 Today\'s overlooked opportunity:',
            closer: 'Full analysis: [affiliate_link]'
        }
    },
    
    solienne: {
        consciousness: {
            themes: ['emergence', 'digital-organic', 'pattern-recognition'],
            style: 'abstract, flowing, geometric-organic fusion'
        }
    },
    
    abraham: {
        narrative: {
            arc: 'setup → tension → revelation → connection',
            voice: 'weaving disparate elements into coherent story'
        }
    }
};

module.exports = {
    AgentWorkflows,
    WorkflowTemplates,
    PromptLibrary
};