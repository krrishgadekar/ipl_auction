const BASE = 'http://localhost:5000/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

async function runTest() {
    console.log('🚀 Starting Full Auction E2E Simulation...');

    try {
        // 1. Login
        console.log('--- Logging in as Admin ---');
        const loginRes = await fetch(`${BASE}/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS })
        });
        const loginData = await loginRes.json();
        if (!loginData.sessionId) throw new Error('Login failed: ' + JSON.stringify(loginData));
        const token = loginData.sessionId;
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log('✅ Login successful');

        // 2. Build Player Map (Rank -> ID)
        console.log('--- Fetching Players ---');
        const playersRes = await fetch(`${BASE}/players`);
        const players = await playersRes.json();
        const playerMap = {};
        players.forEach(p => { playerMap[p.rank] = p.id; });
        console.log(`✅ Mapped ${players.length} players`);

        // 3. Fetch Teams
        console.log('--- Fetching Teams ---');
        const teamsRes = await fetch(`${BASE}/teams`);
        const teams = await teamsRes.json();
        const teamIds = teams.map(t => t.id);
        console.log(`✅ Found ${teams.length} teams`);

        // 4. Franchise Phase
        console.log('\n--- PHASE: FRANCHISE_PHASE ---');
        await fetch(`${BASE}/admin/auction/phase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ phase: 'FRANCHISE_PHASE' })
        });

        // Advance and assign
        let nextItemRes = await fetch(`${BASE}/admin/auction/next-item`, { method: 'POST', headers });
        let nextItem = await nextItemRes.json();
        console.log(`Current: ${nextItem.item} (${nextItem.type})`);

        let assignRes = await fetch(`${BASE}/admin/auction/assign-franchise`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ teamId: teamIds[0], franchiseId: parseInt(nextItem.item), price: 5.5 })
        });
        console.log('✅ Assigned franchise to Team 0');

        // EDGE CASE: Double Franchise
        console.log('--- EDGE CASE: Double Franchise ---');
        nextItemRes = await fetch(`${BASE}/admin/auction/next-item`, { method: 'POST', headers });
        nextItem = await nextItemRes.json();
        assignRes = await fetch(`${BASE}/admin/auction/assign-franchise`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ teamId: teamIds[0], franchiseId: parseInt(nextItem.item), price: 5.0 })
        });
        if (assignRes.status !== 200) {
            console.log('✅ Correctly rejected second franchise');
        } else {
            console.error('❌ BUG: Second franchise accepted');
        }

        // 5. Power Card Phase
        console.log('\n--- PHASE: POWER_CARD_PHASE ---');
        await fetch(`${BASE}/admin/auction/phase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ phase: 'POWER_CARD_PHASE' })
        });

        nextItemRes = await fetch(`${BASE}/admin/auction/next-item`, { method: 'POST', headers });
        nextItem = await nextItemRes.json();
        await fetch(`${BASE}/admin/auction/assign-powercard`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ teamId: teamIds[1], cardType: nextItem.item, price: 1.0 })
        });
        console.log('✅ Assigned power card to Team 1');

        // 6. Live Phase
        console.log('\n--- PHASE: LIVE ---');
        await fetch(`${BASE}/admin/auction/phase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ phase: 'LIVE' })
        });

        for (let i = 0; i < 15; i++) {
            nextItemRes = await fetch(`${BASE}/admin/auction/next-item`, { method: 'POST', headers });
            nextItem = await nextItemRes.json();
            if (nextItem.finished) break;

            const p = nextItem.item;
            const targetTeam = (i < 12) ? teamIds[1] : teamIds[0]; 
            const sellRes = await fetch(`${BASE}/admin/auction/sell`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ playerId: p.id, teamId: targetTeam, pricePaid: p.base_price + 1 })
            });
            const data = await sellRes.json();
            if (sellRes.status === 200) {
                console.log(`   Sold ${p.name} to Team ${targetTeam === teamIds[0] ? '0' : '1'}`);
            } else {
                console.error(`   ❌ Failed to sell ${p.name}: ${data.error}`);
            }
        }

        // TEST: Squad override (Team 1 should have ~12 players, let's add 5 more to exceed 15)
        console.log('\n--- TEST: Squad Size Override (>15) ---');
        for (let i = 0; i < 5; i++) {
            nextItemRes = await fetch(`${BASE}/admin/auction/next-item`, { method: 'POST', headers });
            nextItem = await nextItemRes.json();
            if (nextItem.finished) break;
            const p = nextItem.item;
            const sellRes = await fetch(`${BASE}/admin/auction/sell`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ playerId: p.id, teamId: teamIds[1], pricePaid: 1.0, isAdminOverride: true })
            });
            const data = await sellRes.json();
            if (sellRes.status === 200) {
                console.log(`   ✅ Correctly overrode limit for ${p.name}`);
            } else {
                console.error(`   ❌ Failed override: ${data.error}`);
            }
        }

        // 7. Post Auction & Scoring
        console.log('\n--- PHASE: POST_AUCTION ---');
        await fetch(`${BASE}/admin/auction/phase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ phase: 'POST_AUCTION' })
        });

        // Use public /api/teams to get squad (as ranks)
        const teamsFinalRes = await fetch(`${BASE}/teams`);
        const teamsFinal = await teamsFinalRes.json();
        const team1 = teamsFinal.find(t => t.id === teamIds[1]);
        
        const pRanks = team1.players; // Array of ranks from serializer
        const pIds = pRanks.map(rank => playerMap[rank]).filter(Boolean);
        console.log(`Team 1 has ${pIds.length} players. Locking lineup...`);

        if (pIds.length >= 11) {
            const lockRes = await fetch(`${BASE}/scoring/lock-lineup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: teamIds[1],
                    playerIds: pIds.slice(0, 11),
                    captainId: pIds[0],
                    viceCaptainId: pIds[1]
                })
            });
            const lockData = await lockRes.json();
            if (lockRes.status === 200) {
                console.log('✅ Lineup locked for Team 1');
            } else {
                console.error('❌ Lineup lock failed: ' + lockData.error);
            }
        }

        // Leaderboard
        console.log('\n--- LEADERBOARD ---');
        const lbRes = await fetch(`${BASE}/scoring/leaderboard`);
        const lb = await lbRes.json();
        lb.sort((a,b) => a.rank - b.rank).forEach(row => {
            console.log(`Rank ${row.rank}: ${row.teamName} - Score: ${row.score.finalScore} (${row.status})`);
        });

        console.log('\n✅ SIMULATION COMPLETE');

    } catch (err) {
        console.error('💥 Test Failed:', err);
    }
}

runTest();
