import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldTick, Clock } from '@untitled-ui/icons-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-900 text-right">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span className="font-extrabold text-white text-base">پرسا</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            دستیار هوشمند کسب‌وکار — پاسخگویی ۲۴ ساعته در تمام کانال‌های ارتباطی ایرانی و بین‌المللی.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">امکانات</h4>
          <ul className="text-[11px] space-y-2">
            <li><a href="#how-it-works" className="hover:text-blue-400 transition">نحوه کارکرد</a></li>
            <li><a href="#features" className="hover:text-blue-400 transition">ویژگی‌های کلیدی</a></li>
            <li><a href="#channels" className="hover:text-blue-400 transition">کانال‌های متصل</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">تعرفه‌ها</h4>
          <ul className="text-[11px] space-y-2">
            <li><Link to="/pricing" className="hover:text-blue-400 transition font-semibold text-blue-400">مشاهده همه پلن‌ها</Link></li>
            <li><Link to="/auth" className="hover:text-blue-400 transition">شروع رایگان</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">اعتماد و امنیت</h4>
          <ul className="text-[11px] space-y-2.5 text-slate-500">
            <li className="flex items-center gap-1.5">
              <ShieldTick className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>حریم خصوصی کسب‌وکار شما محفوظ است</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>۹۹.۹٪ پایداری سرویس</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-slate-900 mt-10 pt-6 text-center text-[10px] text-slate-700">
        © ۱۴۰۵ تمامی حقوق برای پرسا محفوظ است.
      </div>
    </footer>
  );
}
