const puppeteer = require('puppeteer');

async function scrapeDDGImages(query) {
    console.log("Launching puppeteer to scrape DDG for:", query);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // We can go directly to Google Images or DDG Images
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iar=images&iax=images&ia=images`, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Wait for the images to load
        await page.waitForSelector('.tile--img__img', { timeout: 10000 });
        
        const images = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('.tile--img__img'));
            return imgs.slice(0, 5).map(img => img.src).filter(src => src.startsWith('http'));
        });
        
        console.log("Found images:", images);
        await browser.close();
        return images;
    } catch (e) {
        console.error("Puppeteer DDG error:", e);
        await browser.close();
        return [];
    }
}

scrapeDDGImages("India tech news");
