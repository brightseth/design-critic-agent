// Public API for NINA Curation System
// Provides programmatic access to evaluation capabilities

const ninaCuratorV2 = require('./nina-curator-v2');
const NinaVideoAnalyzer = require('./nina-video-analyzer');
const crypto = require('crypto');

// Simple API key management (in production, use database)
const API_KEYS = new Map();
if (process.env.NINA_API_KEYS) {
    // Format: "key1:name1,key2:name2"
    process.env.NINA_API_KEYS.split(',').forEach(pair => {
        const [key, name] = pair.split(':');
        if (key && name) API_KEYS.set(key, { name, created: Date.now() });
    });
}

// Rate limiting (in-memory, resets on restart)
const rateLimits = new Map();
const RATE_LIMIT = {
    requests_per_minute: 30,
    requests_per_hour: 500,
    requests_per_day: 5000
};

function checkRateLimit(apiKey) {
    const now = Date.now();
    const limits = rateLimits.get(apiKey) || { minute: [], hour: [], day: [] };
    
    // Clean old entries
    limits.minute = limits.minute.filter(t => now - t < 60000);
    limits.hour = limits.hour.filter(t => now - t < 3600000);
    limits.day = limits.day.filter(t => now - t < 86400000);
    
    // Check limits
    if (limits.minute.length >= RATE_LIMIT.requests_per_minute) {
        return { allowed: false, message: 'Rate limit exceeded (per minute)', retryAfter: 60 };
    }
    if (limits.hour.length >= RATE_LIMIT.requests_per_hour) {
        return { allowed: false, message: 'Rate limit exceeded (per hour)', retryAfter: 3600 };
    }
    if (limits.day.length >= RATE_LIMIT.requests_per_day) {
        return { allowed: false, message: 'Rate limit exceeded (per day)', retryAfter: 86400 };
    }
    
    // Add current request
    limits.minute.push(now);
    limits.hour.push(now);
    limits.day.push(now);
    rateLimits.set(apiKey, limits);
    
    return { allowed: true };
}

