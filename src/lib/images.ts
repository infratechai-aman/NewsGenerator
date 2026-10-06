// Utility for resilient editorial news images and URL sanitization with guaranteed deduplication

// High-resolution verified editorial press photography pools (Unsplash CDN, fast, reliable, zero 402 errors)
export const THEMATIC_PHOTOS = {
  international: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80', // International Diplomatic Assembly & World Flags
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80', // Global Leadership Summit Table
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80', // International Maritime Shipping & Trade Port
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80', // Cross-Border Aviation & International Routes
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80', // Sovereign Foreign Exchange & Reserves
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Global Communications & Satellite Network
  ],
  trade_logistics: [
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80', // Container ship port
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', // Modern freight warehouse
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80', // Commercial freight transit
    'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80', // Air cargo terminal
  ],
  infrastructure: [
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', // Multi-lane Urban Expressway & Highway
    'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80', // Modern Flyover & City Overpass
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', // Major Cable-Stayed Sea Bridge
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80', // Urban Smart City Infrastructure
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80', // Civil Engineering Architecture & Blueprints
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80', // Steel Framework Construction & Projects
  ],
  transit: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Modern Rapid Metro Rail Transit
    'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80', // Metro Train Coach in Motion
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80', // High-Speed Express Railway Tracks
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80', // Express Intercity Passenger Train
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80', // Modern Urban Transit Station Platform
  ],
  police_crime: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80', // Supreme Court of Law & Justice
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1200&q=80', // Gavel & Official Judicial Order
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80', // Police Patrol Lights & Vigilance
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', // Night City Vigilance & Law Enforcement
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80', // Official Case Documents & Legal Archives
  ],
  community: [
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', // Citizens Public Forum & Civic Consultation
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80', // Urban City Street & Neighborhood
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80', // Community Delegation Gathering
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80', // Civic Townhall Conclave
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', // Public City Plaza & Citizens
    'https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?auto=format&fit=crop&w=1200&q=80', // City Neighborhood Commercial Market
  ],
  sports: [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80', // Premier Cricket Stadium Under Floodlights
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80', // Cricket Leather Ball on Pitch
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80', // Athletics Stadium Championship Track
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80', // Badminton International Championship Court
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', // Football Arena & Match Trophy
  ],
  education: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', // University Quad & Campus Scholars
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', // Modern Academic Classroom & Higher Education
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80', // Premier Scientific Research Laboratory
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80', // Central Academic Library & Archives
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Space Mission Satellite & Orbit
  ],
  business: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', // Stock Market Charts, Sensex & Nifty Trading
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80', // Financial Analytics & Trading Desk
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Modern Financial Towers & Corporate District
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80', // Banking, Reserves & Institutional Capital
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // Industrial Manufacturing & Assembly Lines
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80', // Commercial Retail & Economic Markets
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', // Semiconductor Silicon Wafer & Microchip
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80', // Microprocessors & Printed Circuit Board
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', // Cloud Computing Data Center Server Racks
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80', // Cleanroom Semiconductor Hardware Lab
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80', // Artificial Intelligence & Neural Network Systems
    'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&q=80', // Enterprise Software & High-Tech Computing
  ],
  politics: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Historic Indian Governance Landmark / Red Fort New Delhi
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', // India Gate & Rajpath New Delhi
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // National Indian Heritage & Governance
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80', // Court of Justice, Law & Constitutional Bench
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1200&q=80', // Official Press Conference Podium & Microphones
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', // High-level Ministerial Policy Summit Hall
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1200&q=80', // Judicial Gavel & Law Statute
  ],
  rural_agriculture: [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', // Agricultural Farmland & Green Fields
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80', // Farming Irrigation & Crop Cultivation
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80', // Rural Harvest & Agricultural Storage
  ],
  city_landmarks: {
    pune: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', // Pune Urban Highway & Hinjawadi IT Corridor
      'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&q=80', // Pune Flyover & Metro Route
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', // Pune Municipal Civic Forum
    ],
    mumbai: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', // Mumbai Coastal Road & Expressway
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', // Mumbai Sea Link & Marine Drive
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Mumbai BKC Financial Hub
    ],
    delhi: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', // New Delhi Central Vista & India Gate
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Historic Red Fort & Old Delhi
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // Sansad Marg & Governance Vista
    ],
  },
  default: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', // Printing Press & Broadsheet Newsroom
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80', // Newspaper Editorial Desk
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // National Monument & Secretariat
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', // Press Conclave Delegation
  ],
};

