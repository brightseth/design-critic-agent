/**
 * V2 Conversation API Endpoint
 * Generates multi-agent critique conversations
 */

import Anthropic from '@anthropic-ai/sdk';

// Load agent profiles
const agentProfiles = {
    'paula-scher': require('../v2-agents/paula-scher.json'),
    'massimo-vignelli': require('../v2-agents/massimo-vignelli.json'),
    'steve-jobs': require('../v2-agents/steve-jobs.json'),
    'ansel-adams': require('../v2-agents/ansel-adams.json'),
    'annie-leibovitz': require('../v2-agents/annie-leibovitz.json'),
    'henri-cartier-bresson': require('../v2-agents/henri-cartier-bresson.json'),
    'marina-abramovic': require('../v2-agents/marina-abramovic.json'),
    'andy-warhol': require('../v2-agents/andy-warhol.json'),
    'frida-kahlo': require('../v2-agents/frida-kahlo.json')
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { image, agentIds, mode } = req.body;
        
        if (!image || !agentIds || agentIds.length < 2) {
            return res.status(400).json({ error: 'Image and at least 2 agents required' });
        }
        
        // Get selected agents
        const agents = agentIds.map(id => agentProfiles[id]).filter(Boolean);
        
        if (agents.length < 2) {
            return res.status(400).json({ error: 'Invalid agent IDs' });
        }
        
        // Generate conversation using Claude
        const conversation = await generateAgentConversation(image, agents, mode);
        
        res.status(200).json({ conversation });
        
    } catch (error) {
        console.error('Conversation generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate conversation',
            details: error.message 
        });
    }
}

async function generateAgentConversation(imageBase64, agents, mode) {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Build agent context
    const agentContext = agents.map(agent => ({
        name: agent.name,
        philosophy: agent.background.philosophy,
        methodology: agent.critiqueMethodology,
        biases: agent.biases,
        catchphrases: agent.catchphrases,
        communicationStyle: agent.communicationStyle
    }));
    
    const systemPrompt = `You are simulating a dynamic conversation between these legendary critics:
${agentContext.map(a => `- ${a.name}: ${a.philosophy}`).join('\n')}

Generate a realistic, engaging conversation where each critic maintains their unique voice and perspective.
The conversation should have 4 phases:
1. Initial Observations - Each critic gives their first impression
2. Cross-Examination - Critics respond to each other's observations
3. Debate - Heated discussion on key disagreements
4. Consensus - Finding common ground and recommendations

Each critic should:
- Use their specific vocabulary and catchphrases
- Apply their unique methodology
- Show their biases and triggers
- Interact based on their relationships with other critics

Format as JSON array of message objects with: speaker, type, content, intensity (0-1), phase`;
    
    const userPrompt = `Generate a critique conversation between ${agents.map(a => a.name).join(', ')} 
about this ${mode} work. Make it feel authentic to each critic's personality.

Agent details:
${JSON.stringify(agentContext, null, 2)}`;
    
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 3000,
            temperature: 0.8,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/jpeg",
                            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                        }
                    },
                    {
                        type: "text",
                        text: userPrompt
                    }
                ]
            }],
            system: systemPrompt
        });
        
        // Parse the response
        const responseText = message.content[0].text;
        
        // Try to extract JSON from the response
        let conversation;
        try {
            // Look for JSON array in the response
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                conversation = JSON.parse(jsonMatch[0]);
            } else {
                // Fallback: create structured conversation from text
                conversation = parseTextToConversation(responseText, agents);
            }
        } catch (parseError) {
            // If JSON parsing fails, create a structured conversation
            conversation = createFallbackConversation(agents);
        }
        
        return conversation;
        
    } catch (error) {
        console.error('Claude API error:', error);
        // Return a fallback conversation
        return createFallbackConversation(agents);
    }
}

function parseTextToConversation(text, agents) {
    // Simple parser to extract conversation from text
    const lines = text.split('\n').filter(line => line.trim());
    const conversation = [];
    let currentPhase = 'initial';
    
    const phases = {
        'initial': ['first', 'initial', 'observation'],
        'cross': ['response', 'react', 'cross'],
        'debate': ['debate', 'argue', 'disagree'],
        'consensus': ['agree', 'consensus', 'conclusion']
    };
    
    lines.forEach(line => {
        // Check for phase changes
        Object.entries(phases).forEach(([phase, keywords]) => {
            if (keywords.some(kw => line.toLowerCase().includes(kw))) {
                currentPhase = phase;
            }
        });
        
        // Try to extract speaker and content
        agents.forEach(agent => {
            if (line.includes(agent.name)) {
                const content = line.split(':').slice(1).join(':').trim();
                if (content) {
                    conversation.push({
                        speaker: agent.name,
                        avatar: agent.avatar || agent.name.split(' ').map(n => n[0]).join(''),
                        type: currentPhase === 'debate' ? 'debate' : 
                              currentPhase === 'consensus' ? 'consensus' : 'observation',
                        content: content,
                        intensity: currentPhase === 'debate' ? 0.8 : 0.5,
                        phase: currentPhase
                    });
                }
            }
        });
    });
    
    return conversation.length > 0 ? conversation : createFallbackConversation(agents);
}

function createFallbackConversation(agents) {
    // Create a structured fallback conversation
    const conversation = [];
    
    // Phase 1: Initial observations
    agents.forEach(agent => {
        conversation.push({
            speaker: agent.name,
            avatar: agent.avatar || agent.name.split(' ').map(n => n[0]).join(''),
            type: 'initial',
            content: agent.communicationStyle.greeting || "Let me examine this work...",
            intensity: 0.3,
            phase: 'initial'
        });
    });
    
    // Phase 2: Cross-examination
    if (agents.length >= 2) {
        conversation.push({
            speaker: agents[0].name,
            avatar: agents[0].avatar || agents[0].name.split(' ').map(n => n[0]).join(''),
            type: 'response',
            content: agents[0].communicationStyle.questioning || "But what about the fundamental approach?",
            intensity: 0.6,
            phase: 'cross'
        });
        
        conversation.push({
            speaker: agents[1].name,
            avatar: agents[1].avatar || agents[1].name.split(' ').map(n => n[0]).join(''),
            type: 'response',
            content: agents[1].communicationStyle.disagreement?.moderate || "I see it differently...",
            intensity: 0.7,
            phase: 'cross'
        });
    }
    
    // Phase 3: Debate
    if (agents.length >= 2) {
        conversation.push({
            speaker: agents[0].name,
            avatar: agents[0].avatar || agents[0].name.split(' ').map(n => n[0]).join(''),
            type: 'debate',
            content: agents[0].catchphrases?.[0] || "This needs more work.",
            intensity: 0.8,
            phase: 'debate'
        });
        
        if (Math.random() > 0.5) {
            conversation.push({
                speaker: agents[1].name,
                avatar: agents[1].avatar || agents[1].name.split(' ').map(n => n[0]).join(''),
                type: 'interruption',
                content: "Wait, I have to interject here...",
                intensity: 0.9,
                phase: 'debate'
            });
        }
    }
    
    // Phase 4: Consensus
    conversation.push({
        speaker: agents[0].name,
        avatar: agents[0].avatar || agents[0].name.split(' ').map(n => n[0]).join(''),
        type: 'consensus',
        content: "We can agree that this work needs refinement in its core approach.",
        intensity: 0.4,
        phase: 'consensus'
    });
    
    return conversation;
}