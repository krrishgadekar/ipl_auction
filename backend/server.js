import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './src/config/swagger.js';

import adminRoutes from './src/routes/adminRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import socketHandler from './src/websocket/socketHandler.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/admin/auction', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/public/auction', publicRoutes);

// WebSocket
socketHandler(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
