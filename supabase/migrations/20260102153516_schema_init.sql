-- Drop tables if they exist (to allow re-running migration cleanly)
DROP TABLE IF EXISTS entity_media_types CASCADE;
DROP TABLE IF EXISTS entity_categories CASCADE;
DROP TABLE IF EXISTS entities CASCADE;
DROP TABLE IF EXISTS wilayas CASCADE;
DROP TABLE IF EXISTS media_types CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS entity_types CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Entity Types
-- -----------------------------------------------------------------------------
-- e.g. 'startup', 'incubator', 'accelerator', 'media', 'event'...
CREATE TABLE entity_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. Generic Categories (Sectors / Tags)
-- -----------------------------------------------------------------------------
-- Stores generic classifications, primarily 'Startup Sectors' (Fintech, AI, etc.)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,      
    name TEXT NOT NULL,             
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. Media Types (Specific to Media)
-- -----------------------------------------------------------------------------
-- e.g. Podcast, Video, Newsletter.
CREATE TABLE media_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon_url TEXT,
    icon_emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 4. Wilayas (Locations)
-- -----------------------------------------------------------------------------
-- The 58 Wilayas of Algeria.
CREATE TABLE wilayas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code INTEGER UNIQUE,            -- e.g. 16 for Algiers, 31 for Oran
    name TEXT NOT NULL,             -- e.g. 'Algiers'
    slug TEXT UNIQUE NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. Entities (Master Table)
-- -----------------------------------------------------------------------------
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    
    -- Relationship to Entity Types
    type_id UUID NOT NULL REFERENCES entity_types(id) ON DELETE CASCADE,

    -- Relationship to Wilayas (Direct Single Link)
    -- This Entity belongs to ONE location (HQ or physical branch)
    wilaya_id UUID REFERENCES wilayas(id) ON DELETE SET NULL,

    -- Core Info
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    
    -- Nullable / Type-Specific Info
    linkedin TEXT,           
    founded_year INTEGER,    
    map_location TEXT,       
    image_url TEXT,          
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 6. Relationships (Many-to-Many)
-- -----------------------------------------------------------------------------

-- A. Entity <-> Categories (Startups Sectors, etc.)
CREATE TABLE entity_categories (
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (entity_id, category_id)
);

-- B. Entity <-> Media Types
CREATE TABLE entity_media_types (
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    media_type_id UUID REFERENCES media_types(id) ON DELETE CASCADE,
    PRIMARY KEY (entity_id, media_type_id)
);

-- Indexes
CREATE INDEX idx_entities_type_id ON entities(type_id);
CREATE INDEX idx_entities_wilaya_id ON entities(wilaya_id);
CREATE INDEX idx_entity_categories_category_id ON entity_categories(category_id);
CREATE INDEX idx_entity_media_types_media_type_id ON entity_media_types(media_type_id);
