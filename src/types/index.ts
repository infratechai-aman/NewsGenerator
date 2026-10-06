export type Language = 'en' | 'hi' | 'bn';

export type GenerationMode = 'ai' | 'manual';

export type PageCategory =
  | 'front-page'
  | 'politics'
  | 'international'
  | 'business-tech'
  | 'education-science'
  | 'sports'
  | 'entertainment-lifestyle'
  | 'opinion-features';

export type MastheadStyle = 'blackletter' | 'slab' | 'modern' | 'bold';
export type MastheadBorderStyle = 'double' | 'triple-line' | 'ornate' | 'minimal';

export interface NewspaperTheme {
  id: string;
  name: string;
  description: string;
  preview: {
    bg: string;
    text: string;
    accent: string;
  };
  // Typography
  mastheadFont: string;
  headlineFont: string;
  bodyFont: string;
  uiFont: string;
  googleFontsUrl: string;
  // Colors
  paperBg: string;
  inkColor: string;
  accentColor: string;
  categoryHeaderBg: string;
  categoryHeaderText: string;
  columnRuleColor: string;
  mastheadBg: string;
  mastheadText: string;
  // Masthead style
  mastheadStyle: MastheadStyle;
  mastheadBorderStyle: MastheadBorderStyle;
  mastheadTagline: boolean;
  // Special
  paperTexture: boolean;
  dropCapColor: string;
  bylineDividerColor: string;
  sectionBoxBorderTop: string;
}

export interface BriefItem {
  headline: string;
  category: string;
  page?: string;
}

export interface PublicationConfig {
  name: string;
  tagline: string;
  date: string;
  volume: string;
  issue: string;
  edition: string;
  price: string;
  language: 'en' | 'hi' | 'bn';
  pageCount: number;
  mastheadLogo: string | null;
  generationMode: GenerationMode;
  targetLocation: string;
  articleCount: number;
  themeId: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'ad';
  width?: number;
  height?: number;
}

export interface ManualArticle {
  id: string;
  headline: string;
  shortDescription: string;
  content: string;
  images: UploadedAsset[];
  author: string;
  date?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  subHeadline?: string;
  content: string;
  images?: { url: string; caption?: string }[];
  imageUrl?: string | null;
  imageCaption?: string | null;
  category: string;
  source: string;
  date?: string;
  pullQuote?: string;
  keyHighlights?: string[];
  briefs?: BriefItem[];
}

export interface DoYouKnowFacts {
  id: string;
  facts: string[];
}

export interface HoroscopeEntry {
  sign: string;
  prediction: string;
  luckyNumber?: string;
  luckyColor?: string;
}

export interface Horoscope {
  id: string;
  entries: HoroscopeEntry[];
}

export interface SudokuPuzzle {
  id: string;
  difficulty: 'easy' | 'medium';
  imageDataUrl: string;
}

export interface CrypticClue {
  id: string;
  clue: string;
  answer: string;
  hint: string;
}

export interface HouseAd {
  id: string;
  title: string;
  description: string;
  tagline: string;
  type: 'classifieds' | 'subscription' | 'event' | 'general';
}

export interface QuoteOfTheDay {
  id: string;
  quote: string;
  author: string;
}

export interface OnThisDay {
  id: string;
  events: { year: string; event: string }[];
}

export interface WeatherReport {
  id: string;
  city: string;
  currentTemp: string;
  currentCondition: string;
  currentIcon: string;
  forecast: { day: string; high: string; low: string; icon: string }[];
  reports: { city: string; temp: string; conditionIcon: string; condition: string }[];
}

export interface TvGuide {
  id: string;
  listings: { time: string; show: string; channel: string }[];
}

export interface MarketIndicator {
  name: string;
  value: string;
  change: string;
  direction: 'up' | 'down' | 'flat';
}

export interface KeyIndicators {
  id: string;
  indicators: MarketIndicator[];
}

export type ContentBlockType =
  | 'article'
  | 'manual-article'
  | 'ad'
  | 'horoscope'
  | 'facts'
  | 'sudoku'
  | 'cryptic'
  | 'house-ad'
  | 'quote'
  | 'history'
  | 'weather'
  | 'tv-guide'
  | 'key-indicators';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title: string;
  thumbnail?: string;
  data:
    | NewsArticle
    | ManualArticle
    | UploadedAsset
    | DoYouKnowFacts
    | Horoscope
    | SudokuPuzzle
    | CrypticClue
    | HouseAd
    | QuoteOfTheDay
    | OnThisDay
    | WeatherReport
    | TvGuide
    | KeyIndicators;
}

export type SlotSize = 'full' | 'half' | 'third' | 'quarter' | 'two-thirds';

export interface PageSlot {
  id: string;
  label: string;
  size: SlotSize;
  row: number;
  colStart: number;
  colSpan: number;
  assignedContent: ContentBlock | null;
}

export interface NewspaperPage {
  pageNumber: number;
  category: PageCategory;
  categoryLabel: string;
  categoryTagline: string;
  briefs: BriefItem[];
  slots: PageSlot[];
}

export interface GeneratedContent {
  articles: NewsArticle[];
  facts: DoYouKnowFacts | null;
  horoscope: Horoscope | null;
  sudoku: SudokuPuzzle | null;
  crypticClue: CrypticClue | null;
  houseAds: HouseAd[];
  quote: QuoteOfTheDay | null;
  history: OnThisDay | null;
  weather: WeatherReport | null;
  tvGuide: TvGuide | null;
  keyIndicators: KeyIndicators | null;
  briefs?: Record<string, BriefItem[]>;
}

export interface SavedNewspaper {
  id: string;
  config: PublicationConfig;
  content: GeneratedContent;
  pages: NewspaperPage[];
  manualArticles: ManualArticle[];
  assets: UploadedAsset[];
  savedAt: string;
  pdfUrl?: string;
}
