import React from 'react';
import { motion } from 'motion/react';
import { GraduationHat01, Tool01, ShoppingBag01, MessageCircle01 } from '@untitled-ui/icons-react';

const VERTICALS = [
  {
    icon: GraduationHat01,
    color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
    title: 'آموزشی و دوره‌ها',
    subtitle: 'آموزشگاه زبان، برنامه‌نویسی، ریاضی...',
    examples: ['شهریه ترم چقدره؟', 'آزمون تعیین سطح دارید؟', 'کلاس آنلاین هم هست؟', 'زمان‌بندی کلاس‌ها چطوره؟'],
  },
  {
    icon: Tool01,
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
    title: 'خدماتی و کلینیک',
    subtitle: 'دندانپزشکی، آرایشگاه، تعمیرات...',
    examples: ['کی نوبت خالی دارید؟', 'بیمه قبول می‌کنید؟', 'هزینه جرم‌گیری چقدره؟', 'لغو نوبت شرایطش چیه؟'],
  },
  {
    icon: ShoppingBag01,
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
    title: 'فروشگاه و آنلاین‌شاپ',
    subtitle: 'محصولات پوستی، لباس، لوازم خانه...',
    examples: ['ارسال به اصفهان دارید؟', 'ضمانت مرجوعی دارید؟', 'پرداخت اقساطی؟', 'کالا کِی می‌رسه؟'],
  },
];

export default function Verticals() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-lg mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">مناسب هر صنف</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">برای کسب‌وکار شما تنظیم می‌شود</h2>
        <p className="text-sm text-slate-500">پایگاه دانش دستیار بر اساس حوزه کاری شما بومی‌سازی می‌شود.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VERTICALS.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl border ${v.border} p-6 space-y-4 text-right hover:shadow-md transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-xl ${v.bg} ${v.color} flex items-center justify-center`}>
              <v.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{v.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{v.subtitle}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">نمونه سوالات مشتریان</p>
              {v.examples.map((ex, ei) => (
                <div key={ei} className={`flex items-center gap-2 ${v.bg} rounded-lg px-2.5 py-1.5`}>
                  <MessageCircle01 className={`w-3 h-3 shrink-0 ${v.color}`} />
                  <span className="text-[11px] text-slate-700 font-semibold">{ex}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