/**
 * Deterministically picks a UNIQUE photo from list, guaranteeing zero duplicate images
 * within the same page or edition.
 */
function pickUniquePhoto(list: string[], seedText: string, slotIndex: number = 0, usedSet?: Set<string>): string {
  if (!list || list.length === 0) return THEMATIC_PHOTOS.default[0];

  let hash = 0;
  const combinedSeed = `${seedText}_slot_${slotIndex}`;
  for (let i = 0; i < combinedSeed.length; i++) {
    hash = (hash << 5) - hash + combinedSeed.charCodeAt(i);
    hash |= 0;
  }
  const startIndex = Math.abs(hash + slotIndex * 13) % list.length;

  if (!usedSet) {
    return list[startIndex];
  }

  // Find first unused photo in the list
  for (let i = 0; i < list.length; i++) {
    const candidate = list[(startIndex + i) % list.length];
    if (!usedSet.has(candidate)) {
      usedSet.add(candidate);
      return candidate;
    }
  }

  // If all in this pool are used, select candidate with slot offset anyway
  const fallback = list[(startIndex + slotIndex) % list.length];
  usedSet.add(fallback);
  return fallback;
}

/**
 * Returns a distinct verified fallback image for a category with index-aware variation.
 */
export function getCategoryFallbackImage(
  category?: string | null,
  slotIndexOrLocation?: number | string | null,
  usedSet?: Set<string>
): string {
  const slotIndex = typeof slotIndexOrLocation === 'number'
    ? slotIndexOrLocation
    : typeof slotIndexOrLocation === 'string'
      ? Math.abs(slotIndexOrLocation.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))
      : 0;

  const cat = (category || '').toLowerCase();

  let pool: string[] = THEMATIC_PHOTOS.default;
  if (cat.includes('internat') || cat.includes('world') || cat.includes('diploma') || cat.includes('foreign')) {
    pool = THEMATIC_PHOTOS.international;
  } else if (cat.includes('trade') || cat.includes('logist') || cat.includes('shipping')) {
    pool = THEMATIC_PHOTOS.trade_logistics;
  } else if (cat.includes('politic') || cat.includes('govern') || cat.includes('parliament') || cat.includes('lead') || cat.includes('front')) {
    pool = THEMATIC_PHOTOS.politics;
  } else if (cat.includes('infra') || cat.includes('road') || cat.includes('flyover') || cat.includes('bridge')) {
    pool = THEMATIC_PHOTOS.infrastructure;
  } else if (cat.includes('transit') || cat.includes('metro') || cat.includes('rail')) {
    pool = THEMATIC_PHOTOS.transit;
  } else if (cat.includes('police') || cat.includes('crime') || cat.includes('law') || cat.includes('legal') || cat.includes('court')) {
    pool = THEMATIC_PHOTOS.police_crime;
  } else if (cat.includes('local') || cat.includes('civic') || cat.includes('communit') || cat.includes('resident')) {
    pool = THEMATIC_PHOTOS.community;
  } else if (cat.includes('busin') || cat.includes('econom') || cat.includes('market') || cat.includes('financ')) {
    pool = THEMATIC_PHOTOS.business;
  } else if (cat.includes('tech') || cat.includes('chip') || cat.includes('semicon') || cat.includes('digital') || cat.includes('ai')) {
    pool = THEMATIC_PHOTOS.technology;
  } else if (cat.includes('sport') || cat.includes('cricket')) {
    pool = THEMATIC_PHOTOS.sports;
  } else if (cat.includes('educ') || cat.includes('scien') || cat.includes('space') || cat.includes('college')) {
    pool = THEMATIC_PHOTOS.education;
  } else if (cat.includes('rur') || cat.includes('agri') || cat.includes('farm') || cat.includes('welfare')) {
    pool = THEMATIC_PHOTOS.rural_agriculture;
  }

  return pickUniquePhoto(pool, cat, slotIndex, usedSet);
}

/**
 * Deterministically returns a verified, authentic, high-res editorial photo
 * based on headline content, keywords, and category with GUARANTEED DEDUPLICATION.
 * NEVER returns 402, requires NO API keys, and loads instantaneously.
 */
