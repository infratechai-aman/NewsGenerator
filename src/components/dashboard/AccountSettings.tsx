'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, BadgeCheck, CreditCard } from 'lucide-react';

export default function AccountSettings() {
  return (
    <Card className="bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] overflow-hidden">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-800 tracking-tight">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/30">
            <User className="h-5 w-5" />
          </span>
          Account & Billing
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 px-8 pb-8">
        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 border-2 border-white shadow-sm">
            AT
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 leading-none mb-1.5 flex items-center gap-2">
              Aman Talukdar
              <BadgeCheck className="h-5 w-5 text-blue-500" />
            </h4>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[10px]">Premium Publisher</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Full Name</Label>
              <Input defaultValue="Aman Talukdar" className="bg-white border-slate-200 h-12 rounded-xl text-base font-medium shadow-sm transition-all focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Email Address</Label>
              <Input defaultValue="aman@example.com" disabled className="bg-slate-50 border-slate-200 h-12 rounded-xl text-base font-medium text-slate-400 cursor-not-allowed" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border-2 border-blue-100 bg-blue-50/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-blue-900 tracking-tight">Active Plan: Enterprise</h5>
                  <p className="text-xs font-bold text-blue-600/70 uppercase tracking-widest">₹9,000 / Year • 90 Generations</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-extrabold rounded-full uppercase tracking-tighter shadow-sm">Active</span>
            </div>
            
            <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '33%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-blue-800/60 uppercase tracking-widest">
              <span>30 Used</span>
              <span>90 Total Units</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
            Edit Profile
          </Button>
          <Button className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95">
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
