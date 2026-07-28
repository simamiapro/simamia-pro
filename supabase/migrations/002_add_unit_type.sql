-- ------------------------------------------------------------
-- Simamia Pro — Migration 002: Add unit_type and remove property_type strictness
-- ------------------------------------------------------------

-- Add unit_type to units table
ALTER TABLE public.units 
ADD COLUMN IF NOT EXISTS unit_type TEXT NOT NULL DEFAULT 'apartment';

-- We can leave property_type in properties table as optional/legacy
-- but let's change the default to 'mixed' to represent a Project/Compound
ALTER TABLE public.properties
ALTER COLUMN property_type SET DEFAULT 'mixed';
