import https from 'https';
import http from 'http';

/**
 * Pings the server automatically every 14 minutes to prevent Render free-tier from sleeping.
 * Relies on PUBLIC_BACKEND_URL environment variable in production.
 */
export function startKeepAlive() {
    const backendUrl = process.env.PUBLIC_BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const intervalMinutes = 14;
    const intervalMs = intervalMinutes * 60 * 1000;

    console.log(`⏱️  [KeepAlive] Service started. Pinging ${backendUrl}/api/health every ${intervalMinutes} minutes.`);

    setInterval(() => {
        const url = `${backendUrl}/api/health`;
        const client = url.startsWith('https') ? https : http;

        client.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`✅ [KeepAlive] Ping successful: ${url}`);
            } else {
                console.warn(`⚠️ [KeepAlive] Ping failed with status: ${res.statusCode}`);
            }
        }).on('error', (err) => {
            // Can happen on network hiccups or if the server goes down
            console.error(`❌ [KeepAlive] Error pinging server: ${err.message}`);
        });
    }, intervalMs);
}
