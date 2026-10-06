'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Newspaper,
  Sparkles,
  Loader2,
  CheckCircle2,
  Star,
  Lightbulb,
  Grid3X3,
  HelpCircle,
  Megaphone,
  Wand2,
  MapPin,
  AlertCircle,
  RefreshCw,
  Lock,
  ArrowRight,
  BookmarkCheck,
  Layout,
  Trash2,
} from 'lucide-react';

const contentTypes = [
  {
    id: 'articles',
    label: 'News Articles',
    desc: 'AI researches real 7-day trending news and writes multi-paragraph articles',
    icon: Newspaper,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 border-blue-200',
    required: true,
  },
  {
    id: 'horoscope',
    label: 'Daily Horoscope',
    desc: 'Predictions for all 12 astrological zodiac signs',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 border-purple-200',
    required: false,
  },
  {
    id: 'facts',
    label: 'Do You Know?',
    desc: '5 verified interesting historical and scientific facts',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 border-amber-200',
    required: false,
  },
  {
    id: 'sudoku',
    label: 'Daily Sudoku',
    desc: 'Interactive mathematical Sudoku puzzle grid',
    icon: Grid3X3,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 border-emerald-200',
    required: false,
  },
  {
    id: 'cryptic',
    label: 'Cryptic Corner',
    desc: 'Daily cryptic crossword clue with editorial explanation',
    icon: HelpCircle,
    color: 'from-rose-500 to-red-500',
    bg: 'bg-rose-50 border-rose-200',
    required: false,
  },
  {
    id: 'houseAds',
    label: 'House Advertisements',
    desc: 'Automated print filler ads & subscription notices',
    icon: Megaphone,
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 border-indigo-200',
    required: false,
  },
  {
    id: 'keyIndicators',
    label: 'Market Indicators',
    desc: 'Sensex, Nifty 50, USD/INR, Gold, Crude & 10Y G-Sec rates',
    icon: Grid3X3,
    color: 'from-emerald-600 to-green-500',
    bg: 'bg-green-50 border-green-200',
    required: false,
  },
];

