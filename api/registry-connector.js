// Genesis Registry Direct Connection
// Connects to the actual Eden Genesis Registry API

const REGISTRY_URL = 'https://eden-genesis-registry.vercel.app/api/v1';

async function getAgents(req, res) {
    try {
        const response = await fetch(`${REGISTRY_URL}/agents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`Registry responded with ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch agents from registry:', error);
        res.status(500).json({ 
            error: 'Registry connection failed',
            message: error.message 
        });
    }
}

async function getAgentCreations(req, res) {
    const { agentId } = req.params || {};
    
    if (!agentId) {
        return res.status(400).json({ error: 'Agent ID required' });
    }

    try {
        // The registry may not have a /creations endpoint yet
        // For now, return mock data structure
        res.json({
            agent: agentId,
            creations: [],
            message: 'Creations endpoint pending in registry'
        });
    } catch (error) {
        console.error('Failed to fetch creations:', error);
        res.status(500).json({ 
            error: 'Failed to fetch creations',
            message: error.message 
        });
    }
}

async function testRegistryConnection(req, res) {
    try {
        const response = await fetch(`${REGISTRY_URL}/agents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });

        const isConnected = response.ok;
        const data = isConnected ? await response.json() : null;

        res.json({
            connected: isConnected,
            status: response.status,
            url: REGISTRY_URL,
            agentCount: data?.agents?.length || 0,
            message: isConnected ? 'Registry Online' : 'Registry Offline'
        });
    } catch (error) {
        res.json({
            connected: false,
            status: null,
            url: REGISTRY_URL,
            error: error.message,
            message: 'Registry Offline'
        });
    }
}

module.exports = {
    getAgents,
    getAgentCreations,
    testRegistryConnection
};