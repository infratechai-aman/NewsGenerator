import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/openai';
import { getNewsWithImages } from '@/lib/scraper';
import { generateSudokuData, renderSudokuToDataUrl } from '@/lib/sudoku';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeImageUrl, generateDocumentaryImageUrl } from '@/lib/images';
import { NewsArticle, BriefItem } from '@/types';

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: 'Write all content in English.',
  hindi: 'Write all content in Hindi (हिन्दी). Use Devanagari script.',
  bengali: 'Write all content in Bengali (বাংলা). Use Bengali script.',
};

interface TopicQuery {
  query: string;
  label: string;
  category: string;
}

function getExpandedTopicList(cleanLoc: string): TopicQuery[] {
  if (cleanLoc) {
    return [
      // Page 1: Local Lead & Civic Front Page
      { query: `${cleanLoc} news when:7d`, label: `${cleanLoc} Breaking Lead`, category: 'local' },
      { query: `${cleanLoc} municipal corporation road flyover infrastructure when:7d`, label: `${cleanLoc} Civic & Infrastructure`, category: 'civic' },
      { query: `${cleanLoc} police crime safety investigation security when:7d`, label: `${cleanLoc} Law & Public Safety`, category: 'police' },
      { query: `${cleanLoc} residents society citizen forum water supply traffic when:7d`, label: `${cleanLoc} Community & Urban Life`, category: 'community' },
      { query: `${cleanLoc} metro transport railway transit station expansion when:7d`, label: `${cleanLoc} Transit Corridors`, category: 'transit' },

      // Page 2: Regional State Governance & Politics
      { query: `${cleanLoc} state government cabinet policy administration reforms when:7d`, label: 'State Executive & Administration', category: 'politics' },
      { query: 'India parliament session legislative debate bills governance when:7d', label: 'Parliamentary Affairs', category: 'politics' },
      { query: 'Supreme Court India judiciary constitution bench verdict when:7d', label: 'Judicial Deliberation', category: 'judiciary' },
      { query: 'Election Commission India state assembly democracy voter when:7d', label: 'Electoral & Governance Process', category: 'politics' },
      { query: 'Central government welfare development social security schemes when:7d', label: 'National Welfare Policies', category: 'politics' },
      { query: 'Inter-state council fiscal federalism regional cooperation when:7d', label: 'Fiscal & State Federalism', category: 'politics' },

      // Page 3: International & World Affairs
      { query: 'India foreign policy diplomacy bilateral summits global trade when:7d', label: 'Diplomatic Strategy', category: 'world' },
      { query: 'United Nations security council global cooperation international accords when:7d', label: 'Multilateral Diplomacy', category: 'world' },
      { query: 'Indo-Pacific maritime security trade corridor international pact when:7d', label: 'Global Strategic Corridors', category: 'world' },
      { query: 'Global climate transition sustainable energy investment summit when:7d', label: 'International Climate Accord', category: 'world' },
      { query: 'Cross-border technology treaties artificial intelligence semiconductor trade when:7d', label: 'Tech & Trade Diplomacy', category: 'world' },
      { query: 'International aviation direct air connectivity commercial routes when:7d', label: 'Global Aviation & Logistics', category: 'world' },

      // Page 4: Economy, Markets & High-Tech
      { query: 'BSE Sensex Nifty 50 Indian stock markets foreign investment when:7d', label: 'Capital Markets & Indices', category: 'economy' },
      { query: 'Reserve Bank of India RBI monetary policy banking liquidity repo rate when:7d', label: 'Monetary & Central Banking', category: 'economy' },
      { query: 'India semiconductor microchip wafer fabrication Dholera electronics when:7d', label: 'Indigenous Silicon & Fab', category: 'technology' },
      { query: 'India enterprise artificial intelligence digital startups innovation when:7d', label: 'Artificial Intelligence & DeepTech', category: 'technology' },
      { query: 'Unified Payments Interface UPI digital economy fintech milestone when:7d', label: 'Digital Public Infrastructure', category: 'technology' },
      { query: 'Commercial electric vehicles EV automotive logistics expansion when:7d', label: 'Electric Mobility & Industry', category: 'business' },

      // Page 5: Education, Science & Environment
      { query: 'ISRO space mission satellite launch Gaganyaan Chandrayaan exploration when:7d', label: 'Deep Space & ISRO Milestones', category: 'science' },
      { query: 'India universities UGC IIT research laboratories scientific discovery when:7d', label: 'Higher Academic Research', category: 'education' },
      { query: 'Indigenous clean energy storage sodium battery solar hydrogen when:7d', label: 'Green Energy & Innovation', category: 'science' },
      { query: 'National education curriculum STEM digital literacy secondary schools when:7d', label: 'Educational Modernization', category: 'education' },
      { query: 'Environmental conservation wetlands biodiversity river rejuvenation India when:7d', label: 'Ecological Heritage & Climate', category: 'science' },

      // Page 6: Sports & Athletics
      { query: 'Indian cricket team match test series BCCI ICC tournament trophy when:7d', label: 'Cricket Championship Dispatch', category: 'sports' },
      { query: 'India badminton athletics BWF World Super tournament medal podium when:7d', label: 'Racquet & Field Sports', category: 'sports' },
      { query: 'Indian Super League football clubs tournament match result when:7d', label: 'National Football Championship', category: 'sports' },
      { query: 'Chess India grandmaster tournament victory international masters when:7d', label: 'Chess Grandmaster Circuit', category: 'sports' },

      // Page 7: Entertainment, Heritage & Culture
      { query: 'Indian cinema box office national film awards regional cinema when:7d', label: 'Cinema & Creative Arts', category: 'entertainment' },
      { query: 'Indian classical arts cultural heritage monuments preservation festival when:7d', label: 'Living Heritage & Traditions', category: 'entertainment' },
      { query: 'OTT streaming regional storytelling documentary series acclaim when:7d', label: 'Digital Arts & Streaming', category: 'entertainment' },
      { query: 'Traditional arts crafts biennale handloom master artisans exhibition when:7d', label: 'Crafts & Cultural Mosaic', category: 'entertainment' },
      { query: 'Ayurveda integrative healthcare wellness scientific research centre when:7d', label: 'Living Well & Heritage Science', category: 'entertainment' },

      // Page 8: Editorial & Perspectives
      { query: 'India economic growth demographic dividend infrastructure editorial when:7d', label: 'Editorial: The Road Ahead', category: 'opinion' },
      { query: 'Digital public goods federalism regional aspirations citizen perspective when:7d', label: 'Guest Column: Tech & Federalism', category: 'opinion' },
      { query: 'Higher education deep-tech skills youth demographic transition opinion when:7d', label: 'Essay: Empowering the Future', category: 'opinion' },
      { query: `${cleanLoc} urban governance smart city public participation review when:7d`, label: `${cleanLoc} Civic Voices`, category: 'opinion' },
    ];
  }

  // National Edition topics (when cleanLoc is empty)
  return [
    // Page 1: National Lead & Front Page
    { query: 'India national breaking news parliament government policy when:7d', label: 'National Lead Story', category: 'politics' },
    { query: 'India civic infrastructure national highways high-speed rail when:7d', label: 'National Infrastructure', category: 'civic' },
    { query: 'Supreme Court India landmark constitutional ruling citizen rights when:7d', label: 'Judicial Benchmark', category: 'judiciary' },
    { query: 'Union Cabinet major economic welfare allocation sanctioned when:7d', label: 'Executive Cabinet Blueprint', category: 'politics' },
    { query: 'National digital personal data protection statutory framework when:7d', label: 'Digital Governance', category: 'technology' },

    // Page 2: Politics & State Governance
    { query: 'Parliament session debate electoral reform transparency when:7d', label: 'Parliamentary Reform', category: 'politics' },
    { query: 'Election Commission state assemblies electoral preparedness schedule when:7d', label: 'Electoral Affairs', category: 'politics' },
    { query: 'Inter-state council tax devolution fiscal incentive formula when:7d', label: 'Fiscal Federalism', category: 'politics' },
    { query: 'State governance administrative single-window public services when:7d', label: 'Administrative Modernization', category: 'politics' },
    { query: 'Rural development highway logistics agricultural corridors sanctioned when:7d', label: 'Rural Logistics & Infra', category: 'civic' },
    { query: 'Urban renewal smart municipal corporations transit blueprints when:7d', label: 'Urban Transformation', category: 'civic' },

    // Page 3: International & World Affairs
    { query: 'India multilateral diplomacy summits foreign ministers G20 when:7d', label: 'Global Diplomatic Summit', category: 'world' },
    { query: 'United Nations security council commercial shipping navigation pact when:7d', label: 'Strategic Maritime Corridors', category: 'world' },
    { query: 'Global supply chain semiconductor bilateral trade pact when:7d', label: 'International Industrial Alliances', category: 'world' },
    { query: 'International Solar Alliance clean energy grid funding nations when:7d', label: 'Global Energy Transition', category: 'world' },
    { query: 'Bilateral aviation agreements direct trade and air routes when:7d', label: 'Aviation Corridors', category: 'world' },
    { query: 'Global cybersecurity artificial intelligence ethics treaty when:7d', label: 'World Tech Governance', category: 'world' },

    // Page 4: Business, Economy & Tech
    { query: 'BSE Sensex Nifty 50 record rally foreign institutional investors when:7d', label: 'Stock Markets & Capital Inflow', category: 'economy' },
    { query: 'Reserve Bank of India monetary policy inflation retail credit growth when:7d', label: 'Banking & Monetary Stability', category: 'economy' },
    { query: 'India semiconductor 28nm silicon fabrication commercial chip rollout when:7d', label: 'Indigenous Silicon Fabrication', category: 'technology' },
    { query: 'India enterprise generative AI startups venture funding Q3 when:7d', label: 'Venture Capital & DeepTech', category: 'technology' },
    { query: 'Unified Payments Interface UPI cross-border volume record when:7d', label: 'Fintech & Digital Rails', category: 'technology' },
    { query: 'Electric commercial vehicle sales tier-1 fleet transition when:7d', label: 'EV Mobility Revolution', category: 'business' },

    // Page 5: Education, Science & Environment
    { query: 'ISRO Chandrayaan lunar sample return autonomous docking telemetry when:7d', label: 'ISRO Lunar Architecture', category: 'science' },
    { query: 'IIT researchers sodium-ion energy storage breakthrough patent when:7d', label: 'Materials Science Breakthrough', category: 'science' },
    { query: 'National Research Foundation grants university scientific laboratories when:7d', label: 'University Research Grants', category: 'education' },
    { query: 'Higher education curriculum secondary school AI literacy rollout when:7d', label: 'Curriculum Reform', category: 'education' },
    { query: 'National green corridor wetlands restoration biodiversity project when:7d', label: 'Wetlands Ecological Restoration', category: 'science' },

    // Page 6: Sports & Athletics
    { query: 'India cricket test match series BCCI match report score when:7d', label: 'Cricket Championship Arena', category: 'sports' },
    { query: 'India badminton BWF world tour super 750 championship gold when:7d', label: 'World Badminton Podium', category: 'sports' },
    { query: 'Indian Super League football tournament stadium attendances when:7d', label: 'National Football League', category: 'sports' },
    { query: 'Target Olympic Podium Scheme junior track field athletics inductees when:7d', label: 'Olympic Podium Development', category: 'sports' },

    // Page 7: Entertainment, Lifestyle & Culture
    { query: 'National film awards regional cinema box office acclaimed features when:7d', label: 'Cinema & Cultural Recognition', category: 'entertainment' },
    { query: 'Crafts biennale traditional handloom master artisans heritage Red Fort when:7d', label: 'Heritage Arts & Weaves', category: 'entertainment' },
    { query: 'Domestic streaming OTT originals regional storytelling viewership when:7d', label: 'Streaming Storytelling', category: 'entertainment' },
    { query: 'Restored historical architecture stepwell precinct UNESCO heritage honour when:7d', label: 'UNESCO Architectural Heritage', category: 'entertainment' },
    { query: 'Integrative medicine Ayurveda translational scientific research centre when:7d', label: 'Integrative Wellness Science', category: 'entertainment' },

    // Page 8: Editorial & Perspectives
    { query: 'India economic growth demographic potential editorial analysis when:7d', label: 'Editorial: The Road Ahead', category: 'opinion' },
    { query: 'Digital public infrastructure federalism democratic institutions column when:7d', label: 'Guest Column: Democratic Rails', category: 'opinion' },
    { query: 'Higher education workforce alignment deep-tech transformation essay when:7d', label: 'Special Essay: Education Revolution', category: 'opinion' },
    { query: 'Grassroots innovation tier-2 tier-3 entrepreneurs transformation when:7d', label: 'Voices: Bharat Innovators', category: 'opinion' },
  ];
}

