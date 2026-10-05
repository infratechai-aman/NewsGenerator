'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ContentBlock, ContentBlockType, NewspaperPage } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Newspaper,
  ArrowLeft,
  FileOutput,
  Loader2,
  GripVertical,
  Image as ImageIcon,
  Star,
  Lightbulb,
  Grid3X3,
  HelpCircle,
  Megaphone,
  X,
  Download,
  PenTool,
  Wand2,
  Quote,
  History,
  CloudSun,
  Tv,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeImageUrl, getCategoryFallbackImage } from '@/lib/images';
import { buildNewspaperHTML } from '@/lib/newspaper-template';
import { NEWSPAPER_THEMES, getThemeById } from '@/lib/themes';

const typeIcons: Record<ContentBlockType, React.ComponentType<{ className?: string }>> = {
  article: Newspaper,
  'manual-article': PenTool,
  ad: ImageIcon,
  horoscope: Star,
  facts: Lightbulb,
  sudoku: Grid3X3,
  cryptic: HelpCircle,
  'house-ad': Megaphone,
  quote: Quote,
  history: History,
  weather: CloudSun,
  'tv-guide': Tv,
  'key-indicators': Grid3X3,
};

const typeColors: Record<ContentBlockType, string> = {
  article: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'manual-article': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  ad: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  horoscope: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  facts: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sudoku: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cryptic: 'bg-red-500/20 text-red-400 border-red-500/30',
  'house-ad': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  quote: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  history: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  weather: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'tv-guide': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'key-indicators': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function PlannerPage() {
  const {
    pages,
    generatedContent,
    manualArticles,
    assets,
    publication,
    assignContentToSlot,
    removeContentFromSlot,
    isRenderingPdf,
    setIsRenderingPdf,
    saveToRepository,
    clearSession,
    updateArticleImage,
    setTheme,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const [activePageIdx, setActivePageIdx] = useState(0);
  const [draggedBlock, setDraggedBlock] = useState<ContentBlock | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const currentTheme = getThemeById(publication.themeId || 'classic-broadsheet');

  // Build content blocks from generated content and assets
  const contentBlocks: ContentBlock[] = [];

  manualArticles.forEach((article) => {
    contentBlocks.push({
      id: article.id,
      type: 'manual-article',
      title: article.headline,
      thumbnail: article.images?.[0]?.url || undefined,
      data: article,
    });
  });

  generatedContent.articles.forEach((article) => {
    contentBlocks.push({
      id: article.id,
      type: 'article',
      title: article.headline,
      thumbnail: sanitizeImageUrl(article.imageUrl, article.category) || undefined,
      data: article,
    });
  });


  if (generatedContent.horoscope) {
    contentBlocks.push({
      id: generatedContent.horoscope.id,
      type: 'horoscope',
      title: 'Daily Horoscope',
      data: generatedContent.horoscope,
    });
  }

  if (generatedContent.facts) {
    contentBlocks.push({
      id: generatedContent.facts.id,
      type: 'facts',
      title: 'Do You Know?',
      data: generatedContent.facts,
    });
  }

  if (generatedContent.sudoku) {
    contentBlocks.push({
      id: generatedContent.sudoku.id,
      type: 'sudoku',
      title: 'Daily Sudoku',
      thumbnail: generatedContent.sudoku.imageDataUrl,
      data: generatedContent.sudoku,
    });
  }

  if (generatedContent.crypticClue) {
    contentBlocks.push({
      id: generatedContent.crypticClue.id,
      type: 'cryptic',
      title: 'Cryptic Corner',
      data: generatedContent.crypticClue,
    });
  }

  generatedContent.houseAds.forEach((ad) => {
    contentBlocks.push({
      id: ad.id,
      type: 'house-ad',
      title: ad.title,
      data: ad,
    });
  });

  if (generatedContent.quote) {
    contentBlocks.push({
      id: generatedContent.quote.id,
      type: 'quote',
      title: 'Quote of the Day',
      data: generatedContent.quote,
    });
  }

  if (generatedContent.history) {
    contentBlocks.push({
      id: generatedContent.history.id,
      type: 'history',
      title: 'On This Day',
      data: generatedContent.history,
    });
  }

  if (generatedContent.weather) {
    contentBlocks.push({
      id: generatedContent.weather.id,
      type: 'weather',
      title: 'Weather Report',
      data: generatedContent.weather,
    });
  }

  if (generatedContent.tvGuide) {
    contentBlocks.push({
      id: generatedContent.tvGuide.id,
      type: 'tv-guide',
      title: 'TV Guide',
      data: generatedContent.tvGuide,
    });
  }

  if (generatedContent.keyIndicators) {
    contentBlocks.push({
      id: generatedContent.keyIndicators.id,
      type: 'key-indicators',
      title: 'Key Market Indicators',
      data: generatedContent.keyIndicators,
    });
  }

  assets.forEach((asset) => {
    contentBlocks.push({
      id: asset.id,
      type: 'ad',
      title: asset.name,
      thumbnail: asset.url,
      data: asset,
    });
  });

  // Find which blocks are already assigned
  const assignedIds = new Set<string>();
  pages.forEach((p) =>
    p.slots.forEach((s) => {
      if (s.assignedContent) assignedIds.add(s.assignedContent.id);
    })
  );

  const unassignedBlocks = contentBlocks.filter((b) => !assignedIds.has(b.id));
  const activePage = pages[activePageIdx];

  const handleDragStart = (block: ContentBlock) => {
    setDraggedBlock(block);
  };

  const handleDrop = (slotId: string) => {
    if (draggedBlock && activePage) {
      assignContentToSlot(activePage.pageNumber, slotId, draggedBlock);
      setDraggedBlock(null);
    }
  };

  const handleAutoFill = () => {
    let blockIdx = 0;
    pages.forEach(page => {
      page.slots.forEach(slot => {
        if (!slot.assignedContent && blockIdx < unassignedBlocks.length) {
          assignContentToSlot(page.pageNumber, slot.id, unassignedBlocks[blockIdx]);
          blockIdx++;
        }
      });
    });
  };

  const handleExportPdf = async () => {
    setIsRenderingPdf(true);
    setPdfUrl(null);

    try {
      const res = await fetch('/api/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publication,
          pages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setPdfUrl(data.url);
          saveToRepository(data.url);
          clearSession();
          window.open(data.url, '_blank');
          return;
        }
      }
      throw new Error('Server PDF rendering fell through to client engine');
    } catch (err) {
      console.warn('[PDF Engine] Falling back to client-assisted high-res print engine:', err);
      try {
        // Bulletproof client-side print engine:
        const html = buildNewspaperHTML(publication, pages, window.location.origin);
        const printToolbar = `
          <div style="position:fixed;top:0;left:0;right:0;z-index:999999;background:#0f172a;color:#f8fafc;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 20px rgba(0,0,0,0.35);font-family:system-ui,sans-serif;">
            <div style="font-weight:700;font-size:14px;color:#fff;">${publication.name || 'Newspaper Edition'} • <span style="color:#60a5fa;font-size:11px;">300 DPI Pre-Press Ready</span></div>
            <div style="display:flex;gap:10px;">
              <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;">🖨️ Save as PDF / Print</button>
              <button onclick="window.close()" style="background:rgba(255,255,255,0.1);color:#94a3b8;border:1px solid rgba(255,255,255,0.2);padding:7px 14px;border-radius:8px;font-size:12px;cursor:pointer;">Close</button>
            </div>
          </div>
          <style>
            @media screen { body { padding-top: 55px !important; background: #334155 !important; } .page { box-shadow: 0 10px 30px rgba(0,0,0,0.4); margin-bottom: 30px !important; } }
            @media print { div[style*="position:fixed"] { display: none !important; } body { padding-top: 0 !important; background: #fff !important; } }
          </style>
          <script>window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 700); });</script>
        `;
        const fullHtml = html.includes('<body') ? html.replace(/<body([^>]*)>/i, `<body$1>${printToolbar}`) : printToolbar + html;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
        saveToRepository(blobUrl);
        clearSession();
        window.open(blobUrl, '_blank');
      } catch (clientErr) {
        console.error('All PDF rendering options exhausted:', clientErr);
        alert('Could not export PDF. Please check that pages have content assigned.');
      }
    } finally {
      setIsRenderingPdf(false);
    }
  };

  const onImageClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    fileInputRef.current?.click();
  };

  const handleImageReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedArticleId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateArticleImage(selectedArticleId, imageUrl);
        setSelectedArticleId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSlotGridClasses = (colSpan: number): string => {
    switch (colSpan) {
      case 6: return 'col-span-6';
      case 4: return 'col-span-4';
      case 3: return 'col-span-3';
      case 2: return 'col-span-2';
      default: return 'col-span-1';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-full mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Page Planner Configuration</h1>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <Palette className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-slate-500 font-semibold">Theme:</span>
              <select
                value={publication.themeId || 'classic-broadsheet'}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                {NEWSPAPER_THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAutoFill}
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-semibold shadow-sm"
              disabled={unassignedBlocks.length === 0}
            >
              <Wand2 className="h-4 w-4 mr-1.5" />
              Auto-Fill Layout
            </Button>
            {pdfUrl && (
              <Button onClick={() => window.open(pdfUrl, '_blank')} variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 font-semibold shadow-sm">
                <Download className="h-4 w-4 mr-1" />
                View PDF
              </Button>
            )}
            <Button
              onClick={handleExportPdf}
              disabled={isRenderingPdf}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-blue-500/20 font-semibold"
            >
              {isRenderingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rendering PDF...
                </>
              ) : (
                <>
                  <FileOutput className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Content Blocks */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-slate-400" />
              Content Blocks
            </h2>
            <p className="text-xs text-slate-500 mt-1 pl-6">
              Drag blocks to page slots ({unassignedBlocks.length} available)
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {unassignedBlocks.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100">
                  <Newspaper className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-600">No content available</p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Generate AI content or manually build articles in the dashboard first.
                </p>
              </div>
            ) : (
              unassignedBlocks.map((block) => {
                const Icon = typeIcons[block.type];
                return (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block)}
                    className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] ${typeColors[block.type]}`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 mt-0.5 opacity-50 flex-shrink-0" />
                      {block.thumbnail ? (
                        <img
                          src={sanitizeImageUrl(block.thumbnail, (block.data as any)?.category)}
                          alt=""
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = getCategoryFallbackImage((block.data as any)?.category || block.title);
                          }}
                        />
                      ) : (


                        <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{block.title}</p>
                        <Badge variant="outline" className="text-[10px] mt-1 h-4 px-1">
                          {block.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Area: Page Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Tabs */}
          <div className="flex items-center gap-1 p-3 border-b border-slate-200 bg-slate-50">
            {pages.map((page, idx) => (
              <button
                key={page.pageNumber}
                onClick={() => setActivePageIdx(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  idx === activePageIdx
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Page {page.pageNumber}
                {page.pageNumber === 1 && (
                  <span className="ml-1.5 text-[10px] opacity-80">Front</span>
                )}
                {page.pageNumber === pages.length && pages.length > 1 && (
                  <span className="ml-1.5 text-[10px] opacity-80">Back</span>
                )}
              </button>
            ))}
          </div>

          {/* Page Grid */}
          <div className="flex-1 overflow-auto p-6 bg-slate-100">
            <div className="max-w-3xl mx-auto">
              {/* Page frame */}
              <div className="bg-white rounded-lg shadow-xl shadow-slate-200/50 p-4 aspect-[210/297] relative border border-slate-200">
                {/* Page header banner: Masthead on Page 1, Category Strip on Inner Pages */}
                {activePage?.pageNumber === 1 ? (
                  <div className="mb-3 border-b-2 border-slate-900 pb-2">
                    <div
                      className="px-2 py-0.5 text-[8px] font-bold tracking-widest text-center uppercase text-white rounded-t"
                      style={{ background: currentTheme.accentColor === '#000000' ? '#1e293b' : currentTheme.accentColor }}
                    >
                      TODAY • {publication.date || 'LATEST EDITION'} • {publication.edition || 'NATIONAL'}
                    </div>
                    <div className="flex items-center justify-between text-[7.5px] text-slate-500 border-b border-slate-200 py-0.5 font-sans">
                      <span>VOL. {publication.volume || '18'} | NO. {publication.issue || '204'}</span>
                      <span className="italic">{publication.tagline || 'Truth • Perspective'}</span>
                      <span>{publication.price || '₹10'}</span>
                    </div>
                    <h1
                      className="text-center font-bold text-slate-900 py-1 tracking-tight"
                      style={{ fontFamily: currentTheme.mastheadFont, fontSize: '24px', lineHeight: 1 }}
                    >
                      {publication.name || 'THE DAILY CHRONICLE'}
                    </h1>
                  </div>
                ) : (
                  <div
                    className="mb-3 px-3 py-1.5 flex items-center justify-between text-[8px] font-bold uppercase tracking-wider rounded"
                    style={{ background: currentTheme.categoryHeaderBg, color: currentTheme.categoryHeaderText }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="opacity-90">PAGE {activePage?.pageNumber}</span>
                      <span>—</span>
                      <span>{activePage?.categoryLabel || 'NEWS'}</span>
                    </div>
                    <span className="text-[7.5px] opacity-80 normal-case font-normal italic">
                      {activePage?.categoryTagline || ''}
                    </span>
                  </div>
                )}

                {/* Slots grid */}
                <div className="grid grid-cols-6 gap-3 h-[calc(100%-2.5rem)]">
                  {activePage?.slots.map((slot) => {
                    const hasContent = slot.assignedContent !== null;
                    return (
                      <div
                        key={slot.id}
                        className={`${getSlotGridClasses(slot.colSpan)} rounded border-2 relative transition-all duration-200 min-h-[60px] ${
                          hasContent ? 'border-transparent bg-slate-50 shadow-sm' : 'border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-blue-400'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
                          handleDrop(slot.id);
                        }}
                      >
                        {hasContent ? (
                          <div className="h-full flex flex-col p-2">
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                {slot.assignedContent!.thumbnail && (
                                  <div className="w-full h-16 rounded overflow-hidden mb-1.5 shadow-sm bg-slate-100">
                                    <img
                                      src={sanitizeImageUrl(slot.assignedContent!.thumbnail, (slot.assignedContent!.data as any)?.category)}
                                      alt=""
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = getCategoryFallbackImage((slot.assignedContent!.data as any)?.category || slot.assignedContent!.title);
                                      }}
                                    />
                                  </div>
                                )}
                                <p className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-tight">
                                  {slot.assignedContent!.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[8px] text-blue-600 uppercase font-bold tracking-wide">
                                    {slot.assignedContent!.type}
                                  </span>
                                  {(slot.assignedContent!.data as any)?.category && (
                                    <span className="text-[7.5px] text-slate-400 font-semibold truncate">
                                      • {(slot.assignedContent!.data as any).category}
                                    </span>
                                  )}
                                </div>
                                {(slot.assignedContent!.data as any)?.content && (
                                  <p className="text-[7.5px] text-slate-500 mt-1 line-clamp-3 leading-snug font-serif">
                                    {(slot.assignedContent!.data as any).content}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center flex-shrink-0">
                                {slot.assignedContent!.type.includes('article') && (
                                  <button
                                    onClick={() => onImageClick(slot.assignedContent!.data.id)}
                                    className="p-1 rounded-md hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors mr-0.5"
                                    title="Replace Image"
                                  >
                                    <ImageIcon className="h-3 w-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    removeContentFromSlot(
                                      activePage.pageNumber,
                                      slot.id
                                    )
                                  }
                                  className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Remove from slot"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-2">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              {slot.label}
                            </p>
                            <p className="text-[8px] text-slate-400 mt-1 font-medium bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">
                              {slot.size}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Briefs Strip Preview at Bottom of Canvas */}
                {activePage?.briefs && activePage.briefs.length > 0 && (
                  <div className="mt-2 pt-1 border-t-2" style={{ borderColor: currentTheme.categoryHeaderBg }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide flex-shrink-0 rounded"
                        style={{ background: currentTheme.categoryHeaderBg, color: currentTheme.categoryHeaderText }}
                      >
                        {activePage.categoryLabel.split('(')[0].trim().toUpperCase()} BRIEFS
                      </span>
                      <div className="flex-1 flex items-center gap-2 overflow-hidden text-[7px] text-slate-600 truncate">
                        {activePage.briefs.slice(0, 4).map((b, bi) => (
                          <span key={bi} className="truncate">
                            <strong style={{ color: currentTheme.accentColor }}>{b.category}:</strong> {b.headline}
                            {bi < Math.min(activePage.briefs.length, 4) - 1 && <span className="mx-1 text-slate-300">|</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden file input for image replacement */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageReplace}
      />
    </div>
  );
}
