const google = require('googlethis');

async function testGoogleImages() {
  console.log("Searching for: India tech news");
  try {
    const images = await google.image('India tech news', { safe: false });
    console.log(`Found ${images.length} images.`);
    if (images.length > 0) {
      console.log(images.slice(0, 3).map(img => img.url));
    }
  } catch (e) {
    console.error("Google Search error:", e);
  }
}

testGoogleImages();
