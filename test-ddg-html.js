const cheerio = require('cheerio');

async function testVQD() {
    const query = "India tech news";
    const reqUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const res = await fetch(reqUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
    });
    
    const html = await res.text();
    const vqdMatch = html.match(/vqd=([\d-]+)/);
    
    if (vqdMatch) {
        console.log("FOUND VQD IN HTML ENDPOINT:", vqdMatch[1]);
        
        // Let's test if the image endpoint accepts this token
        const vqd = vqdMatch[1];
        const apiUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;
        const apiRes = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
            }
        });
        if (apiRes.ok) {
            const data = await apiRes.json();
            console.log("Images worked?", data.results?.length > 0);
        } else {
            console.log("API failed with", apiRes.status);
        }
    } else {
        console.log("NO VQD FOUND IN HTML ENDPOINT EITHER!");
    }
}
testVQD();
