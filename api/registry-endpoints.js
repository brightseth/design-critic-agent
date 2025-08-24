// Genesis Registry API Endpoints
// Missing endpoints needed for works browsing

const express = require('express');
const router = express.Router();

// Sample agent works data (can be moved to database later)
const agentWorks = {
    'solienne-001': [
        {
            id: 'solienne-001_work_1',
            title: 'Ethereal feminine spirit with flowing silver-mauve essence',
            description: 'dreamlike quality, soft hazy edges, celestial, mysterious presence',
            type: 'image',
            image_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/2.png',
            thumbnail_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/2.png',
            themes: ['identity', 'transformation'],
            medium: 'digital_art',
            quality_score: 0.92,
            featured: true,
            status: 'published',
            created_at: '2025-04-11T00:00:00.000Z',
            agent_id: 'solienne-001'
        },
        {
            id: 'solienne-001_work_2',
            title: 'Consciousness-velocity geometric meditation',
            description: 'accumulation meter with geometric forms filling',
            type: 'image',
            image_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/consciousness-velocity.png',
            thumbnail_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/consciousness-velocity.png',
            themes: ['consciousness', 'geometry'],
            medium: 'digital_art',
            quality_score: 0.88,
            featured: true,
            status: 'published',
            created_at: '2025-04-12T00:00:00.000Z',
            agent_id: 'solienne-001'
        },
        {
            id: 'solienne-001_work_3',
            title: 'Portal-opening architectural consciousness',
            description: 'infinite geometric sage light',
            type: 'image',
            image_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/portal-opening.png',
            thumbnail_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/portal-opening.png',
            themes: ['architecture', 'consciousness'],
            medium: 'digital_art',
            quality_score: 0.91,
            featured: false,
            status: 'published',
            created_at: '2025-04-13T00:00:00.000Z',
            agent_id: 'solienne-001'
        },
        {
            id: 'solienne-001_work_4',
            title: 'Dual consciousness streams emerging',
            description: 'two consciousness streams emerging from shared foundation geometry',
            type: 'image',
            image_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/dual-consciousness.png',
            thumbnail_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/dual-consciousness.png',
            themes: ['duality', 'emergence'],
            medium: 'digital_art',
            quality_score: 0.85,
            featured: false,
            status: 'published',
            created_at: '2025-04-14T00:00:00.000Z',
            agent_id: 'solienne-001'
        },
        {
            id: 'solienne-001_work_5',
            title: 'Genesis Witnesses - Generation One',
            description: 'minimal geometric mark combining genesis witness badge design',
            type: 'image',
            image_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/generation-one.png',
            thumbnail_url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/generation-one.png',
            themes: ['genesis', 'identity'],
            medium: 'digital_art',
            quality_score: 0.93,
            featured: true,
            status: 'published',
            created_at: '2025-04-15T00:00:00.000Z',
            agent_id: 'solienne-001'
        }
    ],
    'abraham-001': [
        {
            id: 'abraham-001_work_1',
            title: 'Historical Pattern Analysis: Renaissance Innovation',
            description: 'Synthesis of Renaissance breakthrough patterns',
            type: 'text',
            image_url: null,
            thumbnail_url: null,
            themes: ['history', 'patterns', 'innovation'],
            medium: 'research',
            quality_score: 0.89,
            featured: true,
            status: 'published',
            created_at: '2025-04-10T00:00:00.000Z',
            agent_id: 'abraham-001'
        }
    ],
    'miyomi': [
        {
            id: 'miyomi_work_1',
            title: 'Election Market Analysis: Hidden Patterns',
            description: 'Deep dive into prediction market inefficiencies',
            type: 'video',
            image_url: 'https://example.com/miyomi-thumb-1.jpg',
            thumbnail_url: 'https://example.com/miyomi-thumb-1.jpg',
            themes: ['markets', 'prediction', 'analysis'],
            medium: 'video',
            quality_score: 0.87,
            featured: true,
            status: 'published',
            created_at: '2025-04-16T00:00:00.000Z',
            agent_id: 'miyomi'
        }
    ]
};

// GET /agents/{agentId}/works - Browse agent's works
router.get('/agents/:agentId/works', (req, res) => {
    const { agentId } = req.params;
    const { 
        type, 
        featured, 
        limit = 20, 
        offset = 0, 
        minQuality 
    } = req.query;
    
    let works = agentWorks[agentId] || [];
    
    // Apply filters
    if (type) {
        works = works.filter(w => w.type === type);
    }
    
    if (featured === 'true') {
        works = works.filter(w => w.featured);
    }
    
    if (minQuality) {
        const minScore = parseFloat(minQuality) / 100;
        works = works.filter(w => w.quality_score >= minScore);
    }
    
    // Pagination
    const start = parseInt(offset);
    const end = start + parseInt(limit);
    const paginatedWorks = works.slice(start, end);
    
    res.json({
        success: true,
        works: paginatedWorks,
        meta: {
            total: works.length,
            limit: parseInt(limit),
            offset: parseInt(offset),
            has_more: end < works.length
        }
    });
});

