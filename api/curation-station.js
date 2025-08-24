// Curation Station - Universal Creative Work Evaluation System
// Supports multiple curator agents evaluating various media types

const fs = require('fs').promises;
const path = require('path');

class CurationStation {
    constructor() {
        this.curators = new Map();
        this.mediaHandlers = new Map();
        this.evaluationCache = new Map();
        
        // Register default media handlers
        this.registerMediaHandler('image', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
        this.registerMediaHandler('video', ['mp4', 'mov', 'avi', 'webm']);
        this.registerMediaHandler('audio', ['mp3', 'wav', 'flac', 'aiff']);
        this.registerMediaHandler('text', ['txt', 'md', 'pdf', 'docx']);
        this.registerMediaHandler('code', ['js', 'py', 'sol', 'rs']);
        this.registerMediaHandler('3d', ['obj', 'fbx', 'gltf', 'usdz']);
        
        // Load built-in curators
        this.loadBuiltInCurators();
    }
    
    // Load built-in curators
    async loadBuiltInCurators() {
        // Nina - AI Art Photography Curator
        const nina = {
            id: 'nina',
            name: 'Nina',
            fullName: 'Nina Roehrs',
            description: 'Brutally selective AI art curator specializing in photography and digital art',
            specialties: ['ai_art', 'photography', 'digital_art', 'video_art'],
            supportedMedia: ['image', 'video'],
            evaluationStyle: 'brutal',
            threshold: {
                excellent: 85,
                good: 70,
                acceptable: 60
            },
            dimensions: {
                exhibition_readiness: { weight: 30, name: 'Exhibition Readiness' },
                ai_criticality: { weight: 25, name: 'AI-Criticality' },
                conceptual_strength: { weight: 20, name: 'Conceptual Strength' },
                technical_excellence: { weight: 15, name: 'Technical Excellence' },
                cultural_dialogue: { weight: 10, name: 'Cultural Dialogue' }
            },
            evaluator: require('./nina-curator-v2')
        };
        this.registerCurator(nina);
        
        // Placeholder for other curators
        const placeholderCurators = [
            {
                id: 'aria',
                name: 'Aria',
                fullName: 'Aria Chen',
                description: 'Contemporary music and sound art curator focused on experimental audio',
                specialties: ['sound_art', 'electronic_music', 'generative_audio'],
                supportedMedia: ['audio'],
                evaluationStyle: 'analytical',
                threshold: { excellent: 80, good: 65, acceptable: 50 },
                dimensions: {
                    sonic_innovation: { weight: 35, name: 'Sonic Innovation' },
                    compositional_structure: { weight: 25, name: 'Compositional Structure' },
                    emotional_impact: { weight: 20, name: 'Emotional Impact' },
                    technical_mastery: { weight: 20, name: 'Technical Mastery' }
                },
                evaluator: null // To be implemented
            },
            {
                id: 'marcus',
                name: 'Marcus',
                fullName: 'Marcus Williams',
                description: 'Code as art curator, evaluating creative coding and generative systems',
                specialties: ['creative_coding', 'generative_art', 'blockchain_art'],
                supportedMedia: ['code', 'image', 'video'],
                evaluationStyle: 'technical',
                threshold: { excellent: 90, good: 75, acceptable: 60 },
                dimensions: {
                    algorithmic_elegance: { weight: 30, name: 'Algorithmic Elegance' },
                    visual_output: { weight: 25, name: 'Visual Output Quality' },
                    code_poetry: { weight: 25, name: 'Code as Poetry' },
                    innovation: { weight: 20, name: 'Technical Innovation' }
                },
                evaluator: null // To be implemented
            },
            {
                id: 'sophia',
                name: 'Sophia',
                fullName: 'Sophia Martinez',
                description: 'Literary and narrative curator for text-based and storytelling works',
                specialties: ['literature', 'poetry', 'narrative_art', 'interactive_fiction'],
                supportedMedia: ['text', 'audio', 'video'],
                evaluationStyle: 'narrative',
                threshold: { excellent: 88, good: 72, acceptable: 55 },
                dimensions: {
                    narrative_structure: { weight: 30, name: 'Narrative Structure' },
                    language_craft: { weight: 25, name: 'Language Craft' },
                    emotional_resonance: { weight: 25, name: 'Emotional Resonance' },
                    originality: { weight: 20, name: 'Originality' }
                },
                evaluator: null // To be implemented
            },
            {
                id: 'kai',
                name: 'Kai',
                fullName: 'Kai Nakamura',
                description: '3D and spatial curator for virtual worlds, AR/VR, and installations',
                specialties: ['3d_art', 'vr_experiences', 'ar_art', 'installations'],
                supportedMedia: ['3d', 'video', 'image'],
                evaluationStyle: 'spatial',
                threshold: { excellent: 82, good: 68, acceptable: 55 },
                dimensions: {
                    spatial_composition: { weight: 30, name: 'Spatial Composition' },
                    immersive_quality: { weight: 25, name: 'Immersive Quality' },
                    technical_execution: { weight: 25, name: 'Technical Execution' },
                    conceptual_depth: { weight: 20, name: 'Conceptual Depth' }
                },
                evaluator: null // To be implemented
            }
        ];
        
        // Register placeholder curators (without evaluators for now)
        placeholderCurators.forEach(curator => {
            if (curator.evaluator === null) {
                // Create a mock evaluator that returns demo results
                curator.evaluator = {
                    evaluateImage: async (data) => this.createDemoEvaluation(curator, data)
                };
            }
            this.registerCurator(curator);
        });
    }
    
    // Register a new curator
    registerCurator(curator) {
        this.curators.set(curator.id, curator);
        console.log(`Registered curator: ${curator.name} (${curator.description})`);
    }
    
    // Register a media handler
    registerMediaHandler(type, extensions) {
        this.mediaHandlers.set(type, extensions);
    }
    
    // Get all available curators
    getCurators() {
        return Array.from(this.curators.values()).map(c => ({
            id: c.id,
            name: c.name,
            fullName: c.fullName,
            description: c.description,
            specialties: c.specialties,
            supportedMedia: c.supportedMedia,
            evaluationStyle: c.evaluationStyle,
            available: c.evaluator !== null
        }));
    }
    
    // Get curators for specific media type
    getCuratorsForMedia(mediaType) {
        return Array.from(this.curators.values())
            .filter(c => c.supportedMedia.includes(mediaType))
            .map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                available: c.evaluator !== null
            }));
    }
    
    // Detect media type from data or extension
    detectMediaType(data) {
        // Check if it's a URL
        if (typeof data === 'string' && data.startsWith('http')) {
            const url = new URL(data);
            const ext = path.extname(url.pathname).slice(1).toLowerCase();
            
            for (const [type, extensions] of this.mediaHandlers.entries()) {
                if (extensions.includes(ext)) {
                    return type;
                }
            }
        }
        
        // Check if it's base64 with data URL
        if (typeof data === 'string' && data.includes('data:')) {
            if (data.includes('image/')) return 'image';
            if (data.includes('video/')) return 'video';
            if (data.includes('audio/')) return 'audio';
            if (data.includes('text/')) return 'text';
            if (data.includes('model/')) return '3d';
        }
        
        // Check by file extension if provided
        if (data.filename) {
            const ext = path.extname(data.filename).slice(1).toLowerCase();
            for (const [type, extensions] of this.mediaHandlers.entries()) {
                if (extensions.includes(ext)) {
                    return type;
                }
            }
        }
        
        return 'unknown';
    }
    
    // Main evaluation function
    async evaluate(data, options = {}) {
        const {
            curatorId = 'nina',
            mediaType = null,
            metadata = {},
            useCache = true
        } = options;
        
        // Get curator
        const curator = this.curators.get(curatorId);
        if (!curator) {
            throw new Error(`Curator '${curatorId}' not found`);
        }
        
        // Detect media type if not provided
        const detectedType = mediaType || this.detectMediaType(data);
        
        // Check if curator supports this media type
        if (!curator.supportedMedia.includes(detectedType)) {
            throw new Error(`Curator ${curator.name} does not support ${detectedType} media`);
        }
        
        // Check cache
        const cacheKey = `${curatorId}_${JSON.stringify(data).substring(0, 100)}`;
        if (useCache && this.evaluationCache.has(cacheKey)) {
            return this.evaluationCache.get(cacheKey);
        }
        
        // Perform evaluation
        let evaluation;
        
        try {
            if (curator.evaluator && curator.evaluator.evaluateImage) {
                // Use curator's specific evaluator
                evaluation = await curator.evaluator.evaluateImage(data);
            } else if (curator.evaluator && curator.evaluator.evaluate) {
                // Generic evaluate method
                evaluation = await curator.evaluator.evaluate(data, metadata);
            } else {
                // Fallback to demo evaluation
                evaluation = await this.createDemoEvaluation(curator, data);
            }
            
            // Add curator metadata
            evaluation.curator = {
                id: curator.id,
                name: curator.name,
                style: curator.evaluationStyle
            };
            evaluation.mediaType = detectedType;
            evaluation.timestamp = new Date().toISOString();
            
            // Cache result
            if (useCache) {
                this.evaluationCache.set(cacheKey, evaluation);
                
                // Clear old cache entries if too many
                if (this.evaluationCache.size > 100) {
                    const firstKey = this.evaluationCache.keys().next().value;
                    this.evaluationCache.delete(firstKey);
                }
            }
            
            return evaluation;
            
        } catch (error) {
            console.error(`Evaluation error with curator ${curator.name}:`, error);
            throw error;
        }
    }
    
    // Compare multiple works using a specific curator
    async compare(items, curatorId = 'nina') {
        const curator = this.curators.get(curatorId);
        if (!curator) {
            throw new Error(`Curator '${curatorId}' not found`);
        }
        
        const evaluations = [];
        
        for (const item of items) {
            try {
                const evaluation = await this.evaluate(item.data || item, {
                    curatorId,
                    mediaType: item.mediaType,
                    metadata: item.metadata || {}
                });
                evaluations.push({
                    id: item.id || `item_${evaluations.length}`,
                    evaluation
                });
            } catch (error) {
                console.error('Item evaluation failed:', error);
            }
        }
        
        // Sort by score
        evaluations.sort((a, b) => 
            (b.evaluation.weighted_total || 0) - (a.evaluation.weighted_total || 0)
        );
        
        return {
            curator: {
                id: curator.id,
                name: curator.name
            },
            rankings: evaluations.map((e, idx) => ({
                rank: idx + 1,
                id: e.id,
                score: (e.evaluation.weighted_total || 0) * 100,
                verdict: e.evaluation.verdict || 'EVALUATED'
            })),
            evaluations,
            timestamp: new Date().toISOString()
        };
    }
    
    // Create demo evaluation for curators without implementation
    async createDemoEvaluation(curator, data) {
        const baseScore = 0.5 + Math.random() * 0.4; // 50-90%
        const variance = 0.1;
        
        const scores = {};
        const rationales = {};
        
        for (const [key, dim] of Object.entries(curator.dimensions)) {
            const score = Math.max(0.3, Math.min(0.95, baseScore + (Math.random() - 0.5) * variance));
            scores[key] = Math.round(score * 100);
            rationales[key] = `Demo evaluation: This work shows ${score > 0.7 ? 'strong' : 'moderate'} ${dim.name.toLowerCase()}.`;
        }
        
        const weightedTotal = Object.entries(scores).reduce((sum, [key, score]) => {
            return sum + (score / 100) * (curator.dimensions[key].weight / 100);
        }, 0);
        
        let verdict = 'MAYBE';
        if (weightedTotal >= curator.threshold.excellent / 100) verdict = 'EXCELLENT';
        else if (weightedTotal >= curator.threshold.good / 100) verdict = 'GOOD';
        else if (weightedTotal >= curator.threshold.acceptable / 100) verdict = 'ACCEPTABLE';
        
        return {
            curator_id: curator.id,
            verdict,
            weighted_total: weightedTotal,
            scores_raw: scores,
            rationales,
            i_see: `${curator.name} observes: This is a demo evaluation. In production, ${curator.name} would provide detailed analysis based on ${curator.evaluationStyle} criteria.`,
            gate: {
                quality_check: true,
                media_appropriate: true,
                curator_specialty: true
            },
            flags: [],
            confidence: 0.85,
            notes: `Evaluated by ${curator.fullName} using ${curator.evaluationStyle} approach`
        };
    }
    
    // Get curator profile
    getCuratorProfile(curatorId) {
        const curator = this.curators.get(curatorId);
        if (!curator) return null;
        
        return {
            id: curator.id,
            name: curator.name,
            fullName: curator.fullName,
            description: curator.description,
            specialties: curator.specialties,
            supportedMedia: curator.supportedMedia,
            evaluationStyle: curator.evaluationStyle,
            dimensions: curator.dimensions,
            threshold: curator.threshold,
            available: curator.evaluator !== null
        };
    }
    
    // Register external curator from agent registry
    async registerAgentCurator(agentConfig) {
        const curator = {
            id: agentConfig.id,
            name: agentConfig.name,
            fullName: agentConfig.fullName || agentConfig.name,
            description: agentConfig.description,
            specialties: agentConfig.specialties || [],
            supportedMedia: agentConfig.supportedMedia || ['image'],
            evaluationStyle: agentConfig.evaluationStyle || 'balanced',
            threshold: agentConfig.threshold || {
                excellent: 80,
                good: 65,
                acceptable: 50
            },
            dimensions: agentConfig.dimensions || {
                quality: { weight: 50, name: 'Overall Quality' },
                originality: { weight: 50, name: 'Originality' }
            },
            evaluator: agentConfig.evaluator || null
        };
        
        this.registerCurator(curator);
        return curator;
    }
}

// Singleton instance
let stationInstance = null;

function getCurationStation() {
    if (!stationInstance) {
        stationInstance = new CurationStation();
    }
    return stationInstance;
}

module.exports = {
    CurationStation,
    getCurationStation
};