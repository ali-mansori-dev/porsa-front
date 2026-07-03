import React from 'react';
import { motion } from 'motion/react';
import { XClose, Check } from '@untitled-ui/icons-react';
import { Bot } from 'lucide-react';

const COMPARE_ROWS = [
  { label: 'ساعات پاسخگویی', old: 'فقط ساعات اداری', new: '۲۴ ساعته، ۷ روز هفته' },
  { label: 'درک زبان فارسی', old: 'کلیدواژه‌ای و محدود', new: 'کامل، عامیانه و محاوره‌ای' },
  { label: 'راه‌اندازی اولیه', old: 'هفته‌ها طراحی و کدنویسی', new: 'کمتر از ۵ دقیقه بدون کد' },
  { label: 'هزینه ماهانه', old: 'میلیون‌ها حقوق اپراتور', new: 'از صفر تا ۲ میلیون تومان' },
  { label: 'پاسخ به سوالات جدید', old: 'نیاز به برنامه‌ریزی مجدد', new: 'SMS فوری + یادگیری خودکار' },
  { label: 'پاسخ همزمان', old: 'یک نفر در یک لحظه', new: 'هزاران مکالمه موازی' },
  { label: 'کانال‌های ارتباطی', old: 'یک کانال مجزا', new: 'واتساپ، تلگرام، وب، بله و روبیکا' },
];

interface ComparisonSectionProps {
  onCTA: () => void;
  isLoggedIn: boolean;
}

export default function ComparisonSection({ onCTA, isLoggedIn }: ComparisonSectionProps) {
  return (
    <section id="comparison" className="py-20 px-4 bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">مقایسه</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            پرسا در مقابل روش‌های سنتی
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            بدون کلی حرف — فقط ببینید کجا تفاوت است.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800" dir="rtl">
          <div className="grid grid-cols-3 bg-slate-800">
            <div className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wide">ویژگی</div>
            <div className="p-4 text-center border-r border-slate-700">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wide">روش قدیمی</span>
            </div>
            <div className="p-4 text-center border-r border-slate-700 bg-blue-900/30">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center justify-center gap-1">
                <Bot className="w-3.5 h-3.5" /> پرسا
              </span>
            </div>
          </div>

          {COMPARE_ROWS.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`grid grid-cols-3 border-t border-slate-800 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/60'}`}
            >
              <div className="p-3.5 flex items-center">
                <span className="text-xs font-bold text-slate-300">{row.label}</span>
              </div>
              <div className="p-3.5 border-r border-slate-800 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                  <XClose className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-[11px] text-slate-500 leading-snug">{row.old}</span>
              </div>
              <div className="p-3.5 border-r border-slate-800 bg-blue-900/20 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-200 font-semibold leading-snug">{row.new}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onCTA}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 transition active-scale cursor-pointer"
          >
            {isLoggedIn ? 'ورود به داشبورد' : 'همین الان رایگان امتحان کنید'}
            <span className="rotate-180 inline-block">←</span>
          </button>
        </div>
      </div>
    </section>
  );
}
