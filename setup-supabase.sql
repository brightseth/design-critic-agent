-- Nina Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS artists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_path TEXT, -- Path in Supabase Storage
    
    -- Evaluation results
    weighted_total DECIMAL(3,2),
    verdict TEXT CHECK (verdict IN ('INCLUDE', 'MAYBE', 'EXCLUDE')),
    i_see TEXT,
    
    -- Gate checks
    compositional_integrity BOOLEAN,
    artifact_control BOOLEAN,
    ethics_process TEXT CHECK (ethics_process IN ('present', 'todo', 'missing')),
    
    -- Raw scores (JSON)
    scores_raw JSONB,
    rationales JSONB,
    flags TEXT[],
    
    -- Metadata
    confidence DECIMAL(3,2),
    nina_pick JSONB,
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    
    agree BOOLEAN,
    suggested_score INTEGER CHECK (suggested_score >= 0 AND suggested_score <= 100),
    suggested_verdict TEXT CHECK (suggested_verdict IN ('INCLUDE', 'MAYBE', 'EXCLUDE')),
    dimension_adjustments JSONB,
    comments TEXT,
    
    -- Learning results
    adjustments JSONB,
    systematic_bias_detected BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    theme TEXT,
    target_size INTEGER DEFAULT 20,
    
    -- Statistics
    avg_score DECIMAL(3,2),
    coherence_score DECIMAL(3,2),
    dominant_themes JSONB,
    
    -- Curatorial
    curatorial_statement TEXT,
    exhibition_ready BOOLEAN DEFAULT FALSE,
    exhibition_notes JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection images junction table
CREATE TABLE IF NOT EXISTS collection_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    
    position INTEGER, -- Display order
    role TEXT CHECK (role IN ('hero', 'anchor', 'supporting', 'contextual', 'consideration')),
    thematic_tags TEXT[],
    
    added_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(collection_id, evaluation_id)
);

-- Comparisons table (A/B testing)
CREATE TABLE IF NOT EXISTS comparisons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    
    variant_a_id UUID REFERENCES evaluations(id),
    variant_b_id UUID REFERENCES evaluations(id),
    
    test_criteria TEXT,
    winner_id UUID REFERENCES evaluations(id),
    results JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series table
CREATE TABLE IF NOT EXISTS series (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    
    -- Analysis results
    coherence_analysis JSONB,
    narrative_flow JSONB,
    exhibition_readiness JSONB,
    recommendations JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series images junction table
CREATE TABLE IF NOT EXISTS series_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    
    position INTEGER, -- Order in series
    
    UNIQUE(series_id, evaluation_id)
);

-- Style fingerprints table
CREATE TABLE IF NOT EXISTS style_fingerprints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE UNIQUE,
    
    total_samples INTEGER,
    characteristics JSONB,
    scoring_tendencies JSONB,
    
    -- Dimensional averages
    avg_paris_photo DECIMAL(3,1),
    avg_ai_criticality DECIMAL(3,1),
    avg_conceptual DECIMAL(3,1),
    avg_technical DECIMAL(3,1),
    avg_cultural DECIMAL(3,1),
    
    success_threshold DECIMAL(3,2),
    preferred_dimensions TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Success patterns table
CREATE TABLE IF NOT EXISTS success_patterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    evaluation_id UUID REFERENCES evaluations(id),
    
    score DECIMAL(3,2),
    key_factors JSONB,
    visual_description TEXT,
    high_scoring_dimensions JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt history table
CREATE TABLE IF NOT EXISTS prompt_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    
    prompt TEXT NOT NULL,
    analysis JSONB,
    suggestions JSONB,
    success_probability DECIMAL(3,2),
    
    -- If used for generation
    evaluation_id UUID REFERENCES evaluations(id),
    effectiveness_score DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning memory table (for Nina's adaptive learning)
CREATE TABLE IF NOT EXISTS learning_memory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    memory_type TEXT CHECK (memory_type IN ('feedback', 'pattern', 'bias', 'adjustment')),
    data JSONB NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_evaluations_artist ON evaluations(artist_id);
CREATE INDEX idx_evaluations_verdict ON evaluations(verdict);
CREATE INDEX idx_evaluations_created ON evaluations(created_at DESC);
CREATE INDEX idx_feedback_evaluation ON feedback(evaluation_id);
CREATE INDEX idx_collection_images_collection ON collection_images(collection_id);
CREATE INDEX idx_series_images_series ON series_images(series_id);

-- Row Level Security (RLS) - Enable after setting up auth
-- ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create policies (example for evaluations)
-- CREATE POLICY "Users can view own evaluations" ON evaluations
--     FOR SELECT USING (auth.uid() = artist_id);
-- CREATE POLICY "Users can insert own evaluations" ON evaluations
--     FOR INSERT WITH CHECK (auth.uid() = artist_id);
-- CREATE POLICY "Users can update own evaluations" ON evaluations
--     FOR UPDATE USING (auth.uid() = artist_id);

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_series_updated_at BEFORE UPDATE ON series
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_style_fingerprints_updated_at BEFORE UPDATE ON style_fingerprints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();