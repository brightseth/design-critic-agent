/**
 * Multi-Agent Conversation Engine
 * Orchestrates realistic critique conversations between design critics
 */

class ConversationEngine {
  constructor(agents) {
    this.agents = new Map();
    this.conversationState = {
      phase: 'initial',
      transcript: [],
      tensions: [],
      consensusPoints: [],
      currentSpeaker: null,
      speakingOrder: [],
      heatLevel: 0
    };
    
    // Load agent profiles
    agents.forEach(agent => {
      this.agents.set(agent.id, new CriticAgent(agent));
    });
  }
  
  /**
   * Main conversation flow
   */
  async generateConversation(artwork, options = {}) {
    const {
      maxExchanges = 20,
      allowInterruptions = true,
      seekConsensus = true
    } = options;
    
    // Phase 1: Initial Observations
    await this.gatherInitialObservations(artwork);
    
    // Phase 2: Cross-Examination
    await this.facilitateCrossExamination();
    
    // Phase 3: Debate Key Issues
    if (this.conversationState.tensions.length > 0) {
      await this.debateKeyIssues();
    }
    
    // Phase 4: Build Consensus
    if (seekConsensus) {
      await this.buildConsensus();
    }
    
    return this.formatConversation();
  }
  
  /**
   * Phase 1: Each agent gives their initial take
   */
  async gatherInitialObservations(artwork) {
    this.conversationState.phase = 'initial_observations';
    
    // Randomize speaking order for natural feel
    const speakers = Array.from(this.agents.values());
    this.shuffleArray(speakers);
    
    for (const agent of speakers) {
      const observation = await agent.formInitialObservation(artwork);
      this.addToTranscript({
        speaker: agent.name,
        type: 'initial',
        content: observation.content,
        confidence: observation.confidence,
        topics: observation.topics
      });
      
      // Track what might cause tension
      this.identifyTensionPoints(observation, agent);
    }
  }
  
  /**
   * Phase 2: Agents respond to each other
   */
  async facilitateCrossExamination() {
    this.conversationState.phase = 'cross_examination';
    
    // Look for strongest reactions
    const reactions = this.calculateReactions();
    
    // Sort by intensity
    reactions.sort((a, b) => b.intensity - a.intensity);
    
    // Process top reactions
    for (const reaction of reactions.slice(0, 5)) {
      const response = await this.generateResponse(reaction);
      this.addToTranscript(response);
      
      // Check for interruptions
      if (reaction.intensity > 0.8 && Math.random() > 0.5) {
        const interruption = await this.generateInterruption(reaction);
        if (interruption) {
          this.addToTranscript(interruption);
        }
      }
    }
  }
  
  /**
   * Phase 3: Debate the key tension points
   */
  async debateKeyIssues() {
    this.conversationState.phase = 'debate';
    
    for (const tension of this.conversationState.tensions.slice(0, 2)) {
      const debate = await this.facilitateDebate(tension);
      debate.exchanges.forEach(exchange => {
        this.addToTranscript(exchange);
      });
      
      // Heat level affects how intense the debate gets
      this.conversationState.heatLevel = this.calculateHeatLevel(debate);
      
      // Moderator intervention if too heated
      if (this.conversationState.heatLevel > 0.8) {
        this.addToTranscript({
          speaker: 'Moderator',
          type: 'intervention',
          content: "Let's take a step back and look at what we're all trying to achieve here..."
        });
      }
    }
  }
  
  /**
   * Phase 4: Find common ground
   */
  async buildConsensus() {
    this.conversationState.phase = 'consensus';
    
    // Identify areas of agreement
    const commonGround = this.findCommonGround();
    
    // Have agents acknowledge consensus
    for (const point of commonGround) {
      const agent = this.selectConsensusBuilder(point);
      const statement = await agent.acknowledgeConsensus(point);
      this.addToTranscript({
        speaker: agent.name,
        type: 'consensus',
        content: statement
      });
    }
    
    // Final recommendations
    const recommendations = await this.synthesizeRecommendations();
    this.conversationState.consensusPoints = recommendations;
  }
  
  /**
   * Calculate potential reactions between agents
   */
  calculateReactions() {
    const reactions = [];
    const transcript = this.conversationState.transcript;
    
    transcript.forEach((statement, index) => {
      this.agents.forEach((agent, agentId) => {
        if (agent.name !== statement.speaker) {
          const reaction = agent.calculateReaction(statement);
          if (reaction.shouldRespond) {
            reactions.push({
              responder: agent,
              toStatement: statement,
              intensity: reaction.intensity,
              type: reaction.type
            });
          }
        }
      });
    });
    
    return reactions;
  }
  
