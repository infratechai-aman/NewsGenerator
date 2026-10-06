'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload, Image as ImageIcon, Megaphone, X, Plus, Loader2, PenTool,
  Trash2, Newspaper, Sparkles, Wand2, CheckCircle2, FileImage,
  RefreshCw, Lightbulb, Tag, Building2, ExternalLink
} from 'lucide-react';
import { UploadedAsset, ManualArticle } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function AssetLibrary() {
  const {
    publication,
    assets,
    addAsset,
    removeAsset,
    manualArticles,
    addManualArticle,
    removeManualArticle,
    updatePublication,
  } = useAppStore();

  const adInputRef = useRef<HTMLInputElement>(null);
  const articleImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'ads'>('articles');

  // AI Assistant states
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSuggestingHeadlines, setIsSuggestingHeadlines] = useState(false);
  const [headlineSuggestions, setHeadlineSuggestions] = useState<string[]>([]);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  // Manual Article Form State
  const [articleForm, setArticleForm] = useState<{
    headline: string;
    shortDescription: string;
    content: string;
    author: string;
    category: string;
    images: UploadedAsset[];
  }>({
    headline: '',
    shortDescription: '',
    content: '',
    author: '',
    category: 'local',
    images: [],
  });

  // AI Ad Creator State
  const [adForm, setAdForm] = useState({
    brandName: '',
    category: 'Retail & Commercial',
    tagline: '',
    offer: 'Special Privileges for Readers — Call Today',
  });
  const [adMode, setAdMode] = useState<'upload' | 'ai'>('ai');

  // AI Assistant: Polish & Expand Story
  const handleAIPolishArticle = async () => {
    if (!articleForm.headline && !articleForm.content) return;
    setIsPolishing(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'polish-article',
          rawText: articleForm.content,
          headline: articleForm.headline,
          category: articleForm.category,
          language: publication.language || 'english',
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setArticleForm((prev) => ({
          ...prev,
          headline: data.content.headline || prev.headline,
          shortDescription: data.content.shortDescription || data.content.subHeadline || prev.shortDescription,
          content: data.content.content || prev.content,
        }));
      }
    } catch (err) {
      console.error('Failed to polish article with AI:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  // AI Assistant: Suggest Headlines
  const handleAISuggestHeadlines = async () => {
    const topic = articleForm.headline || articleForm.content || 'local community news';
    setIsSuggestingHeadlines(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'suggest-headlines',
          topic,
          language: publication.language || 'english',
        }),
      });
      const data = await res.json();
      if (data.success && data.content?.suggestions) {
        setHeadlineSuggestions(data.content.suggestions);
      }
    } catch (err) {
      console.error('Failed to suggest headlines:', err);
    } finally {
      setIsSuggestingHeadlines(false);
    }
  };

  // AI Assistant: Match / Generate Press Photo
  const handleAIMatchPhoto = async () => {
    if (articleForm.images.length >= 3) return;
    setIsGeneratingPhoto(true);
    try {
      const query = articleForm.headline || articleForm.category || 'community';
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate-article-image',
          topic: query,
          category: articleForm.category,
          targetLocation: publication.targetLocation,
        }),
      });
      const data = await res.json();
      if (data.success && data.content?.imageUrl) {
        const newAsset: UploadedAsset = {
          id: uuidv4(),
          name: `${articleForm.headline.slice(0, 20) || 'Press Photo'}`,
          url: data.content.imageUrl,
          type: 'image',
        };
        setArticleForm((prev) => ({
          ...prev,
          images: [...prev.images, newAsset].slice(0, 3),
        }));
      }
    } catch (err) {
      console.error('Failed to generate photo:', err);
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  // AI Assistant: Generate Display Ad Creative
  const handleAIGenerateAd = async () => {
    if (!adForm.brandName) return;
    setIsGeneratingAd(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate-ad-creative',
          brandName: adForm.brandName,
          category: adForm.category,
          tagline: adForm.tagline,
          offer: adForm.offer,
          language: publication.language || 'english',
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        const creative = data.content;
        addAsset({
          id: uuidv4(),
          name: `${creative.sponsorName || adForm.brandName} Ad`,
          url: creative.imageUrl,
          type: 'ad',
        });
        setAdForm({
          brandName: '',
          category: 'Retail & Commercial',
          tagline: '',
          offer: 'Special Privileges for Readers — Call Today',
        });
      }
    } catch (err) {
      console.error('Failed to generate ad creative:', err);
    } finally {
      setIsGeneratingAd(false);
    }
  };

  const handleAdUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      setUploadingType('ad');

      for (const file of Array.from(files)) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'ad');

          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();

          if (data.url) {
            addAsset({ id: uuidv4(), name: file.name, url: data.url, type: 'ad' });
          }
        } catch {
          const url = URL.createObjectURL(file);
          addAsset({ id: uuidv4(), name: file.name, url, type: 'ad' });
        }
      }
      setUploadingType(null);
      e.target.value = '';
    },
    [addAsset]
  );

  const handleArticleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remainingSlots = 3 - articleForm.images.length;
      if (remainingSlots <= 0) return;

      setUploadingType('article-image');
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const newImages: UploadedAsset[] = [];

      for (const file of filesToProcess) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'image');

          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();

          if (data.url) {
            newImages.push({ id: uuidv4(), name: file.name, url: data.url, type: 'image' });
          }
        } catch {
          const url = URL.createObjectURL(file);
          newImages.push({ id: uuidv4(), name: file.name, url, type: 'image' });
        }
      }

      setArticleForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
      setUploadingType(null);
      e.target.value = '';
    },
    [articleForm.images.length]
  );

  const handleAddArticle = () => {
    if (!articleForm.headline || !articleForm.content) return;

    addManualArticle({
      id: uuidv4(),
      headline: articleForm.headline,
      shortDescription: articleForm.shortDescription,
      content: articleForm.content,
      author: articleForm.author || 'Staff Reporter',
      images: articleForm.images,
      date: new Date().toISOString(),
      category: articleForm.category || 'local',
    });

    setArticleForm({
      headline: '',
      shortDescription: '',
      content: '',
      author: '',
      category: 'local',
      images: [],
    });
    setHeadlineSuggestions([]);
  };

  const ads = assets.filter((a) => a.type === 'ad');

  return (
    <div className="space-y-6">

      {/* Mode & Hybrid Workflow Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4.5 bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-slate-50 border border-blue-200/80 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Custom Content & Advertising Hub</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI Co-Pilot
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Write bespoke articles and design display ads. AI tools polish your prose and generate matching visual creatives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">Mode:</span>
          <button
            onClick={() => updatePublication({ generationMode: publication.generationMode === 'ai' ? 'manual' : 'ai' })}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-200/90 shadow-2xs px-3 py-1.5 rounded-xl transition-all hover:bg-blue-50"
          >
            {publication.generationMode === 'ai' ? '⚡ AI-First Edition' : '✍️ Fully Manual Edition'}
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/60">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeTab === 'articles'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Newspaper className="h-4 w-4" />
          <span>News Articles</span>
          {manualArticles.length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              {manualArticles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeTab === 'ads'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          <span>Advertisements</span>
          {ads.length > 0 && (
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
              {ads.length}
            </span>
          )}
        </button>
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Journalistic Article Creator</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Type quick bullet points or notes — our AI Editor polishes it into an authentic inverted-pyramid broadsheet story.
                  </p>
                </div>
              </div>

              {/* AI Quick Assistant Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAISuggestHeadlines}
                  disabled={isSuggestingHeadlines}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSuggestingHeadlines ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
                  <span>Suggest Headlines</span>
                </button>

                <button
                  onClick={handleAIPolishArticle}
                  disabled={isPolishing || (!articleForm.headline && !articleForm.content)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPolishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>AI Polish & Expand</span>
                </button>
              </div>
            </div>

            {/* Headline Suggestions Popup Bar */}
            {headlineSuggestions.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/90 border-b border-indigo-100 px-6 py-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-indigo-600" />
                  Select an AI Generated Headline:
                </p>
                <div className="flex flex-col gap-1.5">
                  {headlineSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setArticleForm((p) => ({ ...p, headline: sug }));
                        setHeadlineSuggestions([]);
                      }}
                      className="text-left text-xs font-semibold text-slate-800 bg-white hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-xl border border-indigo-200/70 transition-all shadow-2xs flex items-center justify-between group"
                    >
                      <span className="truncate">{sug}</span>
                      <span className="text-[10px] text-indigo-500 group-hover:text-white shrink-0 ml-2 font-bold">Use this →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Article Form Fields */}
            <div className="p-6 space-y-5">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                  Headline <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={articleForm.headline}
                  onChange={(e) => setArticleForm({ ...articleForm, headline: e.target.value })}
                  placeholder="e.g. Pune Municipal Corporation Approves New High-Speed Ring Corridor"
                  className="font-bold text-slate-900 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Category Tag
                  </Label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="local">Local News / Lead</option>
                    <option value="politics">Governance & Politics</option>
                    <option value="infrastructure">Civic Infrastructure</option>
                    <option value="business">Business & Economy</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Tech & Innovation</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Byline / Author
                  </Label>
                  <Input
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="By Staff Correspondent"
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                    Short Deck / Summary
                  </Label>
                  <Input
                    value={articleForm.shortDescription}
                    onChange={(e) => setArticleForm({ ...articleForm, shortDescription: e.target.value })}
                    placeholder="Key takeaway or deck line"
                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Story Body / Notes <span className="text-rose-500">*</span>
                  </Label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    100-150 words recommended
                  </span>
                </div>
                <Textarea
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Paste raw notes, draft facts, or complete text. Click 'AI Polish & Expand' above to turn bullet points into authentic journalism..."
                  className="min-h-[140px] bg-slate-50 border-slate-200 focus-visible:ring-blue-500 resize-y rounded-2xl text-sm leading-relaxed"
                />
              </div>

              {/* Supporting Photos with AI Photo Match Option */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Press Photography (Up to 3)
                  </Label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAIMatchPhoto}
                      disabled={isGeneratingPhoto || articleForm.images.length >= 3}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {isGeneratingPhoto ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                      ✨ Match Press Photo via AI
                    </button>
                    <span className="text-xs text-slate-400 font-medium">{articleForm.images.length}/3 attached</span>
                  </div>
                </div>

                {articleForm.images.length > 0 && (
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {articleForm.images.map((img) => (
                      <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setArticleForm((prev) => ({ ...prev, images: prev.images.filter((i) => i.id !== img.id) }))}
                            className="p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => articleImageInputRef.current?.click()}
                  disabled={articleForm.images.length >= 3 || uploadingType === 'article-image'}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all disabled:opacity-50 text-xs font-bold"
                >
                  {uploadingType === 'article-image' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileImage className="h-4 w-4" />
                  )}
                  {articleForm.images.length >= 3 ? 'Max photo capacity reached' : 'Upload Image File (JPG, PNG)'}
                </button>
                <input
                  ref={articleImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleArticleImageUpload}
                />
              </div>

              {/* Action Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleAddArticle}
                  disabled={!articleForm.headline || !articleForm.content}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl font-bold h-11 px-6 text-xs transition-all hover:scale-[1.01]"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Story to Newspaper Layout
                </Button>
              </div>
            </div>

            {/* List of Created Articles */}
            {manualArticles.length > 0 && (
              <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Custom Articles Ready for Planner ({manualArticles.length})
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Auto-allocated to pages
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {manualArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-start justify-between p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-blue-200 transition-all gap-3"
                    >
                      <div className="flex gap-3 min-w-0">
                        {article.images.length > 0 ? (
                          <img src={article.images[0].url} alt="" className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                            <Newspaper className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate leading-snug">{article.headline}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{article.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md">
                              {article.author || 'Staff Reporter'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeManualArticle(article.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                        title="Remove article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ads Tab */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Advertisement Creatives</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate authentic commercial ads with AI or upload custom advertiser banners.
                  </p>
                </div>
              </div>

              {/* Mode Toggle: AI Generator vs Upload */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setAdMode('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    adMode === 'ai'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  AI Ad Generator
                </button>
                <button
                  onClick={() => setAdMode('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    adMode === 'upload'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Upload className="h-3 w-3 inline mr-1" />
                  Upload Image
                </button>
              </div>
            </div>

            {/* AI Ad Generator View */}
            {adMode === 'ai' ? (
              <div className="p-6 space-y-4">
                <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl">
                  <p className="text-xs font-bold text-purple-900 mb-1">
                    ✨ Instant Commercial Ad Creation
                  </p>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    Enter the advertiser’s business name and offer. The AI will generate a complete display ad with authentic broadsheet styling, typography, and curated imagery.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                      Brand / Business Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={adForm.brandName}
                      onChange={(e) => setAdForm({ ...adForm, brandName: e.target.value })}
                      placeholder="e.g. Apollo Diagnostics, Reliance Smart, Kalyan Jewellers"
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-purple-500 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                      Ad Category
                    </Label>
                    <select
                      value={adForm.category}
                      onChange={(e) => setAdForm({ ...adForm, category: e.target.value })}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Retail & Commercial">Retail & Commercial Goods</option>
                      <option value="Healthcare & Wellness">Healthcare & Hospital Services</option>
                      <option value="Real Estate & Housing">Real Estate & Housing Projects</option>
                      <option value="Education & Academy">Education & Coaching Institutes</option>
                      <option value="Automobile & Transit">Automobile Dealership</option>
                      <option value="Banking & Finance">Banking & Financial Services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                      Tagline / USP (Optional)
                    </Label>
                    <Input
                      value={adForm.tagline}
                      onChange={(e) => setAdForm({ ...adForm, tagline: e.target.value })}
                      placeholder="e.g. Trusted by over 50,000 families in Maharashtra"
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-purple-500 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                      Special Privilege / Offer
                    </Label>
                    <Input
                      value={adForm.offer}
                      onChange={(e) => setAdForm({ ...adForm, offer: e.target.value })}
                      placeholder="e.g. Flat 25% Off on Comprehensive Health Packages"
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-purple-500 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleAIGenerateAd}
                    disabled={!adForm.brandName || isGeneratingAd}
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 rounded-xl font-bold h-11 px-6 text-xs transition-all"
                  >
                    {isGeneratingAd ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Creative...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1.5" />
                        Generate Display Ad Creative
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Custom Ad Upload View */
              <div className="p-6">
                <div
                  className="border-2 border-dashed border-slate-200 bg-slate-50/60 rounded-3xl p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all"
                  onClick={() => adInputRef.current?.click()}
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-3 text-purple-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">Upload Display Ad Creative</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    JPG, PNG, WebP supported. Quarter-page and half-page banner sizes are automatically fitted into broadsheet column slots.
                  </p>
                  <button className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-purple-700 bg-white border border-purple-200 px-4 py-2 rounded-xl shadow-2xs hover:bg-purple-50 transition-colors">
                    <FileImage className="h-4 w-4" />
                    Select Image File
                  </button>
                </div>
                <input ref={adInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAdUpload} />
              </div>
            )}

            {/* Ads Gallery Grid */}
            <div className="border-t border-slate-100 p-6 bg-slate-50/40">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-purple-600" />
                  Available Ad Creatives ({ads.length})
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">
                  {ads.length === 0 ? 'AI generates house ads if left empty' : 'Ready for layout slots'}
                </span>
              </div>

              {ads.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-white/70">
                  <p className="text-xs font-semibold text-slate-500">
                    No custom ads created yet. AI will auto-populate realistic house ads if needed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  {ads.map((ad) => (
                    <div
                      key={ad.id}
                      className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200/90 shadow-2xs bg-white hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <img src={ad.url} alt={ad.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => removeAsset(ad.id)}
                          className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
                          title="Remove ad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className="text-[10px] font-bold text-white truncate">{ad.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
