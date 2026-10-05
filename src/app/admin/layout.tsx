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
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
  Printer,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { subscribeToAuthChanges, signOut } from '@/lib/auth';
import { User } from 'firebase/auth';

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Newspaper Generator', href: '/admin/generator', icon: Wand2 },
  { label: 'Page Planner', href: '/admin/planner', icon: BookOpen },
  { label: 'My Repository', href: '/admin/repository', icon: FolderOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Help & Support', href: '/admin/support', icon: HelpCircle },
];

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/admin', icon: LayoutDashboard },
  { label: 'Generator', href: '/admin/generator', icon: Wand2 },
  { label: 'Planner', href: '/admin/planner', icon: BookOpen },
  { label: 'Vault', href: '/admin/repository', icon: FolderOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { publication, generatedContent } = useAppStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);

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

  if (loadingConfig || !user) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-sans">
         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col md:flex-row font-sans selection:bg-indigo-100">
      
      {/* Sidebar Navigation (Desktop only) */}
      <aside className="hidden md:flex w-[260px] bg-[#111827] text-white flex-shrink-0 flex-col fixed inset-y-0 left-0 z-50">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-playfair)'}}>Press Management Suite</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Pre-Press Pro</p>
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
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        
        {/* Mobile Top Header (Directly inspired by reference layout) */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/25 text-white flex-shrink-0">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-bold text-slate-900 leading-tight truncate max-w-[200px]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {publication.name || 'Press Management'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Automate · Compose · Print
              </p>
            </div>
          </div>

          {/* Right Header Actions: Notification Bell with Dot + User Avatar */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            <Link href="/admin/settings">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200">
                {user.email?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
            </Link>
          </div>
        </header>

        {/* Desktop Top Header */}
        <header className="hidden md:flex h-[76px] bg-[#fcfdfd] border-b border-slate-200 sticky top-0 z-40 px-8 items-center justify-between shadow-sm">
          {/* Page Title Breadcrumb */}
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {NAV_ITEMS.find((i) => pathname === i.href)?.label || 'Dashboard'}
          </h2>

          {/* Right Header Controls */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <Bell className="h-5 w-5" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
            </button>
            
            <div className="w-[1px] h-8 bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {user.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Pre-Press Pro</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm border-2 border-white shadow-sm ring-1 ring-slate-100 uppercase">
                {user.email?.substring(0, 2) || 'AD'}
              </div>
            </div>

            <Link href="/admin/generator">
              <button className="min-h-[36px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 inline-flex items-center ml-2 border border-blue-500/50">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Quick Generate
              </button>
            </Link>
          </div>
        </header>

        {/* Floating Notification Popover (Both Desktop and Mobile) */}
        {showNotifs && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex justify-end p-4 md:p-6" onClick={() => setShowNotifs(false)}>
            <div 
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 mt-14 md:mt-16 h-fit space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Publishing Notifications</h3>
                </div>
                <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <p className="font-bold text-slate-900">Pre-Press Engine v3.0 Ready</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">High-speed regional broadsheet layout pipeline is active.</p>
                  <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">Just now</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-900">300 DPI Export Configured</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Vector broadsheets will output at commercial offset standard.</p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content with safe padding for bottom bar on mobile */}
        <main className="flex-1 overflow-auto bg-[#f8fafd] pb-24 md:pb-8">
          {children}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar (5 tabs matching reference screenshot) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.06)]">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}>
                  <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-400 stroke-[1.8]'}`} />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
