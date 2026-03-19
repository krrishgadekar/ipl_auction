/**
 * Player Image Utility
 *
 * Convention: images are stored as /public/player_photos/<rank>.avif
 * where rank is the player's unique rank (1–159).
 *
 * The rank acts as the primary key linking DB records to image files.
 */

/** Returns the local image path for a player by rank */
export function playerImagePath(rank: number): string {
    return `/player_photos/${rank}.avif`;
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
