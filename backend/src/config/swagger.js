import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'IPL Auction 2026 API',
            version: '2.0.0',
            description: 'Backend API for IPL Auction 2026 — Normalized schema with auth, power cards, sealed bids',
        },
        servers: [
            { url: 'http://localhost:5000', description: 'Local (default)' },
        ],
    },
    apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
