'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Globe, FileText, Settings, Key, Wand2, PenTool } from 'lucide-react';
import { Language, GenerationMode } from '@/types';

const languages: { value: Language; label: string; script: string }[] = [
  { value: 'en', label: 'English', script: 'Eng' },
  { value: 'hi', label: 'हिन्दी (Hindi)', script: 'हिं' },
  { value: 'bn', label: 'বাংলা (Bengali)', script: 'বাং' },
];

export default function GlobalSettings() {
  const { publication, setLanguage, setPageCount, updatePublication } = useAppStore();

  return (
    <Card className="bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/30">
            <Settings className="h-5 w-5" />
          </span>
          Global Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 px-8 pb-8">
        
        {/* Generation Mode Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            {publication.generationMode === 'ai' ? <Wand2 className="h-4 w-4 text-indigo-500" /> : <PenTool className="h-4 w-4 text-blue-500" />}
            Content Generation Mode
          </Label>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updatePublication({ generationMode: 'ai' })}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                publication.generationMode === 'ai' 
                  ? 'border-indigo-500 bg-indigo-50 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.02]' 
                  : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              <Wand2 className={`h-7 w-7 mb-3 ${publication.generationMode === 'ai' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className={`text-[15px] font-extrabold ${publication.generationMode === 'ai' ? 'text-indigo-900' : 'text-slate-600'}`}>AI Auto-Pilot</span>
              <span className="text-xs text-slate-500 text-center mt-1.5 font-medium leading-relaxed">Generates articles & images automatically</span>
            </button>
            
            <button
              onClick={() => updatePublication({ generationMode: 'manual' })}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                publication.generationMode === 'manual' 
                  ? 'border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]' 
                  : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white'
              }`}
            >
              <PenTool className={`h-7 w-7 mb-3 ${publication.generationMode === 'manual' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className={`text-[15px] font-extrabold ${publication.generationMode === 'manual' ? 'text-blue-900' : 'text-slate-600'}`}>Manual Mode</span>
              <span className="text-xs text-slate-500 text-center mt-1.5 font-medium leading-relaxed">Write your own articles & upload images</span>
            </button>
          </div>
        </div>

        {/* Target Location & Article Count (Only visible in AI mode) */}
        {publication.generationMode === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-indigo-50/40 rounded-2xl border border-indigo-100 shadow-inner">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                Target City / Region
              </Label>
              <Input 
                type="text" 
                placeholder="e.g. Pune, Mumbai, Delhi..." 
                value={publication.targetLocation || ''}
                onChange={(e) => updatePublication({ targetLocation: e.target.value })}
                className="bg-white border-indigo-200 focus-visible:ring-indigo-500 h-12 rounded-xl text-base shadow-sm"
              />
              <p className="text-xs font-medium text-indigo-600/70 pt-1">
                Leave blank for generic national/global news.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Articles to Generate
              </Label>
              <Select
                value={(publication.articleCount || 6).toString()}
                onValueChange={(val) => updatePublication({ articleCount: parseInt(val || '6') })}
              >
                <SelectTrigger className="bg-white border-indigo-200 focus:ring-indigo-500 text-slate-900 h-12 rounded-xl shadow-sm text-base font-medium">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-100 shadow-2xl rounded-xl">
                  {[4, 6, 8, 10, 12, 16].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="focus:bg-indigo-50 py-2.5 font-medium cursor-pointer">
                      {num} Articles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Language Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            Target Language
          </Label>
          <Select
            value={publication.language}
            onValueChange={(val) => setLanguage(val as Language)}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500 text-slate-900 h-12 rounded-xl shadow-sm text-base font-medium transition-all focus:bg-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-2xl rounded-xl">
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="text-slate-700 focus:bg-blue-50 focus:text-blue-900 cursor-pointer py-2.5"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                      {lang.script}
                    </span>
                    <span className="font-semibold text-[15px]">{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs font-medium text-slate-500 pl-1 pt-1">
            Newspaper text and headers will be formatted in this language.
          </p>
        </div>

        {/* Page Count Slider */}
        <div className="space-y-4 pt-4">
          <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            Page Count
          </Label>
          <div className="flex items-center gap-6 px-1">
            <Slider
              value={[publication.pageCount]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val;
                setPageCount(v);
              }}
              min={2}
              max={8}
              step={1}
              className="flex-1 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-white [&_[role=slider]]:border-4 [&_[role=slider]]:shadow-[0_0_10px_rgba(37,99,235,0.3)]"
            />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center shadow-md">
              <span className="text-2xl font-extrabold text-blue-700">
                {publication.pageCount}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">
            <span>2 Pages</span>
            <span>8 Pages</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 shadow-inner mt-4">
          <p className="text-sm font-medium text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="text-xl">📰</span>
            <span>
              Your publication will generate{' '}
              <span className="text-blue-600 font-extrabold px-1">
                {publication.pageCount} pages
              </span>{' '}
              in{' '}
              <span className="text-blue-600 font-extrabold px-1">
                {languages.find((l) => l.value === publication.language)?.label || 'Selected Language'}
              </span>
              . Use the Asset Library to add your content, then move to the layout planner.
            </span>
          </p>
        </div>
        
      </CardContent>
    </Card>
  );
}
