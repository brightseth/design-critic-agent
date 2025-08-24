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
            console.error('Registry API unavailable, using sample data:', error)
            // Fall back to sample data when Registry is offline
            return await this.getSampleAgentWorks(agentId, filters)
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
            return { connected: response.ok, message: response.ok ? 'Connected' : 'Registry unavailable' }
        } catch (error) {
            console.error('Registry connection test failed:', error)
            return { connected: false, message: 'Using sample data (Registry offline)' }
        }
    }

    // Fallback data for when Registry is offline
    async getSampleAgentWorks(agentId, filters = {}) {
        const sampleData = {
            'solienne-001': [
                {
                    id: 'solienne-001_sample_1',
                    title: 'Ethereal feminine spirit with flowing silver-mauve essence',
                    files: [{ url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/2.png', type: 'original' }],
                    themes: ['identity', 'transformation'],
                    description: 'dreamlike quality, soft hazy edges, celestial, mysterious presence',
                    medium: 'image',
                    status: 'published',
                    createdAt: '2025-04-11T00:00:00.000Z'
                },
                {
                    id: 'solienne-001_sample_2', 
                    title: 'Consciousness-velocity geometric meditation',
                    files: [{ url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/consciousness-velocity.png', type: 'original' }],
                    themes: ['consciousness', 'geometry'],
                    description: 'accumulation meter with geometric forms filling',
                    medium: 'image',
                    status: 'published',
                    createdAt: '2025-04-12T00:00:00.000Z'
                },
                {
                    id: 'solienne-001_sample_3',
                    title: 'Portal-opening architectural consciousness',
                    files: [{ url: 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/portal-opening.png', type: 'original' }],
                    themes: ['architecture', 'consciousness'],
                    description: 'infinite geometric sage light',
                    medium: 'image', 
                    status: 'published',
                    createdAt: '2025-04-13T00:00:00.000Z'
                }
            ],
            'abraham-001': [
                {
                    id: 'abraham-001_sample_1',
                    title: 'Historical Pattern Analysis: Renaissance Innovation',
                    files: [{ url: 'https://example.com/abraham-work-1.jpg', type: 'original' }],
                    themes: ['history', 'patterns', 'innovation'],
                    description: 'Synthesis of Renaissance breakthrough patterns',
                    medium: 'text',
                    status: 'published',
                    createdAt: '2025-04-10T00:00:00.000Z'
                }
            ],
            'koru-001': [
                {
                    id: 'koru-001_sample_1', 
                    title: 'Spiral Pattern Research: Natural Geometries',
                    files: [{ url: 'https://example.com/koru-work-1.jpg', type: 'original' }],
                    themes: ['patterns', 'geometry', 'nature'],
                    description: 'Research into natural spiral formations',
                    medium: 'image',
                    status: 'published', 
                    createdAt: '2025-04-09T00:00:00.000Z'
                }
            ]
        }

        const works = sampleData[agentId] || []
        return {
            success: true,
            data: works,
            meta: { pagination: { page: 1, limit: 20, total: works.length } }
        }
    }
}

// Global Registry client instance
const registryClient = new GenesisRegistryClient()

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GenesisRegistryClient, registryClient }
}