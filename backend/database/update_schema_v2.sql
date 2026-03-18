-- Add new columns to players table to support the custom rated dataset
ALTER TABLE players ADD COLUMN IF NOT EXISTS original_team_name VARCHAR(255);
ALTER TABLE players ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
ALTER TABLE players ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}';

-- Optional: Rename overall_points to overall_rating if you prefer, 
-- but we can just use overall_points to store the 'Rating' from CSV.
ALTER TABLE players ALTER COLUMN overall_points TYPE DECIMAL(10, 2);
