'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  FileText, 
  Trash2, 
  Search, 
  Calendar, 
  Filter,
  Download,
  Plus,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RepositoryPage() {
  const router = useRouter();
  const { repository, deleteSavedPaper, loadSavedPaper, startNewSession } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = repository.filter((paper) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (paper.config.name || '').toLowerCase().includes(q);
    const locMatch = (paper.config.targetLocation || '').toLowerCase().includes(q);
    const dateMatch = dayjs(paper.config.date).format('MMM D, YYYY').toLowerCase().includes(q);
    return nameMatch || locMatch || dateMatch;
  });

  const handleOpenPaper = (paper: any) => {
    loadSavedPaper(paper);
    router.push('/admin/planner');
  };

  const handleStartNew = () => {
    startNewSession();
    router.push('/admin/generator');
  };

  return (
    <div className="p-4 md:p-8 pb-24 max-w-[1400px] mx-auto space-y-8">
      
      {/* Header section with search/filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Broadsheet Vault & Archive
            </h1>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {repository.length} Saved
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Archived pre-press editions ready for commercial offset printing or instant digital distribution.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by publication or city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full sm:w-64 shadow-2xs"
            />
          </div>

          <button 
            onClick={handleStartNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Start New Newspaper
          </button>
        </div>
      </div>

      {repository.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 md:p-16 border-2 border-dashed border-slate-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 border border-blue-100 text-blue-600 shadow-2xs">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Vault is Currently Empty</h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mb-6 leading-relaxed">
            When you complete and save a newspaper or export its PDF from the Page Planner, it will automatically be permanently archived here.
          </p>
          <Link href="/admin/generator">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all">
              Launch Newspaper Generator
            </button>
          </Link>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-600">No archived newspapers match your search.</p>
          <button onClick={() => setSearchQuery('')} className="mt-3 text-xs font-bold text-blue-600 hover:underline">
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPapers.map((paper) => {
            const articleTotal = (paper.content?.articles?.length || 0) + (paper.manualArticles?.length || 0);
            return (
              <div 
                key={paper.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Header Preview Banner */}
                <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-between p-4 relative overflow-hidden text-white">
                  <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-50" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-white/10 backdrop-blur-xs rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/15 text-blue-300">
                      {paper.config.pageCount || 4} Broadsheet Pages
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-500/20 backdrop-blur-xs rounded-full text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                      300 DPI Ready
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {paper.config.name || 'Broadsheet Edition'}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                      {paper.config.targetLocation ? `📍 ${paper.config.targetLocation} Edition` : 'National Edition'}
                    </p>
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {dayjs(paper.savedAt || paper.config.date).format('MMM D, YYYY')}
                      </span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                        {articleTotal} Articles
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Language:</span>
                        <strong className="text-slate-800 uppercase font-bold">{paper.config.language || 'EN'}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Theme:</span>
                        <strong className="text-slate-800 font-bold capitalize">{paper.config.themeId?.replace('-', ' ') || 'Classic'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenPaper(paper)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Open in Page Planner
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          if (paper.pdfUrl) {
                            window.open(paper.pdfUrl, '_blank');
                          } else {
                            handleOpenPaper(paper);
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all"
                      >
                        <Download className="h-3 w-3" />
                        PDF Export
                      </button>

                      <button 
                        onClick={() => deleteSavedPaper(paper.id)}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold transition-all border border-rose-100"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
