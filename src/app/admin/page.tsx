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
  Sparkles,
  Wand2,
  BookOpen,
  FolderOpen,
  Megaphone,
  Grid3X3,
  FileDown,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Newspaper,
  CheckCircle2,
} from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    tag: 'MORNING BROADSHEET',
    title: 'Better Broadsheets, Brighter Headlines',
    subtitle: 'Disciplined AI Pre-Press Suite for Local & National Print Runs',
    ctaText: 'Open Page Planner',
    ctaLink: '/admin/planner',
    image: '/assets/hero_newspaper.jpg',
    badge: '300 DPI Pre-Press Ready',
  },
  {
    tag: 'EDITORIAL ENGINE',
    title: 'Instant Multi-Column Composition',
    subtitle: 'Automated news drafting, horoscopes, cryptic puzzles & regional weather',
    ctaText: 'Quick Generate',
    ctaLink: '/admin/generator',
    image: '/assets/feature_ai_engine.jpg',
    badge: '12 Formatted Columns',
  },
  {
    tag: 'PRODUCTION VAULT',
    title: 'Commercial Broadsheet Vault',
    subtitle: 'Export pixel-perfect vector broadsheets directly for offset press',
    ctaText: 'Explore Vault',
    ctaLink: '/admin/repository',
    image: '/assets/feature_pdf_render.jpg',
    badge: 'Press-Ready Output',
  },
];

const QUICK_ACTIONS = [
  {
    label: 'Generate',
    href: '/admin/generator',
    icon: Wand2,
    bg: 'bg-blue-100/80 hover:bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
  },
  {
    label: 'Page Planner',
    href: '/admin/planner',
    icon: BookOpen,
    bg: 'bg-indigo-100/80 hover:bg-indigo-100',
    text: 'text-indigo-600',
    border: 'border-indigo-200/50',
  },
  {
    label: 'Repository',
    href: '/admin/repository',
    icon: FolderOpen,
    bg: 'bg-amber-100/80 hover:bg-amber-100',
    text: 'text-amber-600',
    border: 'border-amber-200/50',
  },
  {
    label: 'House Ads',
    href: '/admin/planner',
    icon: Megaphone,
    bg: 'bg-purple-100/80 hover:bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200/50',
  },
  {
    label: 'Puzzles',
    href: '/admin/generator',
    icon: Grid3X3,
    bg: 'bg-sky-100/80 hover:bg-sky-100',
    text: 'text-sky-600',
    border: 'border-sky-200/50',
  },
  {
    label: 'Export PDF',
    href: '/admin/planner',
    icon: FileDown,
    bg: 'bg-emerald-100/80 hover:bg-emerald-100',
    text: 'text-emerald-600',
    border: 'border-emerald-200/50',
  },
  {
    label: 'Regions',
    href: '/admin/settings',
    icon: MapPin,
    bg: 'bg-rose-100/80 hover:bg-rose-100',
    text: 'text-rose-600',
    border: 'border-rose-200/50',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: SlidersHorizontal,
    bg: 'bg-slate-100 hover:bg-slate-200/70',
    text: 'text-slate-700',
    border: 'border-slate-200/60',
  },
];

