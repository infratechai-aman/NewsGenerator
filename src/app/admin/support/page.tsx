'use client';

import React from 'react';
import { 
  BookOpen, 
  ChevronRight,
  Search,
  Zap,
  ShieldCheck,
  Globe,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  const faqs = [
    {
      q: "How many newspapers can I generate per month?",
      a: "Your current Enterprise plan allows for up to 90 high-definition newspaper generations per month with full AI research capabilities."
    },
    {
      q: "Can I use my own newspaper logo?",
      a: "Absolutely! Go to the 'Newspaper Generator' or 'Settings' page to upload your custom masthead in PNG or SVG format."
    },
    {
      q: "What languages are supported?",
      a: "We currently support English, Hindi, and Bengali with full AI research and multi-column layout support for all three."
    },
    {
      q: "How do I export to PDF?",
      a: "Once you've planned your layout in the 'Layout Planner', the final step will provide a high-resolution 'Export PDF' button ready for print."
    }
  ];

  return (
    <div className="p-8 pb-32 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-[3rem] p-16 text-center mb-12 relative overflow-hidden shadow-2xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-playfair)' }}>
          How can we help you today?
        </h1>
        <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-10">
          Access our comprehensive guides, documentation, and dedicated support team to maximize your publishing power.
        </p>

        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for articles, guides, or solutions..." 
            className="w-full h-16 pl-16 pr-6 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 text-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Support Cards */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Knowledge Base</h3>
                <p className="text-slate-500 font-medium mb-6">Detailed guides on mastering the AI generator and layout planner.</p>
                <div className="flex items-center text-blue-600 font-bold text-sm tracking-tight">
                  Browse Articles <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 rounded-[2rem] hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Tutorials</h3>
                <p className="text-slate-500 font-medium mb-6">Step-by-step video walkthroughs for creating your first edition.</p>
                <div className="flex items-center text-indigo-600 font-bold text-sm tracking-tight">
                  Watch Videos <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-8 hover:bg-slate-50/50 transition-colors">
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Support */}
        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.5rem] p-8 border-0 shadow-xl shadow-blue-500/20">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold mb-3">Direct Support</h3>
            <p className="text-blue-100 font-medium mb-8">
              Still have questions? Our world-class support engineers are ready to assist you in real-time.
            </p>
            <Button className="w-full h-14 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-lg transition-transform active:scale-95">
              Contact Support
            </Button>
          </Card>

          <Card className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
            <h4 className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">Service Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-slate-700">AI Engine</span>
                </div>
                <span className="text-[10px] font-extrabold text-green-600 bg-green-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-slate-700">API Gateway</span>
                </div>
                <span className="text-[10px] font-extrabold text-green-600 bg-green-100 px-2.5 py-1 rounded-full uppercase tracking-tighter">Operational</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
