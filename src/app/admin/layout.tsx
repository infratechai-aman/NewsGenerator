'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Wand2,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { subscribeToAuthChanges, signOut } from '@/lib/auth';
import { User } from 'firebase/auth';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Newspaper Generator', href: '/admin/generator', icon: Wand2 },
  { label: 'Page Planner', href: '/admin/planner', icon: LayoutDashboard },
  { label: 'My Repository', href: '/admin/repository', icon: FolderOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Help & Support', href: '/admin/support', icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { generatedContent } = useAppStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoadingConfig(false);
      
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const hasContent =
    generatedContent.articles.length > 0 ||
    generatedContent.horoscope !== null ||
    generatedContent.facts !== null;

  if (loadingConfig || !user) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-sans">
         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex font-sans selection:bg-indigo-100">
      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-[#111827] text-white flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
            <Newspaper className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight leading-tight">Press Management Suite</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Premium</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
          
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Status / Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="bg-[#1f2937] rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">System Status</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              AI Engine v3.0 is active for all configured regions.
            </p>
          </div>

          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-[76px] bg-[#fcfdfd] border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
          {/* Page Title Breadcrumb (Dynamic based on route) */}
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {NAV_ITEMS.find((i) => pathname === i.href)?.label || 'Dashboard'}
          </h2>

          {/* Right Header Controls */}
          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-5 w-5" />
              <div className="absolute 0 0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
            </button>
            
            <div className="w-[1px] h-8 bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {user.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Premium</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border-2 border-white shadow-sm ring-1 ring-slate-100 uppercase">
                {user.email?.substring(0, 2) || 'AD'}
              </div>
            </div>

            <Link href="/admin/generator">
              <button className="min-h-[36px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center ml-2 border border-blue-500/50">
                Quick Generate
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
