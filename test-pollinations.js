// test-pollinations.js
async function test() {
    try {
        const url = 'https://image.pollinations.ai/prompt/India%20tech%20news';
        console.log("Fetching", url);
        const res = await fetch(url);
        console.log("Status:", res.status);
        if (res.ok) {
            const buffer = await res.arrayBuffer();
            console.log("Bytes:", buffer.byteLength);
        } else {
            console.log(await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}
test();
