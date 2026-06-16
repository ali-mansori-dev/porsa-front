import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Landmark,
  PiggyBank,
  Zap,
  TrendingDown,
  RefreshCw,
  Coins,
  ShieldAlert,
  Sliders,
  ChevronRight,
  TrendingUp,
  LineChart,
  ChevronLeft
} from 'lucide-react';
import { api } from '../../services/api';
import { TokenUsage, TokenUsageHistory } from '../../types';
import { DashboardOutletContext } from '../../components/layout/DashboardLayout';
import TokenProgressRing from '../../components/common/TokenProgressRing';

export default function Tokens() {
  const { business, tokenUsage, refetchWorkspace } = useOutletContext<DashboardOutletContext>();
  
  const [maxTokens, setMaxTokens] = useState(1000);
  const [savingLimit, setSavingLimit] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(3); // PAGINATION: "Load More" default to 3 items on mobile
  
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      setMaxTokens(business.maxTokens);
    }
  }, [business]);

  const handleSaveMaxTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLimit(true);
    try {
      await api.business.update(business.id, { maxTokens });
      await refetchWorkspace();
      setToast('سقف مجاز مصرف توکن برای پاسخ با موفقیت ذخیره شد.');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره‌سازی محدودیت توکن.');
    } finally {
      setSavingLimit(false);
    }
  };

  const loadMoreHistory = () => {
    setHistoryLimit((prev) => Math.min(prev + 5, tokenUsage?.history.length || 10));
  };

  const getUsagePercentage = () => {
    if (!tokenUsage) return 0;
    return (tokenUsage.current / tokenUsage.limit) * 100;
  };

  return (
    <div className="space-y-6 pb-12 text-right animate-in fade-in duration-200" dir="rtl">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900 border border-slate-800 text-white font-semibold text-xs rounded-xl shadow-lg transition select-none">
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-905 tracking-tight flex items-center gap-2 justify-start">
            <Landmark className="w-6 h-6 text-blue-600 ml-1 shrink-0" />
            <span>میزان مصرف توکن و جزئیات شارژ</span>
          </h2>
          <p className="text-xs text-slate-400">
            سهمیه‌های مصرفی کسر شده از هوش مصنوعی را نظارت کرده و سوابق مالی پرتال را بررسی کنید.
          </p>
        </div>
      </div>

      {/* HERO SECTION BLOCK - PROGRESS RING IN CENTER UPPER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Ring Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center md:col-span-1">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest leading-none mb-6 text-center">بودجه کل دوره فرضی جاری</h3>
          {tokenUsage && (
            <TokenProgressRing current={tokenUsage.current} limit={tokenUsage.limit} />
          )}
          {tokenUsage && (
            <p className="text-[10px] text-slate-400 font-bold mt-4 text-center">
              محدودیت دوره ماهیانه در تاریخ <b className="text-slate-800">{tokenUsage.resetDate}</b> تمدید خواهد شد
            </p>
          )}
        </div>

        {/* Max Tokens settings controllers */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 md:col-span-2 space-y-5 flex flex-col justify-between text-right">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-650 uppercase tracking-wider justify-start">
              <Sliders className="w-4 h-4 text-blue-500 ml-1.5" />
              <span>فیلتر و کنترل سهمیه پاسخ‌ها</span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 text-right">صرفه‌جویی خودکار در بودجه مکالمات</h3>
            <p className="text-[11px] text-slate-450 leading-relaxed font-semibold text-right">
              با تنظیم سقف مجاز، به ربات هوش مصنوعی دستور دهید که پاسخ‌ها را خلاصه‌تر نگه دارد. پاسخ‌های کوتاه‌تر، توکن کمتری مصرف کرده و ماندگاری بودجه دوره پاسخ‌گویی شما را تا هزاران پیام افزایش می‌دهند.
            </p>
          </div>

          <form onSubmit={handleSaveMaxTokens} className="space-y-4 pt-2 text-right">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">حداکثر طول یا سقف پاسخ برای هر پیام:</span>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-sm" dir="ltr">{maxTokens} tokens</span>
            </div>
            
            {/* Slider with customized thumb size is responsive */}
            <input
              type="range"
              min="200"
              max="4000"
              step="50"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            />
            
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-0.5 select-none" dir="rtl">
              <span>۲۰۰ (بسیار کوتاه و خلاصه)</span>
              <span>۲۰۰۰ (پاسخ مفصل)</span>
              <span>۴۰۰۰ (طولانی و با جزئیات جامع)</span>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingLimit || maxTokens === business?.maxTokens}
                className="w-full sm:w-auto bg-slate-950 border border-transparent hover:bg-slate-850 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 text-white font-bold h-11 px-6 rounded-xl text-xs active-scale transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                {savingLimit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>بروزرسانی محدودیت طول پاسخ</span>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* UPGRADE PREMIUM GRADIENT HIGHLIGHT BAR */}
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md shadow-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden text-right">
        {/* Subtle grid mesh effects */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-start"><Coins className="w-24 h-24" /></div>
        <div className="space-y-1.5 z-10 text-right">
          <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5 leading-none justify-start">
            <Zap className="w-5 h-5 text-amber-200 shrink-0 fill-amber-200 ml-1.5" />
            <span>نیاز به سهمیه یا پاسخ‌های بیشتری دارید؟ ارتقا به پنل نامحدود</span>
          </h3>
          <p className="text-[11px] text-blue-100 max-w-xl font-semibold leading-relaxed text-right">
            کلیه محدودیت‌های تعداد پیام و سهمیه توکن‌ها را بردارید؛ دستیار هوشمند با سرعت چند برابری به کار پرداخته و می‌توانید بی‌نهایت کانال پشتیبانی فعال کنید.
          </p>
        </div>
        <button
          onClick={() => alert('درگاه رسمی بانکی به زودی فعال خواهد شد! این دکمه به سامانه متصل خواهد گردید.')}
          className="bg-white hover:bg-slate-50 text-blue-600 font-extrabold text-xs h-10 px-5 rounded-xl shrink-0 cursor-pointer active-scale shadow-sm z-10 self-start sm:self-center flex items-center gap-1"
        >
          <span>ارتقای سریع حساب</span>
          <ChevronLeft className="w-4 h-4 shrink-0 mr-1" />
        </button>
      </div>

      {/* DAILY USAGE TIMELINES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 text-right">
        <div className="flex justify-between items-center pb-2 border-b border-b-slate-100 text-right">
          <div className="text-right">
            <h3 className="font-extrabold text-sm text-slate-850 flex items-center gap-1.5 justify-start"><TrendingUp className="w-4.5 h-4.5 text-blue-600 ml-1.5" /> <span>تاریخچه‌ و گزارش مصرف روزانه</span></h3>
            <p className="text-[11px] text-slate-400">ریز تراکنش‌های تفکیک‌شده از حجم گفتگوها و بودجه سوخت توکن‌ها</p>
          </div>
        </div>

        {tokenUsage && (
          <div className="mt-4 text-right">
            
            {/* MOBILE: STACKED CARD MODULES */}
            <div className="block md:hidden space-y-3">
              {tokenUsage.history.slice(0, historyLimit).map((h, index) => (
                <div key={index} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1 text-right">
                    <span className="text-[11px] font-bold text-slate-805 text-right">{h.date}</span>
                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 justify-start">
                      <Coins className="w-3.5 h-3.5 text-slate-400 ml-1" />
                      <span>{h.count.toLocaleString()} واحد توکن کسر شد</span>
                    </p>
                  </div>
                  <div className="text-left font-mono">
                    <span className="block font-bold text-xs text-slate-905">{h.conversations}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">گفتگو</span>
                  </div>
                </div>
              ))}

              {/* PAGINATION load triggers */}
              {tokenUsage.history.length > historyLimit && (
                <button
                  onClick={loadMoreHistory}
                  className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs text-slate-605 active-scale shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>بارگذاری رکوردهای قدیمی‌تر</span>
                </button>
              )}
            </div>

            {/* DESKTOP: RICH TABLE GRID ROWS */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs font-semibold text-right text-slate-500" dir="rtl">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 pb-2.5">
                    <th className="py-2.5 text-right">تاریخ تراکنش</th>
                    <th className="text-right">واحد توکن مورد استفاده</th>
                    <th className="text-right">تعداد گفتگوهای برقرار شده</th>
                    <th className="text-left">وضعیت همگام‌سازی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tokenUsage.history.map((h, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-bold text-slate-900 text-right">{h.date}</td>
                      <td className="font-semibold text-slate-600 text-right">{h.count.toLocaleString()} توکن مصرفی</td>
                      <td className="font-bold text-slate-800 text-right">{h.conversations} گفتگو با سرور</td>
                      <td className="text-left">
                        <span className="inline-flex px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-full text-[9px] font-bold">
                          همگام‌سازی موفق
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
export type { TokenUsage, TokenUsageHistory };
