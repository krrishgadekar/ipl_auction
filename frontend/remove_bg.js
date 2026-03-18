const Jimp = require('jimp');

async function removeCheckerboardBackground(imagePath) {
    try {
        console.log(`Processing ${imagePath}...`);
        const image = await Jimp.read(imagePath);
        
        let removedCount = 0;
        // Scan all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];
            
            // Skip already transparent pixels
            if (a === 0) return;

            // If pixel is a light neutral color (white or light grey)
            // Fake checkerboards use colors around rgb(255,255,255) and rgb(204,204,204)
            if (r > 180 && g > 180 && b > 180) {
                // Check if it's neutral (difference between channels is small)
                if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
                    this.bitmap.data[idx + 3] = 0; // Make transparent
                    removedCount++;
                }
            }
        });
        
        await image.writeAsync(imagePath);
        console.log(`Successfully removed ${removedCount} background pixels from ${imagePath}`);
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error.message);
    }
}

// Run for Kohli
removeCheckerboardBackground('k:/IPL/IPL_AUCTION/public/players/virat-kohli.png');
