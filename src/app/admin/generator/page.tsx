'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import PublicationIdentity from '@/components/dashboard/PublicationIdentity';
import GlobalSettings from '@/components/dashboard/GlobalSettings';
import AssetLibrary from '@/components/dashboard/AssetLibrary';
import ContentGenerator from '@/components/dashboard/ContentGenerator';
import { Button } from '@/components/ui/button';
import {
  Newspaper,
  Settings,
  ImageIcon,
  Sparkles,
  Layout,
  FileOutput,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  { id: 0, label: 'Configure', icon: Settings, desc: 'Set up your publication' },
  { id: 1, label: 'Assets', icon: ImageIcon, desc: 'Upload images & ads' },
  { id: 2, label: 'Generate', icon: Sparkles, desc: 'AI content pipeline' },
  { id: 3, label: 'Plan Layout', icon: Layout, desc: 'Arrange page layouts' },
  { id: 4, label: 'Export PDF', icon: FileOutput, desc: 'Render & download' },
];

export default function DashboardPage() {
  const { activeStep, setActiveStep, publication, generatedContent } =
    useAppStore();

  const hasContent =
    generatedContent.articles.length > 0 ||
    generatedContent.horoscope !== null ||
    generatedContent.facts !== null;

  return (
    <div className="pb-24">
      {/* Step Progress Container */}
      <div className="bg-white border-b border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-[1.02]'
                      : isCompleted
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100/50'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span>{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        </div>
      </div>

      {/* Step Content Wrapper */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mx-auto">
          {activeStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PublicationIdentity />
                <GlobalSettings />
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setActiveStep(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all font-bold h-12 px-8 rounded-xl text-base"
                >
                  Next: Upload Assets
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AssetLibrary />
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep(0)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 px-8 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setActiveStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all font-bold h-12 px-8 rounded-xl text-base"
                >
                  Next: Generate Content
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ContentGenerator />
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveStep(1)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold h-12 px-8 rounded-xl"
                >
                  Back
                </Button>
                <Link href="/admin/planner">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all font-bold h-12 px-8 rounded-xl text-base">
                    Next: Plan Layout
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 text-center py-12">
              <Layout className="h-16 w-16 mx-auto text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900">
                Page Planner
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Use the full-screen Page Planner to arrange your content blocks
                into newspaper page layouts.
              </p>
              <Link href="/admin/planner">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 transition-all font-semibold"
                >
                  <Layout className="h-5 w-5 mr-2" />
                  Open Page Planner
                </Button>
              </Link>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6 text-center py-12">
              <FileOutput className="h-16 w-16 mx-auto text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900">
                Export PDF
              </h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Once you have arranged your layout in the Page Planner, you can
                generate and download the final newspaper PDF.
              </p>
              <Link href="/admin/planner">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md shadow-blue-500/20 transition-all font-semibold"
                >
                  Go to Page Planner to Export
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
