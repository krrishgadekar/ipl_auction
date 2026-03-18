-- =========================================================================
-- IPL Auction 2026 - Database Schema Definition
-- =========================================================================

-- 1. Enums
DO $$ BEGIN
    CREATE TYPE player_role AS ENUM ('BAT', 'BOWL', 'AR', 'WK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auction_phase AS ENUM (
        'FRANCHISE_BIDDING', 
        'POWERCARD_BIDDING', 
        'PLAYER_AUCTION', 
        'AUCTION_ENDED', 
        'FINAL_XI_SELECTION', 
        'RESULTS_PUBLISHED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE queue_status AS ENUM ('WAITING', 'CURRENT', 'SOLD', 'UNSOLD', 'RELEASED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE purchase_type AS ENUM ('NORMAL_AUCTION', 'RTM', 'FINAL_STRIKE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE powercard_type AS ENUM ('GodsEye', 'Mulligan', 'FinalStrike', 'BidFreezer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM (
        'FRANCHISE_PURCHASE', 
        'POWERCARD_PURCHASE', 
        'PLAYER_PURCHASE', 
        'RTM_USAGE', 
        'FINAL_STRIKE_USAGE', 
        'MULLIGAN_REFUND',
        'ADMIN_CORRECTION',
        'PLAYER_PURCHASE_REFUND'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 2. Franchise Table
CREATE TABLE IF NOT EXISTS franchises (
    franchise_id SERIAL PRIMARY KEY,
    franchise_name VARCHAR(255) UNIQUE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    bonus_points INTEGER NOT NULL DEFAULT 0
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    purse_balance DECIMAL(10, 2) NOT NULL DEFAULT 120.00,
    franchise_id INTEGER REFERENCES franchises(franchise_id) ON DELETE SET NULL,
    rtm_available BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purse_balance_check CHECK (purse_balance >= 0)
);

-- 4. Players Table
CREATE TABLE IF NOT EXISTS players (
    player_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role player_role NOT NULL,
    grade VARCHAR(10),
    base_price DECIMAL(10, 2) NOT NULL,
    overall_points INTEGER NOT NULL DEFAULT 0,
    sub_overall_points INTEGER NOT NULL DEFAULT 0,
    foreign_status BOOLEAN NOT NULL DEFAULT FALSE,
    is_riddle_player BOOLEAN NOT NULL DEFAULT FALSE,
    riddle_clue TEXT,
    franchise_id INTEGER REFERENCES franchises(franchise_id) ON DELETE SET NULL
);

-- 5. Powercards Catalog
CREATE TABLE IF NOT EXISTS powercards (
    powercard_id SERIAL PRIMARY KEY,
    name powercard_type UNIQUE NOT NULL,
    description TEXT
);

-- Initialize the 4 powercards if they don't exist
INSERT INTO powercards (name, description)
VALUES 
    ('GodsEye', 'Allows seeing the next 3 players in queue'),
    ('Mulligan', 'Allows returning a bought player for a full refund'),
    ('FinalStrike', 'Allows buying a player instantly at a high price'),
    ('BidFreezer', 'Freezes another team from bidding for a player')
ON CONFLICT (name) DO NOTHING;

-- 6. Team Powercards
CREATE TABLE IF NOT EXISTS team_powercards (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    powercard_type powercard_type NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE
);

-- 7. Player Queue
CREATE TABLE IF NOT EXISTS player_queue (
    queue_id SERIAL PRIMARY KEY,
    queue_position INTEGER NOT NULL UNIQUE,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    status queue_status NOT NULL DEFAULT 'WAITING',
    appearance_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Squads
CREATE TABLE IF NOT EXISTS squads (
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    purchase_price DECIMAL(10, 2) NOT NULL,
    purchase_type purchase_type NOT NULL DEFAULT 'NORMAL_AUCTION',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, player_id)
);

-- 9. Purse Transactions (Append-Only)
CREATE TABLE IF NOT EXISTS purse_transactions (
    transaction_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Auction State (Singleton)
CREATE TABLE IF NOT EXISTS auction_state (
    auction_id INTEGER PRIMARY KEY CHECK (auction_id = 1), -- Ensure only one row
    current_state auction_phase NOT NULL DEFAULT 'FRANCHISE_BIDDING',
    current_player_id INTEGER REFERENCES players(player_id) ON DELETE SET NULL,
    frozen_team_id INTEGER REFERENCES teams(team_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initialize the singleton row if not exists
INSERT INTO auction_state (auction_id, current_state) 
VALUES (1, 'FRANCHISE_BIDDING') 
ON CONFLICT (auction_id) DO NOTHING;

-- 11. Card Usage Log
CREATE TABLE IF NOT EXISTS card_usage_log (
    usage_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    powercard_type powercard_type NOT NULL,
    target_team_id INTEGER REFERENCES teams(team_id) ON DELETE SET NULL,
    target_player_id INTEGER REFERENCES players(player_id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. RTM Usage
CREATE TABLE IF NOT EXISTS rtm_usage (
    rtm_id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    price_matched DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Final XI
CREATE TABLE IF NOT EXISTS final_xi (
    team_id INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
    is_captain BOOLEAN NOT NULL DEFAULT FALSE,
    is_vice_captain BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (team_id, player_id)
);

-- 14. Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
    team_id INTEGER PRIMARY KEY REFERENCES teams(team_id) ON DELETE CASCADE,
    total_points DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    rank INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Audit Log (Admins)
CREATE TABLE IF NOT EXISTS audit_log (
    log_id SERIAL PRIMARY KEY,
    admin_action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_franchise ON teams(franchise_id);
CREATE INDEX IF NOT EXISTS idx_squads_team_id ON squads(team_id);
CREATE INDEX IF NOT EXISTS idx_squads_player_id ON squads(player_id);
CREATE INDEX IF NOT EXISTS idx_transactions_team ON purse_transactions(team_id);
CREATE INDEX IF NOT EXISTS idx_queue_status ON player_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_position ON player_queue(queue_position);
