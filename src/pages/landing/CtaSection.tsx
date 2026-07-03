import React from 'react';
import { Zap, ArrowLeft, Check, BellRinging01 } from '@untitled-ui/icons-react';

interface CtaSectionProps {
  onCTA: () => void;
  isLoggedIn: boolean;
}

export default function CtaSection({ onCTA, isLoggedIn }: CtaSectionProps) {
  return (
    <section className="py-24 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-2 rounded-full border border-blue-500/20">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          شروع کاملاً رایگان — بدون کارت اعتباری
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
          همین امروز دستیار هوشمند کسب‌وکار خود را بسازید
        </h2>

        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          از پلن رایگان با ۵۰,۰۰۰ توکن هدیه شروع کنید. هیچ چیز پنهانی نیست. هر زمان آماده شدید ارتقا دهید.
        </p>

        <button
          onClick={onCTA}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl px-10 py-4 shadow-xl shadow-blue-500/20 transition active-scale cursor-pointer"
        >
          {isLoggedIn ? 'ورود به محیط کاربری' : 'ساخت رایگان دستیار'}
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />بدون نیاز به کارت اعتباری</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />۵۰,۰۰۰ توکن هدیه اولیه</span>
          <span className="flex items-center gap-1.5"><BellRinging01 className="w-3.5 h-3.5 text-amber-400" />SMS اطلاع‌رسانی فوری</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />آماده‌سازی در ۵ دقیقه</span>
        </div>
      </div>
    </section>
  );
}
