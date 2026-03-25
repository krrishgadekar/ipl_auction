const fs = require('fs');

const content = fs.readFileSync('resources/ipl2026_rated_players_auction.csv', 'utf8');
const lines = content.split('\n');
const headers = lines[0].split(',');
const natIdx = headers.findIndex(h => h.trim() === 'Nationality');

let indians = 0;
let overseas = 0;
let totalCounted = 0;

for (let i = 1; i < lines.length && totalCounted < 159; i++) {
  if (!lines[i].trim()) continue;
  
  // Custom simple CSV splitter
  let cols = [];
  let inQuotes = false;
  let currentVal = '';
  for (let char of lines[i]) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      cols.push(currentVal);
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  cols.push(currentVal);

  const nat = cols[natIdx]?.trim().toUpperCase();
  if (nat === 'INDIAN') indians++;
  else if (nat) overseas++;
  
  totalCounted++;
}

console.log('--- Top 159 Players ---');
console.log('Indians:', indians);
console.log('Overseas:', overseas);
console.log('Total:', indians + overseas);

console.log('\n--- Mathematical Feasibility ---');
console.log('Total Teams: 10');
console.log('Total Squad Slots (15x10): 150 slots total across the league');
console.log('Max Overseas Allowed (4 limit per team):', 10 * 4);
console.log('Max Overseas Allowed (5 limit per team):', 10 * 5);

console.log('\n--- Conclusion ---');
if (overseas > 40) {
  console.log(`There are ${overseas} overseas players in the top 159.`);
  console.log(`If the limit is 4 per team, only a maximum of 40 overseas players can be bought in the entire auction.`);
  console.log(`This means at least ${overseas - 40} overseas players WILL go unsold no matter what.`);
  console.log(`\nRECOMMENDATION: A 5-OVERSEAS LIMIT per squad is far more mathematically balanced, allowing teams enough room to buy all ${overseas} players.`);
} else {
  console.log(`A 4-OVERSEAS LIMIT works perfectly and has enough space to accommodate all ${overseas} players.`);
}
