import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PublicationConfig,
  UploadedAsset,
  GeneratedContent,
  NewspaperPage,
  PageSlot,
  ContentBlock,
  Language,
  ManualArticle,
  SavedNewspaper,
  NewsArticle,
  BriefItem,
  PageCategory,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

// ─── Category Config Map ─────────────────────────────────────────────────────
const CATEGORY_META: Record<PageCategory, { label: string; tagline: string }> = {
  'front-page':             { label: 'FRONT PAGE (NATIONAL / LEAD)', tagline: 'Most important stories, big headlines, hero image' },
  'politics':               { label: 'POLITICS',                      tagline: 'Political news, government, policy, elections' },
  'international':          { label: 'INTERNATIONAL',                  tagline: 'Global news, world affairs' },
  'business-tech':          { label: 'BUSINESS & TECHNOLOGY',          tagline: 'Economy, markets, tech, innovation' },
  'education-science':      { label: 'EDUCATION & SCIENCE',            tagline: 'Education, research, space, environment' },
  'sports':                 { label: 'SPORTS',                         tagline: 'Cricket, football, other sports' },
  'entertainment-lifestyle':{ label: 'ENTERTAINMENT & LIFESTYLE',      tagline: 'Movies, OTT, celebrities, health, travel' },
  'opinion-features':       { label: 'OPINION & FEATURES',             tagline: 'Editorial, column, lifestyle, comics, puzzles' },
};

// Category cycle for pages beyond 8
const CATEGORY_ORDER: PageCategory[] = [
  'front-page',
  'politics',
  'international',
  'business-tech',
  'education-science',
  'sports',
  'entertainment-lifestyle',
  'opinion-features',
];

