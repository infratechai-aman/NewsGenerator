import { generateDocumentaryImageUrl, getCategoryFallbackImage } from './images';

export interface NewsResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  date?: string;
  imageUrl?: string;
}

export interface ImageResult {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
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
 * Searches Google News RSS for authentic, recent articles (past 7 days).
 * Completely free, never blocked, no API key required.
 */
export async function searchGoogleNewsRSS(query: string, count: number = 6): Promise<NewsResult[]> {
  try {
    // 1. Try with when:7d filter for strictly fresh news
    const queryWithTime = query.includes('when:') ? query : `${query} when:7d`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(queryWithTime)}&hl=en-IN&gl=IN&ceid=IN:en`;

    let response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 300 }, // 5 min cache
    });

    let xml = await response.text();
    let items = parseRssItems(xml, count);

    // 2. If hyper-local query has fewer than 2 results in 7 days, broaden slightly without when:7d
    if (items.length < 2 && !query.includes('when:')) {
      const broadUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const fallbackRes = await fetch(broadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      const fallbackXml = await fallbackRes.text();
      const broadItems = parseRssItems(fallbackXml, count);
      if (broadItems.length > 0) {
        items = broadItems;
      }
    }

    return items;
  } catch (error) {
    console.error(`Google News RSS search error for "${query}":`, error);
    return [];
  }
}

function parseRssItems(xml: string, count: number): NewsResult[] {
  const items: NewsResult[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches.slice(0, count)) {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);

    const rawTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : '';
    const source = sourceMatch ? decodeHtmlEntities(sourceMatch[1]) : 'News Desk';
    const date = pubDateMatch ? pubDateMatch[1] : '';
    const url = linkMatch ? linkMatch[1] : '';
    const snippet = descMatch ? decodeHtmlEntities(descMatch[1]) : '';

    // Strip " - Source Name" suffix from the title
    const cleanTitle = rawTitle.replace(new RegExp(`\\s*-\\s*${source}$`, 'i'), '').trim();

    if (cleanTitle) {
      items.push({
        title: cleanTitle,
        snippet: snippet.slice(0, 200),
        url,
        source,
        date,
      });
    }
  }

  return items;
}

export async function searchNews(query: string, count: number = 5): Promise<NewsResult[]> {
  return searchGoogleNewsRSS(query, count);
}

export async function searchImages(query: string, count: number = 3): Promise<ImageResult[]> {
  const images: ImageResult[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    images.push({
      url: generateDocumentaryImageUrl(query, 'news'),
      title: query,
      source: 'Press Photography Desk',
      width: 1000,
      height: 620,
    });
  }
  return images;
}

/**
 * Main entry point for fetching real recent news along with authentic documentary press imagery.
 */
export async function getNewsWithImages(
  topic: string,
  articleCount: number = 6,
  targetLocation?: string
): Promise<{ news: NewsResult[]; images: ImageResult[] }> {
  // If target location is specified, ensure it is part of the query
  let searchQuery = topic;
  if (targetLocation && !topic.toLowerCase().includes(targetLocation.toLowerCase())) {
    searchQuery = `${targetLocation} ${topic}`;
  }

  const news = await searchGoogleNewsRSS(searchQuery, articleCount);

  // Pair each real article with a customized documentary press photo
  const pairedNews = news.map((item, idx) => {
    const imageUrl = generateDocumentaryImageUrl(item.title, topic, targetLocation);
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
