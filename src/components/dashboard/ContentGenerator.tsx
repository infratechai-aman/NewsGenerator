'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  PenTool,
  Wand2,
  Key
} from 'lucide-react';

const contentTypes = [
  {
    id: 'articles',
    label: 'News Articles',
    desc: 'AI researches trending news and writes articles',
    icon: Newspaper,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'horoscope',
    label: 'Daily Horoscope',
    desc: 'Predictions for all 12 zodiac signs',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'facts',
    label: 'Do You Know?',
    desc: '5 interesting verified facts',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'sudoku',
    label: 'Daily Sudoku',
    desc: 'Generate a Sudoku puzzle grid',
    icon: Grid3X3,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'cryptic',
    label: 'Cryptic Corner',
    desc: 'A daily cryptic clue for readers',
    icon: HelpCircle,
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'houseAds',
    label: 'House Ads',
    desc: 'Auto-generate filler display ads',
    icon: Megaphone,
    color: 'from-indigo-500 to-violet-500',
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
    assets,
  } = useAppStore();
  const [generatingItems, setGeneratingItems] = useState<Set<string>>(new Set());
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const getContentStatus = (id: string) => {
    if (completedItems.has(id)) return 'completed';
    if (generatingItems.has(id)) return 'generating';
    return 'pending';
  };

  const generateContent = async (typeId: string) => {
    setGeneratingItems((prev) => new Set(prev).add(typeId));

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
        setGeneratedContent({ [typeId]: data.content });
        setCompletedItems((prev) => new Set(prev).add(typeId));
      }
    } catch (err) {
      console.error(`Error generating ${typeId}:`, err);
    } finally {
      setGeneratingItems((prev) => {
        const next = new Set(prev);
        next.delete(typeId);
        return next;
      });
    }
  };

  const generateAll = async () => {
    setIsGenerating(true);
    for (const ct of contentTypes) {
      await generateContent(ct.id);
    }
    setIsGenerating(false);
  };

  const userAdsCount = assets.filter((a) => a.type === 'ad').length;
  const articlesGenerated = generatedContent.articles.length;

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between text-slate-800">
          <span className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-4 w-4" />
            </span>
            AI Content Pipeline
          </span>
          {publication.generationMode === 'ai' && (
            <Button
              onClick={generateAll}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-blue-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate All Content
                </>
              )}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {publication.generationMode === 'manual' ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
            <PenTool className="h-10 w-10 mx-auto text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-slate-800">Manual Mode Active</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              The AI generation pipeline is disabled because you are in Manual Mode. Use the "Asset Library" step to manually write articles and upload images.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 border-slate-200 text-blue-600 hover:bg-blue-50"
              onClick={() => updatePublication({ generationMode: 'ai' })}
            >
              <Wand2 className="h-4 w-4 mr-2" /> Switch to AI Auto-Pilot
            </Button>
          </div>
        ) : (
          <>
            {/* Status summary */}
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {articlesGenerated} ai articles
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                {userAdsCount} user ads
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {completedItems.size}/{contentTypes.length} generated
              </Badge>
            </div>

            {/* Content generation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentTypes.map((ct) => {
                const status = getContentStatus(ct.id);
                const Icon = ct.icon;
                return (
                  <div
                    key={ct.id}
                    className={`relative rounded-xl p-4 border transition-all duration-200 ${
                      status === 'completed'
                        ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                        : status === 'generating'
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ct.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {ct.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {ct.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        {status === 'completed' ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md text-[10px] font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            DONE
                          </div>
                        ) : status === 'generating' ? (
                          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-100 px-2 py-1 rounded-md text-[10px] font-bold">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            WORKING
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[11px] font-bold text-slate-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 border-slate-200"
                            onClick={() => generateContent(ct.id)}
                            disabled={isGenerating}
                          >
                            Generate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
