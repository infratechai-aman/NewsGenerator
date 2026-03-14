'use client';

import React from 'react';
import AccountSettings from '@/components/dashboard/AccountSettings';
import ApiSettings from '@/components/dashboard/ApiSettings';
import GlobalSettings from '@/components/dashboard/GlobalSettings';

export default function SettingsPage() {
  return (
    <div className="p-8 pb-32 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-[#111827] mb-3 tracking-tighter" style={{ fontFamily: 'var(--font-playfair)' }}>
          Settings & Configuration
        </h1>
        <p className="text-lg font-medium text-slate-500 max-w-2xl">
          Manage your enterprise integration, billing, and publication defaults from one central hub.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        <div className="xl:col-span-1 border-r border-slate-100 pr-0 xl:pr-10 space-y-10">
          <AccountSettings />
        </div>
        <div className="xl:col-span-2 space-y-10">
          <ApiSettings />
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <GlobalSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
