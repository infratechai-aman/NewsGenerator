const cheerio = require('cheerio');

async function searchImagesDDG(query) {
    console.log("Searching DDG images for:", query);
    
    try {
        // Step 1: Get the VQD token
        const reqUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iar=images&iax=images&ia=images`;
        const res = await fetch(reqUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Safari) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        
        const html = await res.text();
        
        const vqdMatch = html.match(/vqd=([\d-]+)/);
        if (!vqdMatch) {
            console.error("VQD token not found!");
            return [];
        }
        
        const vqd = vqdMatch[1];
        console.log("Found VQD token:", vqd);
        
        // Step 2: Fetch the images API
        const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;
        const apiRes = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': reqUrl,
            }
        });
        
        const data = await apiRes.json();
        console.log("Found images:", data.results?.length);
        if (data.results && data.results.length > 0) {
            console.log("First image:", data.results[0].image);
            return data.results.map(r => ({ url: r.image, title: r.title }));
        }
        
        return [];
    } catch (e) {
        console.error("Scraping error:", e);
        return [];
    }
}

searchImagesDDG("India tech news").then(res => console.log(res.slice(0, 3)));
