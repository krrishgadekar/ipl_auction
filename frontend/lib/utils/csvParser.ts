// CSV Parser Utility
// Parses standard IPL Auction player CSV format
// Expected format: Set No, Set Name, Player, Country, Role, ...

import { Player } from '@/lib/mockData/players';

export function parsePlayerCSV(csvContent: string): Player[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Map of CSV headers to Player object keys
    // Adjust these based on actual CSV column names
    const columnMap: Record<string, string> = {
        'player': 'player',
        'role': 'role',
        'set name': 'category', // Using Set Name as Category
        'image': 'image_trans', // Assuming URL or filename
        // Sub-ratings - assuming they might be columns like "Scoring", "Impact" etc.
    };

    const players: Player[] = [];

    // Start from index 1 to skip header
    for (let i = 1; i < lines.length; i++) {
        // Handle CSV lines ensuring quoted commas don't break split
        // This is a simple regex for CSV parsing
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        if (!values || values.length < headers.length) continue;

        // Clean values (remove quotes)
        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

        const player: any = {
            rank: i, // Assign rank based on order
            team: 'Unsold', // Default
            grade: 'C', // Default, logic needed to calculate
            rating: 75, // Default
            pool: 'BAT_WK', // Default, need logic
        };

        headers.forEach((header, index) => {
            if (index < cleanValues.length) {
                // Heuristic mapping
                if (header.includes('player')) player.player = cleanValues[index];
                if (header.includes('set')) player.category = cleanValues[index];
                if (header.includes('role')) player.role = cleanValues[index];
                if (header.includes('country')) player.country = cleanValues[index];
            }
        });

        // Determine pool based on role
        if (player.role) {
            const role = player.role.toLowerCase();
            if (role.includes('wicket') || role.includes('bat')) player.pool = 'BAT_WK';
            else if (role.includes('bowl')) player.pool = 'BOWL';
            else if (role.includes('all')) player.pool = 'AR';
        }

        // Only add if we have at least a name
        if (player.player) {
            players.push(player as Player);
        }
    }

    return players;
}
