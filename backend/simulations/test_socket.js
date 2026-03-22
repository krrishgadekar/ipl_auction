import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log('Connected, requesting state...');
    socket.emit('REQUEST_STATE');
});

socket.on('STATE_SYNC', (data) => {
    const bravo = data.teams.find(t => t.name === 'Team Bravo');
    console.log('Bravo players:', bravo?.players);
    console.log('Bravo budget:', bravo?.budgetRemaining);
    process.exit(0);
});
