import prisma from '../config/db.js';

/**
 * Team Auth Middleware — Verifies session IDs against the Team table.
 * Enforces "one user at a time" by checking the active_session_id.
 * Uses the "Authorization: Bearer <sessionId>" header.
 */
export default async function teamAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Team authentication required' });
    }

    const sessionId = authHeader.replace(/^Bearer\s+/i, '');

    try {
        const team = await prisma.team.findFirst({
            where: { active_session_id: sessionId },
        });

        if (!team) {
            console.warn(`[TeamAuth] Session mismatch or expired: ${sessionId.substring(0, 8)}...`);
            return res.status(401).json({ 
                error: 'Session expired or logged in from another device.',
                code: 'SESSION_EXPIRED'
            });
        }

        // Attach team info to request
        req.user = {
            id: team.id,
            name: team.name,
            brandKey: team.brand_key,
        };

        next();
    } catch (err) {
        console.error('[TeamAuth] Error:', err);
        res.status(500).json({ error: 'Internal auth error' });
    }
}