async function generateSingleArticleFromTopic(
  topicItem: TopicQuery,
  language: string,
  cleanLoc: string,
  isPriority: boolean = false
): Promise<NewsArticle | null> {
  try {
    const { news } = await getNewsWithImages(
      topicItem.query,
      isPriority ? 4 : 2,
      cleanLoc || undefined
    );

    const realItem = news[0];
    const locString = cleanLoc ? ` in ${cleanLoc}` : ' in India';
    const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.english;
    const wordCountRule = 'You MUST write exactly 110 to 145 words in length across 2 to 3 paragraphs. Avoid filler, avoid vague summaries. Present concrete facts, statistics, and authentic journalistic phrasing.';

    const promptContext = realItem
      ? `REAL BREAKING NEWS EVENT REPORTED IN PAST 7 DAYS:
Headline: "${realItem.title}"
Source Outlet: ${realItem.source}
Reported Date: ${realItem.date || 'Past 7 days'}
Key Snippet: ${realItem.snippet}
Location Context: ${cleanLoc || 'National India'}

Write an authentic, highly detailed broadsheet report based STRICTLY on this real event.`
      : `Write an authentic, non-repetitive broadsheet article about tangible ${topicItem.label}${locString}. Focus on tangible civic, infrastructure, or institutional updates.`;

    const result = await generateWithAI(
      `You are a senior chief editor for an authentic daily broadsheet newspaper (like The Hindu or The Indian Express). ${langInstruction} ${wordCountRule} Write with journalistic authority, neutral editorial tone, and rich broadsheet density.`,
      `${promptContext}\n\nReturn strictly valid JSON with:
{
  "headline": "A dramatic, authentic broadsheet headline (max 12 words)",
  "subHeadline": "An insightful secondary headline deck (10-15 words)",
  "content": "A structured, journalistic article of exactly 110-145 words across 2-3 paragraphs",
  "category": "${topicItem.category}",
  "pullQuote": "A striking 10-15 word quotation or memorable takeaway",
  "keyHighlights": ["Key point 1", "Key point 2", "Key point 3"],
  "imageCaption": "A descriptive, factual photojournalist caption (max 15 words)"
}`
    );

    const parsed = JSON.parse(result);

    // Verified Indian Press Photography from clean curated pools
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

    if (isPriority && news[1]) {
      articleImages.push({
        url: sanitizeImageUrl(
          news[1].imageUrl || generateDocumentaryImageUrl(news[1].title, parsed.category || topicItem.category, cleanLoc),
          parsed.category || topicItem.category
        ),
        caption: `Related developments in ${cleanLoc || 'the state'}`,
      });
    }

    return {
      id: uuidv4(),
      headline: parsed.headline,
      subHeadline: parsed.subHeadline || undefined,
      content: parsed.content,
      images: articleImages,
      imageUrl: primaryPhotoUrl,
      imageCaption: parsed.imageCaption || null,
      category: parsed.category || topicItem.category,
      source: realItem?.source || 'Special Correspondent',
      date: realItem?.date || new Date().toISOString(),
      pullQuote: parsed.pullQuote || undefined,
      keyHighlights: Array.isArray(parsed.keyHighlights) ? parsed.keyHighlights : undefined,
    };
  } catch (error) {
    console.error(`Error generating article for ${topicItem.query}:`, error);
    return null;
  }
}

