import mongoose from "mongoose"

const PlayerSchema = new mongoose.Schema({
  // --- 1. IDENTITY & META DATA ---
  Rank: { type: Number },          // From your list
  Player: { type: String, required: true }, // Name
  Team: { type: String },          // Real-life IPL Franchise (e.g., "CSK", "MI") - Used for RTM logic
  Role: { type: String, enum: ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] },
  Category: { type: String },      // e.g., "Capped Indian", "Overseas"
  Pool: { type: String },          // Auction Set (e.g., "Set 1: Marquee")
  Grade: { type: String, enum: ['A', 'B', 'C', 'D'] },
  URL: { type: String },           // Player Image Link
  Legacy: { type: String },        // Special status? (e.g., "Icon", "Captain Material")

  // --- 2. RATINGS & ALGORITHM SCORES ---
  Rating: { type: Number, index: true }, // The MAIN rating (for winning)
  
  // Detailed Sub-Ratings (Your specific columns)
  Sub_Batting: { type: Number },
  Sub_Bowling: { type: Number },
  Sub_Versatility: { type: Number },
  
  // Batting Specific Metrics
  Sub_Scoring: { type: Number },     // Likely Runs volume score
  Sub_Impact: { type: Number },      // Likely Strike Rate score
  Sub_Consistency: { type: Number }, // Likely Average score
  
  // Bowling Specific Metrics
  Sub_WicketTaking: { type: Number },
  Sub_Economy: { type: Number },
  Sub_Efficiency: { type: Number },  // Likely Bowling Average score
  
  // General Metric
  Sub_Experience: { type: Number },

  // --- 3. RAW STATISTICS (For display on Auction Screen) ---
  Matches: { type: Number },
  
  Stats_Batting: {
    Bat_Runs: { type: Number },
    Bat_SR: { type: Number },
    Bat_Average: { type: Number }
  },
  
  Stats_Bowling: {
    Bowl_Wickets: { type: Number },
    Bowl_Eco: { type: Number },
    Bowl_Avg: { type: Number }
  },

  // --- 4. AUCTION OPERATIONAL FIELDS (Critical for the App) ---
  // These change during the event
  base_price: { type: Number, default: 0 }, // Auto-set based on Grade (A=2cr, etc.)
  status: { 
    type: String, 
    enum: ['UPCOMING', 'ON_AUCTION', 'SOLD', 'UNSOLD'], 
    default: 'UPCOMING' 
  },
  sold_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null }, // The User Team who won him
  sold_price: { type: Number, default: 0 },
  is_frozen: { type: Boolean, default: false } // If a team used "Bid Freezer" on him
});

const Player = mongoose.model("Player",playerSchema)
export default Player