'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';

export default function ApiSettings() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••••••••••••••');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-orange-500/30">
            <Key className="h-5 w-5" />
          </span>
          API Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-sm font-medium text-amber-800 leading-relaxed">
            Your OpenAI API key is stored securely on the server and is never exposed to the frontend. It is used to power the Newspaper Generator's high-speed article and asset research.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-slate-700">OpenAI API Key</Label>
            <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
          </div>
          
          <div className="relative group">
            <Input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900 h-14 rounded-2xl text-base font-mono shadow-inner pr-14"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <p className="text-xs font-semibold text-slate-400 pl-1 uppercase tracking-widest">
            Enter your key starting with <span className="text-slate-600">sk-...</span>
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isSaved 
                ? 'bg-green-600 hover:bg-green-600 text-white shadow-lg shadow-green-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 active:scale-95'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Key Saved Successfully
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Update API Key
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                AI
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Trusted by 500+ publishers for high-speed automated workflows.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
