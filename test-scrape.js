// test-scrape.js
const { searchImages } = require('duck-duck-scrape');

async function test() {
    try {
        const results = await searchImages('India tech news');
        console.log("Results found:", results.results.length);
        console.log(results.results.slice(0, 3));
    } catch (e) {
        console.error(e);
    }
}

test();
