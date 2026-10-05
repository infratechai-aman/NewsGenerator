'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@press.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setIsLoading(false);
    } else {
      router.push('/admin');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@press.com');
    setPassword('Password123!');
    setIsLoading(true);
    setError('');
    const { error: signInError } = await signIn('admin@press.com', 'Password123!');
    if (signInError) {
      setError(signInError);
      setIsLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Soft Ambient Background Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-400/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Top Floating App Icon matching reference */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 p-0.5 shadow-xl shadow-blue-500/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden p-2.5">
              <div className="w-full h-full rounded-lg bg-blue-50 flex flex-col items-center justify-center gap-1 border border-blue-100">
                <div className="w-5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-4 h-1 rounded-full bg-blue-300" />
                <div className="w-5 h-1 rounded-full bg-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] border border-slate-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Sign in to Press Management Suite
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                  placeholder="admin@press.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Preset Admin Credentials Box */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Admin Credentials
              </div>
              <div className="space-y-1 text-xs text-slate-600 font-mono">
                <div><span className="text-slate-400">ID:</span> <span className="font-bold text-slate-800">admin@press.com</span></div>
                <div><span className="text-slate-400">Pass:</span> <span className="font-bold text-slate-800">Password123!</span></div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="mt-3 w-full py-2 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Quick 1-Click Login
              </button>
            </div>
          </div>

        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => router.push('/')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            ← Back to Press Management Suite Home
          </button>
        </div>

      </div>
    </div>
  );
}
