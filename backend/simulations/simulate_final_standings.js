// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — End-to-End Scoring Simulation (API Version)
// ═══════════════════════════════════════════════════════════════

import prisma from '../src/config/db.js';

const API_URL = 'http://localhost:5000/api';

async function lockLineupViaApi(teamId, playerIds, captainId, viceCaptainId) {
    const res = await fetch(`${API_URL}/scoring/lock-lineup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, playerIds, captainId, viceCaptainId })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'API Error');
    }
    return res.json();
}

async function getLeaderboardViaApi() {
    const res = await fetch(`${API_URL}/scoring/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
}

async function runSimulation() {
    console.log('🚀 Starting Final Standings Simulation...');

    try {
        // Robust update for phase
        await prisma.auctionState.updateMany({ data: { phase: 'POST_AUCTION' } });
        
        const teams = await prisma.team.findMany();
        const players = await prisma.player.findMany();

        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        let batPool = shuffle(players.filter(p => p.category === 'BAT'));
        let bowlPool = shuffle(players.filter(p => p.category === 'BOWL'));
        let arPool = shuffle(players.filter(p => p.category === 'AR'));
        let wkPool = shuffle(players.filter(p => p.category === 'WK'));
        let overseasPool = shuffle(players.filter(p => p.nationality === 'OVERSEAS'));

        for (const team of teams) {
            const uniqueSquad = new Set();
            
            const getCounts = (set) => {
                const arr = Array.from(set);
                return {
                    BAT: arr.filter(p => p.category === 'BAT').length,
                    BOWL: arr.filter(p => p.category === 'BOWL').length,
                    AR: arr.filter(p => p.category === 'AR').length,
                    WK: arr.filter(p => p.category === 'WK').length,
                    OVERSEAS: arr.filter(p => p.nationality === 'OVERSEAS').length
                };
            };

            const tryAdd = (p) => {
                if (!p || uniqueSquad.has(p)) return false;
                const counts = getCounts(uniqueSquad);
                
                // Rules check
                if (p.nationality === 'OVERSEAS' && counts.OVERSEAS >= 5) return false;
                if (uniqueSquad.size >= 15) return false;
                
                uniqueSquad.add(p);
                // Remove from all category pools to ensure it's not picked again for another team
                batPool = batPool.filter(x => x.id !== p.id);
                bowlPool = bowlPool.filter(x => x.id !== p.id);
                arPool = arPool.filter(x => x.id !== p.id);
                wkPool = wkPool.filter(x => x.id !== p.id);
                overseasPool = overseasPool.filter(x => x.id !== p.id);
                return true;
            };

            // 1. Pick Minimums
            [...batPool].slice(0, 10).forEach(p => { if (getCounts(uniqueSquad).BAT < 3) tryAdd(p); });
            [...bowlPool].slice(0, 10).forEach(p => { if (getCounts(uniqueSquad).BOWL < 3) tryAdd(p); });
            [...arPool].slice(0, 10).forEach(p => { if (getCounts(uniqueSquad).AR < 2) tryAdd(p); });
            [...wkPool].slice(0, 10).forEach(p => { if (getCounts(uniqueSquad).WK < 2) tryAdd(p); });
            
            // 2. Ensure min 2 overseas
            [...overseasPool].slice(0, 20).forEach(p => { if (getCounts(uniqueSquad).OVERSEAS < 2) tryAdd(p); });

            // 3. Fill the rest randomly
            let generalPool = shuffle([...batPool, ...bowlPool, ...arPool, ...wkPool]);
            for (const p of generalPool) {
                if (uniqueSquad.size >= 15) break;
                tryAdd(p);
            }

            const squad = Array.from(uniqueSquad);

            await prisma.teamPlayer.deleteMany({ where: { team_id: team.id } });
            await prisma.top11Selection.deleteMany({ where: { team_id: team.id } });

            // Set random brand score and purse (approx 105-115 spent)
            const spent = 100 + Math.random() * 15;
            await prisma.team.update({
                where: { id: team.id },
                data: {
                    brand_score: 40 + Math.random() * 60,
                    purse_remaining: 120 - spent
                }
            });

            for (const p of squad) {
                await prisma.teamPlayer.create({
                    data: { team_id: team.id, player_id: p.id, price_paid: spent / 15 }
                });
            }

            // Pick 11 from the 15 for Top 11 randomly
            const shuffledSquad = shuffle([...squad]);
            const top11Ids = shuffledSquad.slice(0, 11).map(p => p.id);
            const captainId = top11Ids[0];
            const viceCaptainId = top11Ids[1];

            await lockLineupViaApi(team.id, top11Ids, captainId, viceCaptainId);
            console.log(`✅ Locked valid lineup for ${team.name}`);
        }

        const leaderboard = await getLeaderboardViaApi();
        console.log('\n🏆 LEADERBOARD RESULTS');
        leaderboard.forEach(entry => {
            console.log(`${entry.rank}. ${entry.teamName} | Total Score: ${entry.score.finalScore}`);
            if (entry.status === 'ACTIVE') {
                 console.log(`   Detailed Calculation:`);
                 console.log(`   - Base Score (Σ rating^1.15 * weight): ${entry.score.baseScore}`);
                 console.log(`   - Captain Bonus (rating^1.15): ${entry.score.captainBonus}`);
                 console.log(`   - Vice Captain Bonus (0.5 * rating^1.15): ${entry.score.vcBonus}`);
                 console.log(`   - Squad Balance Bonus (30 - Penalty*4): ${entry.score.balanceBonus}`);
                 console.log(`   - Efficiency Bonus (15 - |Spent-110|*0.3): ${entry.score.efficiencyBonus}`);
                 console.log(`   - Brand Bonus (NormalizedBrand * 5): ${entry.score.brandBonus}`);
            }
            if (entry.status === 'ELIMINATED') {
                console.log(`   ❌ Errors: ${entry.errors.join('; ')}`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

runSimulation();
