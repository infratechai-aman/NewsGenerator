// Utility for resilient editorial news images and URL sanitization

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  // Indian national governance / Parliament / press briefing (NO Obama!)
  politics: 'https://images.unsplash.com/photo-1597044144288-0142e337d6ec?auto=format&fit=crop&w=1200&q=80',
  government: 'https://images.unsplash.com/photo-1597044144288-0142e337d6ec?auto=format&fit=crop&w=1200&q=80',
  
  // Local civic, roads, flyovers, urban infrastructure
  civic: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  infrastructure: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  local: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  
  // Police, law, justice, crime investigation
  police: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  crime: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  
  // Markets, business, finance
  economy: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  markets: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  
  // Technology, software, innovation
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  
  // Sports, cricket, athletics
  sports: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
  
  // Education, university, research
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  science: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  
  // Environment, climate, nature
  environment: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  
  // World affairs & international diplomacy
  world: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  international: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  
  // Entertainment & culture
  entertainment: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  lifestyle: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  
  // Broadsheet press default
  default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
};

export function getCategoryFallbackImage(category?: string | null): string {
  if (!category) return CATEGORY_FALLBACK_IMAGES.default;
  const cat = category.toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (cat.includes(key)) return img;
  }
  return CATEGORY_FALLBACK_IMAGES.default;
}

/**
 * Generates an authentic photojournalist press image URL matching the exact news topic and location.
 */
export function generateDocumentaryImageUrl(
  headline: string,
  category?: string | null,
  location?: string | null
): string {
  const cleanHeadline = (headline || 'Breaking news developments')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);

  const locContext = location ? ` in ${location.trim()}` : ' India';
  const prompt = `${cleanHeadline}${locContext}, photojournalism documentary news press photography, authentic newspaper editorial photo`;
  const seed = Math.floor(Math.random() * 899999 + 100000);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1000&height=620&nologo=true&seed=${seed}`;
}

export function sanitizeImageUrl(url?: string | null, category?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getCategoryFallbackImage(category);
  }

  const trimmed = url.trim();

  // Fix broken pollinations.ai/p/ URL which returns text/html instead of image/jpeg
  if (trimmed.includes('pollinations.ai/p/')) {
    return trimmed.replace('pollinations.ai/p/', 'image.pollinations.ai/prompt/');
  }

  // If pollinations image URL doesn't have prompt format
  if (trimmed.startsWith('https://pollinations.ai/prompt/')) {
    return trimmed.replace('https://pollinations.ai/prompt/', 'https://image.pollinations.ai/prompt/');
  }

  return trimmed;
}
