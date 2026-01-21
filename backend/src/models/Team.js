import mongoose from "mongoose"

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo_url: { type: String },
  login_code: { type: String, select: false }, // Simple auth for teams
  
  // Economy
  initial_budget: { type: Number, default: 100 },
  current_budget: { type: Number, default: 100 },
  
  // Inventory (Power Cards) - Embedded Object
  power_cards: {
    gods_eye: { type: Number, default: 0 },
    mulligan: { type: Number, default: 0 },
    final_strike: { type: Number, default: 0 },
    bid_freezer: { type: Number, default: 0 }
  },

  // Roster - Referencing Players
  squad: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  
  // Final composition (For scoring)
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  vice_captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  
  // Scoring
  total_rating_points: { type: Number, default: 0 }
});

const Team = mongoose.model("Team",teamSchema)
export default Team