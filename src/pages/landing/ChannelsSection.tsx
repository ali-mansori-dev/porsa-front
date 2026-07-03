import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle01, Globe02, HelpCircle } from '@untitled-ui/icons-react';
import { MessageSquareCode } from 'lucide-react';

const CHANNELS = [
  {
    name: 'ویجت وب‌سایت',
    bg: 'bg-blue-600',
    icon: <MessageSquareCode className="w-6 h-6 text-white" />,
  },
  {
    name: 'واتساپ',
    bg: 'bg-emerald-500',
    icon: <MessageCircle01 className="w-6 h-6 text-white" />,
  },
  {
    name: 'تلگرام',
    bg: 'bg-sky-500',
    icon: <Globe02 className="w-6 h-6 text-white" />,
  },
  {
    name: 'روبیکا',
    bg: '',
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="50" fill="url(#rg)" />
        <path d="M50 28 L68 38 L68 62 L50 72 L32 62 L32 38 Z" fill="#fff" />
        <circle cx="50" cy="50" r="10" fill="url(#rc)" />
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e3c72" /><stop offset="0.4" stopColor="#ff007f" /><stop offset="1" stopColor="#00c6ff" />
          </linearGradient>
          <linearGradient id="rc" x1="40" y1="40" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff007f" /><stop offset="1" stopColor="#ffb900" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: 'بله',
    bg: 'bg-[#14a86e]',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
        <path d="M50 20 C68 20 82 34 82 50 C82 66 68 80 50 80 C44 80 38 78 33 74 L18 78 L22 63 C18 58 16 52 16 50 C16 34 30 20 50 20 Z" fill="#fff" />
        <ellipse cx="50" cy="48" rx="20" ry="17" fill="#14a86e" />
        <path d="M42 42 C48 38 58 44 58 52 C58 58 54 62 48 62 C40 62 38 52 42 42 Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'تیکت یکپارچه',
    bg: 'bg-slate-800',
    icon: <HelpCircle className="w-6 h-6 text-white" />,
  },
];

export default function ChannelsSection() {
  return (
    <section id="channels" className="py-20 px-4 max-w-6xl mx-auto w-full text-center">
      <div className="max-w-lg mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">حضور همه‌جانبه</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">اتصال به کانال‌های ارتباطی</h2>
        <p className="text-sm text-slate-500">پاسخ هوشمند در بله، روبیکا، تلگرام، واتساپ و وب‌سایت به‌طور همزمان.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {CHANNELS.map((ch, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200 rounded-2xl py-5 px-3 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition"
          >
            <div className={`w-12 h-12 rounded-full ${ch.bg} flex items-center justify-center overflow-hidden shadow-md`}>
              {ch.icon}
            </div>
            <span className="text-xs font-bold text-slate-700 text-center">{ch.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
