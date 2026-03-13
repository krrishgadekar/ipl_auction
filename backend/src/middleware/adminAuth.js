// ═══════════════════════════════════════════════════════════════
// Admin Auth Middleware — Password-protects admin routes
// Uses ADMIN_PASSWORD env variable. Returns 401 if missing/wrong.
// ═══════════════════════════════════════════════════════════════

export default function adminAuth(req, res, next) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no password is set, allow access (dev mode)
    if (!adminPassword) {
        return next();
    }

    // Check Authorization header: "Bearer <password>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token !== adminPassword) {
        return res.status(401).json({ error: 'Invalid admin password' });
    }

    next();
}
