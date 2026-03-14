'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  FileText, 
  Trash2, 
  Search, 
  Calendar, 
  Filter,
  MoreVertical,
  Download,
  Plus
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function RepositoryPage() {
  const { repository, deleteSavedPaper } = useAppStore();

  return (
    <div className="p-8 pb-24 max-w-[1400px] mx-auto">
      
      {/* Header section with search/filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            The Vault
          </h1>
          <p className="text-slate-500 font-medium">Manage and access your entire publication history.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search papers..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="h-4 w-4" />
          </button>
          <Link href="/admin/generator">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <Plus className="h-4 w-4" />
              New Paper
            </button>
          </Link>
        </div>
      </div>

      {repository.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 border-2 border-dashed border-slate-200 text-center shadow-lg shadow-slate-200/50">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
            <FileText className="h-10 w-10 text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your vault is empty</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
            Once you generate and save your high-quality newspapers, they will appear here for instant access and distribution.
          </p>
          <Link href="/admin/generator">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all">
              Go to Generator
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {repository.map((paper) => (
            <div 
              key={paper.id}
              className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Paper Preview / Thumbnail Area */}
              <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 transition-opacity opacity-0 group-hover:opacity-100" />
                <FileText className="h-16 w-16 text-slate-200 transform group-hover:scale-110 group-hover:text-blue-200 transition-all duration-500" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-extrabold text-blue-600 uppercase tracking-widest border border-blue-100 shadow-sm">
                    {paper.config.generationMode === 'ai' ? 'AI' : 'Manual'}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col border-t border-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {paper.config.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {dayjs(paper.config.date).format('MMM D, YYYY')}
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-tighter opacity-60">Page Count</span>
                    <span className="font-extrabold text-slate-800">{paper.config.pageCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-tighter opacity-60">Articles</span>
                    <span className="font-extrabold text-slate-800">
                      {paper.content.articles.length + paper.manualArticles.length}
                    </span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      if (paper.pdfUrl) {
                        window.open(paper.pdfUrl, '_blank');
                      } else {
                        alert('PDF file not found for this archived paper.');
                      }
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                  <button 
                    onClick={() => deleteSavedPaper(paper.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-[11px] font-bold hover:bg-rose-100 transition-all border border-rose-100 active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
