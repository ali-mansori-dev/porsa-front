import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../services/http';
import { motion } from 'motion/react';
import {
  Menu, X, ArrowLeft, Bot, Sparkles, Zap, Globe2, Clock,
  MessageCircle, HelpCircle, ShieldCheck, Check, BellRing,
  Brain, BarChart3, Smartphone, GraduationCap, Wrench,
  ShoppingBag, MessageSquareCode, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { File01, MessageSquare01, Globe02 } from '@untitled-ui/icons-react';
import { Button } from '../components/ui';

// ─────────────────────────────────────────
// Chat simulator data
// ─────────────────────────────────────────
const SCENARIOS = [
  {
    id: 0,
    title: 'آموزشگاه زبان آیلتس',
    color: '#2563eb',
    messages: [
      { sender: 'user', text: 'سلام! دوره آمادگی آیلتس فشرده چه زمانی شروع میشه؟' },
      { sender: 'bot', text: 'سلام دوست عزیز! دوره فشرده آیلتس از دوشنبه هفته آینده آغاز میشه. کلاس‌ها روزهای زوج ساعت ۱۷ تا ۲۰ هست. 🎓' },
      { sender: 'user', text: 'هزینه‌اش چقدره و شرایط پرداخت چطوره؟' },
      { sender: 'bot', text: 'شهریه هر ترم ۲,۵۰۰,۰۰۰ تومانه با امکان پرداخت اقساطی در ۲ نوبت. لینک ثبت‌نام برام بفرستم؟ 📝' },
    ],
  },
  {
    id: 1,
    title: 'کلینیک دندانپزشکی',
    color: '#059669',
    messages: [
      { sender: 'user', text: 'سلام، جرم‌گیری دندان هم انجام می‌دین؟' },
      { sender: 'bot', text: 'بله! جرم‌گیری تخصصی توسط کادر مجرب همه‌روزه بجز تعطیلات انجام میشه. 🦷' },
      { sender: 'user', text: 'کی نوبت خالی دارید؟ پنجشنبه ممکنه؟' },
      { sender: 'bot', text: 'پنجشنبه ساعت ۱۱:۳۰ نوبت خالی داریم. ثبت کنم؟ پیامک تأیید با لوکیشن می‌فرستیم 🗓️' },
    ],
  },
  {
    id: 2,
    title: 'فروشگاه محصولات پوستی',
    color: '#d97706',
    messages: [
      { sender: 'user', text: 'کرم آبرسان گیاهی موجود دارید؟ ارسال به اصفهان می‌کنید؟' },
      { sender: 'bot', text: 'بله! سرم‌های آبرسان ارگانیک موجوده. ارسال به اصفهان ۲ روز کاریه و بالای ۵۰۰ هزار رایگانه 📦' },
      { sender: 'user', text: 'اگه به پوستم نساخت می‌تونم مرجوع کنم؟' },
      { sender: 'bot', text: 'بله! ضمانت مرجوعی ۳۰ روزه بی‌قید‌وشرط داریم. لینک پرداخت امن بفرستم؟ 🛍️' },
    ],
  },
];

function ChatSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scenario = SCENARIOS[activeTab];

  useEffect(() => {
    setVisibleMessages([]);
    setIsTyping(false);
    let active = true;

    const run = async () => {
      await new Promise(r => setTimeout(r, 600));
      if (!active) return;
      setVisibleMessages([scenario.messages[0]]);
      await new Promise(r => setTimeout(r, 1200));
      if (!active) return;
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1600));
      if (!active) return;
      setIsTyping(false);
      setVisibleMessages(p => [...p, scenario.messages[1]]);
      await new Promise(r => setTimeout(r, 1800));
      if (!active) return;
      setVisibleMessages(p => [...p, scenario.messages[2]]);
      await new Promise(r => setTimeout(r, 1200));
      if (!active) return;
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1600));
      if (!active) return;
      setIsTyping(false);
      setVisibleMessages(p => [...p, scenario.messages[3]]);
    };

    run();
    return () => { active = false; };
  }, [activeTab, trigger]);

  useEffect(() => {
    const t = setInterval(() => setActiveTab(p => (p + 1) % SCENARIOS.length), 12000);
    return () => clearInterval(t);
  }, [trigger]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [visibleMessages, isTyping]);

  const selectTab = (i: number) => { setActiveTab(i); setTrigger(p => p + 1); };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Tab switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1" dir="rtl">
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => selectTab(i)}
            className={`flex-1 py-1.5 px-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              activeTab === i ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Phone mockup */}
      <div className="relative border border-slate-200 rounded-3xl bg-white p-3 shadow-xl shadow-slate-200/60">
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex flex-col h-[300px] sm:h-[320px]">
          {/* Header bar */}
          <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: scenario.color }} dir="rtl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-black">AI</div>
              <div>
                <p className="text-[11px] font-extrabold text-white leading-none">{scenario.title}</p>
                <span className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[9px] text-white/80 font-semibold">آنلاین</span>
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-white/20 text-white px-2 py-0.5 rounded-md font-bold">پرسا AI</span>
          </div>

          {/* Messages */}
          <div ref={containerRef} className="flex-1 p-3 space-y-2.5 overflow-y-auto no-scrollbar flex flex-col" dir="rtl">
            {visibleMessages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11px] font-semibold leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.sender === 'user'
                    ? 'bg-slate-200 text-slate-800 rounded-tr-none mr-auto'
                    : 'text-white rounded-tl-none ml-auto'
                }`}
                style={msg.sender === 'bot' ? { backgroundColor: scenario.color } : {}}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="ml-auto bg-slate-200 px-3 py-2.5 rounded-2xl rounded-tl-none w-14 flex items-center justify-center">
                <div className="flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between" dir="rtl">
            <span className="text-[10px] text-slate-400 font-semibold">پاسخ خودکار توسط پرسا...</span>
            <span className="text-slate-400 text-xs">⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Comparison table data