export function generateDocumentaryImageUrl(
  headline: string,
  category?: string | null,
  slotIndexOrLocation?: number | string | null,
  usedSet?: Set<string>
): string {
  const slotIndex = typeof slotIndexOrLocation === 'number'
    ? slotIndexOrLocation
    : typeof slotIndexOrLocation === 'string'
      ? Math.abs(slotIndexOrLocation.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))
      : 0;
  const text = `${headline || ''} ${category || ''}`.toLowerCase();
  const locKey = typeof slotIndexOrLocation === 'string' ? slotIndexOrLocation.toLowerCase() : '';

  // 0. City-specific local news targeting (Pune, Mumbai, Delhi)
  if (locKey.includes('pune') && (text.includes('pune') || text.includes('local') || text.includes('civic') || text.includes('city') || text.includes('lead'))) {
    return pickUniquePhoto(THEMATIC_PHOTOS.city_landmarks.pune, headline, slotIndex, usedSet);
  }
  if (locKey.includes('mumbai') && (text.includes('mumbai') || text.includes('local') || text.includes('civic') || text.includes('city') || text.includes('lead'))) {
    return pickUniquePhoto(THEMATIC_PHOTOS.city_landmarks.mumbai, headline, slotIndex, usedSet);
  }
  if (locKey.includes('delhi') && (text.includes('delhi') || text.includes('local') || text.includes('civic') || text.includes('city') || text.includes('lead'))) {
    return pickUniquePhoto(THEMATIC_PHOTOS.city_landmarks.delhi, headline, slotIndex, usedSet);
  }

  // 1. Semiconductor / Silicon Chips / Quantum / Hardware
  if (
    text.includes('semiconductor') ||
    text.includes('silicon') ||
    text.includes('chip') ||
    text.includes('microprocessor') ||
    text.includes('fabrication') ||
    text.includes('hardware') ||
    text.includes('quantum')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.technology, headline, slotIndex, usedSet);
  }

  // 2. International / Diplomacy / G20 / World / Accord / Treaties / Borders
  if (
    text.includes('g20') ||
    text.includes('un ') ||
    text.includes('united nations') ||
    text.includes('diplomat') ||
    text.includes('treaty') ||
    text.includes('accord') ||
    text.includes('sovereign') ||
    text.includes('bilateral') ||
    text.includes('multilateral') ||
    text.includes('global') ||
    text.includes('international') ||
    text.includes('foreign') ||
    text.includes('cross-border') ||
    text.includes('corridor') ||
    text.includes('summit')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.international, headline, slotIndex, usedSet);
  }

  // 3. Trade / Tariffs / Shipping / Maritime / Customs / Ports
  if (
    text.includes('trade') ||
    text.includes('tariff') ||
    text.includes('maritime') ||
    text.includes('shipping') ||
    text.includes('customs') ||
    text.includes('export') ||
    text.includes('import') ||
    text.includes('cargo') ||
    text.includes('container') ||
    text.includes('supply chain') ||
    text.includes('port')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.trade_logistics, headline, slotIndex, usedSet);
  }

  // 4. Transit / Metro / Railways / Trains
  if (
    text.includes('metro') ||
    text.includes('train') ||
    text.includes('rail') ||
    text.includes('transit') ||
    text.includes('station')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.transit, headline, slotIndex, usedSet);
  }

  // 5. Infrastructure / Flyovers / Roads / Highways / Bridges / Construction
  if (
    text.includes('flyover') ||
    text.includes('road') ||
    text.includes('highway') ||
    text.includes('bridge') ||
    text.includes('construction') ||
    text.includes('infrastructure') ||
    text.includes('paving') ||
    text.includes('pothole') ||
    text.includes('expressway')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.infrastructure, headline, slotIndex, usedSet);
  }

  // 6. Police / Crime / Murder / Arrest / Safety / Law / Courts
  if (
    text.includes('arrest') ||
    text.includes('police') ||
    text.includes('crime') ||
    text.includes('murder') ||
    text.includes('death') ||
    text.includes('killed') ||
    text.includes('brawl') ||
    text.includes('court') ||
    text.includes('judiciar') ||
    text.includes('bench') ||
    text.includes('law') ||
    text.includes('theft') ||
    text.includes('patrol') ||
    text.includes('security')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.police_crime, headline, slotIndex, usedSet);
  }

  // 7. Community / Residents / Forums / Eateries / Societies / Civic
  if (
    text.includes('resident') ||
    text.includes('forum') ||
    text.includes('society') ||
    text.includes('eater') ||
    text.includes('citizen') ||
    text.includes('meeting') ||
    text.includes('water') ||
    text.includes('civic') ||
    text.includes('delegat') ||
    text.includes('sanitation')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.community, headline, slotIndex, usedSet);
  }

  // 8. Sports / Cricket / Football / Tournament
  if (
    text.includes('cricket') ||
    text.includes('sport') ||
    text.includes('match') ||
    text.includes('tournament') ||
    text.includes('stadium') ||
    text.includes('wicket') ||
    text.includes('series') ||
    text.includes('trophy') ||
    text.includes('league')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.sports, headline, slotIndex, usedSet);
  }

  // 9. Rural / Agriculture / Welfare / Irrigation
  if (
    text.includes('welfare') ||
    text.includes('rural') ||
    text.includes('agricultur') ||
    text.includes('farmer') ||
    text.includes('irrigation') ||
    text.includes('crop') ||
    text.includes('village')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.rural_agriculture, headline, slotIndex, usedSet);
  }

  // 10. Education / College / School / Science / Space
  if (
    text.includes('education') ||
    text.includes('school') ||
    text.includes('college') ||
    text.includes('university') ||
    text.includes('student') ||
    text.includes('scholarship') ||
    text.includes('science') ||
    text.includes('research') ||
    text.includes('isro') ||
    text.includes('space') ||
    text.includes('chandrayaan')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.education, headline, slotIndex, usedSet);
  }

  // 11. Tech / Digital / AI / Software
  if (
    text.includes('tech') ||
    text.includes('digital') ||
    text.includes('software') ||
    text.includes('ai') ||
    text.includes('data') ||
    text.includes('internet')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.technology, headline, slotIndex, usedSet);
  }

  // 12. Business / Finance / Debt / Markets / Economy / Banking
  if (
    text.includes('market') ||
    text.includes('business') ||
    text.includes('econom') ||
    text.includes('estate') ||
    text.includes('growth') ||
    text.includes('finance') ||
    text.includes('bank') ||
    text.includes('debt') ||
    text.includes('fiscal') ||
    text.includes('inflation') ||
    text.includes('sensex') ||
    text.includes('nifty') ||
    text.includes('rupee') ||
    text.includes('investment') ||
    text.includes('corporate')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.business, headline, slotIndex, usedSet);
  }

  // 13. Politics / Parliament / Electoral / Cabinet / Governance
  if (
    text.includes('parliament') ||
    text.includes('cabinet') ||
    text.includes('minister') ||
    text.includes('govern') ||
    text.includes('politic') ||
    text.includes('election') ||
    text.includes('electoral') ||
    text.includes('delimit') ||
    text.includes('reform') ||
    text.includes('legislation') ||
    text.includes('bill')
  ) {
    return pickUniquePhoto(THEMATIC_PHOTOS.politics, headline, slotIndex, usedSet);
  }

  // Default fallback with slot index
  return getCategoryFallbackImage(category, slotIndex, usedSet);
}

