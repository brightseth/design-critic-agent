// Genesis Registry Integration for Curation Station
// Connects to https://eden-genesis-registry.vercel.app/api/v1

class RegistryClient {
    constructor(options = {}) {
        // Use local API endpoints since external registry API isn't ready
        this.baseUrl = options.baseUrl || '/api/v1';
        this.apiKey = options.apiKey || null;
        this.bypassToken = options.bypassToken || null;
        this.timeout = options.timeout || 10000;
    }
    
    // Helper to add auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        
        return headers;
    }
    
    // Helper to build URLs with bypass token if needed
    buildUrl(endpoint) {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Only add bypass token for external registry URLs
        if (this.bypassToken && this.baseUrl.includes('eden-genesis-registry')) {
            const separator = endpoint.includes('?') ? '&' : '?';
            return `${url}${separator}x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${this.bypassToken}`;
        }
        
        return url;
    }
    
    // ==========================================
    // AGENT WORKS API
    // ==========================================
    
    async getAgentWorks(agentId, options = {}) {
        const {
            type = null,
            featured = false,
            limit = 20,
            offset = 0,
            minQuality = null
        } = options;
        
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString()
        });
        
        if (type) params.append('type', type);
        if (featured) params.append('featured', 'true');
        if (minQuality !== null) params.append('minQuality', minQuality.toString());
        
        const url = this.buildUrl(`/agents/${agentId}/works?${params}`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                timeout: this.timeout
            });
            
            if (!response.ok) {
                throw new Error(`Registry API error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch agent works:', error);
            throw error;
        }
    }
    
    // Get detailed work information
    async getWorkDetails(workId, agentId) {
        const url = this.buildUrl(`/agents/${agentId}/works/${workId}`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                timeout: this.timeout
            });
            
            if (!response.ok) {
                throw new Error(`Registry API error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch work details:', error);
            throw error;
        }
    }
    
    // ==========================================
    // CURATION API - The key integration!
    // ==========================================
    
    async analyzeWorks(agentId, workIds, options = {}) {
        const {
            curatorId = 'nina',
            venue = 'Paris Photo',
            minQuality = 70,
            analysisType = 'curation'
        } = options;
        
        const url = this.buildUrl(`/agents/${agentId}/analyze`);
        
        const body = {
            workIds,
            analysisType,
            curatorId,
            exhibitionContext: {
                venue,
                minQuality
            }
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body),
                timeout: this.timeout
            });
            
            if (!response.ok) {
                throw new Error(`Registry analysis error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to analyze works:', error);
            throw error;
        }
    }
    
    // ==========================================
    // CURATION SESSIONS
    // ==========================================
    
    async createCurationSession(options = {}) {
        const {
            curatorId,
            venue,
            sessionName,
            workIds = []
        } = options;
        
        const url = this.buildUrl('/curation/sessions');
        
        const body = {
            curatorId,
            venue,
            sessionName,
            workIds
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Session creation error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    }
    
    async getSessionDecisions(sessionId) {
        const url = this.buildUrl(`/curation/sessions/${sessionId}/decisions`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Session fetch error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch session decisions:', error);
            throw error;
        }
    }
    
    // ==========================================
    // ANALYTICS
    // ==========================================
    
    async getCurationAnalytics(curatorId, timeframe = '7d') {
        const url = this.buildUrl(`/curation/analytics?curatorId=${curatorId}&timeframe=${timeframe}`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Analytics error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            throw error;
        }
    }
    
    // ==========================================
    // FALLBACK METHODS
    // ==========================================
    
    // If Registry is unavailable, fall back to local evaluation
    async fallbackEvaluation(works, curatorId, venue) {
        console.log('Registry unavailable, using fallback evaluation');
        
        // This calls the existing Nina evaluation but modifies scores based on curator+venue
        const evaluations = [];
        
        for (const work of works) {
            try {
                // Call existing nina-curator-v2 API
                const response = await fetch('/api/nina-curator-v2', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: work.data || work.url
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Evaluation failed');
                }
                
                let evaluation = await response.json();
                
                // Apply curator+venue modifiers
                evaluation = this.applyCuratorVenueModifiers(evaluation, curatorId, venue);
                
                evaluations.push({
                    workId: work.id,
                    evaluation
                });
            } catch (error) {
                console.error(`Failed to evaluate work ${work.id}:`, error);
                evaluations.push({
                    workId: work.id,
                    evaluation: null,
                    error: error.message
                });
            }
        }
        
        return { evaluations };
    }
    
    applyCuratorVenueModifiers(evaluation, curatorId, venue) {
        // Get curator and venue profiles
        const curator = window.curatorPersonas?.[curatorId] || window.curatorPersonas?.nina;
        const venueProfile = window.venueProfiles?.[venue] || window.venueProfiles?.parisPhoto;
        
        if (!curator || !venueProfile) {
            return evaluation; // Return unmodified if profiles not found
        }
        
        // Apply curator weight preferences
        if (curator.weights) {
            const modifiedScores = { ...evaluation.scores_raw };
            
            // Adjust scores based on curator preferences
            Object.keys(modifiedScores).forEach(dimension => {
                const curatorWeight = curator.weights[dimension] || 1.0;
                modifiedScores[dimension] = Math.round(modifiedScores[dimension] * curatorWeight);
            });
            
            evaluation.scores_raw = modifiedScores;
        }
        
        // Apply venue modifiers
        if (venueProfile.modifiers) {
            const modifiedScores = { ...evaluation.scores_raw };
            
            Object.keys(modifiedScores).forEach(dimension => {
                const venueModifier = venueProfile.modifiers[dimension] || 1.0;
                modifiedScores[dimension] = Math.round(modifiedScores[dimension] * venueModifier);
            });
            
            evaluation.scores_raw = modifiedScores;
        }
        
        // Recalculate weighted total
        const weights = {
            exhibition_readiness: 0.30,
            ai_criticality: 0.25,
            conceptual_strength: 0.20,
            technical_excellence: 0.15,
            cultural_dialogue: 0.10
        };
        
        let weightedTotal = 0;
        Object.keys(weights).forEach(dimension => {
            if (evaluation.scores_raw[dimension] !== undefined) {
                weightedTotal += (evaluation.scores_raw[dimension] / 100) * weights[dimension];
            }
        });
        
        evaluation.weighted_total = weightedTotal;
        
        // Add curator/venue context
        evaluation.curator_context = {
            curator: curatorId,
            venue: venue,
            modified: true
        };
        
        return evaluation;
    }
    
    // ==========================================
    // CONNECTION STATUS
    // ==========================================
    
    async testConnection() {
        try {
            // Test the actual available endpoint
            const url = this.buildUrl('/agents');
            console.log('Testing registry connection to:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
                timeout: 5000
            });
            
            console.log('Registry response:', response.status, response.ok);
            
            if (response.ok) {
                return {
                    connected: true,
                    status: response.status,
                    message: 'Registry API Connected'
                };
            } else if (response.status === 500) {
                // Server error - registry exists but API not ready
                return {
                    connected: false,
                    status: response.status,
                    message: 'Registry API Unavailable'
                };
            } else {
                // Try fallback to root to check if registry exists
                const rootUrl = this.baseUrl.replace('/api/v1', '');
                const rootResponse = await fetch(rootUrl, {
                    method: 'GET',
                    timeout: 5000
                });
                
                if (rootResponse.ok) {
                    return {
                        connected: false,
                        status: response.status,
                        message: 'Registry Online (API Pending)'
                    };
                } else {
                    return {
                        connected: false,
                        status: response.status,
                        message: `Registry Error: ${response.status}`
                    };
                }
            }
        } catch (error) {
            return {
                connected: false,
                status: null,
                message: 'Registry Offline'
            };
        }
    }
}

// ==========================================
// INTEGRATION WITH CURATION STATION
// ==========================================

// Initialize Registry client
let registryClient = null;

function initializeRegistry(options = {}) {
    registryClient = new RegistryClient(options);
    console.log('Registry client initialized');
    
    // Test connection
    registryClient.testConnection().then(status => {
        console.log('Registry status:', status);
        
        if (status.connected) {
            showNotification('Connected to Genesis Registry', 'success');
        } else {
            console.warn('Registry not available, using fallback mode');
            showNotification('Registry unavailable - using local evaluation', 'warning');
        }
    });
}

// Enhanced evaluation function that uses Registry
async function evaluateWithRegistry(works, curatorId, venue) {
    if (!registryClient) {
        throw new Error('Registry client not initialized');
    }
    
    try {
        // Try Registry first
        const workIds = works.map(w => w.id);
        const agentId = 'solienne-001'; // Default for now
        
        const result = await registryClient.analyzeWorks(agentId, workIds, {
            curatorId,
            venue,
            analysisType: 'curation'
        });
        
        return result;
    } catch (error) {
        console.log('Registry evaluation failed, using fallback:', error);
        
        // Fallback to local evaluation with curator/venue modifiers
        return await registryClient.fallbackEvaluation(works, curatorId, venue);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with default options
    initializeRegistry();
    
    // If bypass token is available, use it
    const bypassToken = localStorage.getItem('vercel_bypass_token');
    if (bypassToken) {
        initializeRegistry({ bypassToken });
    }
    
    // Show registry status in UI
    setTimeout(() => {
        if (registryClient) {
            registryClient.testConnection().then(status => {
                console.log('Registry Connection Status:', status);
                
                // Add status indicator to UI
                const statusElement = document.getElementById('registry-status');
                if (statusElement) {
                    statusElement.textContent = status.message;
                    
                    // Determine status class
                    let statusClass = 'registry-status';
                    if (status.connected) {
                        statusClass += ' status-connected';
                    } else if (status.message.includes('Online') || status.message.includes('Pending')) {
                        statusClass += ' status-pending';
                    } else {
                        statusClass += ' status-disconnected';
                    }
                    
                    statusElement.className = statusClass;
                }
            });
        }
    }, 1000);
});

// Export for use in main application
window.RegistryClient = RegistryClient;
window.registryClient = registryClient;
window.evaluateWithRegistry = evaluateWithRegistry;
window.initializeRegistry = initializeRegistry;