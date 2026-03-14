import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/openai';
import { getNewsWithImages } from '@/lib/scraper';
import { generateSudokuData, renderSudokuToDataUrl } from '@/lib/sudoku';
import { v4 as uuidv4 } from 'uuid';
// Removed broken duck-duck-scrape imports to favor the fixed local scraper.


const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: 'Write all content in English.',
  hindi: 'Write all content in Hindi (हिन्दी). Use Devanagari script.',
  bengali: 'Write all content in Bengali (বাংলা). Use Bengali script.',
};

async function generateArticles(language: string, pageCount: number, targetLocation: string, articleCountSetting: number) {
  const topics = [
    'India politics government',
    'India economy business',
    'India technology',
    'India sports cricket',
    'India education',
    'world international affairs',
    'India science environment',
    'India entertainment Bollywood',
  ];

  const locString = targetLocation ? ` in ${targetLocation}` : '';

  const articleCount = articleCountSetting || Math.min(pageCount * 2, topics.length);
  const selectedTopics = topics.slice(0, articleCount);
  const articles = [];

  for (let i = 0; i < selectedTopics.length; i++) {
    const topic = selectedTopics[i];
    const isPriority = i === 0;

    try {
      const searchTopic = targetLocation ? `${topic} ${targetLocation}` : topic;
      const { news, images } = await getNewsWithImages(searchTopic, isPriority ? 4 : 2);
      const newsContext = news
        .map((n) => `- ${n.title}: ${n.snippet} (Source: ${n.source})`)
        .join('\n');

      const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;

      const wordCountRule = "You MUST write exactly 100 to 150 words in length. Do not write less than 100 words, and do not exceed 150 words. This ensures the layout is dense and perfect.";

      const result = await generateWithAI(
        `You are a professional newspaper journalist. Write an article based on the news source material. ${langInstruction} ${wordCountRule} Do NOT write less than the requested word count, or the layout gaps will be huge. Content Rules: targeted for readers ${locString}.`,
        `Based on these recent news items about "${topic}":\n${newsContext}\n\nWrite a compelling but strict newspaper article. Return JSON with:\n{\n  "headline": "A powerful, attention-grabbing headline (max 12 words)",\n  "content": "A detailed article of exactly 100-150 words",\n  "category": "The news category",\n  "imageCaption": "A brief caption for the article's image (max 15 words)"\n}`
      );

      const parsed = JSON.parse(result);

      // 1. Fetch real photos from DuckDuckGo primarily
      // Use the images already fetched by getNewsWithImages at line 38
      let articleImages = images.slice(0, isPriority ? 3 : 1).map(img => ({
        url: img.url,
        caption: parsed.imageCaption || `News regarding ${topic}`
      }));

      // Fallback only if absolutely no search engine images were found
      if (articleImages.length === 0) {
        const promptBase = encodeURIComponent(`${searchTopic} India realistic news photography`);
        for (let j = 0; j < (isPriority ? 3 : 1); j++) {
          const query = j === 0 ? promptBase : (j === 1 ? promptBase + '%20context' : promptBase + '%20details');
          articleImages.push({
            url: `https://pollinations.ai/p/${query}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 100000)}`,
            caption: parsed.imageCaption || `News regarding ${topic}`
          });
        }
      }

      articles.push({
        id: uuidv4(),
        headline: parsed.headline,
        content: parsed.content,
        images: articleImages,
        imageUrl: articleImages[0]?.url || null,
        imageCaption: parsed.imageCaption || null,
        category: parsed.category || topic,
        source: news[0]?.source || 'Staff Reporter',
        date: new Date().toISOString(),
      });

      // Avoid image scraping rate limits
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error(`Error generating article for ${topic}:`, error);
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

export async function POST(req: NextRequest) {
  try {
    const { type, language, pageCount, targetLocation, articleCount } = await req.json();

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