export default function ContentGenerator() {
  const {
    publication,
    generatedContent,
    setGeneratedContent,
    isGenerating,
    setIsGenerating,
    updatePublication,
    generationLocked,
    setGenerationLocked,
    hasUnsavedGeneration,
    isNewspaperSaved,
    saveToRepository,
    startNewSession,
  } = useAppStore();

  const [generatingItems, setGeneratingItems] = useState<Set<string>>(new Set());
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [globalProgress, setGlobalProgress] = useState(0);
  const [currentlyGeneratingName, setCurrentlyGeneratingName] = useState<string>('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Cleanly unlock any stale generating state that may linger from previous browser sessions
  useEffect(() => {
    setIsGenerating(false);
    setGenerationLocked(false);
  }, [setIsGenerating, setGenerationLocked]);

  const getContentStatus = (id: string) => {
    if (errors.has(id)) return 'error';
    if (completedItems.has(id)) return 'completed';
    if (generatingItems.has(id)) return 'generating';
    if (id === 'articles' && generatedContent.articles.length > 0) return 'completed';
    if (id === 'horoscope' && generatedContent.horoscope) return 'completed';
    if (id === 'facts' && generatedContent.facts) return 'completed';
    if (id === 'sudoku' && generatedContent.sudoku) return 'completed';
    if (id === 'cryptic' && generatedContent.crypticClue) return 'completed';
    if (id === 'houseAds' && generatedContent.houseAds.length > 0) return 'completed';
    if (id === 'keyIndicators' && generatedContent.keyIndicators) return 'completed';
    return 'pending';
  };

  const generateSingle = async (typeId: string): Promise<boolean> => {
    const itemMeta = contentTypes.find((ct) => ct.id === typeId);
    setCurrentlyGeneratingName(itemMeta?.label || typeId);
    setGeneratingItems((prev) => new Set(prev).add(typeId));
    setErrors((prev) => {
      const n = new Set(prev);
      n.delete(typeId);
      return n;
    });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: typeId,
          language: publication.language,
          pageCount: publication.pageCount,
          targetLocation: publication.targetLocation,
          articleCount: publication.articleCount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const storeKey = typeId === 'cryptic' ? 'crypticClue' : typeId;
        setGeneratedContent({ [storeKey]: data.content });
        setCompletedItems((prev) => new Set(prev).add(typeId));
        return true;
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error(`Error generating ${typeId}:`, err);
      setErrors((prev) => new Set(prev).add(typeId));
      return false;
    } finally {
      setGeneratingItems((prev) => {
        const next = new Set(prev);
        next.delete(typeId);
        return next;
      });
    }
  };

  const runAutoPilot = async () => {
    if (isGenerating || (hasUnsavedGeneration && !isNewspaperSaved)) return;

    setIsGenerating(true);
    setGenerationLocked(true);
    setCompletedItems(new Set());
    setErrors(new Set());
    setGlobalProgress(15);
    setCurrentlyGeneratingName('Scraping real-time 7-day news syndicates (Google News RSS)...');

    let progressTimer: NodeJS.Timeout | null = null;
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 60000);

    try {
      // Smoothly advance progress indicator while backend models compute
      progressTimer = setInterval(() => {
        setGlobalProgress((prev) => {
          if (prev < 40) return prev + 6;
          if (prev < 70) return prev + 4;
          if (prev < 88) return prev + 2;
          return prev;
        });
      }, 1400);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          type: 'auto-pilot',
          language: publication.language,
          pageCount: publication.pageCount,
          targetLocation: publication.targetLocation,
          articleCount: publication.articleCount,
        }),
      });

      clearTimeout(abortTimeout);
      if (progressTimer) clearInterval(progressTimer);

      setGlobalProgress(92);
      setCurrentlyGeneratingName('Assembling puzzles, market tickers, real briefs, and documentary photography...');

      const data = await res.json();

      if (data.success && data.content) {
        setGeneratedContent(data.content);
        setCompletedItems(new Set(contentTypes.map((ct) => ct.id)));
        setGlobalProgress(100);
        setCurrentlyGeneratingName('AI Auto-Pilot complete! All pages 100% populated with 7-day news.');
      } else {
        throw new Error(data.error || 'Auto-Pilot generation failed');
      }
    } catch (err) {
      clearTimeout(abortTimeout);
      if (progressTimer) clearInterval(progressTimer);
      console.error('Auto-Pilot error:', err);
      setCurrentlyGeneratingName('Completing sections in safe sequential mode...');
      await generateAll(true);
    } finally {
      clearTimeout(abortTimeout);
      if (progressTimer) clearInterval(progressTimer);
      setIsGenerating(false);
      setGenerationLocked(false);
      setTimeout(() => setCurrentlyGeneratingName(''), 4000);
    }
  };

  const generateAll = async (isInternalFallback = false) => {
    if (!isInternalFallback && (isGenerating || (hasUnsavedGeneration && !isNewspaperSaved))) return;

    setIsGenerating(true);
    setGenerationLocked(true);
    setCompletedItems(new Set());
    setErrors(new Set());
    setGlobalProgress(10);

    let completed = 0;
    for (const ct of contentTypes) {
      await generateSingle(ct.id);
      completed++;
      setGlobalProgress(Math.round((completed / contentTypes.length) * 100));
    }

    setIsGenerating(false);
    setGenerationLocked(false);
    setCurrentlyGeneratingName('');
    setGlobalProgress(100);
  };

  const handleQuickSave = () => {
    saveToRepository();
  };

  const handleStartSecondNewspaper = () => {
    startNewSession();
  };

  const articlesGenerated = generatedContent.articles.length;
  const completedCount = contentTypes.filter((ct) => getContentStatus(ct.id) === 'completed').length;
  const isAllDone = completedCount === contentTypes.length;

  return (
    <div className="space-y-6">

      {/* 1. WORKFLOW LOCK BANNER (If newspaper has unsaved generated content) */}
      {hasUnsavedGeneration && !isNewspaperSaved && !isGenerating && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-3xl shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-950">Active Edition Locked — Save Required</h4>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Unsaved Draft
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 max-w-xl leading-relaxed">
                  Your current newspaper edition has generated content. To prevent accidental overwrites, save this edition to your vault or export the PDF before starting a 2nd newspaper.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-end md:self-auto">
              <Link href="/admin/planner">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs transition-all">
                  <Layout className="h-3.5 w-3.5 mr-1.5" />
                  Open Planner & Export PDF
                </Button>
              </Link>

              <Button
                onClick={handleQuickSave}
                variant="outline"
                className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs h-10 px-4 rounded-xl transition-all"
              >
                <BookmarkCheck className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                Quick Save to Vault
              </Button>

              <button
                onClick={() => setShowDiscardConfirm(true)}
                className="text-xs font-semibold text-amber-700 hover:text-red-600 px-2 py-1.5 transition-colors"
                title="Discard current draft"
              >
                Discard & Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SAVED CONFIRMATION BANNER (Enables starting 2nd newspaper cleanly) */}
      {isNewspaperSaved && !isGenerating && (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Newspaper Saved to Vault!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your edition is preserved in the repository. You can now start generating a fresh 2nd newspaper edition.
                </p>
              </div>
            </div>

            <Button
              onClick={handleStartSecondNewspaper}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Start 2nd Newspaper (New Session)
            </Button>
          </div>
        </div>
      )}

      {/* 3. TARGET LOCATION BAR & NEWS VERIFICATION LAYER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-r from-indigo-50/70 via-blue-50/60 to-emerald-50/50 border border-indigo-200/80 p-4 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-600/20">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-950">Target Region / Micro-Location</span>
              <span className="text-[10px] text-emerald-700 font-semibold">(Verified multi-source search: Google News + Municipal/PMC + Police)</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Kondhwa, Pune, Mumbai, Bengaluru (blank = National Edition)"
              value={publication.targetLocation || ''}
              onChange={(e) => updatePublication({ targetLocation: e.target.value })}
              className="w-full bg-white border border-indigo-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              disabled={isGenerating}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs whitespace-nowrap self-start sm:self-auto">
          <span className="text-emerald-600 font-black">✓</span>
          <span>News Verification Layer Active</span>
        </div>
      </div>

      {/* 4. ACTIVE GENERATION PROGRESS BAR */}
      {isGenerating && (
        <div className="bg-white border border-blue-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Synthesizing Newspaper Broadsheet Content...
                </p>
                {currentlyGeneratingName && (
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    Currently writing: <strong>{currentlyGeneratingName}</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-blue-600">{globalProgress}%</span>
              <button
                onClick={() => {
                  setIsGenerating(false);
                  setGenerationLocked(false);
                  setGlobalProgress(0);
                  setCurrentlyGeneratingName('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors px-2.5 py-1 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 bg-white shadow-2xs"
                title="Cancel or reset active generation"
              >
                Reset / Unlock
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">
            Generating journalist prose, puzzles, horoscopes, and matching high-res documentary photography. Please do not close this window.
          </p>
        </div>
      )}

      {/* 5. MAIN CONTENT PIPELINE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Broadsheet Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {articlesGenerated > 0
                  ? `${articlesGenerated} articles generated • ${completedCount}/${contentTypes.length} broadsheet sections complete`
                  : 'Synthesize all 7 editorial sections together or trigger items individually'}
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={runAutoPilot}
              disabled={isGenerating || generationLocked || (hasUnsavedGeneration && !isNewspaperSaved)}
              className={`font-bold text-xs h-11 px-6 rounded-xl shadow-md transition-all ${
                isGenerating || (hasUnsavedGeneration && !isNewspaperSaved)
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Synthesizing 7-Day Edition...
                </>
              ) : hasUnsavedGeneration && !isNewspaperSaved ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Save Current Edition First
                </>
              ) : isAllDone ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-Run AI Auto-Pilot (Fresh 7-Day News)
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run AI Auto-Pilot (All Pages & Real 7-Day News)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content Type Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {contentTypes.map((ct) => {
            const status = getContentStatus(ct.id);
            const Icon = ct.icon;
            const isItemGenerating = generatingItems.has(ct.id);

            return (
              <div
                key={ct.id}
                className={`relative rounded-2xl border p-4 transition-all duration-200 ${
                  status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : status === 'generating'
                    ? 'border-blue-300 bg-blue-50/60 shadow-xs'
                    : status === 'error'
                    ? 'border-red-200 bg-red-50/60'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ct.color} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{ct.label}</p>
                        {ct.required && (
                          <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Lead Core
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{ct.desc}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-[11px] font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Ready</span>
                      </div>
                    ) : status === 'generating' ? (
                      <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100 px-2.5 py-1.5 rounded-xl text-[11px] font-bold">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Drafting...</span>
                      </div>
                    ) : status === 'error' ? (
                      <button
                        onClick={() => generateSingle(ct.id)}
                        disabled={isGenerating || (hasUnsavedGeneration && !isNewspaperSaved)}
                        className="flex items-center gap-1.5 text-rose-700 bg-rose-100 hover:bg-rose-200 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Retry</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => generateSingle(ct.id)}
                        disabled={isGenerating || (hasUnsavedGeneration && !isNewspaperSaved)}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary with Next Step Link */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{completedCount}/{contentTypes.length} Sections Ready</span>
            </div>
            {articlesGenerated > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <Newspaper className="h-4 w-4" />
                <span>{articlesGenerated} Live Articles</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <Link href="/admin/planner">
                <button className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors">
                  <span>Continue to Page Planner</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Discard Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center mb-1.5">Discard Active Draft?</h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed mb-5">
              This will erase current generated stories and reset the session so you can generate a brand new newspaper.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Keep Draft
              </button>
              <button
                onClick={() => {
                  startNewSession();
                  setShowDiscardConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Discard & Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
