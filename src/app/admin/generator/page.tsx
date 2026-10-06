'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import PublicationIdentity from '@/components/dashboard/PublicationIdentity';
import GlobalSettings from '@/components/dashboard/GlobalSettings';
import AssetLibrary from '@/components/dashboard/AssetLibrary';
import ContentGenerator from '@/components/dashboard/ContentGenerator';
import ThemeSelector from '@/components/ThemeSelector';
import { Button } from '@/components/ui/button';
import {
  Newspaper,
  Settings,
  ImageIcon,
  Sparkles,
  Layout,
  FileOutput,
  ChevronRight,
  CheckCircle2,
  Palette,
  Lock,
  AlertTriangle,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 0, label: 'Style',     icon: Palette,     desc: 'Choose newspaper theme' },
  { id: 1, label: 'Configure', icon: Settings,     desc: 'Publication settings' },
  { id: 2, label: 'Content',   icon: ImageIcon,    desc: 'Articles & ads' },
  { id: 3, label: 'Generate',  icon: Sparkles,     desc: 'AI content pipeline' },
  { id: 4, label: 'Plan & Export', icon: Layout,   desc: 'Layout & PDF export' },
];

export default function GeneratorPage() {
  const {
    activeStep,
    setActiveStep,
    publication,
    generatedContent,
    manualArticles,
    setTheme,
    hasUnsavedGeneration,
    isNewspaperSaved,
    isGenerating,
    startNewSession,
  } = useAppStore();

  const [showNewSessionConfirm, setShowNewSessionConfirm] = useState(false);

  const hasContent =
    generatedContent.articles.length > 0 ||
    manualArticles.length > 0 ||
    generatedContent.horoscope !== null ||
    generatedContent.facts !== null;

  const canGoToStep = (stepId: number): boolean => {
    if (isGenerating && stepId !== activeStep) return false;
    if (hasUnsavedGeneration && !isNewspaperSaved && stepId > activeStep) return false; // Can't skip forward if unsaved
    return true;
  };

  const handleNewSession = () => {
    if (hasUnsavedGeneration && !isNewspaperSaved) {
      setShowNewSessionConfirm(true);
    } else {
      startNewSession();
    }
  };

  return (
    <div className="pb-24">
      {/* Top alert: Unsaved newspaper warning */}
      {hasUnsavedGeneration && !isNewspaperSaved && !isGenerating && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-900">
              You have unsaved content. Export the newspaper as PDF to save it before starting a new one.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/admin/planner">
              <button className="flex items-center gap-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition-colors">
                <FileOutput className="h-3.5 w-3.5" />
                Go to Planner & Export
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Saved confirmation banner */}
      {isNewspaperSaved && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-900">
              Newspaper saved to vault! You can now start a new edition.
            </p>
          </div>
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Start New Newspaper
          </button>
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              const isLocked = isGenerating && !isActive;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      if (!isLocked) setActiveStep(step.id);
                    }}
                    disabled={isLocked}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] scale-[1.02]'
                        : isCompleted
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100/80'
                        : isLocked
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/80 cursor-pointer'
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span>{step.label}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}

            {/* New Session button in header */}
            {hasUnsavedGeneration && !isNewspaperSaved && (
              <div className="ml-auto flex-shrink-0">
                <button
                  onClick={handleNewSession}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors"
                >
                  <Lock className="h-3 w-3" />
                  Locked (Save First)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Step 0: Theme */}
        {activeStep === 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ThemeSelector
              selectedThemeId={publication.themeId || 'classic-broadsheet'}
              onSelect={(id) => setTheme(id)}
            />
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setActiveStep(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 font-bold h-12 px-8 rounded-xl text-sm"
              >
                Next: Configure
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Configure */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PublicationIdentity />
              <GlobalSettings />
            </div>
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setActiveStep(0)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 px-8 rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={() => setActiveStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 font-bold h-12 px-8 rounded-xl text-sm"
              >
                Next: Add Content
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Content / Assets */}
        {activeStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AssetLibrary />
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setActiveStep(1)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 px-8 rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={() => setActiveStep(3)}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 font-bold h-12 px-8 rounded-xl text-sm"
              >
                {publication.generationMode === 'ai' ? 'Next: AI Generate' : 'Next: Plan Layout'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generate */}
        {activeStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {publication.generationMode === 'manual' ? (
              // Manual mode: guide them to layout planner since they've added articles in step 2
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Content Ready</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                    You're in Manual Mode. Your articles from the previous step are ready.
                    Head to the Page Planner to arrange them into your newspaper layout.
                  </p>
                  <Link href="/admin/planner">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 rounded-xl h-12 px-8">
                      <Layout className="h-4 w-4 mr-2" />
                      Open Page Planner
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <ContentGenerator />
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setActiveStep(2)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 px-8 rounded-xl"
                disabled={isGenerating}
              >
                Back
              </Button>
              <Link href="/admin/planner">
                <Button
                  className={`font-bold h-12 px-8 rounded-xl text-sm transition-all ${
                    hasContent
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                  disabled={!hasContent || isGenerating}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Open Page Planner
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Step 4: Plan & Export */}
        {activeStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/25">
                  <Layout className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Page Planner & Export</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
                  Drag content blocks into page slots, preview your newspaper, and export a print-ready PDF. 
                  Saving the PDF also saves this edition to your vault.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link href="/admin/planner">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 rounded-xl h-12 px-8">
                      <Layout className="h-4 w-4 mr-2" />
                      Open Page Planner
                    </Button>
                  </Link>
                </div>

                {hasContent && (
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {generatedContent.articles.length + manualArticles.length} articles ready for layout
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Session Confirm Modal */}
      {showNewSessionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="h-7 w-7 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Unsaved Changes</h3>
            <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
              You have unsaved content. Starting a new session will discard all current articles and generated content permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewSessionConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  startNewSession();
                  setShowNewSessionConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
              >
                Discard & Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
