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

async function main() {
    console.log('🔄 Recalculating all team role counts...');
    const teams = await prisma.team.findMany({
        include: {
            team_players: {
                include: {
                    player: true
                }
            }
        }
    });

    for (const team of teams) {
        const counts = { BAT: 0, BOWL: 0, AR: 0, WK: 0 };
        for (const tp of team.team_players) {
            const cat = mapRoleToCategory(tp.player.role);
            counts[cat]++;
        }

        console.log(`Team ${team.name}:`, counts);

        await prisma.team.update({
            where: { id: team.id },
            data: {
                batsmen_count: counts.BAT,
                bowlers_count: counts.BOWL,
                ar_count: counts.AR,
                wk_count: counts.WK
            }
        });
    }

    console.log('✅ Role counts synchronized!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
