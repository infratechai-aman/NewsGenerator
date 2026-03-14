const DDG = require('duck-duck-scrape');

async function testNews() {
  try {
    const results = await DDG.searchNews('India tech', { safeSearch: DDG.SafeSearchType.MODERATE });
    console.log("News results:", results.results?.length);
  } catch (e) {
    console.error("News search error:", e);
  }
}

testNews();
