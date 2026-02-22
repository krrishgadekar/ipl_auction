import prisma from '../src/config/db.js';
import auctionService from '../src/services/auctionService.js';
const { sellPlayer } = auctionService;

describe('Transaction Stress Test', () => {
    let testPlayer, testTeams;

    beforeEach(async () => {
        // Setup initial state
        await prisma.teamPlayer.deleteMany();
        await prisma.auctionPlayer.updateMany({ data: { status: 'UNSOLD', soldPrice: null, soldToTeamId: null } });
        await prisma.auctionState.update({ where: { id: 1 }, data: { auction_status: 'LIVE', current_player_id: null } });

        testPlayer = await prisma.player.findFirst({ where: { name: 'Virat Kohli' } });
        testTeams = await prisma.team.findMany({ take: 3 });

        // Ensure player is assigned to current auction
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { current_player_id: testPlayer.id }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('Concurrent sales: Only one team should succeed', async () => {
        const bids = testTeams.map(team =>
            sellPlayer(testPlayer.id, team.id, 20000000).catch(err => err)
        );

        const results = await Promise.all(bids);

        const successes = results.filter(r => r.success === true);
        const failures = results.filter(r => r instanceof Error);

        // One should succeed, others should fail (because player becomes SOLD)
        expect(successes.length).toBe(1);
        expect(failures.length).toBe(testTeams.length - 1);

        const soldCheck = await prisma.auctionPlayer.findFirst({
            where: { playerId: testPlayer.id }
        });
        expect(soldCheck.status).toBe('SOLD');
    });
});
