// test-pollinations2.js
async function test() {
    try {
        const url = 'https://pollinations.ai/p/apple';
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
