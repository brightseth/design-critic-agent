// CRIT Registry API - Connects to Genesis Registry for agent creations
const registryClient = require('../lib/genesis-registry');

// Get all agents from Genesis cohort
async function getAgents(req, res) {
    try {
        // Try to get agents from Genesis Registry
        const agents = await registryClient.getAgentsByCohort('genesis', ['profile']);
        res.json(agents);
    } catch (error) {
        console.error('Failed to fetch agents:', error);
        
        // Fallback to known agents if registry is unavailable
        res.json([
            { id: 'abraham', name: 'Abraham', handle: 'abraham', cohort: 'genesis' },
            { id: 'solienne', name: 'Solienne', handle: 'solienne', cohort: 'genesis' },
            { id: 'nina', name: 'Nina', handle: 'nina', cohort: 'genesis' },
            { id: 'osiris', name: 'Osiris', handle: 'osiris', cohort: 'genesis' },
            { id: 'luna', name: 'Luna', handle: 'luna', cohort: 'genesis' },
            { id: 'eva', name: 'Eva', handle: 'eva', cohort: 'genesis' },
            { id: 'aura', name: 'Aura', handle: 'aura', cohort: 'genesis' },
            { id: 'gaia', name: 'Gaia', handle: 'gaia', cohort: 'genesis' },
            { id: 'zephyr', name: 'Zephyr', handle: 'zephyr', cohort: 'genesis' },
            { id: 'kairos', name: 'Kairos', handle: 'kairos', cohort: 'genesis' }
        ]);
    }
}

// Get creations for a specific agent
async function getAgentCreations(req, res) {
    const { agentId } = req.params;
    const { since, limit = 50, status = 'published' } = req.query;
    
    try {
        // Try to get from Genesis Registry
        const creations = await registryClient.getCreations(agentId, since, status);
        
        // Limit results if requested
        if (limit && creations.length > limit) {
            creations.length = limit;
        }
        
        res.json(creations);
    } catch (error) {
        console.error(`Failed to fetch creations for ${agentId}:`, error);
        
        // Return empty array on error (could also return mock data for testing)
        res.json([]);
    }
}

// Get specific agent details
async function getAgentDetails(req, res) {
    const { agentId } = req.params;
    
    try {
        const agent = await registryClient.getAgent(agentId, ['profile', 'personas', 'artifacts']);
        res.json(agent);
    } catch (error) {
        console.error(`Failed to fetch agent ${agentId}:`, error);
        res.status(404).json({ error: 'Agent not found' });
    }
}

// Evaluate a creation through a curator's lens
async function evaluateCreation(req, res) {
    const { creationId } = req.params;
    const { curatorId = 'nina' } = req.query;
    const { imageData, metadata } = req.body;
    
    try {
        // Import the appropriate curator module
        let curator;
        if (curatorId === 'nina') {
            curator = require('./nina-curator-v2');
        } else {
            // Default to basic evaluation
            curator = require('./nina-curator-v2');
        }
        
        // Perform evaluation
        const evaluation = await curator.evaluate({
            imageData,
            metadata,
            creationId
        });
        
        res.json(evaluation);
    } catch (error) {
        console.error('Evaluation failed:', error);
        res.status(500).json({ error: 'Evaluation failed' });
    }
}

// Update creation with curation metadata
async function updateCreationMetadata(req, res) {
    const { agentId, creationId } = req.params;
    const { metadata } = req.body;
    
    try {
        // Add curation data to metadata
        const curationMetadata = {
            ...metadata,
            curated_at: new Date().toISOString(),
            curator: req.body.curator || 'unknown'
        };
        
        const result = await registryClient.patchCreation(agentId, creationId, curationMetadata);
        
        if (result) {
            res.json({ success: true, metadata: curationMetadata });
        } else {
            res.json({ success: false, message: 'Update queued for retry' });
        }
    } catch (error) {
        console.error('Failed to update creation metadata:', error);
        res.status(500).json({ error: 'Update failed' });
    }
}

// API endpoint handler
function handleCritAPI(req, res) {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;
    
    // Route to appropriate handler
    if (method === 'GET' && pathname === '/api/crit/agents') {
        return getAgents(req, res);
    } else if (method === 'GET' && pathname.match(/^\/api\/crit\/agents\/([^\/]+)$/)) {
        req.params = { agentId: pathname.split('/')[4] };
        return getAgentDetails(req, res);
    } else if (method === 'GET' && pathname.match(/^\/api\/crit\/agents\/([^\/]+)\/creations$/)) {
        req.params = { agentId: pathname.split('/')[4] };
        return getAgentCreations(req, res);
    } else if (method === 'POST' && pathname.match(/^\/api\/crit\/evaluate\/([^\/]+)$/)) {
        req.params = { creationId: pathname.split('/')[4] };
        return evaluateCreation(req, res);
    } else if (method === 'PATCH' && pathname.match(/^\/api\/crit\/agents\/([^\/]+)\/creations\/([^\/]+)$/)) {
        req.params = { 
            agentId: pathname.split('/')[4],
            creationId: pathname.split('/')[6]
        };
        return updateCreationMetadata(req, res);
    } else {
        res.status(404).json({ error: 'Endpoint not found' });
    }
}

module.exports = {
    handleCritAPI,
    getAgents,
    getAgentCreations,
    getAgentDetails,
    evaluateCreation,
    updateCreationMetadata
};