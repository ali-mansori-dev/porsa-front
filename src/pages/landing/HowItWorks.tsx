import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from '@untitled-ui/icons-react';
import { File01, MessageSquare01, Globe02 } from '@untitled-ui/icons-react';
import { Button } from '../../components/ui';

const STEPS = [
  {
    num: '۱',
    icon: <File01 className="w-8 h-8 text-white" />,
    bg: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-700',
    time: 'کمتر از ۱ دقیقه',
    title: 'ثبت‌نام و معرفی کسب‌وکار',
    desc: 'نام کسب‌وکار، رنگ سازمانی و حوزه فعالیت خود را وارد کنید. ورود سریع با Google هم پشتیبانی می‌شود.',
  },
  {
    num: '۲',
    icon: <MessageSquare01 className="w-8 h-8 text-white" />,
    bg: 'bg-violet-600',
    badge: 'bg-violet-50 text-violet-700',
    time: '۳ تا ۵ دقیقه',
    title: 'آموزش دستیار هوشمند',
    desc: 'هوش مصنوعی بر اساس نوع کسب‌وکار شما سوالات کلیدی پیشنهاد می‌دهد. پاسخ دهید تا AI یاد بگیرد.',
  },
  {
    num: '۳',
    icon: <Globe02 className="w-8 h-8 text-white" />,
    bg: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700',
    time: 'بلافاصله فعال می‌شود',
    title: 'اتصال و پاسخ‌گویی خودکار',
    desc: 'کد ویجت را به وب‌سایت اضافه کنید یا به تلگرام، بله و روبیکا متصل شوید. همه‌چیز آماده است.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-lg mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">۳ مرحله ساده</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">راه‌اندازی در کمتر از ۵ دقیقه</h2>
        <p className="text-sm text-slate-500">بدون نیاز به دانش فنی. فقط اطلاعات کسب‌وکارتان را وارد کنید.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow text-right"
          >
            <div className={`relative ${step.bg} px-8 py-10 flex items-center justify-center`}>
              {step.icon}
              <span className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black font-mono text-sm text-white">
                {step.num}
              </span>
            </div>
            <div className="p-6 space-y-3">
              <span className={`inline-block text-[10px] font-bold ${step.badge} rounded-full px-2.5 py-1`}>
                ⏱ {step.time}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/auth">
          <Button size="lg" rightIcon={<ArrowLeft className="w-4 h-4" />}>
            همین حالا شروع کن — رایگان
          </Button>
        </Link>
      </div>
    </section>
  );
}
