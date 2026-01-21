import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  action: { 
    type: String, 
    enum: ['BID', 'SOLD', 'UNSOLD', 'MULLIGAN_REFUND', 'CARD_PURCHASE'] 
  },
  amount: { type: Number }, // Bid amount or Cost
  timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction",transactionSchema)
export default Transaction