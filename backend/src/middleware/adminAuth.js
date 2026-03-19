// ═══════════════════════════════════════════════════════════════
// Admin Auth Middleware — Password-protects admin routes
// Uses ADMIN_USERNAME and ADMIN_PASSWORD env variables.
// Token format: "Bearer <username>:<password>" (base64-encoded)
// ═══════════════════════════════════════════════════════════════

export default function adminAuth(req, res, next) {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no credentials are configured, allow access (dev mode)
    if (!adminPassword) {
        return next();
    }

    // Check Authorization header: "Bearer <base64(username:password)>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');

    // Decode base64 token → "username:password"
    let decoded;
    try {
        decoded = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
        return res.status(401).json({ error: 'Invalid authentication token' });
    }

    const [username, ...passwordParts] = decoded.split(':');
    const password = passwordParts.join(':'); // Handle passwords with colons

    // Validate username (if ADMIN_USERNAME is set)
    if (adminUsername && username !== adminUsername) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Validate password
    if (password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    next();
}
