import * as DDG from 'duck-duck-scrape';
import * as google from 'googlethis';

export interface NewsResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  imageUrl?: string;
}

export async function searchNews(query: string, count: number = 5): Promise<NewsResult[]> {
  try {
    const results = await DDG.searchNews(query, {
      safeSearch: DDG.SafeSearchType.MODERATE,
    });

    return results.results.slice(0, count).map((r) => ({
      title: r.title,
      snippet: r.excerpt || '',
      url: r.url,
      source: r.syndicate || 'Unknown',
      imageUrl: r.image,
    }));
  } catch (error) {
    console.error('News search error:', error);
    return [];
  }
}


export interface ImageResult {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

export async function searchImages(query: string, count: number = 3): Promise<ImageResult[]> {
  try {
    const images = await google.image(query, { safe: false });
    
    return images.slice(0, count).map((img) => ({
      url: img.url,
      title: img.origin?.title || query,
      source: img.origin?.website?.domain || 'Google Images',
      width: img.width,
      height: img.height,
    }));
  } catch (error) {
    console.error('Image search error:', error);
    return [];
  }
}

export async function getNewsWithImages(
  topic: string,
  articleCount: number = 6
): Promise<{ news: NewsResult[]; images: ImageResult[] }> {
  const [news, images] = await Promise.all([
    searchNews(`${topic} India latest news today`, articleCount),
    searchImages(`${topic} India news`, articleCount),
  ]);

  // Try to pair images with news
  const pairedNews = news.map((n, i) => ({
    ...n,
    imageUrl: n.imageUrl || images[i]?.url || undefined,
  }));

  return { news: pairedNews, images };
}