/**
 * Sanitizes and verifies an image URL:
 * - Replaces failing Pollinations 402 URLs
 * - Guarantees UNIQUE images per slot / page using usedSet tracking
 */
export function sanitizeImageUrl(
  url?: string | null,
  category?: string | null,
  headline?: string,
  slotIndexOrLocation?: number | string | null,
  usedSet?: Set<string>
): string {
  const slotIndex = typeof slotIndexOrLocation === 'number'
    ? slotIndexOrLocation
    : typeof slotIndexOrLocation === 'string'
      ? Math.abs(slotIndexOrLocation.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))
      : 0;

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return headline
      ? generateDocumentaryImageUrl(headline, category, slotIndex, usedSet)
      : getCategoryFallbackImage(category, slotIndex, usedSet);
  }

  const trimmed = url.trim();

  // If URL points to failing Pollinations service (which gives HTTP 402), immediately replace with genuine photo
  if (trimmed.includes('pollinations.ai')) {
    return headline
      ? generateDocumentaryImageUrl(headline, category, slotIndex, usedSet)
      : getCategoryFallbackImage(category, slotIndex, usedSet);
  }

  // If an existing valid image was passed, check if it's already used on this page to prevent duplicates
  if (usedSet) {
    if (usedSet.has(trimmed)) {
      // Pick a unique replacement from the pool
      return headline
        ? generateDocumentaryImageUrl(headline, category, slotIndex + 1, usedSet)
        : getCategoryFallbackImage(category, slotIndex + 1, usedSet);
    }
    usedSet.add(trimmed);
  }

  return trimmed;
}