// ─── Per-Category Slot Templates ─────────────────────────────────────────────
function slotsForCategory(pageNum: number, cat: PageCategory): PageSlot[] {
  const p = `p${pageNum}`;
  switch (cat) {
    case 'front-page':
      return [
        // Row 0: masthead (rendered separately, no slot needed — row 0 is reserved)
        // Row 1: In-Brief sidebar (1 col) + Lead story (4 cols) + Key Highlights sidebar (2 cols replaced by slot)
        { id: `${p}-s1`, label: 'Lead Headline',        size: 'two-thirds', row: 1, colStart: 2, colSpan: 4, assignedContent: null },
        { id: `${p}-s2`, label: 'Side Story / Key Highlights', size: 'third', row: 1, colStart: 6, colSpan: 2, assignedContent: null },
        // Row 2: Three equal secondary stories
        { id: `${p}-s3`, label: 'Secondary Story A',    size: 'third', row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s4`, label: 'Secondary Story B',    size: 'third', row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'Secondary Story C',    size: 'third', row: 2, colStart: 5, colSpan: 2, assignedContent: null },
      ];

    case 'politics':
      return [
        // Row 1: Lead (4 cols) + sidebar (2 cols)
        { id: `${p}-s1`, label: 'Politics Lead',        size: 'two-thirds', row: 1, colStart: 1, colSpan: 4, assignedContent: null },
        { id: `${p}-s2`, label: 'Political Brief',      size: 'third',      row: 1, colStart: 5, colSpan: 2, assignedContent: null },
        // Row 2: State roundup — 4 equal cols
        { id: `${p}-s3`, label: 'State Story 1',        size: 'quarter',    row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s4`, label: 'State Story 2',        size: 'quarter',    row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'State Story 3',        size: 'quarter',    row: 2, colStart: 5, colSpan: 1, assignedContent: null },
        { id: `${p}-s6`, label: 'State Story 4',        size: 'quarter',    row: 2, colStart: 6, colSpan: 1, assignedContent: null },
      ];

    case 'international':
      return [
        // Row 1: Lead (3 cols) + two secondary stories (3 cols combined)
        { id: `${p}-s1`, label: 'International Lead',   size: 'half',       row: 1, colStart: 1, colSpan: 3, assignedContent: null },
        { id: `${p}-s2`, label: 'World Story A',        size: 'quarter',    row: 1, colStart: 4, colSpan: 2, assignedContent: null },
        { id: `${p}-s3`, label: 'World Story B',        size: 'quarter',    row: 1, colStart: 6, colSpan: 1, assignedContent: null },
        // Row 2: Three smaller world stories
        { id: `${p}-s4`, label: 'World Story C',        size: 'third',      row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'World Story D',        size: 'third',      row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s6`, label: 'World Story E',        size: 'third',      row: 2, colStart: 5, colSpan: 2, assignedContent: null },
      ];

    case 'business-tech':
      return [
        // Row 1: Key Indicators widget (1 col) + Lead (3 cols) + Story 2 (2 cols)
        { id: `${p}-s1`, label: 'Key Indicators',       size: 'third',      row: 1, colStart: 1, colSpan: 1, assignedContent: null },
        { id: `${p}-s2`, label: 'Business Lead',        size: 'half',       row: 1, colStart: 2, colSpan: 3, assignedContent: null },
        { id: `${p}-s3`, label: 'Tech Story',           size: 'third',      row: 1, colStart: 5, colSpan: 2, assignedContent: null },
        // Row 2: Three business items
        { id: `${p}-s4`, label: 'Market Story',        size: 'third',      row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'EV / Startup Story',  size: 'third',      row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s6`, label: 'AI / Policy Story',   size: 'third',      row: 2, colStart: 5, colSpan: 2, assignedContent: null },
      ];

    case 'education-science':
      return [
        // Row 1: Two main stories
        { id: `${p}-s1`, label: 'Education Lead',       size: 'half',       row: 1, colStart: 1, colSpan: 3, assignedContent: null },
        { id: `${p}-s2`, label: 'Science Story',        size: 'half',       row: 1, colStart: 4, colSpan: 3, assignedContent: null },
        // Row 2: Three smaller items
        { id: `${p}-s3`, label: 'Policy Story',         size: 'third',      row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s4`, label: 'Environment Story',    size: 'third',      row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'Research Story',       size: 'third',      row: 2, colStart: 5, colSpan: 2, assignedContent: null },
      ];

    case 'sports':
      return [
        // Row 1: Sports Lead (4 cols) + stats card (2 cols)
        { id: `${p}-s1`, label: 'Sports Lead',          size: 'two-thirds', row: 1, colStart: 1, colSpan: 4, assignedContent: null },
        { id: `${p}-s2`, label: 'Player / Stats',       size: 'third',      row: 1, colStart: 5, colSpan: 2, assignedContent: null },
        // Row 2: Two secondary sports stories
        { id: `${p}-s3`, label: 'Sports Story B',       size: 'half',       row: 2, colStart: 1, colSpan: 3, assignedContent: null },
        { id: `${p}-s4`, label: 'Sports Story C',       size: 'half',       row: 2, colStart: 4, colSpan: 3, assignedContent: null },
      ];

    case 'entertainment-lifestyle':
      return [
        // Row 1: Entertainment Lead (4 cols) + OTT story (2 cols)
        { id: `${p}-s1`, label: 'Entertainment Lead',   size: 'two-thirds', row: 1, colStart: 1, colSpan: 4, assignedContent: null },
        { id: `${p}-s2`, label: 'OTT / Streaming',      size: 'third',      row: 1, colStart: 5, colSpan: 2, assignedContent: null },
        // Row 2: Three lifestyle items
        { id: `${p}-s3`, label: 'Travel Story',         size: 'third',      row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s4`, label: 'Health / Wellness',    size: 'third',      row: 2, colStart: 3, colSpan: 2, assignedContent: null },
        { id: `${p}-s5`, label: 'Food / Culture',       size: 'third',      row: 2, colStart: 5, colSpan: 2, assignedContent: null },
      ];

    case 'opinion-features':
      return [
        // Row 1: Editorial (3 cols) + Column (3 cols)
        { id: `${p}-s1`, label: 'Editorial',            size: 'half',       row: 1, colStart: 1, colSpan: 3, assignedContent: null },
        { id: `${p}-s2`, label: 'Column',               size: 'half',       row: 1, colStart: 4, colSpan: 3, assignedContent: null },
        // Row 2: Horoscope (2) + Sudoku (1) + Weather (2) + Comics hint (1)
        { id: `${p}-s3`, label: 'Horoscope',            size: 'third',      row: 2, colStart: 1, colSpan: 2, assignedContent: null },
        { id: `${p}-s4`, label: 'Sudoku Puzzle',        size: 'quarter',    row: 2, colStart: 3, colSpan: 1, assignedContent: null },
        { id: `${p}-s5`, label: 'Weather Report',       size: 'third',      row: 2, colStart: 4, colSpan: 2, assignedContent: null },
        { id: `${p}-s6`, label: 'Do You Know / Facts',  size: 'quarter',    row: 2, colStart: 6, colSpan: 1, assignedContent: null },
      ];

    default:
      return [
        { id: `${p}-s1`, label: 'Top Story',            size: 'full',       row: 1, colStart: 1, colSpan: 6, assignedContent: null },
        { id: `${p}-s2`, label: 'Mid Left Article',     size: 'half',       row: 2, colStart: 1, colSpan: 3, assignedContent: null },
        { id: `${p}-s3`, label: 'Mid Right Article',    size: 'half',       row: 2, colStart: 4, colSpan: 3, assignedContent: null },
      ];
  }
}

