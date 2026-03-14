'use client';

import React, { useCallback, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export default function PublicationIdentity() {
  const { publication, setPublication } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          setPublication({ mastheadLogo: data.url });
        }
      } catch {
        // Fallback: use object URL
        const url = URL.createObjectURL(file);
        setPublication({ mastheadLogo: url });
      }
    },
    [setPublication]
  );

  return (
    <Card className="bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/30">
            P
          </span>
          Publication Identity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        {/* Masthead Logo */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Masthead Logo</Label>
          <div
            className="relative border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 group hover:shadow-inner"
            onClick={() => fileInputRef.current?.click()}
          >
            {publication.mastheadLogo ? (
              <div className="relative inline-block">
                <img
                  src={publication.mastheadLogo}
                  alt="Masthead Logo"
                  className="max-h-24 mx-auto object-contain rounded-md shadow-sm bg-white p-2 border border-slate-100"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPublication({ mastheadLogo: null });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-200 group-hover:text-blue-500 transition-all">
                  <ImageIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload your masthead logo
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB (Transparent recommended)</p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        {/* Publication Name */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Publication Name</Label>
          <Input
            value={publication.name}
            onChange={(e) => setPublication({ name: e.target.value })}
            placeholder="The Daily Chronicle"
            className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl text-base font-medium shadow-sm transition-all focus:bg-white"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Publication Date</Label>
          <Input
            type="date"
            value={publication.date}
            onChange={(e) => setPublication({ date: e.target.value })}
            className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900 h-12 rounded-xl text-base font-medium shadow-sm transition-all focus:bg-white"
          />
        </div>

        {/* Volume and Issue in a row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Volume</Label>
            <Input
              value={publication.volume}
              onChange={(e) => setPublication({ volume: e.target.value })}
              placeholder="1"
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl text-base font-medium shadow-sm transition-all focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Issue</Label>
            <Input
              value={publication.issue}
              onChange={(e) => setPublication({ issue: e.target.value })}
              placeholder="1"
              className="bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl text-base font-medium shadow-sm transition-all focus:bg-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