export default function AdminOverview() {
  const { publication, generatedContent, manualArticles } = useAppStore();
  const [user, setUser] = useState<User | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Auto rotate banner carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
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

  const currentSlide = CAROUSEL_SLIDES[activeSlide];

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto space-y-6 md:space-y-8">
      
      {/* 2-Column Responsive Wrapper: Left Main / Right Desktop Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        
        {/* Main Column */}
        <div className="flex-1 w-full space-y-6 md:space-y-8">
          
          {/* 1. FEATURED HERO BANNER CAROUSEL (Directly inspired by reference UI) */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-slate-900 text-white min-h-[200px] sm:min-h-[230px] flex flex-col justify-between p-5 md:p-7 border border-slate-800 group">
            
            {/* Background Image with Fallback & Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100 group-hover:scale-105 opacity-40 mix-blend-luminosity"
              style={{ backgroundImage: `url('${currentSlide.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

            {/* Top Carousel Navigation Dots */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/30">
                {currentSlide.tag}
              </span>
              
              <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
                {CAROUSEL_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Content */}
            <div className="relative z-10 max-w-lg my-3">
              <h2 
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-2">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Bottom Row: CTA Button + Print Badge */}
            <div className="relative z-10 flex items-center justify-between pt-1">
              <Link href={currentSlide.ctaLink}>
                <button className="bg-white hover:bg-slate-100 text-blue-700 font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:gap-3">
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </Link>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {currentSlide.badge}
              </div>
            </div>

          </div>

          {/* 2. QUICK ACTIONS (4x2 Pastel Squircle Grid, directly inspired by reference) */}
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href} className="group flex flex-col items-center text-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-md border ${action.bg} ${action.text} ${action.border}`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                    </div>
                    <span className="mt-2 text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. TODAY'S OVERVIEW (2x2 Clean Metric Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Today's Overview
              </h3>
              <Link href="/admin/repository" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              
              {/* Card 1: Total Articles */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    Total Articles
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {articlesSaved}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    ↑ Live Editorial
                  </p>
                </div>
              </div>

              {/* Card 2: Broadsheets Built */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                  <Newspaper className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    Broadsheets Built
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {papersGenerated}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    {papersGenerated > 0 ? 'Print Ready' : 'Drafting'}
                  </p>
                </div>
              </div>

              {/* Card 3: Hours Saved */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    Hours Saved
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {hoursSaved > 0 ? `${hoursSaved}h` : '0h'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-0.5 mt-0.5">
                    92% automated
                  </p>
                </div>
              </div>

              {/* Card 4: Target Region */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 border border-rose-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    Target Region
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">
                    {publication.targetLocation || 'National'}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
                    Geo-targeted
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 4. RECENT ACTIVITY LIST (Inspired by reference UI) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Recent Activity
              </h3>
              <Link href="/admin/repository" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              
              {/* Activity 1 */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {publication.name || 'Morning Broadsheet'} edition generated
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      AI layout compiled {articlesSaved || 12} articles across {publication.pageCount || 4} broadsheet pages
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 whitespace-nowrap">
                  9:12 AM
                </span>
              </div>

              {/* Activity 2 */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      Pre-Press PDF Export ready
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      300 DPI vector output prepared for commercial print
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 whitespace-nowrap">
                  Yesterday
                </span>
              </div>

              {/* Activity 3 */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      House Advertisement slotted in Page 1
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      Quarter-page display ad scaled and color-corrected
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 whitespace-nowrap">
                  Yesterday
                </span>
              </div>

              {/* Activity 4 */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      Puzzles & Regional Syndicate synced
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                      Daily Sudoku & local regional forecasts updated
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 whitespace-nowrap">
                  20 Sep
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Right Desktop Sidebar (Visible on large screens, cleanly provides setup & plan) */}
        <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
          
          {/* Plan Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Status</p>
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Pre-Press Pro</h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">
              Unlimited broadsheet AI layouts & 300 DPI vector PDF exports enabled until <strong className="text-slate-800">Dec 2026</strong>.
            </p>

            <Link href="/admin/settings">
              <button className="w-full py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                Manage Subscription & Keys
              </button>
            </Link>
          </div>

          {/* Setup Completion Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Publishing Checklist</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Editorial AI Engine</p>
                  <p className="text-[10px] text-slate-400">OpenAI & Pollinations Connected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0 ${publication.name ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Publication Title</p>
                  <p className="text-[10px] text-slate-400 truncate">{publication.name || 'Set in settings'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0 ${publication.targetLocation ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">Target Region</p>
                  <p className="text-[10px] text-slate-400 truncate">{publication.targetLocation || 'National edition'}</p>
                </div>
              </div>
            </div>

            <Link href="/admin/settings">
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800 mt-5 pt-3 border-t border-slate-100 w-full text-left transition-colors flex items-center justify-between">
                <span>Configure in Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
