'use client';

import React, { useState, useEffect } from 'react';
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
  Printer,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'front' | 'metro' | 'business'>('front');
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Saved our newsroom hours of frantic evening manual pagination. The generated multi-column broadsheets look indistinguishable from our traditional rotary press prints.",
      name: "Ramesh Patil",
      title: "Executive Editor, Lokmat News Edition",
      location: "Nagpur, Maharashtra",
      rating: 5,
    },
    {
      quote: "The automated regional targeting and Marathi script typesetting are extraordinary. Our readers get hyper-local news with zero formatting errors.",
      name: "Sneha Kulkarni",
      title: "Managing Publisher, Pune Chronicle",
      location: "Pune, Maharashtra",
      rating: 5,
    },
    {
      quote: "Rigid typography rules, accurate dense columns, and CMYK vector output. This is the exact pre-press automation regional Indian publishers have needed for a decade.",
      name: "Arvind Sharma",
      title: "Head of Editorial Operations, City News Network",
      location: "New Delhi",
      rating: 5,
    },
  ];

  // Auto-rotate testimonials smoothly every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const previewTabs = {
    front: {
      label: "National Broadsheet",
      image: "/assets/authentic_newspaper.jpg",
    },
    metro: {
      label: "Metro Edition",
      image: "/assets/hero_newspaper.jpg",
    },
    business: {
      label: "Financial Index",
      image: "/assets/feature_pdf_render.jpg",
    },
  };

  const publisherLogos = [
    { name: "THE HINDU", font: "font-serif font-black text-2xl tracking-tighter" },
    { name: "नवभारत टाइम्स", tag: "NBT", font: "font-bold text-slate-900 text-lg" },
    { name: "Dainik Bhaskar", icon: "☀", font: "font-extrabold text-slate-900 text-lg tracking-tight" },
    { name: "THE TIMES OF INDIA", sub: "Est. 1838", font: "font-serif font-black text-xl tracking-tight" },
    { name: "mid-day", font: "text-2xl font-black text-blue-700 italic tracking-tight" },
    { name: "LOKMAT", font: "text-xl font-black text-[#d32f2f] uppercase tracking-wider" },
    { name: "हिन्दुस्तान", font: "text-xl font-black text-slate-900" },
  ];

  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-indigo-100 overflow-x-hidden text-slate-800">

      {/* ═══════════════════════════════════════════════════════════════════
          1. NAVIGATION BAR — Fixed, Dark, Frosted Glass with Hover Glows
      ═══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed w-full top-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/15 bg-blue-600/20 p-1 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[17px] font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300" style={{ fontFamily: 'var(--font-playfair)' }}>
              Press Management Suite
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-8">
            <a href="#how-it-works" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5">How it works</a>
            <a href="#features" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5">Features</a>
            <a href="#pricing" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5">Pricing</a>
            <a href="#testimonials" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors duration-200 hover:-translate-y-0.5">Editorial Proof</a>
            <a href="#testimonials" className="text-[14px] font-semibold text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1">
              Resources <span className="text-[10px] text-slate-500">▼</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-semibold text-slate-300 hover:text-white px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/25 transition-all duration-200 hover:bg-white/5 cursor-pointer">
                Login
              </button>
            </Link>
            <Link href="/login">
              <button className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer">
                Get Started <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════
          2. HERO SECTION — Ultra-Clean Minimalist Showcase with Rich Animations
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-[72px] overflow-hidden bg-[#070b14]">
        {/* Animated Background Fluid Orbs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b14] via-[#091122] to-[#070b14]" />
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[170px] pointer-events-none animate-blob" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none animate-blob-delay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16 pb-20 lg:pt-20 lg:pb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-14">

            {/* Left: Copy & Value Proposition */}
            <div className="w-full lg:w-[48%] text-center lg:text-left">
              
              {/* Minimalist Live Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold tracking-wider mb-8 backdrop-blur-md hover:bg-blue-500/15 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>AUTOMATED NEWSPRINT PLATFORM</span>
              </div>

              <h1 className="text-5xl lg:text-[4.3rem] font-extrabold text-white tracking-tight leading-[1.06] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Generate{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 italic">
                  Premium
                </span>{' '}
                Broadsheets in Seconds.
              </h1>

              <p className="text-base lg:text-lg text-slate-300/90 mb-10 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                The premier publishing platform engineered for Indian broadsheets and regional dailies. Automate multi-column typesetting, layout composition, and output certified print-ready PDFs without manual pagination delays.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/login">
                  <button className="flex items-center justify-center w-full sm:w-auto text-[15px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 rounded-xl shadow-[0_8px_30px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)] animate-pulse-glow cursor-pointer">
                    Launch Application
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <button className="flex items-center justify-center w-full sm:w-auto text-[15px] font-bold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-8 py-4 rounded-xl transition-all duration-300 cursor-pointer">
                    <PlayCircle className="h-5 w-5 mr-2 text-slate-400" />
                    Watch Production Demo
                  </button>
                </a>
              </div>

              {/* Minimalist Editorial Quality Stamp */}
              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">INS Indian Newspaper Standards Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <span>Rated 4.9/5 by 500+ Dailies</span>
                </div>
              </div>

            </div>

            {/* Right: Clean, Minimalist, Floating Broadsheet Showcase Canvas */}
            <div className="w-full lg:w-[52%] flex flex-col items-center">
              
              {/* Minimalist Glass Tab Selector */}
              <div className="inline-flex p-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl mb-6 shadow-lg">
                {(['front', 'metro', 'business'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {previewTabs[tab].label}
                  </button>
                ))}
              </div>

              {/* Pure Floating Broadsheet Display with Gentle Float & Depth */}
              <div className="w-full relative group animate-float-slow">
                {/* Ambient Glow behind image */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#090e1a] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] group-hover:scale-[1.01] transition-transform duration-500">
                  <img
                    src={previewTabs[activeTab].image}
                    alt={previewTabs[activeTab].label}
                    className="w-full h-[400px] sm:h-[450px] object-cover object-top transition-all duration-500"
                  />
                  
                  {/* Subtle Minimalist Status Badge Overlay */}
                  <div className="absolute bottom-4 right-4 bg-[#070b14]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-2 text-[11px] text-slate-300 font-semibold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>300 DPI CMYK Ready</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Trust Row Badges at bottom of Hero */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-between gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Automated Typesetting</span>
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-200">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>6 & 8-Column Grids</span>
            </div>
            <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-200">
              <FileOutput className="w-4 h-4 text-cyan-400" />
              <span>Rotary Press Bleed Safe</span>
            </div>
            <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-200">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>CMYK 300 DPI Export</span>
            </div>
            <div className="flex items-center gap-2 hover:text-purple-400 transition-colors duration-200">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Devanagari & Regional Scripts</span>
            </div>
            <div className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-200">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Multi-Edition Syndication</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. NEWSPAPER PUBLISHER LOGO BAR — Smooth Infinite Scrolling Marquee
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-y border-slate-200 py-10 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">
            TRUSTED BY REGIONAL & NATIONAL PUBLISHERS ACROSS INDIA
          </p>
        </div>

        {/* Infinite Animated Marquee Track with Smooth Edge Masks */}
        <div className="relative w-full overflow-hidden marquee-mask">
          <div className="animate-marquee flex items-center gap-16 py-2">
            {[...publisherLogos, ...publisherLogos, ...publisherLogos].map((logo, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default shrink-0 px-2"
              >
                {logo.tag && (
                  <span className="bg-[#e65100] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                    {logo.tag}
                  </span>
                )}
                {logo.icon && (
                  <span className="text-amber-500 font-bold text-sm">
                    {logo.icon}
                  </span>
                )}
                <span className={`${logo.font}`} style={{ fontFamily: logo.font.includes('serif') ? 'var(--font-playfair)' : 'inherit' }}>
                  {logo.name}
                </span>
                {logo.sub && (
                  <span className="text-[9px] text-slate-400 ml-1 block">{logo.sub}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          4. THREE STEPS SECTION — Clean Animated Workflow Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-[#f8faff] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="relative mb-16 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              Simple · Precise · Automated
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Three Steps to Print Perfection
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              From raw news feeds to finished broadsheet PDFs — complete pagination without manual typesetting.
            </p>

            {/* Hand-drawn annotation badge */}
            <div className="hidden lg:flex items-center gap-2 absolute -right-44 top-4 text-blue-600 text-sm font-semibold italic rotate-3 hover:rotate-0 transition-transform duration-300">
              <span>✏️ Transform raw stories into certified broadsheets instantly.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 relative group hover:-translate-y-2 cursor-default">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  1
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Configure & Target</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Select your edition date, language, target municipality, and column count. Set parameters in seconds for lead stories and ad slots.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 relative group hover:-translate-y-2 cursor-default">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  2
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Layout className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Automated Layout Engine</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Our pre-press engine automatically formats wire stories, typesets dense columns, balances white space, and embeds high-resolution photography.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-purple-400 transition-all duration-300 relative group hover:-translate-y-2 cursor-default">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-lg border border-purple-100 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  3
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Printer className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-3">Export Print-Ready PDF</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Drag-and-drop adjustments if desired, then export a certified, multi-page CMYK broadsheet PDF directly to your printing press.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. AUTHENTIC. BEAUTIFUL. PROFESSIONAL. — Editorial Excellence
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Realistic Broadsheet Newspaper Spread with Smooth Hover */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-slate-200 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-700 group">
                <img 
                  src="/assets/authentic_newspaper.jpg" 
                  alt="Authentic Indian broadsheet newspaper generated with traditional multi-column typography" 
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                />
              </div>
            </div>

            {/* Right: Description & Metrics */}
            <div className="lg:col-span-6">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0f172a] mb-6 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Authentic. Beautiful. Professional.
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 text-base">
                Press Management Suite captures the exact aesthetic, column density, and structural rules of real Indian newspapers — automating pre-press so your editorial team focuses on what matters: delivering the news.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Traditional 6-column and 8-column broadsheet grids</span>
                </div>
                <div className="flex items-start gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Strict typographic hierarchy and automated copy fitting</span>
                </div>
                <div className="flex items-start gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Full Devanagari and regional script support (Hindi, Marathi, English)</span>
                </div>
                <div className="flex items-start gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">High-resolution print-ready 300 DPI PDF export</span>
                </div>
              </div>

              {/* 3 Metric Cards with Hover Depth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1 text-blue-600">
                    <Users className="w-4 h-4" />
                    <span className="text-2xl font-black text-slate-900">500+</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">Active Publishers</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1 text-indigo-600">
                    <Newspaper className="w-4 h-4" />
                    <span className="text-2xl font-black text-slate-900">1M+</span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">Broadsheets Formatted</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
          6. ENTERPRISE-GRADE FEATURES — Dark Section with Authentic Tools
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 bg-[#070b14] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ CORE EDITORIAL CAPABILITIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Enterprise Press Features
            </h2>
            <p className="text-base text-slate-400 font-normal leading-relaxed">
              Everything required to operate single-run morning editions or syndicated multi-city publishing operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="rounded-3xl border border-white/10 hover:border-blue-500/40 transition-all duration-500 group overflow-hidden bg-[#0d1322] flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] cursor-default">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Autonomous Pagination Engine</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Automatically sets story priority, balances multi-column gutters, and lays out news instantly.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.03] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_ai_engine.jpg" alt="Autonomous Pagination Engine" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all duration-500 group overflow-hidden bg-[#0d1322] flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] cursor-default">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/30 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Layout className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Authentic Typography Spec</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Recreates traditional broadsheet styles with classic serif headers, drop caps, and Devanagari fonts.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.03] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_typography.jpg" alt="Authentic Typography" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-500 group overflow-hidden bg-[#0d1322] flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] cursor-default">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                  <FileOutput className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Rotary Press PDF Output</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Pixel-perfect CMYK rendering with exact bleed safe zones, crisp vector headers, and photo reproduction.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.03] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_pdf_render.jpg" alt="PDF Rendering" className="w-full h-full object-cover object-center" />
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all duration-500 group overflow-hidden bg-[#0d1322] flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] cursor-default">
              <div className="p-8">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Hyper-Local Regional Editions</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Publish dedicated district, municipal, and city editions with localized headlines and regional classifieds.</p>
              </div>
              <div className="h-52 overflow-hidden px-8 pb-8">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 group-hover:scale-[1.03] transition-transform duration-500 shadow-xl">
                  <img src="/assets/feature_local_targets.jpg" alt="Local Editions" className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. TRANSPARENT PRICING — Interactive Monthly / Annual Switcher
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 bg-[#f8faff] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ TRANSPARENT LICENSING
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Choose Your Plan
            </h2>
            <p className="text-base text-slate-500 font-medium mb-8">
              Predictable pricing designed for single newsrooms, regional presses, and daily newspaper syndicates.
            </p>

            {/* Interactive Billing Toggle */}
            <div className="inline-flex items-center p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/80 shadow-inner">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  !isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isAnnual ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            
            {/* Plan 1: Starter Edition */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Starter Edition</h3>
                <p className="text-slate-500 mt-1 text-sm">Ideal for testing layout composition.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-black text-slate-900">Free</span>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  3 Editions per month
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  Standard 6-Column Layouts
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-600" /></div>
                  Community Support
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm cursor-pointer">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Plan 2: Regional Press (Highlighted Most Popular) */}
            <div className="bg-[#0b1021] text-white rounded-3xl p-8 flex flex-col shadow-[0_20px_50px_rgba(11,16,33,0.4)] border border-blue-500/40 relative z-10 transform md:-translate-y-2 hover:-translate-y-3 transition-transform duration-300 cursor-default">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white">Regional Press</h3>
                <p className="text-slate-400 mt-1 text-sm">For regional weeklies and community dailies.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {isAnnual ? '₹5,000' : '₹499'}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">{isAnnual ? '/year' : '/month'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  30 Broadsheet Editions /mo
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  Custom Regional Targeting
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  Priority Editorial Support
                </li>
                <li className="flex items-center text-slate-200 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-blue-400" /></div>
                  High-Res CMYK PDF Export
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 text-sm cursor-pointer">
                  Subscribe to Regional
                </button>
              </Link>
            </div>

            {/* Plan 3: Daily Broadsheet */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Daily Broadsheet</h3>
                <p className="text-slate-500 mt-1 text-sm">For high-frequency dailies and multi-edition syndicates.</p>
              </div>
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {isAnnual ? '₹9,000' : '₹899'}
                  </span>
                  <span className="text-slate-500 text-sm font-medium">{isAnnual ? '/year' : '/month'}</span>
                </div>
              </div>
              <ul className="space-y-3.5 flex-1 mb-8">
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Unlimited Daily Editions
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Custom Watermarks & Mastheads
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  24/7 Dedicated Support
                </li>
                <li className="flex items-center text-slate-600 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0"><Check className="w-3.5 h-3.5 text-indigo-600" /></div>
                  Multi-Lingual Broadsheet Support
                </li>
              </ul>
              <Link href="/login">
                <button className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm cursor-pointer">
                  Subscribe to Daily
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          8. TESTIMONIALS — Auto-Rotating Animated Carousel with Editorial Proof
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              ✦ EDITORIAL CASE STUDIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              Why Publishers Trust Us
            </h2>
            <p className="text-slate-400 text-sm font-medium">Endorsed by editors and production heads across Indian publications.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Carousel Controls */}
            <div className="flex items-center justify-between absolute -inset-x-12 top-1/2 -translate-y-1/2 pointer-events-none z-20 hidden lg:flex">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white flex items-center justify-center pointer-events-auto backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-110"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/10 text-white flex items-center justify-center pointer-events-auto backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-110"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveTestimonial(idx)}
                  className={`rounded-3xl p-8 border transition-all duration-500 flex flex-col justify-between cursor-pointer ${
                    activeTestimonial === idx 
                      ? 'bg-[#0f172a] border-blue-500/50 shadow-[0_10px_35px_rgba(59,130,246,0.25)] scale-[1.03]' 
                      : 'bg-[#0e1424] border-white/10 hover:border-white/20 opacity-75 hover:opacity-100 hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                      "{t.quote}"
                    </p>
                    <div className="flex text-amber-400 mb-6">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-blue-400 font-medium">{t.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTestimonial === i ? 'w-6 bg-blue-500 shadow-md shadow-blue-500/50' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          9. FINAL CTA SECTION — High-Resolution Newspaper Bundle Render
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#0d1630] via-[#111e42] to-[#0d1630] border border-blue-500/30 p-10 lg:p-14 overflow-hidden relative shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            
            {/* Background cyan neon beam */}
            <div className="absolute top-0 right-1/3 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[110px] pointer-events-none animate-blob" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column */}
              <div className="lg:col-span-7">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Ready to reclaim your publishing deadlines?
                </h2>
                <p className="text-slate-300 text-base font-normal mb-8 max-w-xl leading-relaxed">
                  Join hundreds of local newspapers and presses using Press Management Suite to eliminate formatting delays and print with confidence.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/login" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 px-8 py-3.5 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-pulse-glow cursor-pointer">
                      Get Started for Free
                    </button>
                  </Link>
                  <a href="#how-it-works" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-3.5 rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5">
                      Contact Sales
                    </button>
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Stack Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-blue-400/30 group animate-float-reverse">
                  <img 
                    src="/assets/cta_newspaper_stack.jpg" 
                    alt="Printed broadsheet newspapers bound with Press Management Suite strap" 
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
                Empowering Indian publishers with modern automated tools to format news, faster, and smarter.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="font-extrabold text-slate-900 mb-4 text-[11px] tracking-wider uppercase">Platform</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">Editorial Studio</a></li>
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Pagination Engine</a></li>
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Rotary PDF Export</a></li>
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
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
                <button type="button" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shrink-0 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
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
