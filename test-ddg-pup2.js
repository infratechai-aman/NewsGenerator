const puppeteer = require('puppeteer');

async function scrapeDDGImages(query) {
    console.log("Launching puppeteer to scrape DDG for:", query);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iar=images&iax=images&ia=images`, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Wait 2 seconds for JS rendering just to be safe
        await new Promise(r => setTimeout(r, 2000));
        
        const images = await page.evaluate(() => {
            const allImgs = Array.from(document.querySelectorAll('img'));
            // Filter out tracking/logo image schemas
            return allImgs.map(img => img.src).filter(src => src.startsWith('http') && !src.includes('duckduckgo.com') && src.length > 50);
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
