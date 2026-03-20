export interface PowerCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rules: string[];
}

export const AUCTIONABLE_POWER_CARDS: PowerCard[] = [
  {
    id: 'gods_eye',
    name: "God's Eye",
    description:
      'Reveals the highest bid amount in a closed bidding round, giving you a strategic edge.',
    icon: '👁️',
    color: '#d4af37',
    rules: [
      'Can be used to know the highest amount submitted in a closed bidding round (>17 CR).',
      'Only 1 God\'s Eye card is available per auction slot.',
      'Can be used only once throughout the entire auction.',
    ],
  },
  {
    id: 'mulligan',
    name: 'Mulligan Card',
    description:
      'Put any previously bought player back into the auction and reclaim the full amount you paid.',
    icon: '🔄',
    color: '#2bb5cc',
    rules: [
      'At any point in the auction, you can return a player you bought and get a full refund.',
      'The returned player becomes unsold and re-enters the auction for other teams to bid.',
      'Only 1 Mulligan Card is available per auction slot.',
    ],
  },
  {
    id: 'final_strike',
    name: 'Final Strike',
    description:
      'Match the winning bid after the hammer falls to steal the player away from the highest bidder.',
    icon: '⚡',
    color: '#e74c5e',
    rules: [
      'After the hammer falls and a player is about to be sold, you can match the final bid to claim the player instead.',
      'Adds an element of suspense — no deal is sealed until the card window closes.',
      'Each team can use this card only once per auction, so play it wisely.',
    ],
  },
  {
    id: 'bid_freezer',
    name: 'Bid Freezer',
    description:
      'Freeze one rival team out of bidding for a specific player, eliminating direct competition.',
    icon: '🧊',
    color: '#7c3aed',
    rules: [
      'Declare before bidding starts for a player — the targeted team cannot place any bids on that player.',
      'Eliminates direct competition, increasing your chances of a lower purchase price.',
      'The restriction must be declared before the bidding for that player begins.',
      'Once used, the restricted team cannot bid on the selected player throughout the auction.',
    ],
  },
  {
    id: 'silent_heist',
    name: 'Silent Heist',
    description:
      'Know the blind-bid player beforehand. Submit a price range — if correct, secure them at a flat ₹10 CR.',
    icon: '🎭',
    color: '#f59e0b',
    rules: [
      'You will know the blind-bid (riddle) player\'s identity beforehand.',
      'Submit a price range (e.g. 13–15 CR) for that player before the auction begins.',
      'If the player sells within your predicted range, you get them at a flat ₹10 CR.',
      'If your guess is wrong, the player goes to the highest bidder as normal. You can still bid.',
    ],
  },
];
