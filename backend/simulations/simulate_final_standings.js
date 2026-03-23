import prisma from '../src/config/db.js';
import scoringService from '../src/services/scoringService.js';

async function simulate() {
    console.log("🚀 STARTING ROBUST 150-PLAYER SIMULATION...");

    const teams = await prisma.team.findMany();
    if (teams.length === 0) {
        console.error("❌ No teams found.");
        return;
    }

    // 1. Prepare Environment
    console.log("🧹 Clearing existing data and setting phase to POST_AUCTION...");
    await prisma.top11Selection.deleteMany({});
    await prisma.teamPlayer.deleteMany({});
    await prisma.auctionState.updateMany({
        data: { phase: 'POST_AUCTION' }
    });

    // 2. Fetch all players and group by category
    const allPlayers = await prisma.player.findMany({
        orderBy: { rating: 'desc' }
    });
    
    let pool = {
        BAT: allPlayers.filter(p => p.category === 'BAT'),
        BOWL: allPlayers.filter(p => p.category === 'BOWL'),
        AR: allPlayers.filter(p => p.category === 'AR'),
        WK: allPlayers.filter(p => p.category === 'WK'),
    };

    console.log(`Initial Pool Stats: BAT:${pool.BAT.length}, BOWL:${pool.BOWL.length}, AR:${pool.AR.length}, WK:${pool.WK.length}`);

    // 3. Assign 15 players to each team
    for (const team of teams) {
        console.log(`\n📋 Processing Team: ${team.name}`);
        const squad = [];
        
        const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
        const fillCategory = async (cat, min) => {
            while (counts[cat] < min && pool[cat].length > 0) {
                const p = pool[cat].shift();
                await prisma.teamPlayer.create({
                    data: { team_id: team.id, player_id: p.id, price_paid: p.base_price }
                });
                await prisma.auctionPlayer.update({
                    where: { player_id: p.id },
                    data: { status: 'SOLD', sold_price: p.base_price, sold_to_team_id: team.id }
                });
                squad.push(p);
                counts[cat]++;
            }
        };

        // Priority Allocation
        await fillCategory('WK', 2);
        await fillCategory('BAT', 4);
        await fillCategory('BOWL', 4);
        await fillCategory('AR', 2);

        // Fill remaining to 15
        const cats = ['BOWL', 'AR', 'BAT', 'WK'];
        let cIdx = 0;
        while (squad.length < 15) {
            const cat = cats[cIdx % 4];
            if (pool[cat].length > 0) {
                const p = pool[cat].shift();
                await prisma.teamPlayer.create({
                    data: { team_id: team.id, player_id: p.id, price_paid: p.base_price }
                });
                await prisma.auctionPlayer.update({
                    where: { player_id: p.id },
                    data: { status: 'SOLD', sold_price: p.base_price, sold_to_team_id: team.id }
                });
                squad.push(p);
                counts[cat]++;
            }
            cIdx++;
            if (cIdx > 100) break;
        }

        // Update Team counts
        let totalSpent = 0;
        let overseas = 0;
        for (const p of squad) {
            totalSpent += Number(p.base_price);
            if (p.nationality === 'OVERSEAS') overseas++;
        }

        // Fetch franchise brand_score
        let brandScore = 0;
        if (team.brand_key) {
            const franchise = await prisma.franchise.findUnique({
                where: { short_name: team.brand_key }
            });
            if (franchise) brandScore = Number(franchise.brand_score);
        }

        await prisma.team.update({
            where: { id: team.id },
            data: {
                squad_count: squad.length,
                overseas_count: overseas,
                batsmen_count: counts.BAT,
                bowlers_count: counts.BOWL,
                ar_count: counts.AR,
                wk_count: counts.WK,
                purse_remaining: 120 - totalSpent,
                brand_score: brandScore
            }
        });

        console.log(`   ✅ Squad: ${squad.length} players. (BAT:${counts.BAT}, BOWL:${counts.BOWL}, AR:${counts.AR}, WK:${counts.WK})`);

        // 4. Select Top 11
        const top11 = [];
        const pickForTop11 = (cat, count) => {
            const available = squad
                .filter(p => p.category === cat && !top11.find(s => s.id === p.id))
                .sort((a,b) => b.rating - a.rating);
            
            let picked = 0;
            for (const p of available) {
                if (picked >= count) break;
                const currentOverseas = top11.filter(x => x.nationality === 'OVERSEAS').length;
                if (p.nationality !== 'OVERSEAS' || currentOverseas < 4) {
                    top11.push(p);
                    picked++;
                }
            }
        };

        pickForTop11('BAT', 4);
        pickForTop11('BOWL', 4);
        pickForTop11('AR', 2);
        pickForTop11('WK', 1);

        if (top11.length === 11) {
            const sorted = [...top11].sort((a,b) => b.rating - a.rating);
            try {
                await scoringService.submitTeamByRanks(team.id, top11.map(p => p.rank), sorted[0].rank, sorted[1].rank);
                console.log(`   🏆 Submitted Top 11`);
            } catch (err) {
                console.error(`   ❌ Submission failed: ${err.message}`);
            }
        } else {
            console.warn(`   ⚠️ Incomplete Top 11 (${top11.length}/11)`);
        }
    }

    console.log("\n📊 CALCULATING LEADERBOARD...\n");
    const leaderboard = await scoringService.calculateLeaderboard();
    if (leaderboard.length === 0) {
        console.log("No data.");
    } else {
        console.table(leaderboard.map(e => ({
            Rank: e.rank,
            Team: e.teamName,
            Score: e.score?.finalScore ? e.score.finalScore.toFixed(2) : "N/A",
            Base: e.score?.baseScore ? e.score.baseScore.toFixed(2) : "N/A"
        })));
    }

    await prisma.$disconnect();
}

simulate().catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
});