async function generateArticles(
  language: string,
  pageCount: number = 4,
  targetLocation: string = '',
  articleCountSetting?: number
): Promise<NewsArticle[]> {
  const cleanLoc = (targetLocation || '').trim();
  const topics = getExpandedTopicList(cleanLoc);

  // Guarantee sufficient articles to fill all slots: 4 pages = ~22 articles, 8 pages = ~42 articles
  const totalDesired = articleCountSetting || Math.max(pageCount * 5 + 2, 22);
  const selectedTopics = topics.slice(0, totalDesired);
  const articles: NewsArticle[] = [];

  // Process in concurrent batches of 4 for speed & stability
  const batchSize = 4;
  for (let i = 0; i < selectedTopics.length; i += batchSize) {
    const batch = selectedTopics.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((topicItem, batchIdx) =>
        generateSingleArticleFromTopic(topicItem, language, cleanLoc, i + batchIdx === 0)
      )
    );

    for (const art of batchResults) {
      if (art) articles.push(art);
    }
  }

  return articles;
}

function generateCategoryBriefs(
  articles: NewsArticle[],
  cleanLoc: string
): Record<string, BriefItem[]> {
  const loc = cleanLoc ? `${cleanLoc}: ` : '';

  // Extract real headlines from generated articles to populate briefs
  const headlinesByCat: Record<string, string[]> = {};
  for (const art of articles) {
    const cat = art.category || 'general';
    if (!headlinesByCat[cat]) headlinesByCat[cat] = [];
    headlinesByCat[cat].push(art.headline);
  }

  const findHl = (cats: string[], fallback: string) => {
    for (const c of cats) {
      if (headlinesByCat[c] && headlinesByCat[c].length > 0) {
        return headlinesByCat[c].shift()!;
      }
    }
    return fallback;
  };

  return {
    'front-page': [
      { category: 'Markets', headline: findHl(['economy', 'business'], 'Sensex and Nifty maintain resilient momentum backed by strong institutional inflows'), page: '4' },
      { category: 'Space', headline: findHl(['science'], 'ISRO advances mission parameters for upcoming lunar exploration stage'), page: '5' },
      { category: 'Cricket', headline: findHl(['sports'], 'India seals commanding position in premier championship encounter'), page: '6' },
      { category: 'Governance', headline: findHl(['politics', 'local'], `${loc}Administrative committee sanctions priority urban infrastructure package`), page: '2' },
      { category: 'Diplomacy', headline: findHl(['world', 'international'], 'Global delegations ratify landmark multilateral technology and trade accord'), page: '3' },
    ],
    'politics': [
      { category: 'Parliament', headline: findHl(['politics'], 'Legislative consultative committee reviews comprehensive statutory governance updates'), page: '2' },
      { category: 'Election', headline: findHl(['politics'], 'Election Commission advances administrative readiness for state assembly schedule'), page: '2' },
      { category: 'Judiciary', headline: findHl(['judiciary'], 'Constitutional bench affirms statutory protocols on digital governance delivery'), page: '3' },
      { category: 'Policy', headline: findHl(['politics', 'civic'], 'Union cabinet approves expanded allocations for rural and transit logistics'), page: '2' },
    ],
    'international': [
      { category: 'Diplomacy', headline: findHl(['world'], 'Multilateral summit delegates endorse binding clean energy transition framework'), page: '3' },
      { category: 'Trade', headline: findHl(['world'], 'Cross-border technology agreements streamline semiconductor supply chain corridors'), page: '3' },
      { category: 'Maritime', headline: findHl(['world'], 'International maritime agencies coordinate security protocols across key straits'), page: '3' },
      { category: 'Energy', headline: findHl(['world', 'science'], 'Global clean power alliance announces expanded funding for microgrid deployment'), page: '3' },
    ],
    'business-tech': [
      { category: 'Semiconductor', headline: findHl(['technology'], 'Indigenous silicon fabrication units enter advanced commercial packaging validation'), page: '4' },
      { category: 'Startups', headline: findHl(['business', 'technology'], 'Early-stage venture capital investments demonstrate robust rebound across deep-tech'), page: '4' },
      { category: 'Fintech', headline: findHl(['technology', 'economy'], 'Digital payment volumes achieve historic monthly peak driven by retail adoption'), page: '4' },
      { category: 'Mobility', headline: findHl(['business', 'transit'], 'Commercial electric vehicle fleets register accelerated adoption in major freight hubs'), page: '4' },
    ],
    'education-science': [
      { category: 'Research', headline: findHl(['science', 'education'], 'National laboratories register breakthrough patent for high-density energy storage'), page: '5' },
      { category: 'Academia', headline: findHl(['education'], 'Higher academic council introduces interdisciplinary digital literacy curricula'), page: '5' },
      { category: 'Space', headline: findHl(['science'], 'ISRO telemetry centres confirm operational milestone for satellite constellation'), page: '5' },
      { category: 'Ecology', headline: findHl(['science', 'civic'], 'Comprehensive wetland restoration projects revive sensitive regional ecosystems'), page: '5' },
    ],
    'sports': [
      { category: 'Cricket', headline: findHl(['sports'], 'BCCI announces revamped domestic calendar with pink-ball championship fixtures'), page: '6' },
      { category: 'Badminton', headline: findHl(['sports'], 'National doubles pair advances to finals at international super 750 tournament'), page: '6' },
      { category: 'Football', headline: findHl(['sports'], 'National football league opener registers record stadium attendances'), page: '6' },
      { category: 'Chess', headline: findHl(['sports'], 'Indian grandmasters dominate international masters round-robin standings'), page: '6' },
    ],
    'entertainment-lifestyle': [
      { category: 'Cinema', headline: findHl(['entertainment'], 'National film jury honours outstanding regional storytelling at annual gala'), page: '7' },
      { category: 'Heritage', headline: findHl(['entertainment'], 'Centuries-old architectural precinct receives international heritage recognition'), page: '7' },
      { category: 'Crafts', headline: findHl(['entertainment'], 'Triennial crafts biennale showcases traditional weave and sculpture masters'), page: '7' },
      { category: 'Wellness', headline: findHl(['entertainment'], 'Integrative health centre opens for translational clinical research'), page: '7' },
    ],
    'opinion-features': [
      { category: 'Editorial', headline: findHl(['opinion'], 'Balancing rapid technological acceleration with shared societal equity'), page: '8' },
      { category: 'Perspective', headline: findHl(['opinion'], 'Urban revitalization and the future of India’s competitive tier-2 cities'), page: '8' },
      { category: 'Essay', headline: findHl(['opinion'], 'How grassroots innovators are solving high-impact regional challenges at scale'), page: '8' },
      { category: 'Column', headline: findHl(['opinion'], 'Reimagining cooperative federalism through digital public infrastructure'), page: '8' },
    ],
  };
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
      case 'briefs':
        content = generateCategoryBriefs([], targetLocation || '');
        break;
      case 'auto-pilot':
      case 'full-edition': {
        // 1. Generate full set of real broadsheet articles
        const articles = await generateArticles(language, pageCount || 4, targetLocation || '', articleCount);
        
        // 2. Concurrently generate all companion widgets and category briefs
        const [
          horoscope,
          facts,
          sudoku,
          crypticClue,
          houseAds,
          keyIndicators,
          weather,
          tvGuide,
        ] = await Promise.all([
          generateHoroscope(language).catch(() => null),
          generateFacts(language).catch(() => null),
          Promise.resolve(generateSudoku()),
          generateCrypticClue(language).catch(() => null),
          generateHouseAds(language).catch(() => []),
          generateKeyIndicators(language).catch(() => null),
          generateWeather(language, targetLocation).catch(() => null),
          generateTvGuide(language, targetLocation).catch(() => null),
        ]);

        const briefs = generateCategoryBriefs(articles, targetLocation || '');

        content = {
          articles,
          briefs,
          horoscope,
          facts,
          sudoku,
          crypticClue,
          houseAds,
          keyIndicators,
          weather,
          tvGuide,
        };
        break;
      }
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
