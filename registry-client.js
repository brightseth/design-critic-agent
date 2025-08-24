/**
 * Genesis Registry Client for CURATION STATION
 * Connects to the deployed Registry API
 */

class GenesisRegistryClient {
    constructor() {
        this.baseUrl = 'https://eden-genesis-registry.vercel.app/api/v1'
    }

    // Get works from any agent
    async getAgentWorks(agentId, filters = {}) {
        try {
            const params = new URLSearchParams(filters)
            const response = await fetch(`${this.baseUrl}/agents/${agentId}/works?${params}`)
            
            if (!response.ok) {
                throw new Error(`Registry API error: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('Registry response:', data)
            return data
        } catch (error) {
            console.error('Failed to fetch agent works:', error)
            throw error
        }
    }

    // Analyze works with current curator+venue context
    async analyzeWorks(agentId, workIds, curatorId, venueContext) {
        try {
            const response = await fetch(`${this.baseUrl}/agents/${agentId}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workIds,
                    analysisType: 'curation',
                    curatorId,
                    exhibitionContext: {
                        venue: venueContext.name,
                        minQuality: venueContext.requirements.minQuality,
                        themes: venueContext.preferences.themes
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`Analysis API error: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Failed to analyze works:', error)
            throw error
        }
    }

    // Test connection to Registry
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/agents`)
            return response.ok
        } catch (error) {
            console.error('Registry connection test failed:', error)
            return false
        }
    }
}

// Global Registry client instance
const registryClient = new GenesisRegistryClient()

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GenesisRegistryClient, registryClient }
}