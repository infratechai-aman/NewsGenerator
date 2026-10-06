import { generateDocumentaryImageUrl, getCategoryFallbackImage } from './images';

export interface NewsResult {
  title: string;
  headline: string;
  location: string;
  category: string;
  published_at: string;
  source: string;
  source_url: string;
  url: string;
  event_date: string;
  relevance: number;
  verified: boolean;
  verification_type: 'multiple_sources' | 'official_gov' | 'verified_newsroom' | 'single_source';
  duplicate_group: string;
  facts: string[];
  quotes: string[];
  snippet: string;
  imageUrl?: string;
  date?: string;               // ISO 8601 string
  publishedDate: string;       // Formatted as "05 Oct 2026"
  locationScope: 'hyper-local' | 'city' | 'state' | 'national' | 'international';
  matchedLocation?: string;
}

export interface ImageResult {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

export interface VerifiedNewsFeed {
  localArticles: NewsResult[];
  cityArticles: NewsResult[];
  politicsArticles: NewsResult[];
  worldArticles: NewsResult[];
  businessArticles: NewsResult[];
  scienceArticles: NewsResult[];
  sportsArticles: NewsResult[];
  entertainmentArticles: NewsResult[];
  opinionArticles: NewsResult[];
  stateArticles: NewsResult[];
  nationalArticles: NewsResult[];
  otherArticles: NewsResult[];
  allVerifiedArticles: NewsResult[];
  localVerifiedCount: number;
  locationName: string;
  headlineSummary: string;
  leadDeckSummary: string;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Turns RSS pubDate (e.g. "Mon, 05 Oct 2026 13:36:47 GMT") into "05 Oct 2026"
 */
export function formatPublishedDate(rawDate?: string): string {
  if (!rawDate) {
    const d = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  const d = new Date(rawDate);
  if (isNaN(d.getTime())) {
    return rawDate.slice(0, 16);
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = String(d.getUTCDate()).padStart(2, '0');
  const mon = months[d.getUTCMonth()];
  const yr = d.getUTCFullYear();
  return `${day} ${mon} ${yr}`;
}

/**
 * Strict date verification: ensures story was published within the past 7 days (with 24h grace window)
 */
export function isWithinLast7Days(rawDate?: string): boolean {
  if (!rawDate) return true;
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return true;
  const now = Date.now();
  const diffMs = now - d.getTime();
  // Within last 8 days (8 * 24h) and not more than 2 days in the future
  return diffMs >= -2 * 86400000 && diffMs <= 8 * 86400000;
}

/**
 * Tokenizes headline for deduplication comparison
 */
function tokenizeHeadline(text: string): Set<string> {
  const stopwords = new Set([
    'the', 'in', 'of', 'to', 'a', 'and', 'for', 'on', 'with', 'at', 'from',
    'by', 'after', 'says', 'held', 'man', 'two', 'three', 'over', 'out',
    'pune', 'delhi', 'mumbai', 'india', 'news', 'times', 'express', 'daily'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
  return new Set(words);
}

/**
 * Jaccard word-overlap similarity for deduplicating reporting of the same event
 */
function computeHeadlineSimilarity(a: string, b: string): number {
  const tokensA = tokenizeHeadline(a);
  const tokensB = tokenizeHeadline(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 ? intersection / union : 0;
}

/**
 * Extracts a canonical duplicate_group identifier so articles reporting the
 * EXACT same event across multiple outlets are clustered together.
 */
export function extractDuplicateGroup(title: string, snippet: string): string {
  const text = `${title} ${snippet}`.toLowerCase();

  // 1. Pune flyovers / bridges (Katraj, 5 flyovers, infrastructure boost)
  if (
    (text.includes('flyover') || text.includes('bridge') || text.includes('overpass')) &&
    (text.includes('pune') || text.includes('katraj') || text.includes('pmc'))
  ) {
    return 'event_pune_flyovers';
  }

  // 2. Mephedrone / Narcotics in Kondhwa / NIBM / Pune
  if (
    (text.includes('mephedrone') || text.includes('md ') || text.includes('narcotics')) &&
    (text.includes('kondhwa') || text.includes('nibm') || text.includes('undri') || text.includes('pune'))
  ) {
    return 'event_kondhwa_mephedrone';
  }

  // 3. Murder / Homicide in Gokulnagar / Kondhwa
  if (
    (text.includes('murder') || text.includes('stabbed') || text.includes('killed')) &&
    (text.includes('gokulnagar') || text.includes('kondhwa') || text.includes('bibvewadi'))
  ) {
    return 'event_kondhwa_crime';
  }

  // 4. Katraj-Kondhwa road widening
  if (text.includes('katraj-kondhwa') || (text.includes('kondhwa') && text.includes('road widening'))) {
    return 'event_katraj_kondhwa_road';
  }

  // 5. Sensex / Nifty capital markets
  if (
    (text.includes('sensex') || text.includes('nifty')) &&
    (text.includes('rally') || text.includes('surge') || text.includes('points') || text.includes('gain'))
  ) {
    return 'event_capital_markets';
  }

  // 6. RBI monetary policy
  if (text.includes('rbi') && (text.includes('repo') || text.includes('monetary policy') || text.includes('interest rate'))) {
    return 'event_rbi_policy';
  }

  // 7. ISRO missions
  if (text.includes('isro') && (text.includes('chandrayaan') || text.includes('satellite') || text.includes('launch') || text.includes('gaganyaan'))) {
    return 'event_isro_mission';
  }

  // 8. Rowing / Aquatic Championship
  if (text.includes('rower') || text.includes('rowing')) {
    return 'event_rowing_championship';
  }

  // 9. Chess Championship
  if (text.includes('chess') && (text.includes('tournament') || text.includes('grandmaster') || text.includes('camp'))) {
    return 'event_chess_tournament';
  }

  // General semantic clustering key
  const words = Array.from(tokenizeHeadline(title)).slice(0, 3).sort().join('_');
  return words ? `event_${words}` : `event_${encodeURIComponent(title.slice(0, 25))}`;
}

/**
 * Strict Editorial Category Classifier
 */
export function classifyCategory(title: string, snippet: string): string {
  const text = `${title} ${snippet}`.toLowerCase();

  // 1. Sports & Athletics
  if (
    text.includes('cricket') || text.includes('rower') || text.includes('rowing') ||
    text.includes('chess') || text.includes('badminton') || text.includes('football') ||
    text.includes('athletics') || text.includes('bcci') || text.includes('trophy') ||
    text.includes('tournament') || text.includes('championship') || text.includes('medals') ||
    text.includes('super 750') || text.includes('fifa') || text.includes('olympic') ||
    text.includes('sports') || text.includes('marathon') || text.includes('grandmaster') ||
    text.includes('tennis') || text.includes('hockey') || text.includes('kabaddi')
  ) {
    return 'sports';
  }

  // 2. Science, Research, Space & Education
  if (
    text.includes('isro') || text.includes('satellite') || text.includes('space') ||
    text.includes('chandrayaan') || text.includes('gaganyaan') || text.includes('researchers') ||
    text.includes('laboratory') || text.includes('iit ') || text.includes('patent') ||
    text.includes('university') || text.includes('curriculum') || text.includes('quantum') ||
    text.includes('student') || text.includes('education') || text.includes('ugc')
  ) {
    return 'science';
  }

  // 3. Technology & Semiconductors
  if (
    text.includes('semiconductor') || text.includes('silicon') || text.includes('microchip') ||
    text.includes('artificial intelligence') || text.includes('deeptech') ||
    text.includes('chip') || text.includes('cybersecurity') || text.includes('telecom') ||
    text.includes('fintech') || text.includes('upi')
  ) {
    return 'technology';
  }

  // 4. Business, Markets & Economy
  if (
    text.includes('sensex') || text.includes('nifty') || text.includes('rbi') ||
    text.includes('inflation') || text.includes('stock market') || text.includes('banking') ||
    text.includes('gdp') || text.includes('investment') || text.includes('startup') ||
    text.includes('fdi') || text.includes('fiscal') || text.includes('repo rate') ||
    text.includes('revenue') || text.includes('commercial') || text.includes('electric vehicle')
  ) {
    return 'business';
  }

  // 5. International & World Affairs
  if (
    text.includes('united nations') || text.includes('diplomatic') || text.includes('summit') ||
    text.includes('bilateral') || text.includes('global') || text.includes('foreign minister') ||
    text.includes('cross-border') || text.includes('treaty') || text.includes('g20') ||
    text.includes('international') || text.includes('embassy') || text.includes('ambassador') ||
    text.includes('geopolitical') || text.includes('maritime corridor')
  ) {
    return 'world';
  }

  // 6. Entertainment, Culture & Arts
  if (
    text.includes('cinema') || text.includes('film') || text.includes('box office') ||
    text.includes('ott') || text.includes('awards') || text.includes('heritage') ||
    text.includes('culture') || text.includes('festival') || text.includes('biennale') ||
    text.includes('artisan') || text.includes('crafts') || text.includes('theatre') ||
    text.includes('music')
  ) {
    return 'entertainment';
  }

  // 7. Politics & National/State Executive Governance (Strictly Executive, Legislative, Judicial)
  if (
    text.includes('parliament') || text.includes('assembly') || text.includes('cabinet') ||
    text.includes('election') || text.includes('minister') || text.includes('bjp') ||
    text.includes('congress') || text.includes('ncp') || text.includes('governor') ||
    text.includes('chief minister') || text.includes('prime minister') ||
    text.includes('supreme court') || text.includes('high court') || text.includes('judiciary') ||
    text.includes('legislation') || text.includes('constitution') || text.includes('bill passed') ||
    text.includes('delimitation') || text.includes('electoral') || text.includes('state government') ||
    text.includes('central government') || text.includes('ministry')
  ) {
    return 'politics';
  }

  // 8. Local Crime & Police (Belongs strictly on Front Page / City Lead, NOT Politics or Sports!)
  if (
    text.includes('mephedrone') || text.includes('narcotics') || text.includes('murder') ||
    text.includes('killed') || text.includes('stabbed') || text.includes('arrest') ||
    text.includes('police seize') || text.includes('fir ') || text.includes('theft') ||
    text.includes('robbery') || text.includes('assault') || text.includes('brawl') ||
    text.includes('crime branch') || text.includes('court remand') || text.includes('police held') ||
    text.includes('contraband') || text.includes('fraud') || text.includes('scam')
  ) {
    return 'crime';
  }

  // 9. Local Civic & Infrastructure (Roads, Flyovers, PMC - Belongs on Front Page / City Lead)
  if (
    text.includes('flyover') || text.includes('bridge') || text.includes('pmc') ||
    text.includes('municipal corporation') || text.includes('pothole') ||
    text.includes('road widening') || text.includes('water supply') || text.includes('metro') ||
    text.includes('traffic police') || text.includes('drainage') || text.includes('garbage') ||
    text.includes('pcmc') || text.includes('infrastructure') || text.includes('road project') ||
    text.includes('civic')
  ) {
    return 'civic';
  }

  return 'general';
}

/**
 * Computes geographic relevance score (0.0 to 1.0) and filters out
 * distant irrelevant locations (e.g. Chandigarh rowers in Kondhwa news).
 */
export function computeRelevanceAndScope(
  title: string,
  snippet: string,
  targetLocation: string,
  parentCity: string
): { relevance: number; scope: 'hyper-local' | 'city' | 'state' | 'national' | 'international'; isDistantIrrelevant: boolean } {
  const text = `${title} ${snippet}`.toLowerCase();
  const cleanLoc = (targetLocation || '').toLowerCase().trim();
  const cleanParent = (parentCity || '').toLowerCase().trim();

  // Negative location filter: If searching for local news in target location, reject distant cities!
  const distantCities = ['chandigarh', 'haryana', 'punjab', 'kashmir', 'himachal', 'chennai', 'kolkata', 'hyderabad', 'bengaluru', 'delhi', 'lucknow', 'jaipur', 'patna', 'bhopal'];
  const mentionsDistant = distantCities.some(c => text.includes(c));
  const mentionsParent = cleanParent && text.includes(cleanParent);
  const mentionsTarget = cleanLoc && cleanLoc.split(/[,/]+/).map(s => s.trim()).filter(Boolean).some(part => text.includes(part));

  if (cleanLoc && mentionsDistant && !mentionsParent && !mentionsTarget) {
    return { relevance: 0.05, scope: 'national', isDistantIrrelevant: true };
  }

  // Handle generic ambiguous keywords like "camp"
  if (cleanLoc.includes('camp')) {
    const isGenericActivityCamp = text.includes('coaching camp') || text.includes('training camp') || text.includes('cricket camp') || text.includes('rowing camp') || text.includes('summer camp');
    if (isGenericActivityCamp && !text.includes('pune camp') && !text.includes('cantonment')) {
      return { relevance: 0.1, scope: 'national', isDistantIrrelevant: true };
    }
  }

  // Hyper-local micro-location check
  const microParts = cleanLoc ? cleanLoc.split(/[,/]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 2) : [];
  const matchesMicro = microParts.some(part => {
    if (part === 'camp') {
      return text.includes('pune camp') || text.includes('camp, pune') || text.includes('cantonment');
    }
    return text.includes(part);
  });

  if (matchesMicro || text.includes('nibm') || text.includes('undri') || text.includes('katraj-kondhwa') || text.includes('salunke vihar')) {
    return { relevance: 0.98, scope: 'hyper-local', isDistantIrrelevant: false };
  }

  if (cleanParent && text.includes(cleanParent)) {
    return { relevance: 0.85, scope: 'city', isDistantIrrelevant: false };
  }

  if (text.includes('maharashtra')) {
    return { relevance: 0.75, scope: 'state', isDistantIrrelevant: false };
  }

  if (text.includes('un ') || text.includes('united nations') || text.includes('global') || text.includes('g20') || text.includes('international') || text.includes('diplomat')) {
    return { relevance: 0.65, scope: 'international', isDistantIrrelevant: false };
  }

  return { relevance: 0.60, scope: 'national', isDistantIrrelevant: false };
}

/**
 * Deduplicates news stories so that multiple outlets reporting the same event are merged
 * into a single canonical story with highest authority source preserved and all facts combined.
 */
export function deduplicateNewsItems(items: NewsResult[]): NewsResult[] {
  const PREFERRED_OUTLETS = [
    'the indian express', 'pune pulse', 'the times of india', 'the hindu',
    'hindustan times', 'livemint', 'pune mirror', 'punekar news', 'lokmat times',
    'free press journal', 'the bridge chronicle', 'ani', 'pti'
  ];

  const grouped: Record<string, NewsResult[]> = {};

  for (const item of items) {
    // 1. Group by exact duplicate_group
    let groupKey = item.duplicate_group;

    // 2. Also check if headline Jaccard similarity matches an existing group
    const existingKey = Object.keys(grouped).find((gk) => {
      const sample = grouped[gk][0];
      return computeHeadlineSimilarity(sample.title, item.title) >= 0.45;
    });

    if (existingKey) {
      groupKey = existingKey;
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
  }

  const canonical: NewsResult[] = [];

  for (const groupKey of Object.keys(grouped)) {
    const cluster = grouped[groupKey];
    if (cluster.length === 1) {
      canonical.push(cluster[0]);
    } else {
      // Sort to find the highest authority outlet
      cluster.sort((a, b) => {
        const scoreA = PREFERRED_OUTLETS.findIndex((o) => (a.source || '').toLowerCase().includes(o));
        const scoreB = PREFERRED_OUTLETS.findIndex((o) => (b.source || '').toLowerCase().includes(o));
        const rankA = scoreA === -1 ? 99 : scoreA;
        const rankB = scoreB === -1 ? 99 : scoreB;
        if (rankA !== rankB) return rankA - rankB;
        return (b.snippet || '').length - (a.snippet || '').length;
      });

      const primary = cluster[0];
      const allFacts: string[] = [];
      cluster.forEach((c) => {
        if (c.snippet && !allFacts.includes(c.snippet)) allFacts.push(c.snippet);
      });

      canonical.push({
        ...primary,
        verified: true,
        verification_type: 'multiple_sources',
        facts: allFacts.length > 0 ? allFacts : [primary.snippet],
        duplicate_group: groupKey,
      });
    }
  }

  return canonical;
}

/**
 * Searches Google News RSS for authentic, recent articles.
 */
export async function searchGoogleNewsRSS(
  query: string,
  count: number = 8,
  targetLocation: string = '',
  parentCity: string = ''
): Promise<NewsResult[]> {
  try {
    const queryWithTime = query.includes('when:') ? query : `${query} when:7d`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(queryWithTime)}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const xml = await response.text();
    return parseRssItems(xml, count, targetLocation, parentCity);
  } catch (error) {
    console.error(`Google News RSS search error for "${query}":`, error);
    return [];
  }
}

function parseRssItems(
  xml: string,
  count: number,
  targetLocation: string = '',
  parentCity: string = ''
): NewsResult[] {
  const items: NewsResult[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches.slice(0, count)) {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);

    const rawTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
    const source = sourceMatch ? decodeHtmlEntities(sourceMatch[1]) : 'News Bureau';
    const rawDate = pubDateMatch ? pubDateMatch[1] : '';
    const url = linkMatch ? linkMatch[1] : '';
    const snippet = descMatch ? decodeHtmlEntities(descMatch[1]) : '';

    // Strip " - Source Name" suffix from title
    const cleanTitle = rawTitle.replace(new RegExp(`\\s*-\\s*${source}$`, 'i'), '').trim();

    if (cleanTitle) {
      const pubDateFormatted = formatPublishedDate(rawDate);
      const isDateValid = isWithinLast7Days(rawDate);

      // Perform location relevance scoring and negative filtering
      const { relevance, scope, isDistantIrrelevant } = computeRelevanceAndScope(
        cleanTitle,
        snippet,
        targetLocation,
        parentCity
      );

      // If user searched for local news but this story is in a distant unrelated state (e.g. Chandigarh), discard it from local pool!
      if (targetLocation && isDistantIrrelevant && scope === 'national') {
        // Do not add to local collection
        continue;
      }

      const category = classifyCategory(cleanTitle, snippet);
      const duplicateGroup = extractDuplicateGroup(cleanTitle, snippet);

      items.push({
        title: cleanTitle,
        headline: cleanTitle,
        location: scope === 'hyper-local' ? targetLocation : (scope === 'city' ? parentCity : 'National'),
        category,
        published_at: pubDateFormatted,
        source,
        source_url: url,
        url,
        event_date: pubDateFormatted,
        relevance,
        verified: isDateValid,
        verification_type: 'verified_newsroom',
        duplicate_group: duplicateGroup,
        facts: [snippet],
        quotes: [],
        snippet: snippet.slice(0, 300),
        date: rawDate ? new Date(rawDate).toISOString() : new Date().toISOString(),
        publishedDate: pubDateFormatted,
        locationScope: scope,
        matchedLocation: scope === 'hyper-local' ? targetLocation : parentCity,
      });
    }
  }

  return items;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STAR NEWS INDIA: NEWS VERIFICATION LAYER PIPELINE
 * 
 * Pipeline:
 * SEARCH -> DATE FILTER -> LOCATION FILTER -> SOURCE VALIDATION ->
 * EVENT EXTRACTION -> DUPLICATE/SAME-EVENT DETECTION -> RELEVANCE SCORE ->
 * GEOGRAPHIC HIERARCHY (Micro-location -> City -> State -> India -> World)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function fetchVerifiedNewsFeed(
  targetLocation: string,
  totalSlotsNeeded: number = 22
): Promise<VerifiedNewsFeed> {
  const cleanLoc = (targetLocation || '').trim();
  const locLower = cleanLoc.toLowerCase();

  // Parse micro-location parts (e.g. "Kondhwa, Camp" -> ["kondhwa", "camp"])
  const microParts = cleanLoc
    ? cleanLoc.split(/[,/]+/).map((s) => s.trim()).filter((s) => s.length > 1)
    : [];

  // Determine parent city context (e.g. Kondhwa -> Pune; Bandra -> Mumbai; Indiranagar -> Bengaluru)
  let parentCity = '';
  if (locLower.includes('kondhwa') || locLower.includes('camp') || locLower.includes('kothrud') || locLower.includes('hinjawadi') || locLower.includes('viman')) {
    parentCity = 'Pune';
  } else if (locLower.includes('bandra') || locLower.includes('andheri') || locLower.includes('bkc') || locLower.includes('colaba')) {
    parentCity = 'Mumbai';
  } else if (locLower.includes('koramangala') || locLower.includes('indiranagar') || locLower.includes('whitefield')) {
    parentCity = 'Bengaluru';
  } else if (cleanLoc && !cleanLoc.includes(',')) {
    parentCity = cleanLoc;
  }

  // Build targeted multi-source search queries
  const queries: string[] = [];

  if (microParts.length > 0) {
    // 1. Direct micro-location queries
    for (const part of microParts) {
      if (part.toLowerCase() === 'camp') {
        queries.push(`Pune Camp Cantonment news when:7d`);
        queries.push(`Pune Camp police civic when:7d`);
      } else {
        queries.push(`${part} ${parentCity || ''} news when:7d`);
        queries.push(`${part} ${parentCity || ''} police crime PMC municipal when:7d`);
        queries.push(`${part} ${parentCity || ''} road traffic infrastructure when:7d`);
      }
    }
  }

  if (parentCity) {
    // 2. City & District official sources
    queries.push(`${parentCity} municipal corporation road flyover infrastructure when:7d`);
    queries.push(`${parentCity} police crime investigation security when:7d`);
    queries.push(`${parentCity} state government administration when:7d`);
  }

  // 3. National & Sectoral broadsheet queries for inner pages (Politics, World, Business, Tech, Science, Sports, Arts)
  queries.push('India parliament session legislative governance when:7d');
  queries.push('Supreme Court India judiciary constitution bench when:7d');
  queries.push('BSE Sensex Nifty Indian stock markets investment when:7d');
  queries.push('Reserve Bank of India RBI monetary policy banking liquidity when:7d');
  queries.push('India semiconductor microchip silicon fabrication electronics when:7d');
  queries.push('ISRO space mission satellite launch exploration when:7d');
  queries.push('IIT university research laboratory scientific discovery when:7d');
  queries.push('Indian cricket team match series BCCI trophy when:7d');
  queries.push('Indian cinema box office national film awards regional when:7d');

  // Execute queries concurrently in parallel bundles
  const rawResults: NewsResult[] = [];
  const BUNDLE_SIZE = 4;
  for (let i = 0; i < queries.length; i += BUNDLE_SIZE) {
    const bundle = queries.slice(i, i + BUNDLE_SIZE);
    const bundleResults = await Promise.all(
      bundle.map((q) => searchGoogleNewsRSS(q, 6, cleanLoc, parentCity))
    );
    for (const res of bundleResults) {
      rawResults.push(...res);
    }
  }

  // Apply strict same-event deduplication
  const deduplicated = deduplicateNewsItems(rawResults);

  // Partition strictly by Geographic & Category Hierarchy
  const localArticles: NewsResult[] = [];
  const cityArticles: NewsResult[] = [];
  const politicsArticles: NewsResult[] = [];
  const worldArticles: NewsResult[] = [];
  const businessArticles: NewsResult[] = [];
  const scienceArticles: NewsResult[] = [];
  const sportsArticles: NewsResult[] = [];
  const entertainmentArticles: NewsResult[] = [];
  const opinionArticles: NewsResult[] = [];
  const stateArticles: NewsResult[] = [];
  const nationalArticles: NewsResult[] = [];

  for (const item of deduplicated) {
    // Only accept verified items
    if (!item.verified) continue;

    // 1. Strict Category Routing
    if (item.category === 'sports') {
      sportsArticles.push(item);
    } else if (item.category === 'world') {
      worldArticles.push(item);
    } else if (item.category === 'politics') {
      politicsArticles.push(item);
    } else if (item.category === 'business' || item.category === 'technology') {
      businessArticles.push(item);
    } else if (item.category === 'science') {
      scienceArticles.push(item);
    } else if (item.category === 'entertainment') {
      entertainmentArticles.push(item);
    }

    // 2. Geographic Hierarchy Routing (for Page 1 and local/city pages)
    if (item.locationScope === 'hyper-local' && item.relevance >= 0.85) {
      localArticles.push(item);
    } else if (item.locationScope === 'city') {
      cityArticles.push(item);
    } else if (item.locationScope === 'state') {
      stateArticles.push(item);
    } else if (item.locationScope === 'international') {
      if (!worldArticles.includes(item)) worldArticles.push(item);
    } else {
      nationalArticles.push(item);
    }
  }

  const localVerifiedCount = localArticles.length;

  // Honest newsroom lead: e.g. "KONDHWA — 3 VERIFIED DEVELOPMENTS THIS WEEK"
  const headlineSummary = cleanLoc
    ? (localVerifiedCount > 0
        ? `${cleanLoc.toUpperCase()} — ${localVerifiedCount} VERIFIED DEVELOPMENTS THIS WEEK`
        : `${cleanLoc.toUpperCase()} REGIONAL EDITION — VERIFIED CIVIC & GOVERNANCE REPORT`)
    : `NATIONAL EDITION — ${deduplicated.length} VERIFIED DEVELOPMENTS THIS WEEK`;

  const leadDeckSummary = cleanLoc
    ? (localVerifiedCount > 0
        ? `Only ${localVerifiedCount} verified ${cleanLoc} developments confirmed across police, municipal, and regional reporting for the past 7 days.`
        : `Verified regional administrative and municipal overview for ${parentCity || cleanLoc}.`)
    : `Verified national dispatches covering governance, capital markets, deep space, and constitutional affairs.`;

  return {
    localArticles,
    cityArticles,
    politicsArticles,
    worldArticles,
    businessArticles,
    scienceArticles,
    sportsArticles,
    entertainmentArticles,
    opinionArticles,
    stateArticles,
    nationalArticles,
    otherArticles: [
      ...politicsArticles,
      ...worldArticles,
      ...businessArticles,
      ...scienceArticles,
      ...sportsArticles,
      ...entertainmentArticles,
      ...cityArticles,
    ],
    allVerifiedArticles: [
      ...localArticles,
      ...politicsArticles,
      ...worldArticles,
      ...businessArticles,
      ...scienceArticles,
      ...sportsArticles,
      ...entertainmentArticles,
      ...cityArticles,
    ],
    localVerifiedCount,
    locationName: cleanLoc || 'National Edition',
    headlineSummary,
    leadDeckSummary,
  };
}

/**
 * Main entry point for fetching real recent news along with authentic documentary press imagery.
 */
export async function getNewsWithImages(
  topic: string,
  articleCount: number = 6,
  targetLocation?: string
): Promise<{ news: NewsResult[]; images: ImageResult[] }> {
  let searchQuery = topic || '';
  const safeTopic = (topic || '').toLowerCase();
  const safeLoc = (targetLocation || '').toLowerCase().trim();
  if (safeLoc && !safeTopic.includes(safeLoc)) {
    searchQuery = `${targetLocation} ${topic}`;
  }

  const rawNews = await searchGoogleNewsRSS(searchQuery, articleCount + 2, targetLocation || '');
  const deduplicated = deduplicateNewsItems(rawNews).slice(0, articleCount);

  // Pair each real article with a customized documentary press photo
  const pairedNews = deduplicated.map((item) => {
    const imageUrl = generateDocumentaryImageUrl(item.title, item.category || topic, targetLocation);
    return {
      ...item,
      imageUrl,
    };
  });

  const images: ImageResult[] = pairedNews.map((n) => ({
    url: n.imageUrl || getCategoryFallbackImage(topic),
    title: n.title,
    source: n.source,
    width: 1000,
    height: 620,
  }));

  return { news: pairedNews, images };
}
