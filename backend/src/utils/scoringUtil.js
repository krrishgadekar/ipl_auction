/**
 * Scoring (DO NOT STORE SCORES)
 * Scores are computed post-auction in a pure function.
 */
function calculateTop11Score(playerIds, playerMap, captainId, viceCaptainId) {
    let totalScore = 0;

    playerIds.forEach(playerId => {
        const player = playerMap[playerId];
        if (!player) return;

        let multiplier = 1;
        if (playerId === captainId) multiplier = 2;
        else if (playerId === viceCaptainId) multiplier = 1.5;

        totalScore += player.rating * multiplier;
    });

    return totalScore;
}

export default {
    calculateTop11Score
};
