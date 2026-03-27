// ═══════════════════════════════════════════════════════════════
// IPL Auction 2026 — Server Entry Point
// ═══════════════════════════════════════════════════════════════
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';

import adminRoutes from './src/routes/adminRoutes.js';
import adminAuthRoutes from './src/routes/adminAuthRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import playerRoutes from './src/routes/playerRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import scoringRoutes from './src/routes/scoringRoutes.js';
import socketHandler from './src/websocket/socketHandler.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use((req, res, next) => {
    console.error(`🚀 [BACKEND] ${req.method} ${req.url}`);
    next();
});
app.use(express.json());

// Inject io into every route
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/auction', adminRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/public/auction', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Catch-all ────────────────────────────────────────────
app.use((req, res) => {
    console.warn(`[404] ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Not Found', path: req.url });
});

// ── WebSocket ────────────────────────────────────────────────
socketHandler(io);

import { startKeepAlive } from './src/utils/keepAlive.js';

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════════════');
    console.log(`🏏 IPL Auction 2026 Backend — Port ${PORT}`);
    console.log(`📄 Swagger UI: http://localhost:${PORT}/api/docs`);
    console.log(`💚 Health:     http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════════');
    startKeepAlive();
});

export { app, server, io };
