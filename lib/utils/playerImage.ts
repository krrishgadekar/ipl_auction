/**
 * Player Image Utility
 *
 * Convention for local images (zero-delay, no CDN):
 *   Place images in:  /public/players/<slug>.png
 *   Where slug       = player name, lowercase, spaces→hyphens, dots removed
 *   Example:         "Virat Kohli" → /players/virat-kohli.png
 *                    "M.S. Dhoni"  → /players/ms-dhoni.png
 *
 * When you provide the player images folder, just drop files with these slugs.
 * The imageUrl on the Player object should be set to this local path.
 */

/** Convert a player name to the standard image file slug */
export function playerImageSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/\./g, '')        // remove dots (M.S. → ms)
        .replace(/\s+/g, '-')     // spaces → hyphens
        .replace(/[^a-z0-9-]/g, '') // strip other special chars
        .replace(/-+/g, '-');      // collapse multiple hyphens
}

/** Returns the local /public/players/ path for a given player name */
export function localPlayerImagePath(name: string): string {
    return `/players/${playerImageSlug(name)}.png`;
}

/**
 * Preload a list of image URLs into the browser cache in the background.
 * Call this when a player is announced so the NEXT player's image is warm.
 */
export function preloadImages(urls: (string | undefined)[]): void {
    if (typeof window === 'undefined') return;
    urls.forEach((url) => {
        if (!url) return;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}
