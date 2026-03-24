import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SALT_ROUNDS = 10;
const instances = [1, 2, 3, 4, 5];

async function generate() {
    let output = "═══════════════════════════════════════════════════\n";
    output += "       IPL AUCTION 2026 — INSTANCE CREDENTIALS      \n";
    output += "═══════════════════════════════════════════════════\n\n";

    for (const i of instances) {
        const password = crypto.randomBytes(8).toString('hex');
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        output += `--- INSTANCE ${i} ---\n`;
        output += `Admin Password: ${password}\n`;
        output += `Bcrypt Hash:   ${hash}\n\n`;
    }

    fs.writeFileSync('instance_credentials.txt', output);
    console.log(output);
}

generate();
