import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'auction.db');

// Create database connection with optimizations
const db = new Database(DB_PATH, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
    // Auctions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS auctions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day INTEGER NOT NULL CHECK(day IN (1, 2)),
      status TEXT NOT NULL DEFAULT 'idle' CHECK(status IN ('idle', 'active', 'paused', 'completed')),
      current_player_id INTEGER,
      current_player_rank INTEGER,
      current_bid_amount REAL DEFAULT 0,
      current_bidding_team_id INTEGER,
      auction_state TEXT NOT NULL DEFAULT 'idle' CHECK(auction_state IN ('idle', 'announcing', 'bidding', 'closed_bidding', 'sold', 'unsold')),
      timer_seconds INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

    // Teams table
    db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auction_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      franchise TEXT NOT NULL,
      budget_total REAL NOT NULL DEFAULT 100,
      budget_remaining REAL NOT NULL DEFAULT 100,
      budget_spent REAL NOT NULL DEFAULT 0,
      rtm_available INTEGER NOT NULL DEFAULT 1,
      rtm_used INTEGER NOT NULL DEFAULT 0,
      squad_count INTEGER NOT NULL DEFAULT 0,
      final_xi_locked INTEGER NOT NULL DEFAULT 0,
      captain_player_id INTEGER,
      vice_captain_player_id INTEGER,
      final_rating REAL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (auction_id) REFERENCES auctions(id)
    );
  `);

    // Players table
    db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rank INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      team TEXT NOT NULL,
      role TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Batsmen', 'Bowlers', 'All-rounders', 'Wicketkeepers')),
      pool TEXT NOT NULL CHECK(pool IN ('BAT_WK', 'BOWL', 'AR')),
      rating INTEGER NOT NULL CHECK(rating >= 40 AND rating <= 99),
      grade TEXT NOT NULL CHECK(grade IN ('A', 'B', 'C', 'D')),
      legacy INTEGER NOT NULL CHECK(legacy >= 0 AND legacy <= 10),
      profile_url TEXT,
      
      sub_experience INTEGER,
      
      sub_scoring INTEGER,
      sub_impact INTEGER,
      sub_consistency INTEGER,
      
      sub_wicket_taking INTEGER,
      sub_economy INTEGER,
      sub_efficiency INTEGER,
      
      sub_batting INTEGER,
      sub_bowling INTEGER,
      sub_versatility INTEGER,
      
      base_price REAL NOT NULL,
      is_riddle INTEGER NOT NULL DEFAULT 0,
      riddle_text TEXT,
      is_unsold INTEGER NOT NULL DEFAULT 0,
      reintroduced INTEGER NOT NULL DEFAULT 0,
      reduced_base_price REAL,
      
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_players_rank ON players(rank);
    CREATE INDEX IF NOT EXISTS idx_players_pool ON players(pool);
    CREATE INDEX IF NOT EXISTS idx_players_grade ON players(grade);
  `);

    // Squad Players table
    db.exec(`
    CREATE TABLE IF NOT EXISTS squad_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      player_rank INTEGER NOT NULL,
      purchase_price REAL NOT NULL,
      purchased_at TEXT NOT NULL DEFAULT (datetime('now')),
      is_final_xi INTEGER NOT NULL DEFAULT 0,
      is_captain INTEGER NOT NULL DEFAULT 0,
      is_vice_captain INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      UNIQUE(team_id, player_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_squad_team ON squad_players(team_id);
    CREATE INDEX IF NOT EXISTS idx_squad_player ON squad_players(player_id);
  `);

    // Bids table
    db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auction_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      player_rank INTEGER NOT NULL,
      team_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      bid_type TEXT NOT NULL CHECK(bid_type IN ('open', 'closed')),
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (auction_id) REFERENCES auctions(id),
      FOREIGN KEY (player_id) REFERENCES players(id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
    CREATE INDEX IF NOT EXISTS idx_bids_player ON bids(player_id);
    CREATE INDEX IF NOT EXISTS idx_bids_timestamp ON bids(timestamp DESC);
  `);

    // Power Cards table
    db.exec(`
    CREATE TABLE IF NOT EXISTS power_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id INTEGER NOT NULL,
      card_type TEXT NOT NULL CHECK(card_type IN ('final_strike', 'bid_freezer', 'gods_eye', 'mulligan')),
      card_name TEXT NOT NULL,
      price REAL NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      used INTEGER NOT NULL DEFAULT 0,
      used_at TEXT,
      used_on_player_id INTEGER,
      effect_data TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (team_id) REFERENCES teams(id),
      UNIQUE(team_id, card_type)
    );
    
    CREATE INDEX IF NOT EXISTS idx_power_cards_team ON power_cards(team_id);
  `);

    // Audit Logs table
    db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auction_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      user_role TEXT NOT NULL CHECK(user_role IN ('super_admin', 'auctioneer', 'admin_operator', 'team', 'viewer')),
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      data TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (auction_id) REFERENCES auctions(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_audit_auction ON audit_logs(auction_id);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
  `);

    // Undo Actions table
    db.exec(`
    CREATE TABLE IF NOT EXISTS undo_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auction_id INTEGER NOT NULL,
      action_type TEXT NOT NULL,
      reverse_action TEXT NOT NULL,
      data_snapshot TEXT NOT NULL,
      can_undo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (auction_id) REFERENCES auctions(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_undo_auction ON undo_actions(auction_id);
  `);

    console.log('✅ Database initialized successfully');
}

// Initialize on import
initializeDatabase();

export default db;
