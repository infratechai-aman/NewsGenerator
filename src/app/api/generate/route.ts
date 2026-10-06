import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/openai';
import { getNewsWithImages } from '@/lib/scraper';
import { generateSudokuData, renderSudokuToDataUrl } from '@/lib/sudoku';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeImageUrl, getCategoryFallbackImage, generateDocumentaryImageUrl } from '@/lib/images';

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: 'Write all content in English.',
  hindi: 'Write all content in Hindi (हिन्दी). Use Devanagari script.',
  bengali: 'Write all content in Bengali (বাংলা). Use Bengali script.',
};

async function generateArticles(language: string, pageCount: number, targetLocation: string, articleCountSetting: number) {
  const cleanLoc = (targetLocation || '').trim();

  // Dynamic location-aware topics
  const topics = cleanLoc
    ? [
        { query: `${cleanLoc} news`, label: 'Local Lead Story', category: 'local' },
        { query: `${cleanLoc} infrastructure road development municipal`, label: 'Civic Infrastructure', category: 'civic' },
        { query: `${cleanLoc} police crime safety investigation`, label: 'Law & Order', category: 'police' },
        { query: `${cleanLoc} society residents community traffic`, label: 'Community & Society', category: 'community' },
        { query: `${cleanLoc} metro transport real estate commercial`, label: 'Transit & Business', category: 'business' },
        { query: `${cleanLoc} state politics government administration`, label: 'Regional Governance', category: 'politics' },
        { query: 'India economy business markets investment', label: 'National Economy', category: 'economy' },
        { query: 'India technology digital AI space innovation', label: 'Technology & Space', category: 'technology' },
        { query: 'India sports cricket match victory', label: 'Sports & Cricket', category: 'sports' },
        { query: 'India education environment research sustainability', label: 'Education & Environment', category: 'education' },
      ]
    : [
        { query: 'India national politics government parliament reforms', label: 'National Politics', category: 'politics' },
        { query: 'India economy business markets industry growth', label: 'Economy & Business', category: 'economy' },
        { query: 'India technology digital AI semiconductor space', label: 'Tech & Innovation', category: 'technology' },
        { query: 'India sports cricket tournament championships', label: 'Sports', category: 'sports' },
        { query: 'India education research universities youth', label: 'Education', category: 'education' },
        { query: 'world international diplomacy summits foreign relations', label: 'World Affairs', category: 'world' },
        { query: 'India science space ISRO environment climate', label: 'Science & Environment', category: 'science' },
        { query: 'India entertainment cinema culture heritage arts', label: 'Entertainment & Culture', category: 'entertainment' },
      ];

  const locString = cleanLoc ? ` in ${cleanLoc}` : ' in India';
  const totalDesired = articleCountSetting || Math.min(pageCount * 2, topics.length);
  const selectedTopics = topics.slice(0, totalDesired);
  const articles = [];

  for (let i = 0; i < selectedTopics.length; i++) {
    const topicItem = selectedTopics[i];
    const isPriority = i === 0;

    try {
      const { news, images } = await getNewsWithImages(
        topicItem.query,
        isPriority ? 4 : 2,
        cleanLoc || undefined
      );

      const realItem = news[0];
      const newsContext = news.length > 0
        ? news.map((n) => `- Headline: "${n.title}" | Source: ${n.source} | Date: ${n.date || 'Recent 7 days'} | Excerpt: ${n.snippet}`).join('\n')
        : `- Topic Focus: "${topicItem.label} developments in ${cleanLoc || 'India'}"`;

      const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
      const wordCountRule = 'You MUST write exactly 100 to 150 words in length across 2 to 3 paragraphs. Do not write less than 100 words, and do not exceed 150 words.';

      const promptContext = realItem
        ? `REAL BREAKING NEWS EVENT FROM PAST 7 DAYS:
Headline: "${realItem.title}"
Source Outlet: ${realItem.source}
Reported Date: ${realItem.date || 'Past 7 days'}
Key Snippet: ${realItem.snippet}
Location: ${cleanLoc || 'India'}

Write an authentic, highly detailed broadsheet report based STRICTLY on this real event.`
        : `Write an authentic, non-repetitive broadsheet article about recent ${topicItem.label}${locString}. Focus on tangible civic, infrastructure, or institutional updates.`;

      const result = await generateWithAI(
        `You are a senior chief editor for an authentic daily broadsheet newspaper. ${langInstruction} ${wordCountRule} Write with journalistic authority, neutral editorial tone, and rich broadsheet density.`,
        `${promptContext}\n\nReturn strictly valid JSON with:
{
  "headline": "A dramatic, authentic broadsheet headline (max 12 words)",
  "subHeadline": "An insightful secondary headline deck (10-15 words)",
  "content": "A structured, journalistic article of exactly 100-150 words in 2-3 paragraphs",
  "category": "${topicItem.category}",
  "pullQuote": "A striking 10-15 word quotation or memorable takeaway",
  "keyHighlights": ["Key point 1", "Key point 2", "Key point 3"],
  "imageCaption": "A descriptive, factual photojournalist caption (max 15 words)"
}`
      );

      const parsed = JSON.parse(result);

      // Construct verified high-resolution documentary press photography
      const headlineForPhoto = realItem?.title || parsed.headline || topicItem.label;
      const primaryPhotoUrl = sanitizeImageUrl(
        realItem?.imageUrl || generateDocumentaryImageUrl(headlineForPhoto, parsed.category || topicItem.category, cleanLoc),
        parsed.category || topicItem.category
      );

      const articleImages = [
        {
          url: primaryPhotoUrl,
          caption: parsed.imageCaption || `Developments regarding ${parsed.headline || topicItem.label}`,
        },
      ];

      // If priority front page, add secondary photo if available
      if (isPriority && news[1]) {
        articleImages.push({
          url: sanitizeImageUrl(
            news[1].imageUrl || generateDocumentaryImageUrl(news[1].title, parsed.category || topicItem.category, cleanLoc),
            parsed.category || topicItem.category
          ),
          caption: `Related regional developments in ${cleanLoc || 'the state'}`,
        });
      }

      articles.push({
        id: uuidv4(),
        headline: parsed.headline,
        subHeadline: parsed.subHeadline || undefined,
        content: parsed.content,
        images: articleImages,
        imageUrl: articleImages[0]?.url || primaryPhotoUrl,
        imageCaption: parsed.imageCaption || null,
        category: parsed.category || topicItem.category,
        source: realItem?.source || 'Staff Reporter',
        date: realItem?.date || new Date().toISOString(),
        pullQuote: parsed.pullQuote || undefined,
        keyHighlights: Array.isArray(parsed.keyHighlights) ? parsed.keyHighlights : undefined,
      });

      // Brief delay to prevent rate limits
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch (error) {
      console.error(`Error generating article for ${topicItem.query}:`, error);
    }
  }

  return articles;
}

async function generateHoroscope(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;

  const result = await generateWithAI(
    `You are an expert astrologer writing perfectly structured daily horoscope predictions for an Indian newspaper. ${langInstruction}`,
    `Generate beautiful, concise daily horoscope predictions for EXACTLY all 12 zodiac signs. Return JSON:
{
  "entries": [
    { "sign": "Aries", "prediction": "2-3 sentence prediction" },
    ... all 12 signs in standard order
  ]
}`
  );

  const parsed = JSON.parse(result);
  return {
    id: uuidv4(),
    entries: parsed.entries,
  };
}

async function generateFacts(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;

  const result = await generateWithAI(
    `You are a knowledge writer for an Indian newspaper's "Do You Know?" section. ${langInstruction}`,
    `Generate 5 interesting, verified, and surprising facts. Mix topics: science, history, India, nature, technology. Return JSON:\n{\n  "facts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"]\n}`
  );

  const parsed = JSON.parse(result);
  return {
    id: uuidv4(),
    facts: parsed.facts,
  };
}

async function generateCrypticClue(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;

  const result = await generateWithAI(
    `You are a crossword puzzle creator for an Indian newspaper. ${langInstruction}`,
    `Generate one cryptic clue with its answer and a hint. The answer should be a common English/Hindi word. Return JSON:\n{\n  "clue": "The cryptic clue text",\n  "answer": "THE ANSWER",\n  "hint": "A gentle hint"\n}`
  );

  const parsed = JSON.parse(result);
  return {
    id: uuidv4(),
    clue: parsed.clue,
    answer: parsed.answer,
    hint: parsed.hint,
  };
}

async function generateHouseAds(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;

  const result = await generateWithAI(
    `You are a copywriter creating display ads for an Indian newspaper. ${langInstruction}`,
    `Generate 3 fictional newspaper house advertisements. Types: classifieds promotion, subscription offer, and a community event. Return JSON:\n{\n  "ads": [\n    {\n      "title": "Ad headline",\n      "description": "2-3 line ad copy",\n      "tagline": "Catchy tagline",\n      "type": "classifieds|subscription|event"\n    }\n  ]\n}`
  );

  const parsed = JSON.parse(result);
  return parsed.ads.map((ad: { title: string; description: string; tagline: string; type: string }) => ({
    id: uuidv4(),
    ...ad,
  }));
}

function generateSudoku() {
  const data = generateSudokuData('easy');
  const imageDataUrl = renderSudokuToDataUrl(data.puzzle);
  return {
    id: uuidv4(),
    difficulty: data.difficulty,
    imageDataUrl,
  };
}

async function generateQuote(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const result = await generateWithAI(
    `You are an editor for an inspirational Quote of the Day section in an Indian newspaper. ${langInstruction}`,
    `Provide a profound, inspirational quote from a notable historical figure (preferably Indian context if suitable, but global is fine). Return JSON:\n{\n  "quote": "The quote text",\n  "author": "Author Name"\n}`
  );
  return { id: uuidv4(), ...JSON.parse(result) };
}

async function generateHistory(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const result = await generateWithAI(
    `You are an archivist for an "On This Day in History" column in an Indian newspaper. ${langInstruction}`,
    `Generate 3 significant historical events that happened on ${today}. Return JSON:\n{\n  "events": [\n    { "year": "YYYY", "event": "Description of event" }\n  ]\n}`
  );
  return { id: uuidv4(), ...JSON.parse(result) };
}

async function generateWeather(language: string, targetLocation: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const locString = targetLocation || "major Indian cities (Delhi, Mumbai, Bangalore, Kolkata)";
  
  const result = await generateWithAI(
    `You are a meteorologist providing a weather report for an Indian newspaper. ${langInstruction}`,
    `Provide a simulated, realistic current weather report for ${locString}. Include 4 distinct locations/cities. For conditionIcon, use EXACTLY ONE of these unicode characters: ☀️, 🌤️, ☁️, 🌧️, ⛈️, ❄️. Return JSON:\n{\n  "reports": [\n    { "city": "City Name", "temp": "28°C", "conditionIcon": "☀️", "condition": "Sunny" }\n  ]\n}`
  );
  return { id: uuidv4(), ...JSON.parse(result) };
}

async function generateTvGuide(language: string, targetLocation: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const locString = targetLocation ? ` in ${targetLocation}` : '';
  
  const result = await generateWithAI(
    `You are an entertainment editor for a local newspaper. ${langInstruction}`,
    `Provide a fictionalized but realistic evening TV guide & local events listing${locString}. Return JSON:\n{\n  "listings": [\n    { "time": "19:00", "show": "Show or Event Name", "channel": "Channel or Venue" }\n  ]\n} Ensure there are exactly 5 listings.`
  );
  return { id: uuidv4(), ...JSON.parse(result) };
}

async function generateKeyIndicators(language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const result = await generateWithAI(
    `You are a financial desk editor for an Indian broadsheet newspaper. Provide realistic, current financial market indicators. ${langInstruction}`,
    `Generate the latest financial indicators for Indian markets. Include Sensex, Nifty 50, USD/INR, Gold (10g), Brent Crude, and 10Y G-Sec. Return JSON:
{
  "indicators": [
    { "name": "SENSEX", "value": "82,490.15", "change": "+412.30", "direction": "up" },
    { "name": "NIFTY 50", "value": "25,235.90", "change": "+128.45", "direction": "up" },
    { "name": "USD / INR", "value": "83.92", "change": "-0.04", "direction": "down" },
    { "name": "GOLD (10g)", "value": "₹76,450", "change": "+320.00", "direction": "up" },
    { "name": "BRENT CRUDE", "value": "$74.18/bbl", "change": "-0.85", "direction": "down" },
    { "name": "10Y G-SEC", "value": "6.82%", "change": "-0.02", "direction": "down" }
  ]
}`
  );
  const parsed = JSON.parse(result);
  return { id: uuidv4(), indicators: parsed.indicators };
}

async function polishArticle(rawText: string, draftHeadline: string, language: string, category?: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const prompt = `You are a chief news editor for a daily broadsheet. Transform the following raw draft/notes into a polished broadsheet article.
Draft Headline: "${draftHeadline || 'Untitled'}"
Draft Notes / Raw Text: "${rawText || ''}"
Category: ${category || 'general'}

${langInstruction}
Requirements:
1. Headline: Strong, authentic broadsheet headline (max 12 words).
2. SubHeadline: Insightful sub-headline deck (10-15 words).
3. ShortDescription: One crisp sentence summary (15-20 words).
4. Content: Exactly 120-160 words across 2 structured paragraphs in authentic news broadsheet inverted pyramid style.

Return JSON:
{
  "headline": "...",
  "subHeadline": "...",
  "shortDescription": "...",
  "content": "..."
}`;

  const result = await generateWithAI(
    `You are a senior broadsheet newspaper editor. ${langInstruction}`,
    prompt
  );
  return JSON.parse(result);
}

async function suggestHeadlines(topic: string, language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const result = await generateWithAI(
    `You are a newspaper editor creating headlines. ${langInstruction}`,
    `Suggest 3 compelling, authentic broadsheet newspaper headlines for this topic/story: "${topic}". Return JSON:\n{\n  "suggestions": ["Headline 1", "Headline 2", "Headline 3"]\n}`
  );
  return JSON.parse(result);
}

async function generateAdCreative(brandName: string, category: string, tagline: string, offer: string, language: string) {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
  const result = await generateWithAI(
    `You are an advertising copywriter for a leading print newspaper. ${langInstruction}`,
    `Create a commercial broadsheet display advertisement creative for:
Brand Name: "${brandName || 'Premier Brand'}"
Category: "${category || 'Commercial Retail'}"
Tagline: "${tagline || ''}"
Offer / Call to Action: "${offer || ''}"

Return JSON:
{
  "headline": "A bold, punchy ad headline (max 8 words)",
  "tagline": "An inspiring brand tagline (max 10 words)",
  "offer": "A compelling promotional privilege or discount (max 12 words)",
  "callToAction": "Clear contact details or visit action (max 8 words)",
  "sponsorName": "${brandName || 'Sponsor'}"
}`
  );
  const parsed = JSON.parse(result);

  const adCategory = (category || 'business').toLowerCase();
  const photoUrl = sanitizeImageUrl('', adCategory.includes('health') ? 'education' : adCategory.includes('tech') ? 'technology' : 'business');

  return {
    id: uuidv4(),
    ...parsed,
    imageUrl: photoUrl,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      language = 'english',
      pageCount,
      targetLocation,
      articleCount,
      rawText,
      headline,
      category,
      topic,
      brandName,
      tagline,
      offer,
    } = body;

    let content;
    let success = true;

    switch (type) {
      case 'articles':
        content = await generateArticles(language, pageCount, targetLocation, articleCount);
        break;
      case 'horoscope':
        content = await generateHoroscope(language);
        break;
      case 'facts':
        content = await generateFacts(language);
        break;
      case 'sudoku':
        content = generateSudoku();
        break;
      case 'cryptic':
        content = await generateCrypticClue(language);
        break;
      case 'houseAds':
        content = await generateHouseAds(language);
        break;
      case 'quote':
        content = await generateQuote(language);
        break;
      case 'history':
        content = await generateHistory(language);
        break;
      case 'weather':
        content = await generateWeather(language, targetLocation);
        break;
      case 'tv-guide':
        content = await generateTvGuide(language, targetLocation);
        break;
      case 'key-indicators':
      case 'keyIndicators':
        content = await generateKeyIndicators(language);
        break;
      case 'polish-article':
        content = await polishArticle(rawText, headline, language, category);
        break;
      case 'suggest-headlines':
        content = await suggestHeadlines(topic || headline || rawText, language);
        break;
      case 'generate-ad-creative':
        content = await generateAdCreative(brandName, category, tagline, offer, language);
        break;
      case 'generate-article-image': {
        const query = topic || headline || 'newspaper news';
        const imgUrl = sanitizeImageUrl(
          generateDocumentaryImageUrl(query, category || 'general', targetLocation),
          category || 'general'
        );
        content = { imageUrl: imgUrl };
        break;
      }
      default:
        return NextResponse.json(
          { error: `Unknown content type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success, content });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
