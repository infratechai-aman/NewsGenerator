'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { subscribeToAuthChanges } from '@/lib/auth';
import { User } from 'firebase/auth';
import { 
  FileText, 
  Database, 
  Clock, 
  Users, 
  ChevronRight, 
  Crown,
  CalendarDays,
  Sparkles
} from 'lucide-react';

export default function AdminOverview() {
  const { publication, generatedContent, manualArticles } = useAppStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const totalGenerated = generatedContent.articles.length;
  const totalManual = manualArticles.length;
  
  let articlesSaved = totalGenerated + totalManual;
  if (generatedContent.horoscope) articlesSaved++;
  if (generatedContent.facts) articlesSaved++;
  if (generatedContent.quote) articlesSaved++;
  if (generatedContent.history) articlesSaved++;
  if (generatedContent.weather) articlesSaved++;
  if (generatedContent.tvGuide) articlesSaved++;
  if (generatedContent.sudoku) articlesSaved++;
  if (generatedContent.crypticClue) articlesSaved++;
  articlesSaved += generatedContent.houseAds.length;

  const hasContent = articlesSaved > 0;
  const papersGenerated = hasContent ? 1 : 0;
  const hoursSaved = articlesSaved > 0 ? Math.max(1, Math.floor(articlesSaved * 0.75)) : 0;
  const locationsTracked = publication.targetLocation ? 1 : 0;

  return (
    <div className="p-8 pb-24 max-w-[1600px] mx-auto">
      
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Main Content */}
        <div className="flex-1 space-y-10">
          
          <div className="flex items-center gap-4">
            <Link href="/admin/generator">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all text-sm">
                <Sparkles className="h-4 w-4" />
                Generate Paper
              </button>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
            </h1>
            <p className="text-slate-500 font-medium">Here's your premium dashboard overview.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Papers Generated</p>
              <p className="text-3xl font-extrabold text-slate-900">{papersGenerated}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                <Database className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Articles Saved</p>
              <p className="text-3xl font-extrabold text-slate-900">{articlesSaved}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hours Saved</p>
              <p className="text-3xl font-extrabold text-slate-900">{hoursSaved > 0 ? `${hoursSaved}h` : '0'}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 border border-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Locations Tracked</p>
              <p className="text-3xl font-extrabold text-slate-900">{locationsTracked}</p>
            </div>
          </div>

          {/* Current Subjects (Mocked Location Trackers for Newspaper Generator) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Current Targets</h3>
              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                View All Regions
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center">
              <p className="text-sm font-medium text-slate-500">{publication.targetLocation ? `Currently tracking: ${publication.targetLocation}` : 'No specific regional targets added yet.'}</p>
            </div>
          </div>

          {/* Recently Built Papers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Recently Built Papers</h3>
              <Link href="/admin/repository">
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors flex items-center">
                  Access Vault <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </Link>
            </div>

            {!hasContent ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm font-medium shadow-sm">
                No recent papers found. Generate one to see it here!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{publication.name} (Latest)</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Page count: {publication.pageCount} • {publication.date}
                      </p>
                      <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-600 uppercase tracking-widest border border-slate-200">
                        {publication.generationMode === 'ai' ? 'AI Generated' : 'Manual Build'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 space-y-6">
          
          {/* Plan Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-fuchsia-500 to-indigo-600"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 mt-2">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plan Status</p>
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Premium Plan</h3>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Your subscription is active until <strong className="text-slate-800">Dec 2026</strong>.
            </p>

            <button className="w-full py-2.5 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
              Manage Billing
            </button>
          </div>

          {/* Setup Completion Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900">Setup Checklist</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">OpenAI Integrated</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${publication.name ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    <span className="text-sm font-bold">{publication.name ? '✓' : '!'}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Publication Name</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${publication.targetLocation ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    <span className="text-sm font-bold">{publication.targetLocation ? '✓' : '!'}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">Target Location</p>
                </div>
              </div>
            </div>

            {(!publication.targetLocation || !publication.name) && (
              <Link href="/admin/settings">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-6 pt-4 border-t border-slate-100 w-full text-left transition-colors">
                  Complete Setup in Settings →
                </button>
              </Link>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
