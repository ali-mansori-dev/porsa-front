import React from 'react';
import { motion } from 'motion/react';
import { Zap, BarChart03, Clock, BellRinging01 } from '@untitled-ui/icons-react';
import { Brain, Smartphone } from 'lucide-react';

const FEATURES = [
  { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', title: 'هوش مصنوعی اختصاصی', desc: 'AI با داده‌های کسب‌وکار شما آموزش می‌بیند و مانند یک کارمند حرفه‌ای پاسخ می‌دهد.' },
  { icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'چند کانال، یک مدیریت', desc: 'واتساپ، تلگرام، روبیکا، بله و ویجت وب‌سایت از یک داشبورد متمرکز.' },
  { icon: BarChart03, color: 'text-violet-600', bg: 'bg-violet-50', title: 'آمار و تحلیل مکالمات', desc: 'ببینید مشتریان بیشتر چه می‌پرسند تا پایگاه دانش خود را بهینه کنید.' },
  { icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50', title: 'پاسخگویی ۲۴ ساعته', desc: 'نیمه‌شب، تعطیلات، جمعه‌ها — دستیار هرگز آفلاین نمی‌شود.' },
  { icon: Smartphone, color: 'text-rose-500', bg: 'bg-rose-50', title: 'بدون اپ جداگانه', desc: 'مدیریت کامل از مرورگر موبایل. هر زمان، هرجایی وضعیت مکالمات را ببینید.' },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="bg-white border-y border-slate-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-lg mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">همه امکانات</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">چرا پرسا را انتخاب می‌کنند؟</h2>
          <p className="text-sm text-slate-500">ابزارهای کامل برای پاسخگویی حرفه‌ای، در یک پلتفرم.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* SMS highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            id="sms-highlight"
            className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-right overflow-hidden"
          >
            <div className="absolute -top-8 -left-8 w-28 h-28 bg-amber-200/30 rounded-full blur-2xl" />
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 relative">
              <BellRinging01 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-slate-900 text-sm">اطلاع‌رسانی SMS هوشمند</h3>
              <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">ویژه</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              مشتری سوالی پرسید که جواب ندارد؟ <b className="text-slate-800">فوری SMS</b> می‌گیرید. هیچ سوالی بی‌پاسخ نمی‌ماند.
            </p>
          </motion.div>

          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.07 }}
              className="bg-white border border-slate-150 rounded-2xl p-6 text-right hover:shadow-md transition-shadow space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