  /**
   * Generate a response from one agent to another
   */
  async generateResponse(reaction) {
    const { responder, toStatement, type, intensity } = reaction;
    
    const response = await responder.generateResponse({
      to: toStatement.speaker,
      regarding: toStatement.content,
      responseType: type,
      intensity: intensity
    });
    
    return {
      speaker: responder.name,
      type: 'response',
      respondingTo: toStatement.speaker,
      content: response,
      intensity: intensity
    };
  }
  
  /**
   * Generate an interruption (for heated moments)
   */
  async generateInterruption(reaction) {
    const { responder } = reaction;
    
    if (responder.personality.assertiveness > 0.7) {
      return {
        speaker: responder.name,
        type: 'interruption',
        content: responder.getInterruption(),
        intensity: 0.9
      };
    }
    
    return null;
  }
  
  /**
   * Facilitate a structured debate on a tension point
   */
  async facilitateDebate(tension) {
    const exchanges = [];
    const participants = tension.agents;
    let rounds = 0;
    const maxRounds = 3;
    
    while (rounds < maxRounds) {
      for (const agent of participants) {
        const argument = await agent.makeArgument(tension.topic, rounds);
        exchanges.push({
          speaker: agent.name,
          type: 'debate',
          content: argument,
          round: rounds
        });
        
        // Others might interject
        if (Math.random() > 0.7) {
          const interjector = this.selectInterjector(participants, agent);
          if (interjector) {
            const interjection = await interjector.interject(argument);
            exchanges.push({
              speaker: interjector.name,
              type: 'interjection',
              content: interjection
            });
          }
        }
      }
      rounds++;
    }
    
    return { topic: tension.topic, exchanges };
  }
  
  /**
   * Format the conversation for display
   */
  formatConversation() {
    return {
      transcript: this.conversationState.transcript,
      keyMoments: this.identifyKeyMoments(),
      tensions: this.conversationState.tensions,
      consensus: this.conversationState.consensusPoints,
      heatmap: this.generateHeatmap(),
      summary: this.generateSummary()
    };
  }
  
  /**
   * Identify key moments in the conversation
   */
  identifyKeyMoments() {
    return this.conversationState.transcript.filter(entry => {
      return entry.intensity > 0.7 || 
             entry.type === 'consensus' || 
             entry.type === 'interruption';
    });
  }
  
  /**
   * Generate a heat map of conversation intensity
   */
  generateHeatmap() {
    return this.conversationState.transcript.map(entry => ({
      speaker: entry.speaker,
      intensity: entry.intensity || 0.5,
      type: entry.type
    }));
  }
  
  /**
   * Generate a summary of the conversation
   */
  generateSummary() {
    return {
      totalExchanges: this.conversationState.transcript.length,
      peakHeat: this.conversationState.heatLevel,
      consensusReached: this.conversationState.consensusPoints.length > 0,
      mainDebates: this.conversationState.tensions.slice(0, 3),
      recommendations: this.conversationState.consensusPoints
    };
  }
  
  // Utility methods
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  addToTranscript(entry) {
    this.conversationState.transcript.push({
      ...entry,
      timestamp: Date.now(),
      index: this.conversationState.transcript.length
    });
  }
  
  identifyTensionPoints(observation, agent) {
    // Look for topics that might cause disagreement
    const controversialTopics = [
      'minimalism', 'maximalism', 'grid', 'typography-size',
      'simplicity', 'complexity', 'rules', 'expression'
    ];
    
    observation.topics.forEach(topic => {
      if (controversialTopics.includes(topic)) {
        this.conversationState.tensions.push({
          topic,
          agents: [agent],
          intensity: 0
        });
      }
    });
  }
  
  calculateHeatLevel(debate) {
    const intensities = debate.exchanges.map(e => e.intensity || 0.5);
    return Math.max(...intensities);
  }
  
  findCommonGround() {
    // Analyze transcript for points of agreement
    const agreements = [];
    
    this.conversationState.transcript.forEach((entry, i) => {
      if (entry.type === 'response' && entry.intensity < 0.3) {
        agreements.push({
          topic: this.extractTopic(entry.content),
          supporters: [entry.speaker, entry.respondingTo]
        });
      }
    });
    
    return agreements;
  }
  
  selectConsensusBuilder(point) {
    // Choose the most diplomatic agent
    const agents = Array.from(this.agents.values());
    agents.sort((a, b) => b.personality.openness - a.personality.openness);
    return agents[0];
  }
  
  selectInterjector(participants, currentSpeaker) {
    const others = Array.from(this.agents.values()).filter(a => 
      !participants.includes(a) && a !== currentSpeaker
    );
    
    if (others.length === 0) return null;
    
    // Most assertive is most likely to interject
    others.sort((a, b) => b.personality.assertiveness - a.personality.assertiveness);
    
    return Math.random() > 0.5 ? others[0] : null;
  }
  
