import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api/admin/auction/assign-powercard';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your_admin_password_here';

async function simulate() {
    console.log('🏏 Starting Power Card Simulation...');

    // 1. Get 4 different teams
    const teams = await prisma.team.findMany({
        take: 4,
        select: { id: true, name: true }
    });

    if (teams.length < 4) {
        console.error('❌ Not enough teams found in the database. Need at least 4.');
        return;
    }

    const powerCardTypes = ['MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'RIGHT_TO_MATCH'];
    
    // 2. Assign one power card to each team
    const token = Buffer.from(`admin:${ADMIN_PASSWORD}`).toString('base64');
    const authHeader = `Bearer ${token}`;

    for (let i = 0; i < 4; i++) {
        const team = teams[i];
        const type = powerCardTypes[i];

        console.log(`📡 Assigning ${type} to ${team.name}...`);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
                body: JSON.stringify({
                    teamId: team.id,
                    type: type
                })
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Successfully assigned ${type} to ${team.name}`);
            } else {
                console.error(`❌ Failed to assign ${type} to ${team.name}:`, data.error || data);
            }
        } catch (err) {
            console.error(`❌ Network error while assigning ${type} to ${team.name}:`, err.message);
        }
    }

    console.log('🏆 Power Card Simulation Complete!');
}

simulate()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
