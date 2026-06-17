import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../services/http';
import { motion } from 'motion/react';
import {
  Check,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  BellRing,
  MessageSquare,
  Globe2,
  ShieldCheck,
  Crown,
  Gift,
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    badge: 'رایگان',
    name: 'پلن آزمایشی',
    description: 'برای آشنایی با پرسا و تست قابلیت‌ها',
    price: 0,
    priceLabel: 'رایگان',
    priceSub: 'برای همیشه',
    highlight: false,
    dark: false,
    icon: Gift,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    ctaText: 'شروع رایگان',
    ctaStyle: 'border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800',
    features: [
      { text: '۵۰,۰۰۰ توکن هدیه (یک‌بار)', ok: true },
      { text: '۱ کانال ارتباطی (ویجت وب)', ok: true },
      { text: 'حداکثر ۵ سوال و پاسخ', ok: true },
      { text: 'ورود با گوگل', ok: true },
      { text: 'اطلاع‌رسانی SMS', ok: false },
      { text: 'کانال‌های واتس‌اپ / تلگرام', ok: false },
      { text: 'آمار و تحلیل مکالمات', ok: false },
    ],
  },
  {
    id: 'starter',
    badge: 'پلن پایه',
    name: 'کسب‌وکار کوچک',
    description: 'مناسب آنلاین‌شاپ‌ها، آموزشگاه‌های کوچک و کلینیک‌های تک‌نفره',
    price: 400000,
    priceLabel: '۴۰۰,۰۰۰',
    priceSub: 'تومان / ماه',
    highlight: false,
    dark: false,
    icon: MessageSquare,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    ctaText: 'شروع با پلن پایه',
    ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
    features: [
      { text: '۱۵۰,۰۰۰ توکن ماهانه', ok: true },
      { text: '۲ کانال همزمان (وب + بله)', ok: true },
      { text: 'سوال و پاسخ نامحدود', ok: true },
      { text: 'اطلاع‌رسانی SMS', ok: true },
      { text: 'آمار پایه مکالمات', ok: true },
      { text: 'کانال تلگرام و روبیکا', ok: false },
      { text: 'پشتیبانی اختصاصی', ok: false },
    ],
  },
  {
    id: 'growth',
    badge: 'محبوب‌ترین',
    name: 'کسب‌وکار متوسط',
    description: 'بهترین گزینه برای کلینیک‌ها، آموزشگاه‌ها و کسب‌وکارهای رو به رشد',
    price: 1000000,
    priceLabel: '۱,۰۰۰,۰۰۰',
    priceSub: 'تومان / ماه',
    highlight: true,
    dark: true,
    icon: Zap,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    ctaText: 'شروع با پلن رشد',
    ctaStyle: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30',
    features: [
      { text: '۵۰۰,۰۰۰ توکن ماهانه', ok: true },
      { text: '۴ کانال همزمان (وب، بله، روبیکا، تلگرام)', ok: true },
      { text: 'سوال و پاسخ نامحدود', ok: true },
      { text: 'اطلاع‌رسانی SMS اولویت‌دار', ok: true },
      { text: 'آمار کامل و نمودار مکالمات', ok: true },
      { text: 'پشتیبانی واتس‌اپ و تلگرام', ok: true },
      { text: 'سرور اولویت‌دار', ok: true },
    ],
  },
  {
    id: 'pro',
    badge: 'پلن حرفه‌ای',
    name: 'کسب‌وکار بزرگ',
    description: 'برای هولدینگ‌ها، زنجیره‌های خدماتی و پلتفرم‌های پرمخاطب',
    price: 2000000,
    priceLabel: '۲,۰۰۰,۰۰۰',
    priceSub: 'تومان / ماه',
    highlight: false,
    dark: false,
    icon: Crown,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    ctaText: 'شروع با پلن حرفه‌ای',
    ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
    features: [
      { text: 'توکن نامحدود (کلید اختصاصی)', ok: true },
      { text: 'تمام کانال‌ها + واتس‌اپ', ok: true },
      { text: 'آپلود فایل PDF / اکسل / ورد', ok: true },
      { text: 'SMS اطلاع‌رسانی VIP', ok: true },
      { text: 'آمار پیشرفته + گزارش هفتگی', ok: true },
      { text: 'پشتیبانی ۲۴ ساعته تلفنی اختصاصی', ok: true },
      { text: 'سرور اختصاصی جداگانه', ok: true },
    ],
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    window.scrollTo(0, 0);
  }, []);

  const handleCTA = (planId: string) => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900" dir="rtl">

      {/* Header — solid bg, no backdrop-blur to prevent flicker */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center gap-1 shadow-md shadow-blue-500/15 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-2 h-2 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">پرسا</span>
              <span className="text-[9px] text-slate-400 font-medium mt-0.5">دستیار هوشمند کسب‌وکار</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition">صفحه اصلی</Link>
            <Link to="/#how-it-works" className="hover:text-blue-600 transition">نحوه کارکرد</Link>
            <span className="text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5">تعرفه‌ها</span>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 transition text-xs font-semibold"
              >
                داشبورد
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline text-slate-600 hover:text-slate-900 font-medium text-sm">ورود</Link>
                <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition">
                  شروع رایگان
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 text-center space-y-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full border border-emerald-200"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>۵۰,۰۰۰ توکن هدیه در پلن رایگان — بدون کارت اعتباری</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          تعرفه‌های پرسا
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-slate-500 leading-relaxed"
        >
          از پلن رایگان شروع کنید. هر زمان که آماده شدید، ارتقا دهید.
        </motion.p>
      </section>

      {/* Pricing cards */}
      <section className="px-4 max-w-7xl mx-auto w-full pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`relative rounded-2xl flex flex-col text-right transition-all duration-300 ${
                  plan.dark
                    ? 'bg-slate-900 text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/10'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black tracking-widest text-white py-1 px-5 rounded-full whitespace-nowrap shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1 gap-6">

                  {/* Plan header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl ${plan.iconBg} ${plan.iconColor} flex items-center justify-center`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      {!plan.highlight && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.dark ? 'text-blue-400' : 'text-slate-400'}`}>
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className={`text-base font-extrabold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-[11px] leading-relaxed mt-1 ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={`py-4 border-y ${plan.dark ? 'border-slate-800' : 'border-slate-100'}`}>
                    {plan.price === 0 ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-3xl font-extrabold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                          رایگان
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-extrabold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                          {plan.priceLabel}
                        </span>
                        <span className={`text-xs font-semibold ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {plan.priceSub}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5">
                        {f.ok ? (
                          <Check className={`w-3.5 h-3.5 shrink-0 ${plan.dark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        ) : (
                          <X className={`w-3.5 h-3.5 shrink-0 ${plan.dark ? 'text-slate-600' : 'text-slate-300'}`} />
                        )}
                        <span className={`text-xs ${
                          f.ok
                            ? plan.dark ? 'text-slate-200 font-semibold' : 'text-slate-700 font-semibold'
                            : plan.dark ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleCTA(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition active-scale cursor-pointer ${plan.ctaStyle}`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SMS callout banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-right"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <p className="text-sm font-bold text-amber-900">اطلاع‌رسانی SMS — هیچ سوالی از دست نمی‌رود</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              اگر مشتری سوالی بپرسد که پاسخ آن را تنظیم نکرده باشید، پرسا <b>فوراً یک پیامک SMS</b> به شماره کسب‌وکار شما می‌فرستد تا هیچ فرصتی از دست نرود.
            </p>
          </div>
          <button
            onClick={() => handleCTA('starter')}
            className="shrink-0 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition active-scale cursor-pointer whitespace-nowrap"
          >
            فعال‌سازی SMS
          </button>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              شروع کاملاً رایگان
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            همین امروز دستیار هوشمند کسب‌وکار خود را بسازید
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            از پلن رایگان شروع کنید. ۵۰,۰۰۰ توکن هدیه. بدون کارت اعتباری. هر زمان آماده شدید ارتقا دهید.
          </p>
          <button
            onClick={() => handleCTA('free')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 transition active-scale cursor-pointer"
          >
            <span>رایگان شروع کنید</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-10 px-4 border-t border-slate-900 text-right">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 relative shrink-0">
              <div className="absolute bottom-0.5 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span className="font-extrabold text-white text-sm">پرسا</span>
          </Link>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/" className="hover:text-blue-400 transition">صفحه اصلی</Link>
            <Link to="/auth" className="hover:text-blue-400 transition">ورود / ثبت‌نام</Link>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              امنیت و حریم خصوصی
            </span>
          </div>

          <p className="text-[11px]">© ۱۴۰۵ پرسا — تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  );
}