  extractTopic(content) {
    // Simple topic extraction (would be more sophisticated in production)
    const keywords = ['typography', 'color', 'grid', 'simplicity', 'impact'];
    for (const keyword of keywords) {
      if (content.toLowerCase().includes(keyword)) {
        return keyword;
      }
    }
    return 'design';
  }
  
  async synthesizeRecommendations() {
    // Combine insights from all agents
    const recommendations = [];
    
    this.agents.forEach(agent => {
      const recs = agent.getRecommendations();
      recommendations.push(...recs);
    });
    
    // Remove duplicates and prioritize
    return [...new Set(recommendations)].slice(0, 5);
  }
}

/**
 * Individual Critic Agent
 */
class CriticAgent {
  constructor(profile) {
    Object.assign(this, profile);
    this.currentMood = 0.5; // Neutral
    this.memory = [];
  }
  
  async formInitialObservation(artwork) {
    // Analyze based on methodology
    const observation = {
      content: this.generateInitialStatement(artwork),
      confidence: Math.random() * 0.3 + 0.6,
      topics: this.identifyTopics(artwork)
    };
    
    this.memory.push(observation);
    return observation;
  }
  
  calculateReaction(statement) {
    // Determine if and how strongly to respond
    let shouldRespond = false;
    let intensity = 0;
    let type = 'neutral';
    
    // Check triggers
    this.biases.triggers.forEach(trigger => {
      if (statement.content.toLowerCase().includes(trigger)) {
        shouldRespond = true;
        intensity = Math.max(intensity, 0.9);
        type = 'disagreement';
      }
    });
    
    // Check loves
    this.biases.loves.forEach(love => {
      if (statement.content.toLowerCase().includes(love.replace('-', ' '))) {
        shouldRespond = true;
        intensity = Math.max(intensity, 0.7);
        type = 'agreement';
      }
    });
    
    // Check relationships
    if (this.relationships[statement.speaker.toLowerCase().replace(' ', '-')]) {
      const relationship = this.relationships[statement.speaker.toLowerCase().replace(' ', '-')];
      intensity *= (1 + relationship.tension);
    }
    
    return { shouldRespond, intensity, type };
  }
  
  async generateResponse(context) {
    const { responseType, intensity } = context;
    
    if (responseType === 'agreement') {
      if (intensity > 0.8) {
        return this.communicationStyle.agreement.strong;
      } else if (intensity > 0.5) {
        return this.communicationStyle.agreement.moderate;
      } else {
        return this.communicationStyle.agreement.reluctant;
      }
    } else if (responseType === 'disagreement') {
      if (intensity > 0.8) {
        return this.communicationStyle.disagreement.strong;
      } else if (intensity > 0.5) {
        return this.communicationStyle.disagreement.moderate;
      } else {
        return this.communicationStyle.disagreement.gentle;
      }
    }
    
    return this.communicationStyle.building;
  }
  
  getInterruption() {
    const interruptions = [
      "Wait, wait, wait...",
      "Hold on a second...",
      "I have to jump in here...",
      "No, that's not right..."
    ];
    
    return interruptions[Math.floor(Math.random() * interruptions.length)] + 
           " " + this.catchphrases[Math.floor(Math.random() * this.catchphrases.length)];
  }
  
  async makeArgument(topic, round) {
    // Generate position based on round
    if (round === 0) {
      return this.generateOpeningArgument(topic);
    } else if (round === 1) {
      return this.generateCounterArgument(topic);
    } else {
      return this.generateClosingArgument(topic);
    }
  }
  
  async interject(argument) {
    return this.communicationStyle.questioning;
  }
  
  async acknowledgeConsensus(point) {
    return `I think we can all agree that ${point.topic} is crucial here.`;
  }
  
  getRecommendations() {
    // Generate recommendations based on profile
    return this.expertise.primary.map(area => 
      `Focus on ${area.replace('-', ' ')}`
    );
  }
  
  // Helper methods
  generateInitialStatement(artwork) {
    return this.communicationStyle.greeting;
  }
  
  identifyTopics(artwork) {
    return this.expertise.primary.slice(0, 3);
  }
  
  generateOpeningArgument(topic) {
    return `From my perspective, ${topic} is fundamental because...`;
  }
  
  generateCounterArgument(topic) {
    return `But consider this angle on ${topic}...`;
  }
  
  generateClosingArgument(topic) {
    return `Ultimately, ${topic} comes down to...`;
  }
}

// Export for use in the main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConversationEngine, CriticAgent };
}