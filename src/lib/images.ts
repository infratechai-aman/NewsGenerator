// Utility for resilient editorial news images and URL sanitization

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  politics: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  government: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  economy: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  sports: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
  cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  science: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  environment: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  world: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  entertainment: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
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
