'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  PlayCircle,
  Star,
  Zap,
  ShieldCheck,
  Settings,
  Wand2,
  FileOutput,
  Globe,
  Layout,
  Check,
  Mail,
  MapPin,
  Users,
  Newspaper,
  BarChart3,
  Clock,
  Sparkles,
  Server,
  Layers,
  Code2,
  Cpu,
  PenTool,
  Send,
  Twitter,
  Youtube,
  Linkedin,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-indigo-100 overflow-x-hidden text-slate-800">

      {/* ═══════════════════════════════════════════════════════════════════
          1. NAVIGATION BAR — Dark, Fixed
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed w-full top-0 z-50 bg-[#070b14]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/15 bg-blue-600/20 p-1">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[17px] font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
              Press Management Suite
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8">
            <a href="#how-it-works" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">How it works</a>
            <a href="#features" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#integrations" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors">Integrations</a>
            <a href="#testimonials" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              Resources <span className="text-[10px] text-slate-500">▼</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-semibold text-slate-300 hover:text-white px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-full transition-all shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 flex items-center gap-1.5">
                Get Started <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          2. HERO SECTION — Dark Gradient with Newspaper Imagery
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-[72px] overflow-hidden bg-[#070b14]">
        {/* Ambient Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b14] via-[#0d162d] to-[#070b14]" />
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16 pb-20 lg:pt-20 lg:pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

            {/* Left: Copy & Value Proposition */}
            <div className="w-full lg:w-[54%] text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                AI-Powered Newsprint Tech
              </div>

              <h1 className="text-5xl lg:text-[4.4rem] font-extrabold text-white tracking-tight leading-[1.06] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Generate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 italic">
                  Premium
                </span>{' '}
                Broadsheets in Seconds.
              </h1>

              <p className="text-base lg:text-lg text-slate-300/90 mb-10 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                The hyper-premium SaaS platform that fuses authentic Indian newspaper aesthetics with blazing-fast AI generation. Design perfect PDFs automatically without typing a single word.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/login">
                  <button className="flex items-center justify-center w-full sm:w-auto text-[15px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 rounded-xl shadow-[0_8px_30px_rgba(59,130,246,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)]">
                    Launch Application
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <button className="flex items-center justify-center w-full sm:w-auto text-[15px] font-bold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-8 py-4 rounded-xl transition-all">
                    <PlayCircle className="h-5 w-5 mr-2 text-slate-400" />
                    Watch Demo
                  </button>
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-400">
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-[#070b14] flex items-center justify-center text-white text-[11px] font-bold shadow-md">RP</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-[#070b14] flex items-center justify-center text-white text-[11px] font-bold shadow-md">SK</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-[#070b14] flex items-center justify-center text-white text-[11px] font-bold shadow-md">AS</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 border-2 border-[#070b14] flex items-center justify-center text-white text-[11px] font-bold shadow-md">MB</div>
                </div>
                <div>
                  <div className="flex text-amber-400 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span className="text-slate-400 text-xs font-semibold">Trusted by 500+ Local Publishers</span>
                </div>
              </div>
            </div>

            {/* Right: Visual Mockup Showcase with Interactive Perspective */}
            <div className="w-full lg:w-[46%] relative min-h-[440px] lg:min-h-[500px]">
              
              {/* Background Glow behind mockups */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[80px] -z-10" />

              {/* Main Dashboard Preview Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/15 bg-[#0f172a] transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/assets/hero_dashboard.jpg" 
                  alt="Press Management Suite Dashboard Preview" 
                  className="w-full h-auto object-cover rounded-2xl" 
                />
                
                {/* Foreground Angled Newspaper Broadside Overlap */}
                <div className="absolute -bottom-6 -right-6 w-[56%] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-white/20 transform rotate-3 hover:rotate-1 transition-transform duration-500">
                  <img 
                    src="/assets/hero_newspaper.jpg" 
                    alt="The Daily Chronicle Newspaper Broadsheet" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Floating Badge 1: AI Generator Status */}
                <div className="absolute top-4 left-4 bg-[#0a0f1d]/90 backdrop-blur-xl px-3.5 py-2 rounded-xl shadow-xl border border-white/15 flex items-center gap-2.5 z-20">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">AI Generator</p>
                    <p className="text-[9px] text-blue-300 font-medium">Completed: 10 new spaces</p>
                  </div>
                </div>

                {/* Floating Badge 2: Generation Speed */}
                <div className="absolute bottom-6 left-4 bg-[#0a0f1d]/90 backdrop-blur-xl px-3.5 py-2 rounded-xl shadow-xl border border-white/15 flex items-center gap-2.5 z-20">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Generation Time</p>
                    <p className="text-[9px] text-emerald-300 font-semibold">12 seconds</p>
                  </div>
                </div>

                {/* Floating Tools Strip on the Right */}
                <div className="absolute top-8 right-3 bg-[#0a0f1d]/90 backdrop-blur-xl p-2 rounded-xl border border-white/15 flex flex-col gap-2 z-20 shadow-xl hidden sm:flex">
                  <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Headlines">
                    <PenTool className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer" title="AI Images">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer" title="Auto Layout">
                    <Layout className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white transition-colors cursor-pointer" title="Export PDF">
                    <FileOutput className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Trust Row Badges at bottom of Hero */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-between gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>AI Content Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Newscraft Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <FileOutput className="w-4 h-4 text-cyan-400" />
              <span>Puppeteer PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>React UI</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Multi-Language</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Cloud Infrastructure</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. NEWSPAPER PUBLISHER LOGO BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-y border-slate-200 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">
            TRUSTED BY PUBLISHERS ACROSS INDIA
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            
            {/* The Hindu */}
            <div className="flex items-center gap-2 text-slate-800 opacity-80 hover:opacity-100 transition-opacity">
              <div className="font-serif font-black text-2xl tracking-tighter" style={{ fontFamily: 'var(--font-playfair)' }}>
                THE HINDU
              </div>
            </div>

            {/* Navbharat Times */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="bg-[#e65100] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">NBT</span>
              <span className="font-bold text-slate-900 text-lg">नवभारत टाइम्स</span>
            </div>

            {/* Dainik Bhaskar */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] font-bold">☀</div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">Dainik Bhaskar</span>
            </div>

            {/* The Times of India */}
            <div className="flex items-center gap-2 text-slate-900 opacity-80 hover:opacity-100 transition-opacity">
              <div className="text-center leading-none">
                <span className="block text-[8px] font-bold tracking-widest text-slate-500 uppercase">Est. 1838</span>
                <span className="font-serif font-black text-xl tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>THE TIMES OF INDIA</span>
              </div>
            </div>

            {/* mid-day */}
            <div className="opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-2xl font-black text-blue-700 italic tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>mid-day</span>
            </div>

            {/* Lokmat */}
            <div className="opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-xl font-black text-[#d32f2f] uppercase tracking-wider">LOKMAT</span>
            </div>

            {/* Hindustan */}
            <div className="opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-xl font-black text-slate-900">
                <span className="text-rose-600 font-bold">हिन्दू</span>स्तान
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          4. THREE STEPS SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-[#f8faff] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="relative mb-16 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              Simple · Powerful · Automated
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Three Steps to Print Perfection
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              From raw parameters to a finished broadsheet PDF — fully automated, zero manual effort.
            </p>

            {/* Hand-drawn annotation badge */}
            <div className="hidden lg:flex items-center gap-2 absolute -right-48 top-4 text-blue-600 text-sm font-semibold italic rotate-6">
              <span>✏️ Transform ideas into professional newspapers instantly.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 group-hover:scale-105 transition-transform">
                  1
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                  <Settings className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Configure & Target</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Select your city, language, news source, and publication date. Set your parameters in seconds — be it headlines, sections, or ad inserts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 relative group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 group-hover:scale-105 transition-transform">
                  2
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Wand2 className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">AI Generates Everything</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Our engine auto-fetches live news, creates articles, filters by relevance, writes headlines, and places content perfectly with images and ads.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 relative group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg border border-purple-100 group-hover:scale-105 transition-transform">
                  3
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <FileOutput className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Export Print-Ready PDF</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Drag-and-drop your page layout, then export a perfectly aligned, multi-page broadsheet PDF in one click.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. AUTHENTIC. BEAUTIFUL. PROFESSIONAL. — High-End Mockup & Stats
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Realistic Newspaper Broadsheet Preview */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-200 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/assets/authentic_newspaper.jpg" 
                  alt="Realistic Indian broadsheet newspaper generated with authentic typography" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>

            {/* Right: Description & Metrics */}
            <div className="lg:col-span-6">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0f172a] mb-6 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Authentic. Beautiful. Professional.
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 text-base">
                Press Management Suite captures the exact aesthetic and structure of real Indian newspapers — with AI working in the background so you can focus on what matters: delivering the news.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Traditional and modern newspaper templates</span>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Smart content placement with AI</span>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Regional language support (Hindi, Marathi, English + more)</span>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">High-resolution print-ready PDF export</span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-1 text-blue-600">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-2xl font-black text-slate-900">500+</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">Active Publishers</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-1 text-indigo-600">
                    <Newspaper className="w-4 h-4" />
                    <span className="text-2xl font-black text-slate-900">1M+</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">Newspapers Generated</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-1 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-2xl font-black text-slate-900">99.9%</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">Uptime Guarantee</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. ENTERPRISE-GRADE FEATURES — Dark Section with Curated Images
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 bg-[#070b14] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ CORE CAPABILITIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Enterprise-Grade Features
            </h2>
            <p className="text-base text-slate-400 font-normal leading-relaxed">
              Everything you need to launch single-run or high-volume multi-edition news operations with AI automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all duration-300 group overflow-hidden bg-[#0d1322] flex flex-col justify-between">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Auto-Pilot AI Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Curates news, writes articles, selects images, and layouts automatically.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_ai_engine.jpg" alt="AI Engine" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group overflow-hidden bg-[#0d1322] flex flex-col justify-between">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30">
                  <Layout className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Authentic Typography</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Recreates real newspaper styles with precision typography and spacing.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_typography.jpg" alt="Typography" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group overflow-hidden bg-[#0d1322] flex flex-col justify-between">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                  <FileOutput className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Flawless Rendering</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Pixel-perfect multi-column layout generation with ads and images.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_pdf_render.jpg" alt="PDF Rendering" className="w-full h-full object-cover object-center" />
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 group overflow-hidden bg-[#0d1322] flex flex-col justify-between">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Hyper-Local Targets</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Generate city-specific editions with local news and targeted ads.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_local_targets.jpg" alt="Local Targets" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. TRANSPARENT PRICING
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 bg-[#f8faff] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ TRANSPARENT PRICING
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Choose Your Plan
            </h2>
            <p className="text-base text-slate-500 font-medium">Simple, predictable pricing that scales with your publication's needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            
            {/* Plan 1: Starter */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Starter</h3>
                <p className="text-slate-500 mt-1 text-sm">Perfect for testing the AI capabilities.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-black text-slate-900">Free</span>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  3 Generations a month
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  Standard Templates
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  Community Support
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all text-sm">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Plan 2: Scale (Highlighted Most Popular) */}
            <div className="bg-[#0b1021] text-white rounded-3xl p-8 flex flex-col shadow-[0_20px_50px_rgba(11,16,33,0.4)] border border-blue-500/40 relative z-10 transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white">Scale</h3>
                <p className="text-slate-400 mt-1 text-sm">For growing local weekly publications.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">₹5,000</span>
                  <span className="text-slate-400 text-sm font-medium">/year</span>
                </div>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  30 Generations a month
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  Custom AI Targeting
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  Priority Email Support
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  Advanced Templates
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all text-sm">
                  Upgrade to Scale
                </button>
              </Link>
            </div>

            {/* Plan 3: Pro */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Pro</h3>
                <p className="text-slate-500 mt-1 text-sm">For daily publishers needing greater reach.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">₹9,000</span>
                  <span className="text-slate-500 text-sm font-medium">/year</span>
                </div>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  60 Generations a month
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Custom Watermarks & Ads
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  24/7 Dedicated Support
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Multi-Language Support
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all text-sm">
                  Upgrade to Pro
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          8. WHY PUBLISHERS LOVE US — Testimonials
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ REAL USER STORIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Why Publishers Love Us
            </h2>
            <p className="text-slate-400 text-sm font-medium">Trusted by local and regional publishers across India.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Left/Right Carousel Controls */}
            <div className="hidden lg:flex items-center justify-between absolute -inset-x-12 top-1/2 -translate-y-1/2 pointer-events-none z-20">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center pointer-events-auto backdrop-blur-md transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center pointer-events-auto backdrop-blur-md transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Testimonial 1 */}
              <div className="bg-[#0e1424] rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                    "Saved us hours of manual work. The generated PDFs look exactly like our printed edition."
                  </p>
                  <div className="flex text-amber-400 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    RP
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Ramesh Patil</p>
                    <p className="text-[11px] text-slate-500">Editor, Lokmat News Edition</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-[#0e1424] rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                    "The local news targeting feature is a game-changer. Our readers love the relevance."
                  </p>
                  <div className="flex text-amber-400 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    SK
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Sneha Kulkarni</p>
                    <p className="text-[11px] text-slate-500">Publisher, Pune Chronicle</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-[#0e1424] rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between">
                <div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                    "Professional templates, accurate layout, and zero hassle. This is the future of local journalism."
                  </p>
                  <div className="flex text-amber-400 mb-6">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    AS
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Arvind Sharma</p>
                    <p className="text-[11px] text-slate-500">Founder, City News Network</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          9. FINAL CTA SECTION — High-Resolution Newspaper Bundle Mockup
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#0d1630] via-[#111e42] to-[#0d1630] border border-blue-500/30 p-10 lg:p-14 overflow-hidden relative shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            
            {/* Background cyan neon beam */}
            <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column */}
              <div className="lg:col-span-7">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Ready to reclaim your publishing weekends?
                </h2>
                <p className="text-slate-300 text-base font-normal mb-8 max-w-xl leading-relaxed">
                  Join hundreds of local newspapers who use Press Management Suite to cut formatting time down to zero.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 px-8 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                      Get Started for Free
                    </button>
                  </Link>
                  <a href="#how-it-works" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-3.5 rounded-xl transition-all">
                      Contact Sales
                    </button>
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Stack Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-blue-400/30 group">
                  <img 
                    src="/assets/cta_newspaper_stack.jpg" 
                    alt="Printed broadsheet newspapers bound with glowing Press Management Suite banner" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          10. FOOTER — Clean, Professional White
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

            {/* Left Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-md bg-blue-600/10 p-1">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Press Management Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 max-w-sm">
                Empowering Indian publishers with AI-driven tools to format news, faster, and smarter.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="font-extrabold text-slate-900 mb-4 text-[11px] tracking-wider uppercase">Platform</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Digital Newsroom</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">AI Article Engine</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Ad Integration</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-extrabold text-slate-900 mb-4 text-[11px] tracking-wider uppercase">Support</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Video Tutorials</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Documentation</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-extrabold text-slate-900 mb-4 text-[11px] tracking-wider uppercase">Company</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-2">
              <h4 className="font-extrabold text-slate-900 mb-2 text-[11px] tracking-wider uppercase">Subscribe to our newsletter</h4>
              <p className="text-xs text-slate-500 mb-3">Get product updates and publishing tips.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
                <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-4">
            <p>© 2026 Press Management Suite. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