async function handleAPIRequest(req, res) {
    // CORS headers for API access
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    // Check API key (optional for now, but recommended)
    const apiKey = req.headers['x-api-key'];
    if (API_KEYS.size > 0 && !API_KEYS.has(apiKey)) {
        return res.status(401).json({
            error: 'Invalid API key',
            message: 'Please provide a valid API key in the X-API-Key header'
        });
    }
    
    // Rate limiting
    if (apiKey) {
        const rateCheck = checkRateLimit(apiKey);
        if (!rateCheck.allowed) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: rateCheck.message,
                retryAfter: rateCheck.retryAfter
            });
        }
    }
    
    try {
        const { action, data } = req.body;
        
        switch (action) {
            case 'evaluate':
                return await handleEvaluate(data, res);
            case 'evaluate_batch':
                return await handleBatchEvaluate(data, res);
            case 'compare':
                return await handleCompare(data, res);
            case 'analyze_video':
                return await handleVideoAnalysis(data, res);
            case 'get_status':
                return handleStatus(res);
            default:
                return res.status(400).json({
                    error: 'Invalid action',
                    message: 'Supported actions: evaluate, evaluate_batch, compare, analyze_video, get_status'
                });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

async function handleEvaluate(data, res) {
    if (!data || !data.image) {
        return res.status(400).json({
            error: 'Missing required field',
            message: 'Please provide an image (base64 or URL)'
        });
    }
    
    let imageData = data.image;
    
    // Handle URL input
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
        try {
            const response = await fetch(imageData);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            imageData = `data:${mimeType};base64,${base64}`;
        } catch (error) {
            return res.status(400).json({
                error: 'Failed to fetch image',
                message: error.message
            });
        }
    }
    
    // Evaluate image
    const evaluation = await ninaCuratorV2.evaluateImage(imageData);
    
    // Add metadata
    evaluation.api_version = '1.0';
    evaluation.timestamp = new Date().toISOString();
    
    return res.json({
        success: true,
        evaluation,
        metadata: {
            dimensions: {
                exhibition_readiness: { weight: 30, description: 'Gallery wall presence and professional presentation' },
                ai_criticality: { weight: 25, description: 'Critical engagement with AI as medium' },
                conceptual_strength: { weight: 20, description: 'Conceptual rigor and thematic coherence' },
                technical_excellence: { weight: 15, description: 'Technical execution and craft' },
                cultural_dialogue: { weight: 10, description: 'Engagement with artistic lineage' }
            }
        }
    });
}

async function handleBatchEvaluate(data, res) {
    if (!data || !data.images || !Array.isArray(data.images)) {
        return res.status(400).json({
            error: 'Missing required field',
            message: 'Please provide an array of images'
        });
    }
    
    if (data.images.length > 10) {
        return res.status(400).json({
            error: 'Batch size exceeded',
            message: 'Maximum 10 images per batch request'
        });
    }
    
    const evaluations = [];
    
    for (const image of data.images) {
        try {
            let imageData = image.data || image;
            
            // Handle URL input
            if (typeof imageData === 'string' && imageData.startsWith('http')) {
                const response = await fetch(imageData);
                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const mimeType = response.headers.get('content-type') || 'image/jpeg';
                imageData = `data:${mimeType};base64,${base64}`;
            }
            
            const evaluation = await ninaCuratorV2.evaluateImage(imageData);
            evaluations.push({
                id: image.id || crypto.randomUUID(),
                evaluation,
                success: true
            });
        } catch (error) {
            evaluations.push({
                id: image.id || crypto.randomUUID(),
                error: error.message,
                success: false
            });
        }
    }
    
    // Rank evaluations
    const successful = evaluations.filter(e => e.success);
    successful.sort((a, b) => b.evaluation.weighted_total - a.evaluation.weighted_total);
    
    return res.json({
        success: true,
        evaluations,
        summary: {
            total: evaluations.length,
            successful: successful.length,
            failed: evaluations.length - successful.length,
            average_score: successful.length > 0 
                ? successful.reduce((sum, e) => sum + e.evaluation.weighted_total * 100, 0) / successful.length 
                : 0,
            exhibition_ready: successful.filter(e => e.evaluation.weighted_total >= 0.85).length
        },
        metadata: {
            api_version: '1.0',
            timestamp: new Date().toISOString()
        }
    });
}

async function handleCompare(data, res) {
    if (!data || !data.images || !Array.isArray(data.images) || data.images.length < 2) {
        return res.status(400).json({
            error: 'Missing required field',
            message: 'Please provide at least 2 images for comparison'
        });
    }
    
    // Evaluate all images
    const evaluations = [];
    for (const image of data.images) {
        try {
            let imageData = image.data || image;
            
            // Handle URL input
            if (typeof imageData === 'string' && imageData.startsWith('http')) {
                const response = await fetch(imageData);
                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const mimeType = response.headers.get('content-type') || 'image/jpeg';
                imageData = `data:${mimeType};base64,${base64}`;
            }
            
            const evaluation = await ninaCuratorV2.evaluateImage(imageData);
            evaluations.push({
                id: image.id || crypto.randomUUID(),
                evaluation
            });
        } catch (error) {
            console.error('Evaluation error:', error);
        }
    }
    
    if (evaluations.length < 2) {
        return res.status(400).json({
            error: 'Evaluation failed',
            message: 'Could not evaluate enough images for comparison'
        });
    }
    
    // Perform pairwise comparisons
    const comparisons = [];
    for (let i = 0; i < evaluations.length; i++) {
        for (let j = i + 1; j < evaluations.length; j++) {
            const evalA = evaluations[i];
            const evalB = evaluations[j];
            
            const comparison = {
                pair: [evalA.id, evalB.id],
                scores: {
                    [evalA.id]: evalA.evaluation.weighted_total * 100,
                    [evalB.id]: evalB.evaluation.weighted_total * 100
                },
                winner: evalA.evaluation.weighted_total > evalB.evaluation.weighted_total ? evalA.id : evalB.id,
                margin: Math.abs(evalA.evaluation.weighted_total - evalB.evaluation.weighted_total) * 100,
                dimensions: {
                    exhibition_readiness: {
                        [evalA.id]: evalA.evaluation.scores_raw.exhibition_readiness,
                        [evalB.id]: evalB.evaluation.scores_raw.exhibition_readiness
                    },
                    ai_criticality: {
                        [evalA.id]: evalA.evaluation.scores_raw.ai_criticality,
                        [evalB.id]: evalB.evaluation.scores_raw.ai_criticality
                    },
                    conceptual_strength: {
                        [evalA.id]: evalA.evaluation.scores_raw.conceptual_strength,
                        [evalB.id]: evalB.evaluation.scores_raw.conceptual_strength
                    }
                }
            };
            comparisons.push(comparison);
        }
    }
    
    // Rank all images
    evaluations.sort((a, b) => b.evaluation.weighted_total - a.evaluation.weighted_total);
    
    return res.json({
        success: true,
        rankings: evaluations.map((e, idx) => ({
            rank: idx + 1,
            id: e.id,
            score: e.evaluation.weighted_total * 100,
            verdict: e.evaluation.verdict
        })),
        comparisons,
        metadata: {
            api_version: '1.0',
            timestamp: new Date().toISOString()
        }
    });
}

async function handleVideoAnalysis(data, res) {
    if (!data || !data.video) {
        return res.status(400).json({
            error: 'Missing required field',
            message: 'Please provide a video (base64 or URL)'
        });
    }
    
    const analyzer = new NinaVideoAnalyzer();
    const metadata = {
        duration: data.duration || 30,
        resolution: data.resolution || '1920x1080',
        isLoop: data.isLoop || false
    };
    
    const analysis = await analyzer.evaluateVideo(data.video, metadata);
    
    return res.json({
        success: true,
        analysis,
        metadata: {
            api_version: '1.0',
            timestamp: new Date().toISOString()
        }
    });
}

function handleStatus(res) {
    return res.json({
        success: true,
        status: 'operational',
        version: '1.0',
        endpoints: {
            evaluate: {
                method: 'POST',
                description: 'Evaluate a single image',
                parameters: {
                    action: 'evaluate',
                    data: {
                        image: 'base64 or URL'
                    }
                }
            },
            evaluate_batch: {
                method: 'POST',
                description: 'Evaluate multiple images (max 10)',
                parameters: {
                    action: 'evaluate_batch',
                    data: {
                        images: ['array of base64 or URLs']
                    }
                }
            },
            compare: {
                method: 'POST',
                description: 'Compare multiple images',
                parameters: {
                    action: 'compare',
                    data: {
                        images: ['array of base64 or URLs']
                    }
                }
            },
            analyze_video: {
                method: 'POST',
                description: 'Analyze video content',
                parameters: {
                    action: 'analyze_video',
                    data: {
                        video: 'base64 or URL',
                        duration: 'optional, in seconds',
                        resolution: 'optional, e.g. 1920x1080',
                        isLoop: 'optional, boolean'
                    }
                }
            }
        },
        rate_limits: RATE_LIMIT,
        metadata: {
            api_version: '1.0',
            timestamp: new Date().toISOString()
        }
    });
}

module.exports = handleAPIRequest;