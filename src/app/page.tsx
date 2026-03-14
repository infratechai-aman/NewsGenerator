import React from 'react';
import Link from 'next/link';
import { Newspaper, ChevronRight, PenTool, Layout, Globe, Wand2, FileOutput, ArrowRight, PlayCircle, Star, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-indigo-100 overflow-x-hidden">
      
      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-[#0f172a] tracking-tight">Bharat Digital</span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-10 w-1/2">
            <a href="#how-it-works" className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
            <a href="#features" className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#support" className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors">Support</a>
          </div>

          <div className="flex justify-end w-1/4">
            <Link href="/admin">
              <button className="flex items-center text-sm font-bold text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-6 py-2.5 rounded-full transition-all shadow-sm">
                Log In
              </button>
            </Link>
            <Link href="/admin">
              <button className="hidden sm:flex items-center text-sm font-bold text-white bg-[#0f172a] hover:bg-black px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ml-3">
                Go to Dashboard
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Gorgeous Abstract Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            
            {/* Left: Copy */}
            <div className="w-full lg:w-1/2 text-center lg:text-left mt-4 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                <Wand2 className="h-3.5 w-3.5" />
                AI-Powered Newsprint Tech
              </div>
              
              <h1 className="text-5xl lg:text-[4.5rem] font-extrabold text-[#0f172a] tracking-tight leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-playfair)'}}>
                Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Premium Broadsheets</span> in Seconds.
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                The hyper-premium SaaS platform that fuses authentic Indian newspaper aesthetics with blazing-fast AI generation. Design perfect PDFs automatically without typing a single word.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/admin">
                  <button className="flex items-center justify-center w-full sm:w-auto text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.3)] transition-all hover:-translate-y-1">
                    Launch Application
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </Link>
                <button className="flex items-center justify-center w-full sm:w-auto text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-8 py-4 rounded-xl transition-all">
                  <PlayCircle className="h-5 w-5 mr-2 text-slate-400" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex text-amber-400 mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  Trusted by 500+ Local Publishers
                </div>
              </div>
            </div>

            {/* Right: Premium Mockup Graphic */}
            <div className="w-full lg:w-1/2 relative lg:h-[600px] perspective-[2000px]">
              {/* Main Dashboard Window */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden transform lg:rotate-y-[-12deg] lg:rotate-x-[4deg] lg:translate-x-12 transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0 z-10 flex flex-col">
                <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="mx-auto bg-white border border-slate-200 rounded-md px-24 py-1 text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                    BharatDigital.com/admin
                  </div>
                </div>
                <div className="flex flex-1">
                  <div className="w-1/4 bg-[#111827] p-4 flex flex-col gap-3">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-blue-500/20 rounded w-full"></div>
                    <div className="h-3 bg-white/5 rounded w-5/6"></div>
                    <div className="h-3 bg-white/5 rounded w-full"></div>
                  </div>
                  <div className="flex-1 bg-slate-100 p-6">
                    <div className="bg-white h-full rounded-xl shadow-sm border border-slate-200 p-4 flex gap-4">
                      <div className="w-1/3 flex flex-col gap-2">
                         <div className="h-24 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-blue-300" />
                         </div>
                         <div className="h-16 bg-emerald-50 rounded-lg border border-emerald-100"></div>
                         <div className="h-16 bg-amber-50 rounded-lg border border-amber-100"></div>
                      </div>
                      <div className="flex-1 bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4 flex flex-col gap-2 relative">
                        <div className="absolute right-2 top-2 p-1 bg-blue-600 rounded text-white"><Wand2 className="w-3 h-3" /></div>
                        <div className="h-5 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
                        <div className="flex gap-2">
                          <div className="flex-1 h-32 bg-slate-200 rounded"></div>
                          <div className="flex-1 h-32 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1 - Notification */}
              <div className="absolute top-20 -left-12 lg:-left-24 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 z-20 flex items-center gap-4 animate-[bounce_6s_infinite]">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">PDF Ready</p>
                  <p className="text-[10px] text-slate-500 font-medium">12 Pages generated perfectly.</p>
                </div>
              </div>

              {/* Floating Element 2 - Stats */}
              <div className="absolute bottom-24 -right-4 lg:-right-12 bg-white p-5 rounded-xl shadow-2xl border border-slate-100 z-20 w-48 animate-[bounce_7s_infinite_reverse]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time Saved</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-[#0f172a] leading-none">18</span>
                  <span className="text-sm font-bold text-blue-600 mb-1">Hours</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className="w-[80%] h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Powered By Banner */}
      <div className="border-y border-slate-200 bg-white py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Integrated with Industry Leading Technology</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mocked Tech Logos */}
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Wand2 className="w-6 h-6"/> OpenAI API</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Globe className="w-6 h-6"/> NewsAPI</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><FileOutput className="w-6 h-6"/> Puppeteer Engine</div>
            <div className="flex items-center gap-2 font-bold text-xl text-slate-800"><Layout className="w-6 h-6"/> React UI</div>
          </div>
        </div>
      </div>

      {/* How It Works (ScorePrepPro Style) */}
      <section id="how-it-works" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">The Workflow</h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight" style={{ fontFamily: 'var(--font-playfair)'}}>How Bharat Digital Works</h3>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-10 lg:p-16 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative">
            {/* Huge decorative quotes */}
            <div className="absolute top-8 left-8 text-8xl text-blue-50 font-serif leading-none select-none pointer-events-none">"</div>
            <div className="absolute bottom-8 right-8 text-8xl text-blue-50 font-serif leading-none select-none pointer-events-none rotate-180">"</div>
            
            <p className="text-lg lg:text-xl text-slate-600 leading-[1.8] font-medium text-center relative z-10">
              <strong className="text-slate-900 font-bold">Bharat Digital</strong> simplifies the entire newsletter and broadsheet creation process into a seamlessly integrated, intelligent workflow designed specifically for busy publishers. Instead of wrestling with indesign templates, copy-pasting news, and struggling with formatting, our platform allows you to effortlessly select your specific Target Location and News Count in seconds. Once your parameters are set, our <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">advanced AI takes over</span> — automatically fetching live news, designing quotes, tracking weather, and writing horoscopes. Finally, with a single drag-and-drop builder, your custom-tailored, professional publication is instantly exported as a <span className="text-indigo-600 font-bold border-b-2 border-indigo-200">perfectly aligned, print-ready PDF</span>. This completely eliminates manual typography and formatting, saving you countless hours of labor and letting you focus on what truly matters: delivering the news.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-playfair)'}}>Enterprise-Grade Features</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Everything you need to launch a high-end digital publication, combining aesthetic perfection with autonomous AI workflows.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 block">Auto-Pilot AI Engine</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Connect your OpenAI credentials securely on the backend. Generate highly localized News, Weather, TV Guides, and Horoscopes instantly.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Layout className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 block">Authentic Typography</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Engineered to perfectly match the dense, multi-column Indian aesthetic with strict serif fonts and classic UnifrakturMaguntia headers.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-emerald-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <FileOutput className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 block">Flawless Rendering</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                A highly-tuned Puppeteer engine guarantees that content perfectly wraps across pages. Built-in break-inside avoidance technology.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-b from-slate-50 to-white border border-slate-200 hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 block">Hyper-Local Targets</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Scrape realtime news and API vectors mapped precisely to the cities and regions you care about. Real news, real weather.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-[#fafcff] border-t border-slate-200/60 relative">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-playfair)'}}>Transparent Pricing</h2>
            <p className="text-lg text-slate-500 font-medium">Simple, predictable pricing that scales with your digital publication needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-200 flex flex-col hover:border-blue-200 hover:shadow-xl transition-all relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Starter</h3>
                <p className="text-slate-500 mt-2 font-medium">Perfect for testing the AI capabilities.</p>
              </div>
              <div className="mb-8 pb-8 border-b border-slate-100">
                <span className="text-5xl font-extrabold text-[#0f172a]">Free</span>
              </div>
              <ul className="space-y-5 flex-1 mb-10">
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  3 Generations a month
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  Standard Templates
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  Community Support
                </li>
              </ul>
              <Link href="/admin">
                <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Scale */}
            <div className="bg-[#0f172a] rounded-[2rem] p-10 flex flex-col shadow-[0_20px_40px_-15px_rgba(15,23,42,0.4)] transform md:scale-105 relative z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">Scale</h3>
                <p className="text-slate-400 mt-2 font-medium">For growing local weekly publications.</p>
              </div>
              <div className="mb-8 pb-8 border-b border-white/10">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-white">₹5,000</span>
                  <span className="text-slate-400 font-medium pb-2">/year</span>
                </div>
              </div>
              <ul className="space-y-5 flex-1 mb-10">
                <li className="flex items-center text-slate-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">✓</span>
                  </div>
                  30 Generations a month
                </li>
                <li className="flex items-center text-slate-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">✓</span>
                  </div>
                  Custom AI Targeting
                </li>
                <li className="flex items-center text-slate-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-400 text-xs font-bold">✓</span>
                  </div>
                  Priority Email Support
                </li>
              </ul>
              <Link href="/admin">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                  Upgrade to Scale
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-[2rem] p-10 border border-slate-200 flex flex-col hover:border-blue-200 hover:shadow-xl transition-all relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                <p className="text-slate-500 mt-2 font-medium">For daily publishers reaching millions.</p>
              </div>
              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-[#0f172a]">₹9,000</span>
                  <span className="text-slate-500 font-medium pb-2">/year</span>
                </div>
              </div>
              <ul className="space-y-5 flex-1 mb-10">
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  90 Generations a month
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  Custom Watermarks & Ads
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </div>
                  24/7 Dedicated Support
                </li>
              </ul>
              <Link href="/admin">
                <button className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                  Upgrade to Pro
                </button>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* Support / Why Us */}
      <section id="support" className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Publishing Power</h2>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-playfair)'}}>Why Teachers & Publishers Love Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-10 bg-[#fafcff] rounded-[2rem] border border-slate-200 flex flex-col gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-extrabold text-xl">1</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-3">Zero Typing Needed</h4>
                <p className="text-slate-500 font-medium leading-[1.8]">Say goodbye to manual transcription. The AI pulls relevant source material and drafts print-ready broadsheet articles in exactly 60 seconds. Absolutely seamless automation.</p>
              </div>
            </div>

            <div className="p-10 bg-[#fafcff] rounded-[2rem] border border-slate-200 flex flex-col gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 font-extrabold text-xl">2</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-3">Custom Branding</h4>
                <p className="text-slate-500 font-medium leading-[1.8]">Deliver a premium professional look that represents your local news brand perfectly. Completely white-labeled output means you own the identity front-to-back.</p>
              </div>
            </div>

            <div className="p-10 bg-[#fafcff] rounded-[2rem] border border-slate-200 flex flex-col gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-extrabold text-xl">3</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-3">In-house Ad Network</h4>
                <p className="text-slate-500 font-medium leading-[1.8]">Upload and place custom graphical ad slots right inside the flow of the newspaper seamlessly, driving revenue effortlessly alongside content blocks.</p>
              </div>
            </div>

            <div className="p-10 bg-[#fafcff] rounded-[2rem] border border-slate-200 flex flex-col gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-extrabold text-xl">4</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-3">Dedicated Support</h4>
                <p className="text-slate-500 font-medium leading-[1.8]">Our engineering support team is always available to help you configure custom templates, troubleshoot PDF scaling issues, and integrate your OpenAI keys securely.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-[#0f172a] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full translate-y-1/2 w-full h-[500px]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)'}}>
            Ready to reclaim your publishing weekends?
          </h2>
          <p className="text-slate-300 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">Join the hundreds of local newspapers who use Bharat Digital to cut formatting time down to zero.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/admin">
              <button className="flex items-center justify-center w-full sm:w-auto text-lg font-bold text-slate-900 bg-white hover:bg-slate-50 px-10 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                Get Started for Free
              </button>
            </Link>
            <button className="flex items-center justify-center w-full sm:w-auto text-lg font-bold text-white bg-[#1e293b] border border-[#334155] hover:bg-[#334155] px-10 py-5 rounded-2xl transition-all">
              Contact Sales
            </button>
          </div>
          <p className="mt-8 text-sm text-slate-500 font-medium tracking-wide font-sans">NO CREDIT CARD REQUIRED • CANCEL ANYTIME</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fcfdfd] border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            
            <div className="md:col-span-5 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                  <Newspaper className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Bharat Digital</span>
              </div>
              <p className="text-base text-slate-500 leading-[1.8] font-medium max-w-sm">
                Empowering Indian publishers with AI-driven tools for better news, faster layouts, and smarter automation. Let's build the future of print.
              </p>
              {/* Fake Social Icons */}
              <div className="flex gap-4 mt-8 text-slate-400">
                <div className="w-6 h-6 bg-slate-400 hover:bg-blue-500 cursor-pointer transition-colors" style={{ WebkitMaskImage: 'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" fill="currentColor"/></svg>\')', maskImage: 'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" fill="currentColor"/></svg>\')' }}></div>
                <div className="w-6 h-6 bg-slate-400 rounded-full cursor-pointer hover:bg-[#e1306c] transition-colors" ></div>
                <div className="w-6 h-6 bg-slate-400 rounded hover:bg-[#0077B5] cursor-pointer text-xs flex items-center justify-center font-bold text-white transition-colors">in</div>
              </div>
            </div>

            <div className="md:col-span-2 md:col-start-7">
              <h4 className="font-extrabold text-slate-900 mb-6 text-[11px] tracking-[0.2em]">PLATFORM</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Digital Newsroom</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">AI Article Engine</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Ad Network</a></li>
                <li><a href="#pricing" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-extrabold text-slate-900 mb-6 text-[11px] tracking-[0.2em]">SUPPORT</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Help Center</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Video Tutorials</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-extrabold text-slate-900 mb-6 text-[11px] tracking-[0.2em]">LEGAL</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-base text-slate-500 hover:text-blue-600 font-medium transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-slate-400 font-medium">
              © 2026 Bharat Digital Publisher. All rights reserved. Built for the Modern Indian Classroom... wait, Newsroom.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
