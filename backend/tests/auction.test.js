import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import prisma from '../src/config/db.js';
import adminRoutes from '../src/routes/adminRoutes.js';
import publicRoutes from '../src/routes/publicRoutes.js';
import teamRoutes from '../src/routes/teamRoutes.js';
import socketHandler from '../src/websocket/socketHandler.js';

jest.setTimeout(10000);

let app, server, io, clientSocket, port;

beforeAll((done) => {
    app = express();
    app.use(express.json());
    app.use('/api/admin', adminRoutes);
    app.use('/api/public', publicRoutes);
    app.use('/api/team', teamRoutes);

    server = http.createServer(app);
    io = new Server(server);
    socketHandler(io);

    server.listen(() => {
        port = server.address().port;
        clientSocket = new Client(`http://localhost:${port}`);
        clientSocket.on('connect', done);
    });
});

afterAll(async () => {
    clientSocket.close();
    io.close();
    server.close();
    await prisma.$disconnect();
});

describe('IPL Auction Integration Flow', () => {
    let testPlayer, testTeam;

    beforeEach(async () => {
        // Reset DB state for clean tests
        await prisma.teamPlayer.deleteMany();
        await prisma.auctionPlayer.updateMany({ data: { status: 'UNSOLD', soldPrice: null, soldToTeamId: null } });
        await prisma.auctionState.update({ where: { id: 1 }, data: { auction_status: 'NOT_STARTED', current_player_id: null } });

        testTeam = await prisma.team.findFirst({ where: { brandKey: 'MI' } });
        testPlayer = await prisma.player.findFirst({ where: { name: 'Virat Kohli' } });
    });

    test('Start Auction state transition', async () => {
        const res = await request(app).post('/api/admin/start');
        expect(res.status).toBe(200);

        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
        expect(state.auction_status).toBe('LIVE');
    });

    test('Assign Player to auction', async () => {
        const res = await request(app)
            .post('/api/admin/assign-player')
            .send({ playerId: testPlayer.id });

        expect(res.status).toBe(200);
        const state = await prisma.auctionState.findUnique({ where: { id: 1 } });
        expect(state.current_player_id).toBe(testPlayer.id);
    });

    test('Transaction Safety: Sell Player', async () => {
        // Ensure status is LIVE and player is assigned
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { auction_status: 'LIVE', current_player_id: testPlayer.id }
        });

        return new Promise((resolve, reject) => {
            clientSocket.once('PLAYER_SOLD', async (data) => {
                try {
                    expect(data.playerId).toBe(testPlayer.id);
                    expect(data.teamId).toBe(testTeam.id);

                    const team = await prisma.team.findUnique({ where: { id: testTeam.id } });
                    expect(team.purseRemaining).toBe(testTeam.purseRemaining - 20000000);

                    const soldInfo = await prisma.auctionPlayer.findFirst({ where: { playerId: testPlayer.id } });
                    expect(soldInfo.status).toBe('SOLD');
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            clientSocket.emit('SELL_PLAYER', {
                playerId: testPlayer.id,
                teamId: testTeam.id,
                pricePaid: 20000000
            });
        });
    });

    test('Constraint: Insufficient Purse', async () => {
        await prisma.auctionState.update({
            where: { id: 1 },
            data: { auction_status: 'LIVE', current_player_id: testPlayer.id }
        });

        return new Promise((resolve, reject) => {
            clientSocket.once('ERROR', (data) => {
                try {
                    expect(data.message).toBe('Insufficient purse for this team');
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });

            clientSocket.emit('SELL_PLAYER', {
                playerId: testPlayer.id,
                teamId: testTeam.id,
                pricePaid: 900000000 // More than 80 Cr
            });
        });
    });
});