export const DEFAULT_BRIEFS_BY_CATEGORY: Record<PageCategory, BriefItem[]> = {
  'front-page': [
    { category: 'Markets', headline: 'Sensex zooms 850 pts on heavy foreign institutional inflows', page: '4' },
    { category: 'Space', headline: 'ISRO clears launch window for Chandrayaan-4 lunar sample return', page: '5' },
    { category: 'Cricket', headline: 'India seals T20 series with record 9-wicket victory', page: '6' },
    { category: 'Policy', headline: 'Cabinet approves ₹12,000-cr green hydrogen manufacturing incentive', page: '2' },
    { category: 'Diplomacy', headline: 'Global leaders convene in New Delhi for Sustainable Economy Summit', page: '3' },
  ],
  'politics': [
    { category: 'Parliament', headline: 'Monsoon session concludes after marathon debate on electoral reforms', page: '2' },
    { category: 'Election', headline: 'Election Commission announces schedule for upcoming state assemblies', page: '2' },
    { category: 'Judiciary', headline: 'Supreme Court bench upholds new digital personal data rules', page: '3' },
    { category: 'Governance', headline: 'Centre rolls out unified single-window clearance for urban infra', page: '2' },
  ],
  'international': [
    { category: 'G20', headline: 'Member nations ratify historic climate transition investment framework', page: '3' },
    { category: 'Tech Diplomacy', headline: 'EU and India sign landmark AI security and semiconductor treaty', page: '3' },
    { category: 'Aviation', headline: 'New direct air corridors opened linking Mumbai with South American hubs', page: '3' },
    { category: 'Energy', headline: 'International Solar Alliance expands microgrid funding to 15 nations', page: '3' },
  ],
  'business-tech': [
    { category: 'Semiconductors', headline: 'First indigenous 28nm silicon chips roll out from Dholera fab', page: '4' },
    { category: 'Startups', headline: 'Venture funding touches 18-month high with $2.4B deployed in Q3', page: '4' },
    { category: 'Fintech', headline: 'UPI crosses 16 billion monthly transactions with cross-border surge', page: '4' },
    { category: 'Automotive', headline: 'Commercial EV registrations cross 25% milestone across tier-1 cities', page: '4' },
  ],
  'education-science': [
    { category: 'Research', headline: 'IIT researchers unveil low-cost sodium-ion battery with 3,000 cycles', page: '5' },
    { category: 'Academia', headline: 'New curriculum framework introduces AI literacy from secondary school', page: '5' },
    { category: 'Astronomy', headline: 'Ladakh High Altitude Observatory discovers twin exoplanet system', page: '5' },
    { category: 'Environment', headline: 'National Green Corridor project restores 40,000 hectares of wetlands', page: '5' },
  ],
  'sports': [
    { category: 'Cricket', headline: 'BCCI announces revamped domestic calendar with pink-ball rounds', page: '6' },
    { category: 'Olympics', headline: 'Target Olympic Podium Scheme inducts 45 junior track & field athletes', page: '6' },
    { category: 'Badminton', headline: 'India clinches mixed doubles gold at BWF World Super 750', page: '6' },
    { category: 'Football', headline: 'ISL kicks off new season with record stadium attendances in Kolkata', page: '6' },
  ],
  'entertainment-lifestyle': [
    { category: 'Cinema', headline: 'National Film Awards jury announces winners celebrating regional cinema', page: '7' },
    { category: 'Streaming', headline: 'Local streaming originals capture 65% of domestic OTT viewership', page: '7' },
    { category: 'Heritage', headline: 'Restored 18th-century stepwell precinct wins UNESCO heritage honour', page: '7' },
    { category: 'Wellness', headline: 'Ayurveda and integrative medicine research centre opens in Kerala', page: '7' },
  ],
  'opinion-features': [
    { category: 'Editorial', headline: 'The Road Ahead: Balancing technological acceleration with human equity', page: '8' },
    { category: 'Perspective', headline: 'Urban transformation and the rebirth of India’s smart tier-2 cities', page: '8' },
    { category: 'Book Review', headline: 'Chronicle of a Nation: Reflections on seven decades of Indian progress', page: '8' },
    { category: 'Arts', headline: 'Contemporary Indian artists showcase modern miniatures in Paris', page: '8' },
  ],
};

