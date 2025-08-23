// Genesis Registry Client for Nina Design Critic
// Handles all agent identity & artifact reads from the new registry

const REGISTRY_BASE_URL = process.env.GENESIS_REGISTRY_URL || 'https://api.eden.art/registry';
const REGISTRY_API_KEY = process.env.EDEN_API_KEY;
const CACHE_TTL = 60 * 1000; // 60 seconds ISR
const FALLBACK_TTL = 5 * 60 * 1000; // 5 minutes on outage

class GenesisRegistryClient {
  constructor() {
    this.cache = new Map();
    this.lastGoodData = new Map();
  }

  // Get agent data from Registry with caching
  async getAgent(agentId, includes = ['personas', 'artifacts']) {
    const cacheKey = `agent:${agentId}:${includes.join(',')}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${REGISTRY_BASE_URL}/api/v1/agents/${agentId}?include=${includes.join(',')}`,
        {
          headers: {
            'x-eden-api-key': REGISTRY_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Registry returned ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the successful response
      this.setCache(cacheKey, data, CACHE_TTL);
      this.lastGoodData.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Registry fetch failed:', error);
      
      // Return last good data if available and recent enough
      const lastGood = this.lastGoodData.get(cacheKey);
      if (lastGood && Date.now() - lastGood.timestamp < FALLBACK_TTL) {
        console.log('Using last good data from', new Date(lastGood.timestamp));
        return lastGood.data;
      }
      
      throw error;
    }
  }

  // Get agent by handle
  async getAgentByHandle(handle) {
    const cacheKey = `handle:${handle}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${REGISTRY_BASE_URL}/api/v1/agents/${handle}`,
        {
          headers: {
            'x-eden-api-key': REGISTRY_API_KEY
          }
        }
      );

      const data = await response.json();
      this.setCache(cacheKey, data, CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Failed to fetch agent by handle:', error);
      throw error;
    }
  }

  // Post creation results to Registry (after saving to Academy)
  async appendCreation(agentId, creationData) {
    try {
      const response = await fetch(
        `${REGISTRY_BASE_URL}/api/v1/agents/${agentId}/creations`,
        {
          method: 'POST',
          headers: {
            'x-eden-api-key': REGISTRY_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(creationData)
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to append creation: ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to append creation to Registry:', error);
      // Don't throw - we don't want to break the main flow
      // Queue for retry if needed
      this.queueForRetry('appendCreation', { agentId, creationData });
      return null;
    }
  }

  // Update creation metadata (e.g., curation tags)
  async patchCreation(agentId, creationId, metadata) {
    try {
      const response = await fetch(
        `${REGISTRY_BASE_URL}/api/v1/agents/${agentId}/creations/${creationId}`,
        {
          method: 'PATCH',
          headers: {
            'x-eden-api-key': REGISTRY_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ metadata })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to patch creation: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to patch creation:', error);
      this.queueForRetry('patchCreation', { agentId, creationId, metadata });
      return null;
    }
  }

  // Get all agents for a cohort
  async getAgentsByCohort(cohort = 'genesis', includes = ['profile', 'creations']) {
    const cacheKey = `cohort:${cohort}:${includes.join(',')}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${REGISTRY_BASE_URL}/api/v1/agents?cohort=${cohort}&include=${includes.join(',')}`,
        {
          headers: {
            'x-eden-api-key': REGISTRY_API_KEY
          }
        }
      );

      const data = await response.json();
      this.setCache(cacheKey, data, CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Failed to fetch cohort agents:', error);
      
      const lastGood = this.lastGoodData.get(cacheKey);
      if (lastGood && Date.now() - lastGood.timestamp < FALLBACK_TTL) {
        return lastGood.data;
      }
      
      throw error;
    }
  }

  // Get creation history for an agent
  async getCreations(agentId, since = null, status = 'published') {
    let url = `${REGISTRY_BASE_URL}/api/v1/agents/${agentId}/creations?status=${status}`;
    if (since) {
      url += `&since=${since}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'x-eden-api-key': REGISTRY_API_KEY
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch creations:', error);
      throw error;
    }
  }

  // Cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data, ttl = CACHE_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Retry queue for failed writes
  retryQueue = [];
  
  queueForRetry(method, args) {
    this.retryQueue.push({
      method,
      args,
      attempts: 0,
      nextRetry: Date.now() + 1000 // Start with 1 second delay
    });
    
    // Start retry processor if not running
    if (!this.retryInterval) {
      this.startRetryProcessor();
    }
  }

  startRetryProcessor() {
    this.retryInterval = setInterval(async () => {
      const now = Date.now();
      const pending = this.retryQueue.filter(item => item.nextRetry <= now);
      
      for (const item of pending) {
        try {
          // Retry the operation
          if (item.method === 'appendCreation') {
            await this.appendCreation(item.args.agentId, item.args.creationData);
          } else if (item.method === 'patchCreation') {
            await this.patchCreation(item.args.agentId, item.args.creationId, item.args.metadata);
          }
          
          // Remove from queue on success
          this.retryQueue = this.retryQueue.filter(i => i !== item);
        } catch (error) {
          // Exponential backoff
          item.attempts++;
          item.nextRetry = now + Math.min(Math.pow(2, item.attempts) * 1000, 60000);
          
          // Give up after 5 attempts
          if (item.attempts >= 5) {
            console.error(`Giving up on ${item.method} after ${item.attempts} attempts`);
            this.retryQueue = this.retryQueue.filter(i => i !== item);
          }
        }
      }
      
      // Stop processor if queue is empty
      if (this.retryQueue.length === 0) {
        clearInterval(this.retryInterval);
        this.retryInterval = null;
      }
    }, 1000);
  }
}

// Singleton instance
const registryClient = new GenesisRegistryClient();

module.exports = registryClient;