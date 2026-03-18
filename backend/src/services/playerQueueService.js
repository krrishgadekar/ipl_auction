import QueueModel from '../models/QueueModel.js';

class PlayerQueueService {
    
    constructor() {
        this.MASKED_FIELDS = ['name', 'role', 'grade', 'overall_points', 'sub_overall_points', 'foreign_status'];
    }

    /**
     * Helper to mask a player if they are a newly appearing Riddle player.
     * @param {Object} player The raw player record joined from DB
     * @returns {Object} Masked or Unmasked player
     */
    maskPlayerIfRiddle(player) {
        if (!player) return null;

        const isRiddle = player.is_riddle_player === true;
        const isFirstAppearance = Number(player.appearance_count) === 1;

        if (isRiddle && isFirstAppearance) {
            // Clone to avoid mutating original obj deeply
            const maskedPlayer = { ...player };
            
            this.MASKED_FIELDS.forEach(field => {
                delete maskedPlayer[field];
            });

            // We explicitly keep: player_id, base_price, riddle_clue, queue_id, status, is_riddle_player
            maskedPlayer.is_masked = true;
            return maskedPlayer;
        }

        return player;
    }

    /**
     * Emits a SOCKET event fully unmasking a player if they were previously hidden.
     * Called when a player is successfully sold.
     */
    emitRiddleRevealIfApplicable(ioEmitter, player, SOCKET_EVENTS) {
        const isRiddle = player.is_riddle_player === true;
        const isFirstAppearance = Number(player.appearance_count) === 1;

        if (isRiddle && isFirstAppearance) {
            // Full player payload 
            ioEmitter.emit(SOCKET_EVENTS.RIDDLE_REVEALED, player);
        }
    }
}

export default new PlayerQueueService();
