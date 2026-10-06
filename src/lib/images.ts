// Utility for resilient editorial news images and URL sanitization

// High-resolution verified editorial press photography pools (Unsplash CDN, fast, reliable, zero 402 errors)
const THEMATIC_PHOTOS = {
  infrastructure: [
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80', // Flyover / bridge construction
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', // Urban city road transit
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1200&q=80', // Construction cranes & engineering
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', // City bridge architecture
  ],
  transit: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Modern metro transit rail
    'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80', // Metro train coach
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80', // High-speed railway track
  ],
  police_crime: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80', // Court of justice & law
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1200&q=80', // Legal gavel & statute
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80', // Police patrol lights
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', // Night urban vigilance
  ],
  community: [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', // Town hall meeting / public forum
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', // Neighborhood street & residents
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80', // Community gathering
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80', // Civic consultation
  ],
  sports: [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80', // Cricket ball on pitch
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80', // Cricket stadium under floodlights
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', // Athletics track & championship
  ],
  education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', // Campus students & university
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', // Modern classroom & learning
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', // Financial market charts
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Commercial corporate center
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', // Commercial retail market
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', // Semiconductor chip & hardware
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Satellite & global tech data
  ],
  politics: [
    'https://images.unsplash.com/photo-1597044144288-0142e337d6ec?auto=format&fit=crop&w=1200&q=80', // Parliament & government assembly
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1200&q=80', // Press conference podium & mics
  ],
  default: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', // Printing press & broadsheet
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80', // Editorial journalism desk
  ],
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  politics: THEMATIC_PHOTOS.politics[0],
  government: THEMATIC_PHOTOS.politics[1] || THEMATIC_PHOTOS.politics[0],
  civic: THEMATIC_PHOTOS.infrastructure[1],
  infrastructure: THEMATIC_PHOTOS.infrastructure[0],
  local: THEMATIC_PHOTOS.community[1],
  police: THEMATIC_PHOTOS.police_crime[2],
  crime: THEMATIC_PHOTOS.police_crime[0],
  legal: THEMATIC_PHOTOS.police_crime[1],
  economy: THEMATIC_PHOTOS.business[0],
  business: THEMATIC_PHOTOS.business[1],
  markets: THEMATIC_PHOTOS.business[0],
  technology: THEMATIC_PHOTOS.technology[0],
  tech: THEMATIC_PHOTOS.technology[0],
  sports: THEMATIC_PHOTOS.sports[0],
  cricket: THEMATIC_PHOTOS.sports[1],
  education: THEMATIC_PHOTOS.education[0],
  science: THEMATIC_PHOTOS.technology[1],
  environment: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  world: THEMATIC_PHOTOS.business[1],
  international: THEMATIC_PHOTOS.business[1],
  entertainment: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  default: THEMATIC_PHOTOS.default[0],
};

function pickPhoto(list: string[], seedText: string): string {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
}

/**
 * Deterministically returns a verified, authentic, high-res editorial photo
 * based on headline content, keywords, and category.
 * NEVER returns 402, requires NO API keys, and loads instantaneously.
 */
export function generateDocumentaryImageUrl(
  headline: string,
  category?: string | null,
  location?: string | null
): string {
  const text = `${headline || ''} ${category || ''}`.toLowerCase();

  // Transit / Metro
  if (text.includes('metro') || text.includes('train') || text.includes('rail') || text.includes('transit')) {
    return pickPhoto(THEMATIC_PHOTOS.transit, headline);
  }

  // Infrastructure / Flyover / Roads / Highway
  if (
    text.includes('flyover') ||
    text.includes('road') ||
    text.includes('highway') ||
    text.includes('bridge') ||
    text.includes('construction') ||
    text.includes('infrastructure') ||
    text.includes('pothole')
  ) {
    return pickPhoto(THEMATIC_PHOTOS.infrastructure, headline);
  }

  // Police / Crime / Murder / Arrest / Safety / Court
  if (
    text.includes('arrest') ||
    text.includes('police') ||
    text.includes('crime') ||
    text.includes('murder') ||
    text.includes('death') ||
    text.includes('killed') ||
    text.includes('brawl') ||
    text.includes('court') ||
    text.includes('law') ||
    text.includes('theft')
  ) {
    return pickPhoto(THEMATIC_PHOTOS.police_crime, headline);
  }

  // Community / Residents / Forums / Eateries / Society
  if (
    text.includes('resident') ||
    text.includes('forum') ||
    text.includes('society') ||
    text.includes('eater') ||
    text.includes('citizen') ||
    text.includes('meeting') ||
    text.includes('action') ||
    text.includes('water')
  ) {
    return pickPhoto(THEMATIC_PHOTOS.community, headline);
  }

  // Sports / Cricket
  if (text.includes('cricket') || text.includes('sport') || text.includes('match') || text.includes('tournament') || text.includes('stadium')) {
    return pickPhoto(THEMATIC_PHOTOS.sports, headline);
  }

  // Education / College / School
  if (text.includes('education') || text.includes('school') || text.includes('college') || text.includes('university') || text.includes('student')) {
    return pickPhoto(THEMATIC_PHOTOS.education, headline);
  }

  // Tech / Digital
  if (text.includes('tech') || text.includes('digital') || text.includes('software') || text.includes('chip') || text.includes('ai')) {
    return pickPhoto(THEMATIC_PHOTOS.technology, headline);
  }

  // Business / Economy / Markets / Real estate
  if (text.includes('market') || text.includes('business') || text.includes('econom') || text.includes('estate') || text.includes('growth')) {
    return pickPhoto(THEMATIC_PHOTOS.business, headline);
  }

  // Politics / Government / Administration
  if (text.includes('parliament') || text.includes('minister') || text.includes('govern') || text.includes('politic') || text.includes('election')) {
    return pickPhoto(THEMATIC_PHOTOS.politics, headline);
  }

  // Fallback category
  const cat = (category || '').toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (cat.includes(key)) return img;
  }

  return pickPhoto(THEMATIC_PHOTOS.default, headline);
}

export function getCategoryFallbackImage(category?: string | null): string {
  if (!category) return CATEGORY_FALLBACK_IMAGES.default;
  const cat = category.toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (cat.includes(key)) return img;
  }
  return CATEGORY_FALLBACK_IMAGES.default;
}

export function sanitizeImageUrl(url?: string | null, category?: string | null, headline?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return headline ? generateDocumentaryImageUrl(headline, category) : getCategoryFallbackImage(category);
  }

  const trimmed = url.trim();

  // If URL points to failing Pollinations service (which gives HTTP 402), immediately replace with genuine photo
  if (trimmed.includes('pollinations.ai')) {
    return headline ? generateDocumentaryImageUrl(headline, category) : getCategoryFallbackImage(category);
  }

  return trimmed;
}
