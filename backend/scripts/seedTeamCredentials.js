// ═══════════════════════════════════════════════════════════════
// Seed Script — Create team credentials in the database
// Run:  node backend/scripts/seedTeamCredentials.js
// ═══════════════════════════════════════════════════════════════

import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

const TEAMS = [
    { name: 'Mumbai Indians',              username: 'mi',   password: 'mi2026' },
    { name: 'Chennai Super Kings',         username: 'csk',  password: 'csk2026' },
    { name: 'Royal Challengers Bengaluru', username: 'rcb',  password: 'rcb2026' },
    { name: 'Kolkata Knight Riders',       username: 'kkr',  password: 'kkr2026' },
    { name: 'Delhi Capitals',              username: 'dc',   password: 'dc2026' },
    { name: 'Punjab Kings',                username: 'pbks', password: 'pbks2026' },
    { name: 'Rajasthan Royals',            username: 'rr',   password: 'rr2026' },
    { name: 'Gujarat Titans',              username: 'gt',   password: 'gt2026' },
    { name: 'Sunrisers Hyderabad',         username: 'srh',  password: 'srh2026' },
    { name: 'Lucknow Super Giants',        username: 'lsg',  password: 'lsg2026' },
];

async function seed() {
    console.log('🏏 Seeding team credentials...\n');

    for (const t of TEAMS) {
        const hash = await bcrypt.hash(t.password, 10);

        await prisma.team.upsert({
            where: { name: t.name },
            update: {
                username: t.username,
                password_hash: hash,
            },
            create: {
                name: t.name,
                username: t.username,
                password_hash: hash,
            },
        });

        console.log(`  ✅ ${t.name.padEnd(35)} → username: ${t.username.padEnd(5)} | password: ${t.password}`);
    }

    console.log('\n🎉 All team credentials seeded!\n');
    await prisma.$disconnect();
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    prisma.$disconnect();
    process.exit(1);
});
