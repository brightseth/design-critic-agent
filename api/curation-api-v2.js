// Curation Station API v2 - Multi-curator support
const { getCurationStation } = require('./curation-station');
const crypto = require('crypto');

// Rate limiting (simplified)
const rateLimits = new Map();

async function handleCurationAPI(req, res) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    const station = getCurationStation();
    
    // Handle different endpoints
    const path = req.path.replace('/api/v2/curation', '');
    
    try {
        switch (path) {
            case '/curators':
                return handleGetCurators(station, req, res);
            case '/evaluate':
                return handleEvaluate(station, req, res);
            case '/compare':
                return handleCompare(station, req, res);
            case '/curator':
                return handleGetCuratorProfile(station, req, res);
            case '/register':
                return handleRegisterCurator(station, req, res);
            case '/status':
                return handleStatus(station, res);
            default:
                return res.status(404).json({
                    error: 'Endpoint not found',
                    message: `Unknown endpoint: ${path}`
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

// Get all available curators
async function handleGetCurators(station, req, res) {
    const { mediaType } = req.query;
    
    const curators = mediaType 
        ? station.getCuratorsForMedia(mediaType)
        : station.getCurators();
    
    return res.json({
        success: true,
        curators,
        totalCount: curators.length,
        mediaType: mediaType || 'all'
    });
}

// Get specific curator profile
async function handleGetCuratorProfile(station, req, res) {
    const { curatorId } = req.query;
    
    if (!curatorId) {
        return res.status(400).json({
            error: 'Missing parameter',
            message: 'Please provide curatorId'
        });
    }
    
    const profile = station.getCuratorProfile(curatorId);
    
    if (!profile) {
        return res.status(404).json({
            error: 'Curator not found',
            message: `No curator found with id: ${curatorId}`
        });
    }
    
    return res.json({
        success: true,
        curator: profile
    });
}

// Evaluate work with specific curator
async function handleEvaluate(station, req, res) {
    const { 
        data,           // The work to evaluate (base64, URL, or object)
        curatorId = 'nina',  // Which curator to use
        mediaType,      // Optional: specify media type
        metadata = {}   // Additional metadata
    } = req.body;
    
    if (!data) {
        return res.status(400).json({
            error: 'Missing data',
            message: 'Please provide data to evaluate'
        });
    }
    
    try {
        // Handle URL fetching if needed
        let workData = data;
        if (typeof data === 'string' && data.startsWith('http')) {
            const response = await fetch(data);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const mimeType = response.headers.get('content-type') || 'application/octet-stream';
            workData = `data:${mimeType};base64,${base64}`;
        }
        
        const evaluation = await station.evaluate(workData, {
            curatorId,
            mediaType,
            metadata
        });
        
        return res.json({
            success: true,
            evaluation,
            curator: {
                id: curatorId,
                name: station.getCuratorProfile(curatorId)?.name
            }
        });
        
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                error: 'Curator not found',
                message: error.message
            });
        }
        if (error.message.includes('does not support')) {
            return res.status(400).json({
                error: 'Media type not supported',
                message: error.message
            });
        }
        throw error;
    }
}

// Compare multiple works
async function handleCompare(station, req, res) {
    const {
        items,          // Array of items to compare
        curatorId = 'nina'  // Which curator to use
    } = req.body;
    
    if (!items || !Array.isArray(items) || items.length < 2) {
        return res.status(400).json({
            error: 'Invalid items',
            message: 'Please provide at least 2 items to compare'
        });
    }
    
    if (items.length > 10) {
        return res.status(400).json({
            error: 'Too many items',
            message: 'Maximum 10 items per comparison'
        });
    }
    
    try {
        const comparison = await station.compare(items, curatorId);
        
        return res.json({
            success: true,
            comparison
        });
        
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                error: 'Curator not found',
                message: error.message
            });
        }
        throw error;
    }
}

// Register new curator from agent
async function handleRegisterCurator(station, req, res) {
    const { agentConfig } = req.body;
    
    if (!agentConfig || !agentConfig.id || !agentConfig.name) {
        return res.status(400).json({
            error: 'Invalid configuration',
            message: 'Agent configuration must include id and name'
        });
    }
    
    try {
        const curator = await station.registerAgentCurator(agentConfig);
        
        return res.json({
            success: true,
            message: `Curator ${curator.name} registered successfully`,
            curator: {
                id: curator.id,
                name: curator.name,
                description: curator.description,
                supportedMedia: curator.supportedMedia
            }
        });
        
    } catch (error) {
        return res.status(400).json({
            error: 'Registration failed',
            message: error.message
        });
    }
}

// Get API status
async function handleStatus(station, res) {
    const curators = station.getCurators();
    
    return res.json({
        success: true,
        status: 'operational',
        version: '2.0',
        curators: {
            total: curators.length,
            available: curators.filter(c => c.available).length,
            list: curators.map(c => ({
                id: c.id,
                name: c.name,
                available: c.available
            }))
        },
        endpoints: {
            '/api/v2/curation/curators': {
                method: 'GET',
                description: 'Get list of available curators',
                params: {
                    mediaType: 'optional: filter by media type'
                }
            },
            '/api/v2/curation/curator': {
                method: 'GET',
                description: 'Get curator profile',
                params: {
                    curatorId: 'required: curator identifier'
                }
            },
            '/api/v2/curation/evaluate': {
                method: 'POST',
                description: 'Evaluate work with specific curator',
                body: {
                    data: 'required: work data (base64, URL, or object)',
                    curatorId: 'optional: curator to use (default: nina)',
                    mediaType: 'optional: specify media type',
                    metadata: 'optional: additional metadata'
                }
            },
            '/api/v2/curation/compare': {
                method: 'POST',
                description: 'Compare multiple works',
                body: {
                    items: 'required: array of items to compare',
                    curatorId: 'optional: curator to use (default: nina)'
                }
            },
            '/api/v2/curation/register': {
                method: 'POST',
                description: 'Register new curator agent',
                body: {
                    agentConfig: 'required: agent configuration object'
                }
            }
        },
        supportedMedia: [
            'image', 'video', 'audio', 'text', 'code', '3d'
        ],
        metadata: {
            timestamp: new Date().toISOString()
        }
    });
}

module.exports = handleCurationAPI;