import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api/admin/auction/sell';

async function simulate() {
    const teams = await prisma.team.findMany();
    if (teams.length === 0) return console.log('No teams found.');
    
    // We want 10 teams exactly for the mapping.
    const teamSelection = teams.slice(0, 10);
    
    // Get the sequence of players from DB
    const sequence = await prisma.auctionSequence.findUnique({
        where: { id: 3 } // ID 3 is the Main Player Sequence according to seed.js
    });
    
    if (!sequence || !sequence.sequence_items) {
        return console.log('Player sequence not found in DB.');
    }
    
    const allRanks = sequence.sequence_items;
    const targetRanks = allRanks.slice(0, 20).map(r => parseInt(r));
    
    // Uneven distribution pattern: 4, 3, 3, 2, 2, 2, 1, 1, 1, 1 = 20 total
    const distribution = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    
    let playerIndex = 0;
    
    for (let i = 0; i < distribution.length; i++) {
        const team = teamSelection[i];
        const numPlayers = distribution[i];
        
        for (let j = 0; j < numPlayers; j++) {
            const playerRank = targetRanks[playerIndex++];
            const player = await prisma.player.findUnique({ where: { rank: playerRank } });
            
            if (!player) {
                console.log(`Player with rank ${playerRank} not found.`);
                continue;
            }

            console.log(`Simulating API sale of ${player.name} (Rank: ${playerRank}) to ${team.name}...`);

            // Set auction state to LIVE and set current player
            await prisma.auctionState.update({
                where: { id: 1 },
                data: { phase: 'LIVE', current_player_id: player.id }
            });

            // Random price between (base price) and (base price + 5)
            const pricePaid = Number(player.base_price) + Math.floor(Math.random() * 5 * 4) / 4;
            
            const body = {
                playerId: player.id,
                teamId: team.id,
                pricePaid: pricePaid
            };

            const token = Buffer.from('admin:your_admin_password_here').toString('base64');
            
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            console.log('API Response:', data);
            
            // tiny sleep
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

simulate().catch(console.error).finally(() => prisma.$disconnect());
