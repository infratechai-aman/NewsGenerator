import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublicationConfig, UploadedAsset, GeneratedContent, NewspaperPage, PageSlot, ContentBlock, Language, ManualArticle, SavedNewspaper, NewsArticle } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function createDefaultPages(count: number): NewspaperPage[] {
  const pages: NewspaperPage[] = [];
  for (let i = 1; i <= count; i++) {
    if (i === 1) {
      pages.push({
        pageNumber: 1,
        slots: [
          { id: `p${i}-s1`, label: 'Lead Headline', size: 'two-thirds', row: 1, colStart: 1, colSpan: 4, assignedContent: null },
          { id: `p${i}-s2`, label: 'Side Story', size: 'third', row: 1, colStart: 5, colSpan: 2, assignedContent: null },
          { id: `p${i}-s3`, label: 'Below Fold Left', size: 'half', row: 2, colStart: 1, colSpan: 3, assignedContent: null },
          { id: `p${i}-s4`, label: 'Below Fold Right', size: 'half', row: 2, colStart: 4, colSpan: 3, assignedContent: null },
          { id: `p${i}-s5`, label: 'Bottom Banner Ad', size: 'full', row: 3, colStart: 1, colSpan: 6, assignedContent: null },
        ],
      });
    } else if (i === count) {
      pages.push({
        pageNumber: i,
        slots: [
          { id: `p${i}-s1`, label: 'Top Feature', size: 'full', row: 0, colStart: 1, colSpan: 6, assignedContent: null },
          { id: `p${i}-s2`, label: 'Horoscope Section', size: 'half', row: 1, colStart: 1, colSpan: 3, assignedContent: null },
          { id: `p${i}-s3`, label: 'Do You Know / Puzzles', size: 'half', row: 1, colStart: 4, colSpan: 3, assignedContent: null },
          { id: `p${i}-s4`, label: 'Sudoku', size: 'third', row: 2, colStart: 1, colSpan: 2, assignedContent: null },
          { id: `p${i}-s5`, label: 'Cryptic Corner', size: 'third', row: 2, colStart: 3, colSpan: 2, assignedContent: null },
          { id: `p${i}-s6`, label: 'Bottom Ad', size: 'third', row: 2, colStart: 5, colSpan: 2, assignedContent: null },
        ],
      });
    } else {
      pages.push({
        pageNumber: i,
        slots: [
          { id: `p${i}-s1`, label: 'Top Story', size: 'full', row: 0, colStart: 1, colSpan: 6, assignedContent: null },
          { id: `p${i}-s2`, label: 'Mid Left Article', size: 'half', row: 1, colStart: 1, colSpan: 3, assignedContent: null },
          { id: `p${i}-s3`, label: 'Mid Right Article', size: 'half', row: 1, colStart: 4, colSpan: 3, assignedContent: null },
          { id: `p${i}-s4`, label: 'Quarter Slot 1', size: 'quarter', row: 2, colStart: 1, colSpan: 2, assignedContent: null },
          { id: `p${i}-s5`, label: 'Quarter Slot 2', size: 'quarter', row: 2, colStart: 3, colSpan: 2, assignedContent: null },
          { id: `p${i}-s6`, label: 'Ad Slot', size: 'third', row: 2, colStart: 5, colSpan: 2, assignedContent: null },
        ],
      });
    }
  }
  return pages;
}

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


  setPublication: (config: Partial<PublicationConfig>) => void;
  updatePublication: (config: Partial<PublicationConfig>) => void;
  setLanguage: (lang: Language) => void;
  setPageCount: (count: number) => void;
  addAsset: (asset: UploadedAsset) => void;
  removeAsset: (id: string) => void;
  addManualArticle: (article: ManualArticle) => void;
  removeManualArticle: (id: string) => void;
  setGeneratedContent: (content: Partial<GeneratedContent>) => void;
  assignContentToSlot: (pageNumber: number, slotId: string, content: ContentBlock) => void;
  removeContentFromSlot: (pageNumber: number, slotId: string) => void;
  setIsGenerating: (val: boolean) => void;
  setIsRenderingPdf: (val: boolean) => void;
  setActiveStep: (step: number) => void;
  resetPages: () => void;
  saveToRepository: (pdfUrl?: string) => void;
  deleteSavedPaper: (id: string) => void;
  clearSession: () => void;
  updateArticleImage: (articleId: string, imageUrl: string) => void;
}


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({

  publication: {
    name: 'The Daily Chronicle',
    date: new Date().toISOString().split('T')[0],
    volume: '1',
    issue: '1',
    language: 'en',
    pageCount: 4,
    mastheadLogo: null,
    generationMode: 'ai',
    targetLocation: '',
    articleCount: 6,
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
  },
  pages: createDefaultPages(4),
  isGenerating: false,
  isRenderingPdf: false,
  activeStep: 0,
  repository: [],

  setPublication: (config: Partial<PublicationConfig>) => set((state) => ({ 
    publication: { ...state.publication, ...config } 
  })),

  updatePublication: (config: Partial<PublicationConfig>) => set((state) => ({ 
    publication: { ...state.publication, ...config } 
  })),

  setLanguage: (lang) => set((state) => ({
    publication: { ...state.publication, language: lang as any }
  })),

  setPageCount: (count) =>
    set((s) => ({
      publication: { ...s.publication, pageCount: count },
      pages: createDefaultPages(count),
    })),

  addAsset: (asset) =>
    set((s) => ({ assets: [...s.assets, asset] })),

  removeAsset: (id) =>
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

  addManualArticle: (article) =>
    set((s) => ({ manualArticles: [...s.manualArticles, article] })),

  removeManualArticle: (id) =>
    set((s) => ({ manualArticles: s.manualArticles.filter((a) => a.id !== id) })),

  setGeneratedContent: (content) =>
    set((s) => ({ generatedContent: { ...s.generatedContent, ...content } })),

  assignContentToSlot: (pageNumber, slotId, content) =>
    set((s) => ({
      pages: s.pages.map((p) =>
        p.pageNumber === pageNumber
          ? {
              ...p,
              slots: p.slots.map((slot) =>
                slot.id === slotId ? { ...slot, assignedContent: content } : slot
              ),
            }
          : p
      ),
    })),

  removeContentFromSlot: (pageNumber, slotId) =>
    set((s) => ({
      pages: s.pages.map((p) =>
        p.pageNumber === pageNumber
          ? {
              ...p,
              slots: p.slots.map((slot) =>
                slot.id === slotId ? { ...slot, assignedContent: null } : slot
              ),
            }
          : p
      ),
    })),

  setIsGenerating: (val) => set({ isGenerating: val }),
  setIsRenderingPdf: (val) => set({ isRenderingPdf: val }),
  setActiveStep: (step) => set({ activeStep: step }),
  resetPages: () => set((s) => ({ pages: createDefaultPages(s.publication.pageCount) })),
  
  saveToRepository: (pdfUrl?: string) => {
    const { publication, assets, manualArticles, generatedContent, pages } = get();
    // Only save if there's actually content
    if (generatedContent.articles.length === 0 && manualArticles.length === 0) return;
    
    const newSaved: SavedNewspaper = {
      id: uuidv4(),
      config: JSON.parse(JSON.stringify(publication)),
      assets: JSON.parse(JSON.stringify(assets)),
      manualArticles: JSON.parse(JSON.stringify(manualArticles)),
      content: JSON.parse(JSON.stringify(generatedContent)),
      pages: JSON.parse(JSON.stringify(pages)),
      savedAt: new Date().toISOString(),
      pdfUrl: pdfUrl,
    };
    
    set((s) => ({ repository: [newSaved, ...s.repository] }));
  },

  deleteSavedPaper: (id) => set((s) => ({
    repository: s.repository.filter(p => p.id !== id)
  })),

  clearSession: () => set((s) => ({
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
    },
    pages: createDefaultPages(s.publication.pageCount),
    activeStep: 0,
  })),

  updateArticleImage: (articleId: string, imageUrl: string) => set((state) => {
    // 1. Update in generated articles
    const updatedGeneratedArticles = state.generatedContent.articles.map(article => 
      article.id === articleId ? { ...article, imageUrl, images: [{ url: imageUrl, caption: article.imageCaption || '' }] } : article
    );

    // 2. Update in manual articles
    const updatedManualArticles = state.manualArticles.map(article => 
      article.id === articleId ? { ...article, images: [{ id: 'manual-img', name: 'uploaded-image', url: imageUrl, type: 'image' as const }] } : article
    );

    // 3. Update in placed slots across all pages
    const updatedPages = state.pages.map(page => ({
      ...page,
      slots: page.slots.map(slot => {
        if (slot.assignedContent && slot.assignedContent.data.id === articleId) {
          const updatedData = {
            ...slot.assignedContent.data,
            ...(slot.assignedContent.type === 'article' 
              ? { imageUrl, images: [{ url: imageUrl, caption: (slot.assignedContent.data as NewsArticle).imageCaption || '' }] }
              : { images: [{ id: 'manual-img', name: 'uploaded-image', url: imageUrl, type: 'image' as const }] }
            )
          };
          return {
            ...slot,
            assignedContent: {
              ...slot.assignedContent,
              thumbnail: imageUrl,
              data: updatedData as any
            }
          };
        }
        return slot;
      })
    }));

    return {
      generatedContent: { ...state.generatedContent, articles: updatedGeneratedArticles },
      manualArticles: updatedManualArticles,
      pages: updatedPages
    };
  }),
}),
{
  name: 'news-builder-storage',
}
)
);
