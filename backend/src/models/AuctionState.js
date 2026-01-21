import mongoose from "mongoose"

const auctionStateSchema = new mongoose.Schema({
  is_live: { type: Boolean, default: false },
  round: { type: Number, default: 1 }, // 1=Regular, 2=Accelerated
  
  // The Player currently on the screen
  current_player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  
  // Bidding State
  current_bid: { type: Number, default: 0 },
  current_winning_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  
  // Timer State
  timer_start_time: { type: Date },
  timer_duration: { type: Number, default: 30 }, // seconds
  
  // Special Mode Triggers
  is_sealed_bid_active: { type: Boolean, default: false }, // If bid > 17cr
  last_activity_timestamp: { type: Date, default: Date.now } // For syncing
});


const AuctionState = mongoose.model("AuctionState",auctionStateSchema)
export default AuctionState