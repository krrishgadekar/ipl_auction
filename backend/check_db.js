import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function mapRoleToCategory(role) {
    if (!role) return 'BAT';
    const r = role.toLowerCase();
    if (r.includes('wk') || r.includes('wicket')) return 'WK';
    if (r.includes('allrounder')) return 'AR';
    if (r.includes('bowler')) return 'BOWL';
    return 'BAT';
}

async function check() {
    console.log('--- Database Role Check ---');
    const teams = await prisma.team.findMany({
        include: {
            team_players: {
                include: {
                    player: true
                }
            }
        }
    });

    for (const t of teams) {
        if (t.team_players.length > 0) {
            console.log(`Team: ${t.name}`);
            console.log(`Squad Count: ${t.squad_count}`);
            for (const tp of t.team_players) {
                const category = mapRoleToCategory(tp.player.role);
                console.log(`  Player #${tp.player.rank}: ${tp.player.name} | Role: ${tp.player.role} | Mapped: ${category}`);
            }
            console.log(`Stored Counts -> B:${t.batsmen_count}, Bo:${t.bowlers_count}, A:${t.ar_count}, W:${t.wk_count}`);
            console.log('---');
        }
    }
}

check().catch(console.error).finally(() => prisma.$disconnect());
