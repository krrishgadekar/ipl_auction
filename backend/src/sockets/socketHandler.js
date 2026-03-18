import { SOCKET_EVENTS } from '../constants/socketEvents.js';

export default function socketHandler(io) {
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        console.log(`📡 Socket connected: ${socket.id}`);

        // Frontend read-only requests for state
        socket.on('REQUEST_STATE', async () => {
            // Handled in future steps
        });

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log(`📡 Socket disconnected: ${socket.id}`);
        });
    });
}