// ─────────────────────────────────────────
const COMPARE_ROWS = [
  { label: 'ساعات پاسخگویی', old: 'فقط ساعات اداری', new: '۲۴ ساعته، ۷ روز هفته' },
  { label: 'درک زبان فارسی', old: 'کلیدواژه‌ای و محدود', new: 'کامل، عامیانه و محاوره‌ای' },
  { label: 'راه‌اندازی اولیه', old: 'هفته‌ها طراحی و کدنویسی', new: 'کمتر از ۵ دقیقه بدون کد' },
  { label: 'هزینه ماهانه', old: 'میلیون‌ها حقوق اپراتور', new: 'از صفر تا ۲ میلیون تومان' },
  { label: 'پاسخ به سوالات جدید', old: 'نیاز به برنامه‌ریزی مجدد', new: 'SMS فوری + یادگیری خودکار' },
  { label: 'پاسخ همزمان', old: 'یک نفر در یک لحظه', new: 'هزاران مکالمه موازی' },
  { label: 'کانال‌های ارتباطی', old: 'یک کانال مجزا', new: 'واتساپ، تلگرام، وب، بله و روبیکا' },
];

// ─────────────────────────────────────────
// Main Landing component
// ─────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleCTA = () => navigate(isLoggedIn ? '/dashboard' : '/auth');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">

      {/* ── HEADER ─────────────────────────── */}
      <header className="sticky top-0 bg-white border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-2 h-2 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">پرسا</span>
              <span className="text-[9px] text-slate-400 font-medium mt-0.5">دستیار هوشمند کسب‌وکار</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition">نحوه کارکرد</a>
            <a href="#features" className="hover:text-blue-600 transition">امکانات</a>
            <a href="#channels" className="hover:text-blue-600 transition">کانال‌ها</a>
            <Link to="/pricing" className="hover:text-blue-600 transition">تعرفه‌ها</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 transition text-sm font-semibold">
                داشبورد <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium text-sm">ورود</Link>
                <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-sm shadow-blue-500/20 transition">
                  شروع رایگان
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-5 flex flex-col gap-5 md:hidden shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
              {[['#how-it-works', 'نحوه کارکرد'], ['#features', 'امکانات'], ['#channels', 'کانال‌ها']].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50">{label}</a>
              ))}
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50">تعرفه‌ها</Link>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}
                className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold text-sm">شروع رایگان</button>
              {isLoggedIn && (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 font-bold text-sm">ورود به داشبورد</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────── */}
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl" />
        </div>

        {/* Left: copy */}
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
            یک‌بار اطلاعات کسب‌وکارتان را وارد کنید. پرسا ۲۴ ساعته در واتس‌اپ، تلگرام و سایت شما پاسخ می‌دهد.
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

        {/* Right: chat simulator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full max-w-md relative z-10"
        >
          <ChatSimulator />
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────── */}
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

      {/* ── HOW IT WORKS ───────────────────── */}
      <section id="how-it-works" className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-lg mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">۳ مرحله ساده</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">راه‌اندازی در کمتر از ۵ دقیقه</h2>
          <p className="text-sm text-slate-500">بدون نیاز به دانش فنی. فقط اطلاعات کسب‌وکارتان را وارد کنید.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
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
          ].map((step, i) => (
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

      {/* ── FEATURES GRID ──────────────────── */}
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
              className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 text-right overflow-hidden"
            >
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-amber-200/30 rounded-full blur-2xl" />
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 relative">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-sm">اطلاع‌رسانی SMS هوشمند</h3>
                <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">ویژه</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                مشتری سوالی پرسید که جواب ندارد؟ <b className="text-slate-800">فوری SMS</b> می‌گیرید. هیچ سوالی بی‌پاسخ نمی‌ماند.
              </p>
            </motion.div>

            {[
              { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', title: 'هوش مصنوعی اختصاصی', desc: 'AI با داده‌های کسب‌وکار شما آموزش می‌بیند و مانند یک کارمند حرفه‌ای پاسخ می‌دهد.' },
              { icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'چند کانال، یک مدیریت', desc: 'واتس‌اپ، تلگرام، روبیکا، بله و ویجت وب‌سایت از یک داشبورد متمرکز.' },
              { icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', title: 'آمار و تحلیل مکالمات', desc: 'ببینید مشتریان بیشتر چه می‌پرسند تا پایگاه دانش خود را بهینه کنید.' },
              { icon: Clock, color: 'text-sky-600', bg: 'bg-sky-50', title: 'پاسخگویی ۲۴ ساعته', desc: 'نیمه‌شب، تعطیلات، جمعه‌ها — دستیار هرگز آفلاین نمی‌شود.' },
              { icon: Smartphone, color: 'text-rose-500', bg: 'bg-rose-50', title: 'بدون اپ جداگانه', desc: 'مدیریت کامل از مرورگر موبایل. هر زمان، هرجایی وضعیت مکالمات را ببینید.' },
            ].map((f, i) => (
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

      {/* ── VERTICALS ──────────────────────── */}
      <section className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-lg mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">مناسب هر صنف</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">برای کسب‌وکار شما تنظیم می‌شود</h2>
          <p className="text-sm text-slate-500">پایگاه دانش دستیار بر اساس حوزه کاری شما بومی‌سازی می‌شود.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: GraduationCap,
              color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
              title: 'آموزشی و دوره‌ها',
              subtitle: 'آموزشگاه زبان، برنامه‌نویسی، ریاضی...',
              examples: ['شهریه ترم چقدره؟', 'آزمون تعیین سطح دارید؟', 'کلاس آنلاین هم هست؟', 'زمان‌بندی کلاس‌ها چطوره؟'],
            },
            {
              icon: Wrench,
              color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
              title: 'خدماتی و کلینیک',
              subtitle: 'دندانپزشکی، آرایشگاه، تعمیرات...',
              examples: ['کی نوبت خالی دارید؟', 'بیمه قبول می‌کنید؟', 'هزینه جرم‌گیری چقدره؟', 'لغو نوبت شرایطش چیه؟'],
            },
            {
              icon: ShoppingBag,
              color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
              title: 'فروشگاه و آنلاین‌شاپ',
              subtitle: 'محصولات پوستی، لباس، لوازم خانه...',
              examples: ['ارسال به اصفهان دارید؟', 'ضمانت مرجوعی دارید؟', 'پرداخت اقساطی؟', 'کالا کِی می‌رسه؟'],
            },
          ].map((v, i) => (
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
                    <MessageCircle className={`w-3 h-3 shrink-0 ${v.color}`} />
                    <span className="text-[11px] text-slate-700 font-semibold">{ex}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON ─────────────────────── */}
      <section className="py-20 px-4 bg-slate-900">
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

          {/* Comparison table */}
          <div className="rounded-2xl overflow-hidden border border-slate-800" dir="rtl">
            {/* Header row */}
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

            {/* Data rows */}
            {COMPARE_ROWS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`grid grid-cols-3 border-t border-slate-800 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/60'}`}
              >
                {/* Feature label */}
                <div className="p-3.5 flex items-center">
                  <span className="text-xs font-bold text-slate-300">{row.label}</span>
                </div>

                {/* Old way */}
                <div className="p-3.5 border-r border-slate-800 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-[11px] text-slate-500 leading-snug">{row.old}</span>
                </div>

                {/* Porsa */}
                <div className="p-3.5 border-r border-slate-800 bg-blue-900/20 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-200 font-semibold leading-snug">{row.new}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA inside comparison */}
          <div className="text-center pt-2">
            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 transition active-scale cursor-pointer"
            >
              {isLoggedIn ? 'ورود به داشبورد' : 'همین الان رایگان امتحان کنید'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CHANNELS ───────────────────────── */}
      <section id="channels" className="py-20 px-4 max-w-6xl mx-auto w-full text-center">
        <div className="max-w-lg mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">حضور همه‌جانبه</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">اتصال به کانال‌های ارتباطی</h2>
          <p className="text-sm text-slate-500">پاسخ هوشمند در بله، روبیکا، تلگرام، واتس‌اپ و وب‌سایت به‌طور همزمان.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {[
            {
              name: 'ویجت وب‌سایت',
              bg: 'bg-blue-600',
              icon: <MessageSquareCode className="w-6 h-6 text-white" />,
            },
            {
              name: 'واتس‌اپ',
              bg: 'bg-emerald-500',
              icon: <MessageCircle className="w-6 h-6 text-white" />,
            },
            {
              name: 'تلگرام',
              bg: 'bg-sky-500',
              icon: <Globe2 className="w-6 h-6 text-white" />,
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
          ].map((ch, i) => (
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

      {/* ── CTA ────────────────────────────── */}
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
            onClick={handleCTA}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl px-10 py-4 shadow-xl shadow-blue-500/20 transition active-scale cursor-pointer"
          >
            {isLoggedIn ? 'ورود به محیط کاربری' : 'ساخت رایگان دستیار'}
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />بدون نیاز به کارت اعتباری</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />۵۰,۰۰۰ توکن هدیه اولیه</span>
            <span className="flex items-center gap-1.5"><BellRing className="w-3.5 h-3.5 text-amber-400" />SMS اطلاع‌رسانی فوری</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />آماده‌سازی در ۵ دقیقه</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-900 text-right">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
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
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
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
    </div>
  );
}
