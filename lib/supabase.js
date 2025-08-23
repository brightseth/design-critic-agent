// Supabase client configuration
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Using in-memory storage.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Storage helpers
class NinaStorage {
  constructor() {
    this.useSupabase = !!supabase;
    // Fallback to in-memory storage if Supabase not configured
    this.memoryStorage = {
      evaluations: [],
      feedback: [],
      collections: [],
      series: [],
      fingerprints: {},
      patterns: []
    };
  }

  // ARTIST MANAGEMENT
  async ensureArtist(artistId) {
    if (!this.useSupabase || !artistId) return null;
    
    try {
      // Check if artist exists
      const { data: existing } = await supabase
        .from('artists')
        .select('id')
        .eq('username', artistId)
        .single();
      
      if (existing) return existing.id;
      
      // Create new artist
      const { data: newArtist, error } = await supabase
        .from('artists')
        .insert({
          username: artistId,
          email: `${artistId}@nina.art`
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return newArtist.id;
    } catch (error) {
      console.error('Failed to ensure artist:', error);
      return null;
    }
  }

  // EVALUATIONS
  async saveEvaluation(evaluation, artistId = null) {
    if (!this.useSupabase) {
      evaluation.id = `eval_${Date.now()}`;
      evaluation.artist_id = artistId;
      this.memoryStorage.evaluations.push(evaluation);
      return evaluation;
    }

    try {
      // Ensure artist exists and get UUID
      const artistUuid = await this.ensureArtist(artistId);
      
      // First, upload image if present
      let imagePath = null;
      if (evaluation.imageData) {
        imagePath = await this.uploadImage(evaluation.imageData, artistId);
      }

      const { data, error } = await supabase
        .from('evaluations')
        .insert({
          artist_id: artistUuid,
          image_url: evaluation.imageUrl || imagePath || 'https://placeholder.nina.art',
          image_path: imagePath,
          weighted_total: evaluation.weighted_total,
          verdict: evaluation.verdict,
          i_see: evaluation.i_see,
          compositional_integrity: evaluation.gate?.compositional_integrity,
          artifact_control: evaluation.gate?.artifact_control,
          ethics_process: evaluation.gate?.ethics_process,
          scores_raw: evaluation.scores_raw,
          rationales: evaluation.rationales,
          flags: evaluation.flags,
          confidence: evaluation.confidence,
          nina_pick: evaluation.nina_pick,
          metadata: evaluation.metadata
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save evaluation:', error);
      // Fallback to memory storage
      return this.saveEvaluationToMemory(evaluation, artistId);
    }
  }

  async getEvaluations(artistId = null, limit = 20, offset = 0) {
    if (!this.useSupabase) {
      let evals = this.memoryStorage.evaluations;
      if (artistId) {
        evals = evals.filter(e => e.artist_id === artistId);
      }
      return evals.slice(offset, offset + limit);
    }

    try {
      // Get artist UUID if provided
      const artistUuid = artistId ? await this.ensureArtist(artistId) : null;
      
      let query = supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (artistUuid) {
        query = query.eq('artist_id', artistUuid);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get evaluations:', error);
      return [];
    }
  }

  // FEEDBACK
  async saveFeedback(evaluationId, feedback, artistId = null) {
    if (!this.useSupabase) {
      const feedbackRecord = {
        id: `feedback_${Date.now()}`,
        evaluation_id: evaluationId,
        artist_id: artistId,
        ...feedback,
        created_at: new Date().toISOString()
      };
      this.memoryStorage.feedback.push(feedbackRecord);
      return feedbackRecord;
    }

    try {
      // Get artist UUID if provided
      const artistUuid = artistId ? await this.ensureArtist(artistId) : null;
      
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          evaluation_id: evaluationId,
          artist_id: artistUuid,
          agree: feedback.agree,
          suggested_score: feedback.suggested_score,
          suggested_verdict: feedback.suggested_verdict,
          dimension_adjustments: feedback.dimension_adjustments,
          comments: feedback.comments,
          adjustments: feedback.adjustments,
          systematic_bias_detected: feedback.systematic_bias_detected
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save feedback:', error);
      return null;
    }
  }

  // COLLECTIONS
  async saveCollection(collection, artistId = null) {
    if (!this.useSupabase) {
      collection.id = `coll_${Date.now()}`;
      collection.artist_id = artistId;
      this.memoryStorage.collections.push(collection);
      return collection;
    }

    try {
      // Get artist UUID if provided
      const artistUuid = artistId ? await this.ensureArtist(artistId) : null;
      
      const { data, error } = await supabase
        .from('collections')
        .insert({
          artist_id: artistUuid,
          name: collection.name,
          theme: collection.theme,
          target_size: collection.target_size,
          avg_score: collection.statistics?.avg_score,
          coherence_score: collection.statistics?.coherence_score,
          dominant_themes: collection.statistics?.dominant_themes,
          curatorial_statement: collection.curatorial_statement,
          exhibition_ready: collection.exhibition_ready,
          exhibition_notes: collection.exhibition_notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save collection:', error);
      return null;
    }
  }

  async addToCollection(collectionId, evaluationId, role, tags) {
    if (!this.useSupabase) {
      // Handle in-memory collection update
      const collection = this.memoryStorage.collections.find(c => c.id === collectionId);
      if (collection) {
        if (!collection.images) collection.images = [];
        collection.images.push({ evaluation_id: evaluationId, role, tags });
      }
      return true;
    }

    try {
      const { data, error } = await supabase
        .from('collection_images')
        .insert({
          collection_id: collectionId,
          evaluation_id: evaluationId,
          role: role,
          thematic_tags: tags
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add to collection:', error);
      return null;
    }
  }

  async getCollections(artistId = null) {
    if (!this.useSupabase) {
      return artistId ? 
        this.memoryStorage.collections.filter(c => c.artist_id === artistId) :
        this.memoryStorage.collections;
    }

    try {
      // Get artist UUID if provided
      const artistUuid = artistId ? await this.ensureArtist(artistId) : null;
      
      let query = supabase
        .from('collections')
        .select(`
          *,
          collection_images (
            evaluation_id,
            role,
            thematic_tags,
            evaluations (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (artistUuid) {
        query = query.eq('artist_id', artistUuid);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get collections:', error);
      return [];
    }
  }

  // STYLE FINGERPRINT
  async saveFingerprint(fingerprint, artistId) {
    if (!this.useSupabase) {
      this.memoryStorage.fingerprints[artistId] = fingerprint;
      return fingerprint;
    }

    try {
      // Get artist UUID
      const artistUuid = await this.ensureArtist(artistId);
      if (!artistUuid) return null;
      
      const { data, error } = await supabase
        .from('style_fingerprints')
        .upsert({
          artist_id: artistUuid,
          total_samples: fingerprint.total_samples,
          characteristics: fingerprint.characteristics,
          scoring_tendencies: fingerprint.scoring_tendencies,
          avg_paris_photo: fingerprint.scoring_tendencies?.avg_scores?.paris_photo_ready,
          avg_ai_criticality: fingerprint.scoring_tendencies?.avg_scores?.ai_criticality,
          avg_conceptual: fingerprint.scoring_tendencies?.avg_scores?.conceptual_strength,
          avg_technical: fingerprint.scoring_tendencies?.avg_scores?.technical_excellence,
          avg_cultural: fingerprint.scoring_tendencies?.avg_scores?.cultural_dialogue,
          success_threshold: fingerprint.scoring_tendencies?.success_threshold,
          preferred_dimensions: fingerprint.scoring_tendencies?.preferred_dimensions
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save fingerprint:', error);
      return null;
    }
  }

  async getFingerprint(artistId) {
    if (!this.useSupabase) {
      return this.memoryStorage.fingerprints[artistId] || null;
    }

    try {
      // Get artist UUID
      const artistUuid = await this.ensureArtist(artistId);
      if (!artistUuid) return null;
      
      const { data, error } = await supabase
        .from('style_fingerprints')
        .select('*')
        .eq('artist_id', artistUuid)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data;
    } catch (error) {
      console.error('Failed to get fingerprint:', error);
      return null;
    }
  }

  // SUCCESS PATTERNS
  async saveSuccessPattern(pattern, artistId, evaluationId = null) {
    if (!this.useSupabase) {
      this.memoryStorage.patterns.push({ ...pattern, artist_id: artistId });
      return pattern;
    }

    try {
      // Get artist UUID if provided
      const artistUuid = artistId ? await this.ensureArtist(artistId) : null;
      
      const { data, error } = await supabase
        .from('success_patterns')
        .insert({
          artist_id: artistUuid,
          evaluation_id: evaluationId,
          score: pattern.score,
          key_factors: pattern.key_factors,
          visual_description: pattern.visual_description,
          high_scoring_dimensions: pattern.high_scoring_dimensions
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save success pattern:', error);
      return null;
    }
  }

  // IMAGE STORAGE
  async uploadImage(imageData, artistId) {
    if (!this.useSupabase) {
      // In memory mode, just return a data URL
      return `data:image/jpeg;base64,${imageData}`;
    }

    try {
      const fileName = `${artistId || 'anonymous'}/${Date.now()}.jpg`;
      
      // Convert base64 to blob
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const { data, error } = await supabase.storage
        .from('nina-images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('nina-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  }

  // LEARNING MEMORY
  async saveLearningMemory(memoryType, data) {
    if (!this.useSupabase) {
      // Store in memory
      return { memory_type: memoryType, data };
    }

    try {
      const { data: saved, error } = await supabase
        .from('learning_memory')
        .insert({
          memory_type: memoryType,
          data: data
        })
        .select()
        .single();

      if (error) throw error;
      return saved;
    } catch (error) {
      console.error('Failed to save learning memory:', error);
      return null;
    }
  }

  async getLearningMemory(memoryType = null, limit = 100) {
    if (!this.useSupabase) {
      return [];
    }

    try {
      let query = supabase
        .from('learning_memory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (memoryType) {
        query = query.eq('memory_type', memoryType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get learning memory:', error);
      return [];
    }
  }

  // Helper for memory storage fallback
  saveEvaluationToMemory(evaluation, artistId) {
    evaluation.id = `eval_${Date.now()}`;
    evaluation.artist_id = artistId;
    evaluation.created_at = new Date().toISOString();
    this.memoryStorage.evaluations.push(evaluation);
    return evaluation;
  }
}

module.exports = new NinaStorage();