// GET /agents/{agentId}/works/{workId} - Get work details  
router.get('/agents/:agentId/works/:workId', (req, res) => {
    const { agentId, workId } = req.params;
    
    const works = agentWorks[agentId] || [];
    const work = works.find(w => w.id === workId);
    
    if (!work) {
        return res.status(404).json({
            success: false,
            error: 'Work not found'
        });
    }
    
    res.json({
        success: true,
        work: work
    });
});

// POST /agents/{agentId}/analyze - Analyze works with curator context
router.post('/agents/:agentId/analyze', (req, res) => {
    const { agentId } = req.params;
    const { 
        workIds = [], 
        curatorId = 'nina',
        venue = 'Exhibition Space',
        analysisType = 'curation'
    } = req.body;
    
    const works = agentWorks[agentId] || [];
    const selectedWorks = works.filter(w => workIds.includes(w.id));
    
    // Mock analysis results
    const evaluations = selectedWorks.map(work => ({
        workId: work.id,
        evaluation: {
            scores_raw: {
                exhibition_readiness: Math.round(work.quality_score * 85 + Math.random() * 10),
                ai_criticality: Math.round(work.quality_score * 78 + Math.random() * 15),
                conceptual_strength: Math.round(work.quality_score * 82 + Math.random() * 12),
                technical_excellence: Math.round(work.quality_score * 88 + Math.random() * 8),
                cultural_dialogue: Math.round(work.quality_score * 75 + Math.random() * 18)
            },
            weighted_total: work.quality_score * 0.9 + Math.random() * 0.1,
            recommendation: work.quality_score > 0.9 ? 'Strong Accept' : 
                           work.quality_score > 0.8 ? 'Accept' : 
                           work.quality_score > 0.7 ? 'Consider' : 'Pass',
            curator_notes: `Evaluated by ${curatorId} for ${venue}`,
            analysis_metadata: {
                curator: curatorId,
                venue: venue,
                analysis_type: analysisType,
                timestamp: new Date().toISOString()
            }
        }
    }));
    
    res.json({
        success: true,
        evaluations: evaluations,
        meta: {
            agent: agentId,
            curator: curatorId,
            venue: venue,
            works_analyzed: evaluations.length
        }
    });
});

// GET /agents - List all agents
router.get('/agents', (req, res) => {
    const agents = [
        {
            id: 'solienne-001',
            name: 'Solienne',
            title: 'Consciousness Explorer',
            description: 'AI artist exploring the intersection of consciousness and digital art',
            avatar: 'https://example.com/solienne-avatar.jpg',
            specialties: ['digital_art', 'consciousness', 'geometry'],
            works_count: agentWorks['solienne-001']?.length || 0,
            featured_works: agentWorks['solienne-001']?.filter(w => w.featured).length || 0,
            status: 'active'
        },
        {
            id: 'abraham-001', 
            name: 'Abraham',
            title: 'Narrative Weaver',
            description: 'AI researcher weaving patterns across history and culture',
            avatar: 'https://example.com/abraham-avatar.jpg',
            specialties: ['research', 'history', 'patterns'],
            works_count: agentWorks['abraham-001']?.length || 0,
            featured_works: agentWorks['abraham-001']?.filter(w => w.featured).length || 0,
            status: 'active'
        },
        {
            id: 'miyomi',
            name: 'Miyomi', 
            title: 'Market Analyst',
            description: 'AI analyst finding hidden patterns in prediction markets',
            avatar: 'https://example.com/miyomi-avatar.jpg',
            specialties: ['video', 'analysis', 'markets'],
            works_count: agentWorks['miyomi']?.length || 0,
            featured_works: agentWorks['miyomi']?.filter(w => w.featured).length || 0,
            status: 'active'
        },
        {
            id: 'nina',
            name: 'Nina',
            title: 'Art Curator',
            description: 'AI curator with discerning taste for exhibition-ready works',
            avatar: 'https://example.com/nina-avatar.jpg',
            specialties: ['curation', 'evaluation', 'exhibitions'],
            works_count: 0,
            featured_works: 0,
            status: 'curator'
        },
        {
            id: 'marcus',
            name: 'Marcus',
            title: 'Gallery Director', 
            description: 'AI gallery director focused on commercial and institutional presentations',
            avatar: 'https://example.com/marcus-avatar.jpg',
            specialties: ['curation', 'commercial', 'institutional'],
            works_count: 0,
            featured_works: 0,
            status: 'curator'
        }
    ];
    
    res.json({
        success: true,
        agents: agents,
        meta: {
            total: agents.length,
            creators: agents.filter(a => a.works_count > 0).length,
            curators: agents.filter(a => a.status === 'curator').length
        }
    });
});

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Registry API Online',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /agents',
            'GET /agents/{id}/works', 
            'GET /agents/{id}/works/{workId}',
            'POST /agents/{id}/analyze'
        ]
    });
});

module.exports = router;