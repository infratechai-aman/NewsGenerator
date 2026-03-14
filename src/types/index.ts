export type Language = 'en' | 'hi' | 'bn';

export type GenerationMode = 'ai' | 'manual';

export interface PublicationConfig {
  name: string;
  date: string;
  volume: string;
  issue: string;
  language: 'en' | 'hi' | 'bn';
  pageCount: number;
  mastheadLogo: string | null;
  generationMode: GenerationMode;
  targetLocation: string;
  articleCount: number;
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
  content: string; // Long description
  images: UploadedAsset[]; // Up to 3 images
  author: string;
  date?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  content: string;
  images?: { url: string; caption?: string }[];
  imageUrl?: string | null;
  imageCaption?: string | null;
  category: string;
  source: string;
  date?: string;
}

export interface DoYouKnowFacts {
  id: string;
  facts: string[];
}

export interface HoroscopeEntry {
  sign: string;
  prediction: string;
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
  reports: { city: string; temp: string; conditionIcon: string; condition: string }[];
}

export interface TvGuide {
  id: string;
  listings: { time: string; show: string; channel: string }[];
}

export type ContentBlockType = 'article' | 'manual-article' | 'ad' | 'horoscope' | 'facts' | 'sudoku' | 'cryptic' | 'house-ad' | 'quote' | 'history' | 'weather' | 'tv-guide';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title: string;
  thumbnail?: string;
  data: NewsArticle | ManualArticle | UploadedAsset | DoYouKnowFacts | Horoscope | SudokuPuzzle | CrypticClue | HouseAd | QuoteOfTheDay | OnThisDay | WeatherReport | TvGuide;
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
