'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image as ImageIcon, Megaphone, X, Plus, Loader2, PenTool, Trash2, Newspaper } from 'lucide-react';
import { UploadedAsset, ManualArticle } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function AssetLibrary() {
  const { publication, assets, addAsset, removeAsset, manualArticles, addManualArticle, removeManualArticle } = useAppStore();
  const adInputRef = useRef<HTMLInputElement>(null);
  const articleImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  // Manual Article Form State
  const [articleForm, setArticleForm] = useState<{
    headline: string;
    shortDescription: string;
    content: string;
    author: string;
    images: UploadedAsset[];
  }>({
    headline: '',
    shortDescription: '',
    content: '',
    author: '',
    images: []
  });

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

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();

          if (data.url) {
            const asset: UploadedAsset = {
              id: uuidv4(),
              name: file.name,
              url: data.url,
              type: 'ad',
            };
            addAsset(asset);
          }
        } catch {
          const url = URL.createObjectURL(file);
          const asset: UploadedAsset = { id: uuidv4(), name: file.name, url, type: 'ad' };
          addAsset(asset);
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
      if (remainingSlots <= 0) {
        alert("Maximum 3 images allowed per article.");
        return;
      }

      setUploadingType('article-image');
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const newImages: UploadedAsset[] = [];

      for (const file of filesToProcess) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'image');

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();

          if (data.url) {
            newImages.push({ id: uuidv4(), name: file.name, url: data.url, type: 'image' });
          }
        } catch {
          const url = URL.createObjectURL(file);
          newImages.push({ id: uuidv4(), name: file.name, url, type: 'image' });
        }
      }

      setArticleForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      setUploadingType(null);
      e.target.value = '';
    },
    [articleForm.images.length]
  );

  const handleAddArticle = () => {
    if (!articleForm.headline || !articleForm.content) {
      alert("Headline and Content are required.");
      return;
    }

    const newArticle: ManualArticle = {
      id: uuidv4(),
      headline: articleForm.headline,
      shortDescription: articleForm.shortDescription,
      content: articleForm.content,
      author: articleForm.author || 'Staff Reporter',
      images: articleForm.images,
      date: new Date().toISOString()
    };

    addManualArticle(newArticle);
    
    // Reset form
    setArticleForm({
      headline: '',
      shortDescription: '',
      content: '',
      author: '',
      images: []
    });
  };

  const removeArticleImage = (id: string) => {
    setArticleForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const ads = assets.filter((a) => a.type === 'ad');

  return (
    <div className="space-y-6">
      
      {/* Dynamic Content Section based on Mode */}
      {publication.generationMode === 'manual' ? (
        // MANUAL MODE: Article Builder
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center justify-between text-slate-800">
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/20">
                  <PenTool className="h-4 w-4" />
                </span>
                Manual Article Builder
              </span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {manualArticles.length} Articles Created
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-500">
              Write your news articles and upload supporting images.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Article Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Headline</Label>
                  <Input 
                    value={articleForm.headline}
                    onChange={(e) => setArticleForm({...articleForm, headline: e.target.value})}
                    placeholder="E.g. Government Announces New Infrastructure Project" 
                    className="font-bold text-lg bg-white border-slate-200 focus-visible:ring-blue-500 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Author / Reporter (Optional)</Label>
                  <Input 
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({...articleForm, author: e.target.value})}
                    placeholder="By Special Correspondent" 
                    className="bg-white border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Short Description</Label>
                  <Input 
                    value={articleForm.shortDescription}
                    onChange={(e) => setArticleForm({...articleForm, shortDescription: e.target.value})}
                    placeholder="A brief summary of the article..." 
                    className="bg-white border-slate-200 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Full Content</Label>
                <Textarea 
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  placeholder="Body of the article. Write the full news story here..." 
                  className="min-h-[150px] bg-white border-slate-200 focus-visible:ring-blue-500 resize-y"
                />
              </div>

              {/* Image Uploader for this specific article */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-700">Article Images (Max 3)</Label>
                  <span className="text-xs font-medium text-slate-500">{articleForm.images.length}/3 Uploaded</span>
                </div>
                
                {articleForm.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {articleForm.images.map((img) => (
                      <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 group">
                        <img src={img.url} alt="Article prep" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:text-red-400 hover:bg-black/50" onClick={() => removeArticleImage(img.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 h-12"
                  onClick={() => articleImageInputRef.current?.click()}
                  disabled={articleForm.images.length >= 3 || uploadingType === 'article-image'}
                >
                  {uploadingType === 'article-image' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {articleForm.images.length >= 3 ? "Maximum images reached" : "Upload Supporting Image"}
                </Button>
                <input ref={articleImageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleArticleImageUpload} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleAddArticle}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  disabled={!articleForm.headline || !articleForm.content}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Save Article to Library
                </Button>
              </div>
            </div>

            {/* List of Created Articles */}
            {manualArticles.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">Your Articles</h4>
                <div className="grid grid-cols-1 gap-3">
                  {manualArticles.map((article) => (
                    <div key={article.id} className="flex justify-between items-start p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-colors">
                      <div className="flex gap-4">
                        {article.images.length > 0 ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                            <img src={article.images[0].url} alt={article.headline} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                            <Newspaper className="h-6 w-6 text-slate-300" />
                          </div>
                        )}
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{article.headline}</h5>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{article.shortDescription || "No description"}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] font-medium border-slate-200 text-slate-600 bg-slate-50">
                              {article.images.length} Image(s)
                            </Badge>
                            {article.author && <span className="text-[10px] text-slate-400">By {article.author}</span>}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeManualArticle(article.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      ) : (
        // AI MODE: Photo Library (Currently Disabled/Hidden for AI generation ease, or can be kept for custom photos in AI layouts)
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
             <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
               <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/20">
                 <ImageIcon className="h-4 w-4" />
               </span>
               AI Mode Active
             </CardTitle>
             <CardDescription className="text-slate-500">
               Content is generated automatically. To write your own articles, switch to Manual Mode in Global Settings.
             </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Ads Section (Always Available) */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center justify-between text-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-pink-500/20">
                <Megaphone className="h-4 w-4" />
              </span>
              Advertisement Creatives
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 ml-2">
                {ads.length}
              </Badge>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-purple-700 hover:border-purple-300 hover:bg-purple-50 font-semibold shadow-sm"
              onClick={() => adInputRef.current?.click()}
              disabled={uploadingType === 'ad'}
            >
              {uploadingType === 'ad' ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
              Add Ads
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div
              className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50"
              onClick={() => adInputRef.current?.click()}
            >
              <Megaphone className="h-10 w-10 mx-auto text-purple-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">
                Upload display advertisements
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                These ads will be placed in specific ad slots. If you don't upload enough, placeholder house ads will be used.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md transition-all"
                >
                  <img
                    src={ad.url}
                    alt={ad.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-500 hover:bg-red-600 shadow-md h-8 w-8 rounded-full"
                      onClick={() => removeAsset(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-900/90 to-transparent">
                    <p className="text-[10px] font-medium text-white line-clamp-1">
                      {ad.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <input
            ref={adInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAdUpload}
          />
        </CardContent>
      </Card>
    </div>
  );
}
