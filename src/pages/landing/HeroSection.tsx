import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from '@untitled-ui/icons-react';
import { Sparkles } from 'lucide-react';
import { getToken } from '../../services/http';
import ChatSimulator from './ChatSimulator';

export default function HeroSection() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/auth');

  return (
    <>
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 text-center lg:text-right space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold py-2 px-4 rounded-full border border-blue-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            پشتیبانی هوشمند ۲۴/۷ برای کسب‌وکار ایرانی
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            دستیار هوشمندی که{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-indigo-500">
              مثل بهترین کارمند شما
            </span>{' '}
            پاسخ می‌دهد
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            یک‌بار اطلاعات کسب‌وکارتان را وارد کنید. پرسا ۲۴ ساعته در واتساپ، تلگرام و سایت شما پاسخ می‌دهد.
            اگر سوالی بدون جواب ماند، <span className="font-semibold text-slate-700">فوری SMS دریافت می‌کنید.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm transition-all active-scale cursor-pointer"
            >
              {isLoggedIn ? 'ورود به داشبورد' : 'رایگان شروع کنید'}
              <ArrowLeft className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl px-6 py-3.5 text-center text-sm flex items-center justify-center gap-2 transition"
            >
              نحوه کارکرد را ببینید
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-1.5 text-xs text-slate-500"
          >
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />بدون کدنویسی</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />پلن رایگان دائمی</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />SMS اطلاع‌رسانی</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full max-w-md relative z-10"
        >
          <ChatSimulator />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '۵۰۰+', label: 'کسب‌وکار فعال', color: 'text-blue-600' },
            { value: '۱M+', label: 'پاسخ هوشمند داده شده', color: 'text-blue-600' },
            { value: '۲۴/۷', label: 'پاسخگویی بدون وقفه', color: 'text-emerald-600' },
            { value: 'SMS', label: 'اطلاع‌رسانی فوری', color: 'text-amber-600' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="space-y-1"
            >
              <span className={`block text-2xl font-extrabold ${s.color}`}>{s.value}</span>
              <span className="block text-xs font-bold text-slate-400">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
