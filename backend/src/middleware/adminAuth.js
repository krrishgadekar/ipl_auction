import prisma from '../config/db.js';

/**
 * Admin Auth Middleware — Verifies session IDs against the AdminUser table.
 * Uses the "Authorization: Bearer <sessionId>" header.
 */
export default async function adminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }

    const sessionId = authHeader.replace(/^Bearer\s+/i, '');

    try {
        const admin = await prisma.adminUser.findFirst({
            where: { active_session_id: sessionId },
        });

        if (!admin) {
            console.warn(`[AdminAuth] Authentication failed for session: ${sessionId.substring(0, 8)}...`);
            return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
        }

        // Attach user info to request
        req.user = {
            id: admin.id,
            username: admin.username,
            role: admin.role,
        };

        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal auth error' });
    }
}