export const DEFAULT_KEY_INDICATORS = {
  id: 'default-key-ind',
  indicators: [
    { name: 'SENSEX', value: '82,490.15', change: '+412.30', direction: 'up' as const },
    { name: 'NIFTY 50', value: '25,235.90', change: '+128.45', direction: 'up' as const },
    { name: 'USD / INR', value: '83.92', change: '-0.04', direction: 'down' as const },
    { name: 'GOLD (10g)', value: '₹76,450', change: '+320.00', direction: 'up' as const },
    { name: 'BRENT CRUDE', value: '$74.18/bbl', change: '-0.85', direction: 'down' as const },
    { name: '10Y G-SEC', value: '6.82%', change: '-0.02', direction: 'down' as const },
  ],
};

function createDefaultPages(count: number): NewspaperPage[] {
  const pages: NewspaperPage[] = [];
  for (let i = 1; i <= count; i++) {
    const cat: PageCategory = CATEGORY_ORDER[(i - 1) % CATEGORY_ORDER.length];
    const meta = CATEGORY_META[cat];
    pages.push({
      pageNumber: i,
      category: cat,
      categoryLabel: meta.label,
      categoryTagline: meta.tagline,
      briefs: DEFAULT_BRIEFS_BY_CATEGORY[cat] || [],
      slots: slotsForCategory(i, cat),
    });
  }
  return pages;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AppState {
  publication: PublicationConfig;
  assets: UploadedAsset[];
  manualArticles: ManualArticle[];
  generatedContent: GeneratedContent;
  pages: NewspaperPage[];
  isGenerating: boolean;
  isRenderingPdf: boolean;
  activeStep: number;
  repository: SavedNewspaper[];
  // Workflow lock state
  isNewspaperSaved: boolean;      // true once current newspaper is saved to repository
  generationLocked: boolean;       // true while AI is generating content
  hasUnsavedGeneration: boolean;   // true once content has been generated but not saved

  setPublication: (config: Partial<PublicationConfig>) => void;
  updatePublication: (config: Partial<PublicationConfig>) => void;
  setLanguage: (lang: Language) => void;
  setPageCount: (count: number) => void;
  setTheme: (themeId: string) => void;
  addAsset: (asset: UploadedAsset) => void;
  removeAsset: (id: string) => void;
  addManualArticle: (article: ManualArticle) => void;
  removeManualArticle: (id: string) => void;
  setGeneratedContent: (content: Partial<GeneratedContent>) => void;
  assignContentToSlot: (pageNumber: number, slotId: string, content: ContentBlock) => void;
  removeContentFromSlot: (pageNumber: number, slotId: string) => void;
  setPageBriefs: (pageNumber: number, briefs: BriefItem[]) => void;
  setIsGenerating: (val: boolean) => void;
  setIsRenderingPdf: (val: boolean) => void;
  setActiveStep: (step: number) => void;
  setGenerationLocked: (val: boolean) => void;
  resetPages: () => void;
  saveToRepository: (pdfUrl?: string) => void;
  deleteSavedPaper: (id: string) => void;
  loadSavedPaper: (saved: SavedNewspaper) => void;
  clearSession: () => void;
  startNewSession: () => void;
  updateArticleImage: (articleId: string, imageUrl: string) => void;
  autoFillPagesWithContent: (force?: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      publication: {
        name: 'The Daily Chronicle',
        tagline: 'Truth · People · Perspective',
        date: new Date().toISOString().split('T')[0],
        volume: '18',
        issue: '204',
        edition: 'Pune Edition',
        price: '₹10',
        language: 'en',
        pageCount: 4,
        mastheadLogo: null,
        generationMode: 'ai',
        targetLocation: '',
        articleCount: 6,
        themeId: 'classic-broadsheet',
      },
      assets: [],
      manualArticles: [],
      generatedContent: {
        articles: [],
        facts: null,
        horoscope: null,
        sudoku: null,
        crypticClue: null,
        houseAds: [],
        quote: null,
        history: null,
        weather: null,
        tvGuide: null,
        keyIndicators: DEFAULT_KEY_INDICATORS,
      },
      pages: createDefaultPages(4),
      isGenerating: false,
      isRenderingPdf: false,
      activeStep: 0,
      repository: [],
      isNewspaperSaved: false,
      generationLocked: false,
      hasUnsavedGeneration: false,

      setPublication: (config) =>
        set((state) => ({ publication: { ...state.publication, ...config } })),

      updatePublication: (config) =>
        set((state) => ({ publication: { ...state.publication, ...config } })),

      setLanguage: (lang) =>
        set((state) => ({ publication: { ...state.publication, language: lang as any } })),

      setPageCount: (count) =>
        set((s) => ({
          publication: { ...s.publication, pageCount: count },
          pages: createDefaultPages(count),
        })),

      setTheme: (themeId) =>
        set((state) => ({ publication: { ...state.publication, themeId } })),

      addAsset: (asset) => set((s) => ({ assets: [...s.assets, asset] })),

      removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

      addManualArticle: (article) =>
        set((s) => ({ manualArticles: [...s.manualArticles, article] })),

      removeManualArticle: (id) =>
        set((s) => ({ manualArticles: s.manualArticles.filter((a) => a.id !== id) })),

      autoFillPagesWithContent: (force = true) => {
        const { generatedContent, manualArticles, pages } = get();
        const allArticles = [
          ...manualArticles.map((a) => ({
            id: a.id,
            type: 'manual-article' as const,
            title: a.headline,
            thumbnail: a.images?.[0]?.url,
            data: a,
          })),
          ...generatedContent.articles.map((a) => ({
            id: a.id,
            type: 'article' as const,
            title: a.headline,
            thumbnail: a.imageUrl || undefined,
            data: a,
          })),
        ];

        // Track available pool of articles for category-aware distribution
        const pool = [...allArticles];

        const CATEGORY_PREFERENCES: Record<string, string[]> = {
          'front-page': ['local', 'civic', 'crime', 'police', 'community', 'transit', 'general'],
          'politics': ['politics', 'judiciary', 'governance', 'parliament', 'assembly', 'cabinet'],
          'international': ['world', 'international', 'diplomacy', 'foreign'],
          'business-tech': ['business', 'economy', 'technology', 'markets', 'finance'],
          'education-science': ['science', 'education', 'research', 'space', 'environment'],
          'sports': ['sports', 'athletics', 'cricket', 'chess', 'rowing', 'football', 'badminton'],
          'entertainment-lifestyle': ['entertainment', 'culture', 'arts', 'lifestyle', 'cinema', 'heritage'],
          'opinion-features': ['opinion', 'essay', 'column', 'editorial'],
        };

        const updatedPages = (pages || []).map((page, idx) => {
          const pNum = page?.pageNumber || idx + 1;
          const cat = page?.category || (pNum === 1 ? 'front-page' : CATEGORY_ORDER[(pNum - 1) % CATEGORY_ORDER.length]);
          const meta = CATEGORY_META[cat] || CATEGORY_META['politics'];
          const rawSlots = Array.isArray(page?.slots) && page.slots.length > 0 ? page.slots : slotsForCategory(pNum, cat);
          const preferredCats = CATEGORY_PREFERENCES[cat] || [];

          const updatedSlots = rawSlots.map((slot) => {
            const idLower = (slot.id || '').toLowerCase();
            const labelLower = (slot.label || '').toLowerCase();

            // Widget slot: Key Indicators (Page 4)
            if ((idLower.includes('indicator') || labelLower.includes('indicator')) && generatedContent.keyIndicators) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.keyIndicators.id,
                  type: 'key-indicators' as const,
                  title: 'Market Indicators',
                  data: generatedContent.keyIndicators,
                },
              };
            }

            // Widget slot: Daily Sudoku (Page 8)
            if ((idLower.includes('sudoku') || labelLower.includes('sudoku')) && generatedContent.sudoku) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.sudoku.id,
                  type: 'sudoku' as const,
                  title: 'Daily Sudoku',
                  thumbnail: generatedContent.sudoku.imageDataUrl,
                  data: generatedContent.sudoku,
                },
              };
            }

            // Widget slot: Horoscope (Page 8)
            if ((idLower.includes('horoscope') || labelLower.includes('horoscope')) && generatedContent.horoscope) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.horoscope.id,
                  type: 'horoscope' as const,
                  title: 'Daily Horoscope',
                  data: generatedContent.horoscope,
                },
              };
            }

            // Widget slot: Weather Report (Page 8)
            if ((idLower.includes('weather') || labelLower.includes('weather')) && generatedContent.weather) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.weather.id,
                  type: 'weather' as const,
                  title: 'Weather Report',
                  data: generatedContent.weather,
                },
              };
            }

            // Widget slot: Do You Know / Facts (Page 8)
            if ((idLower.includes('fact') || labelLower.includes('fact') || labelLower.includes('know')) && generatedContent.facts) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.facts.id,
                  type: 'facts' as const,
                  title: 'Do You Know?',
                  data: generatedContent.facts,
                },
              };
            }

            // Widget slot: Cryptic Clue
            if ((idLower.includes('cryptic') || labelLower.includes('cryptic')) && generatedContent.crypticClue) {
              return {
                ...slot,
                assignedContent: {
                  id: generatedContent.crypticClue.id,
                  type: 'cryptic' as const,
                  title: 'Cryptic Clue',
                  data: generatedContent.crypticClue,
                },
              };
            }

            // News article slots
            if (force || !slot.assignedContent) {
              // 1. First try matching preferred category from remaining pool
              let matchIndex = pool.findIndex((item) => {
                const itemCat = ((item.data as any)?.category || '').toLowerCase();
                return preferredCats.some((pc) => itemCat.includes(pc));
              });

              // 2. Strict category firewall: NEVER contaminate Politics or World with sports, crime, or local civic!
              if (matchIndex === -1 && pool.length > 0) {
                const STRICT_FORBIDDEN: Record<string, string[]> = {
                  'politics': ['sports', 'crime', 'civic', 'local-crime', 'local-civic'],
                  'international': ['sports', 'crime', 'civic', 'local-crime', 'local-civic'],
                  'sports': ['politics', 'crime', 'civic', 'business', 'technology', 'world'],
                  'business-tech': ['sports', 'crime'],
                  'education-science': ['sports', 'crime'],
                };
                const forbidden = STRICT_FORBIDDEN[cat] || [];
                const compatibleIndex = pool.findIndex((item) => {
                  const itemCat = ((item.data as any)?.category || '').toLowerCase();
                  return !forbidden.some((f) => itemCat.includes(f));
                });
                if (compatibleIndex !== -1) {
                  matchIndex = compatibleIndex;
                }
              }

              if (matchIndex !== -1) {
                const [matchedArticle] = pool.splice(matchIndex, 1);
                return { ...slot, assignedContent: matchedArticle };
              }

              // 3. If no compatible article exists in pool, leave unassigned so that the category-specific
              // high-quality broadsheet fallback will render cleanly without category leakage!
              return { ...slot, assignedContent: null };
            }

            return slot;
          });

          // Use real generated briefs if available, otherwise fall back to category defaults
          const briefsToUse = (generatedContent.briefs && generatedContent.briefs[cat])
            ? generatedContent.briefs[cat]
            : (Array.isArray(page?.briefs) && page.briefs.length > 0 ? page.briefs : (DEFAULT_BRIEFS_BY_CATEGORY[cat] || []));

          return {
            ...page,
            pageNumber: pNum,
            category: cat,
            categoryLabel: page?.categoryLabel || meta.label,
            categoryTagline: page?.categoryTagline || meta.tagline,
            briefs: briefsToUse,
            slots: updatedSlots,
          };
        });

        set({ pages: updatedPages });
      },

      setGeneratedContent: (content) => {
        set((s) => ({
          generatedContent: { ...s.generatedContent, ...content },
          hasUnsavedGeneration: true,
          isNewspaperSaved: false,
        }));
        // Automatically auto-fill pages with new articles and widgets
        get().autoFillPagesWithContent(true);
      },

      setGenerationLocked: (val) => set({ generationLocked: val }),

      assignContentToSlot: (pageNumber, slotId, content) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.pageNumber === pageNumber
              ? { ...p, slots: p.slots.map((slot) => (slot.id === slotId ? { ...slot, assignedContent: content } : slot)) }
              : p
          ),
        })),

      removeContentFromSlot: (pageNumber, slotId) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.pageNumber === pageNumber
              ? { ...p, slots: p.slots.map((slot) => (slot.id === slotId ? { ...slot, assignedContent: null } : slot)) }
              : p
          ),
        })),

      setPageBriefs: (pageNumber, briefs) =>
        set((s) => ({
          pages: s.pages.map((p) => (p.pageNumber === pageNumber ? { ...p, briefs } : p)),
        })),

      setIsGenerating: (val) => set({ isGenerating: val }),
      setIsRenderingPdf: (val) => set({ isRenderingPdf: val }),
      setActiveStep: (step) => set({ activeStep: step }),
      resetPages: () => set((s) => ({ pages: createDefaultPages(s.publication.pageCount) })),

      saveToRepository: (pdfUrl?: string) => {
        const { publication, assets, manualArticles, generatedContent, pages } = get();
        if (generatedContent.articles.length === 0 && manualArticles.length === 0) return;
        const newSaved: SavedNewspaper = {
          id: uuidv4(),
          config: JSON.parse(JSON.stringify(publication)),
          assets: JSON.parse(JSON.stringify(assets)),
          manualArticles: JSON.parse(JSON.stringify(manualArticles)),
          content: JSON.parse(JSON.stringify(generatedContent)),
          pages: JSON.parse(JSON.stringify(pages)),
          savedAt: new Date().toISOString(),
          pdfUrl,
        };
        set((s) => ({
          repository: [newSaved, ...s.repository],
          isNewspaperSaved: true,
          hasUnsavedGeneration: false,
        }));
      },

      startNewSession: () =>
        set((s) => ({
          assets: [],
          manualArticles: [],
          generatedContent: {
            articles: [],
            facts: null,
            horoscope: null,
            sudoku: null,
            crypticClue: null,
            houseAds: [],
            quote: null,
            history: null,
            weather: null,
            tvGuide: null,
            keyIndicators: DEFAULT_KEY_INDICATORS,
          },
          pages: createDefaultPages(s.publication.pageCount),
          activeStep: 0,
          isNewspaperSaved: false,
          hasUnsavedGeneration: false,
          generationLocked: false,
        })),

      deleteSavedPaper: (id) =>
        set((s) => ({ repository: s.repository.filter((p) => p.id !== id) })),

      loadSavedPaper: (saved: SavedNewspaper) => {
        const loadedContent = saved.content ? JSON.parse(JSON.stringify(saved.content)) : {};
        const safeContent: GeneratedContent = {
          articles: Array.isArray(loadedContent.articles) ? loadedContent.articles : [],
          facts: loadedContent.facts || null,
          horoscope: loadedContent.horoscope || null,
          sudoku: loadedContent.sudoku || null,
          crypticClue: loadedContent.crypticClue || null,
          houseAds: Array.isArray(loadedContent.houseAds) ? loadedContent.houseAds : [],
          quote: loadedContent.quote || null,
          history: loadedContent.history || null,
          weather: loadedContent.weather || null,
          tvGuide: loadedContent.tvGuide || null,
          keyIndicators: loadedContent.keyIndicators || DEFAULT_KEY_INDICATORS,
          briefs: loadedContent.briefs || {},
        };

        const safePages: NewspaperPage[] = Array.isArray(saved.pages) && saved.pages.length > 0
          ? saved.pages.map((p, idx) => {
              const pNum = p?.pageNumber || idx + 1;
              const cat = p?.category || (pNum === 1 ? 'front-page' : CATEGORY_ORDER[(pNum - 1) % CATEGORY_ORDER.length]);
              const meta = CATEGORY_META[cat] || CATEGORY_META['politics'];
              return {
                ...p,
                pageNumber: pNum,
                category: cat,
                categoryLabel: p?.categoryLabel || meta.label,
                categoryTagline: p?.categoryTagline || meta.tagline,
                briefs: Array.isArray(p?.briefs) && p.briefs.length > 0 ? p.briefs : (DEFAULT_BRIEFS_BY_CATEGORY[cat] || []),
                slots: Array.isArray(p?.slots) && p.slots.length > 0 ? p.slots : slotsForCategory(pNum, cat),
              };
            })
          : createDefaultPages(saved.config?.pageCount || 4);

        set({
          publication: JSON.parse(JSON.stringify(saved.config || {})),
          assets: JSON.parse(JSON.stringify(saved.assets || [])),
          manualArticles: JSON.parse(JSON.stringify(saved.manualArticles || [])),
          generatedContent: safeContent,
          pages: safePages,
          isNewspaperSaved: true,
          hasUnsavedGeneration: false,
          generationLocked: false,
        });
      },

      clearSession: () =>
        set((s) => ({
          assets: [],
          manualArticles: [],
          generatedContent: {
            articles: [],
            facts: null,
            horoscope: null,
            sudoku: null,
            crypticClue: null,
            houseAds: [],
            quote: null,
            history: null,
            weather: null,
            tvGuide: null,
            keyIndicators: DEFAULT_KEY_INDICATORS,
          },
          pages: createDefaultPages(s.publication.pageCount),
          activeStep: 0,
          isNewspaperSaved: false,
          hasUnsavedGeneration: false,
          generationLocked: false,
        })),

      updateArticleImage: (articleId: string, imageUrl: string) =>
        set((state) => {
          const updatedGeneratedArticles = state.generatedContent.articles.map((article) =>
            article.id === articleId
              ? { ...article, imageUrl, images: [{ url: imageUrl, caption: article.imageCaption || '' }] }
              : article
          );
          const updatedManualArticles = state.manualArticles.map((article) =>
            article.id === articleId
              ? { ...article, images: [{ id: 'manual-img', name: 'uploaded-image', url: imageUrl, type: 'image' as const }] }
              : article
          );
          const updatedPages = state.pages.map((page) => ({
            ...page,
            slots: page.slots.map((slot) => {
              if (slot.assignedContent && slot.assignedContent.data.id === articleId) {
                const updatedData = {
                  ...slot.assignedContent.data,
                  ...(slot.assignedContent.type === 'article'
                    ? { imageUrl, images: [{ url: imageUrl, caption: (slot.assignedContent.data as NewsArticle).imageCaption || '' }] }
                    : { images: [{ id: 'manual-img', name: 'uploaded-image', url: imageUrl, type: 'image' as const }] }),
                };
                return { ...slot, assignedContent: { ...slot.assignedContent, thumbnail: imageUrl, data: updatedData as any } };
              }
              return slot;
            }),
          }));
          return {
            generatedContent: { ...state.generatedContent, articles: updatedGeneratedArticles },
            manualArticles: updatedManualArticles,
            pages: updatedPages,
          };
        }),
    }),
    {
      name: 'news-builder-storage',
      partialize: (state) => ({
        publication: state.publication,
        assets: state.assets,
        manualArticles: state.manualArticles,
        generatedContent: state.generatedContent,
        pages: state.pages,
        activeStep: state.activeStep,
        repository: state.repository,
        isNewspaperSaved: state.isNewspaperSaved,
        hasUnsavedGeneration: state.hasUnsavedGeneration,
        // Notice: isGenerating, isRenderingPdf, generationLocked are intentionally excluded
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Cleanly release any generation or PDF rendering locks on page refresh
          state.isGenerating = false;
          state.isRenderingPdf = false;
          state.generationLocked = false;

          if (!state.generatedContent) {
            state.generatedContent = {
              articles: [],
              facts: null,
              horoscope: null,
              sudoku: null,
              crypticClue: null,
              houseAds: [],
              quote: null,
              history: null,
              weather: null,
              tvGuide: null,
              keyIndicators: DEFAULT_KEY_INDICATORS,
            };
          } else if (!state.generatedContent.keyIndicators) {
            state.generatedContent.keyIndicators = DEFAULT_KEY_INDICATORS;
          }

          if (Array.isArray(state.pages)) {
            state.pages = state.pages.map((p, idx) => {
              const pNum = p?.pageNumber || idx + 1;
              const cat = p?.category || (pNum === 1 ? 'front-page' : CATEGORY_ORDER[(pNum - 1) % CATEGORY_ORDER.length]);
              const meta = CATEGORY_META[cat] || CATEGORY_META['politics'];
              return {
                ...p,
                pageNumber: pNum,
                category: cat,
                categoryLabel: p?.categoryLabel || meta.label,
                categoryTagline: p?.categoryTagline || meta.tagline,
                briefs: Array.isArray(p?.briefs) && p.briefs.length > 0 ? p.briefs : (DEFAULT_BRIEFS_BY_CATEGORY[cat] || []),
                slots: Array.isArray(p?.slots) && p.slots.length > 0 ? p.slots : slotsForCategory(pNum, cat),
              };
            });
          }
        }
      },
    }
  )
);
