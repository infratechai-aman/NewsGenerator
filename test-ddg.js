const { image_search } = require('duckduckgo-images-api');

async function test() {
    try {
        const results = await image_search({ query: "India tech news", moderate: true });
        console.log("Images found:", results.length);
        console.log(results.slice(0, 3));
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
