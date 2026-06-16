import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Menu,
  X,
  GraduationCap,
  Wrench,
  ShoppingBag,
  MessageSquareCode,
  ArrowLeft,
  Bot,
  Sparkles,
  Zap,
  Globe2,
  Clock,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';

// Interactive Chat Scenarios and Simulator
const SCENARIOS = [
  {
    id: 0,
    title: 'آموزشگاه زبان آیلتس',
    sub: 'پخش زنده مکالمه آموزشی',
    color: 'blue',
    avatarLetter: 'دانش',
    messages: [
      { sender: 'user', text: 'سلام! دوره آمادگی آیلتس فشرده چه زمانی شروع میشه؟' },
      { sender: 'bot', text: 'سلام دوست من! دوره فشرده آیلتس آکادمی از دوشنبه هفته آینده آغاز میشه. برگزاری کلاس‌ها روزهای زوج ساعت ۱۷:۰۰ الی ۲۰:۰۰ هست. 🎓' },
      { sender: 'user', text: 'هزینه‌اش چقدر هست و شرایط پرداخت چطوره؟' },
      { sender: 'bot', text: 'شهریه هر ترم ۲,۵۰۰,۰۰۰ تومانه که امکان پرداخت اقساطی در دو نوبت هم وجود داره. آیا تمایل دارید براتون لینک تعیین سطح زبان آنلاین بفرستم؟ 📝' }
    ]
  },
  {
    id: 1,
    title: 'کلینیک دندون‌پزشکی',
    sub: 'رزرو نوبت خدمات درمانی',
    color: 'emerald',
    avatarLetter: 'پزشک',
    messages: [
      { sender: 'user', text: 'سلام وقت بخیر، جرم‌گیری دندان هم انجام می‌دین؟' },
      { sender: 'bot', text: 'سلام و درود! بله، جرم‌گیری عمیق تخصصی و درمان ریشه دندان توسط کادر مجرب دندان‌پزشکی ما همه‌روزه بجز تعطیلات انجام میشه. 🦷🩺' },
      { sender: 'user', text: 'کی نوبت خالی دارید؟ برای این هفته پنجشنبه ممکنه؟' },
      { sender: 'bot', text: 'برای پنجشنبه ساعت ۱۱:۳۰ نوبت خالی داریم. مایلید این نوبت رو بنام شما موقت ثبت کنم تا پیامک تایید با لوکیشن براتون بیاد؟ 🗓️' }
    ]
  },
  {
    id: 2,
    title: 'فروشگاه پوستی ارگانیک',
    sub: 'امور مشتریان و کادو ها',
    color: 'amber',
    avatarLetter: 'کالا',
    messages: [
      { sender: 'user', text: 'سلام، کرم آبرسان و سرم گیاهی موجود دارید؟ ارسال با چی هست؟' },
      { sender: 'bot', text: 'سلام بله! شوینده‌های گیاهی و سرم‌های آبرسان پوست ارگانیک در انبار موجود داریم. ارسال کالا با پست پیشتاز انجام میشه و برای خریدهای بالای ۵۰۰ تومن کاملا رایگان هست! 📦🧴' },
      { sender: 'user', text: 'اگر تست کردم و به پوستم نساخت، چطور میتونم مرجوع کنم?' },
      { sender: 'bot', text: 'خیالتون صد درصد راحت باشه! کل محصولات ما ضمانت بی‌قیدوشرط تعویض یا مرجوعی ۳۰ روزه دارن. مایلید لینک درگاه رسمی پرداخت مستقیم رو براتون بفرستم؟ 🛍️' }
    ]
  }
];

function ChatSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userResetTrigger, setUserResetTrigger] = useState(0);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scenario = SCENARIOS[activeTab];

  useEffect(() => {
    setVisibleMessages([]);
    setIsTyping(false);

    let active = true;
    const playNextStep = async () => {
      // Step 0: Small pause
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!active) return;

      // User Message 1
      setVisibleMessages([{ sender: 'user', text: scenario.messages[0].text }]);
      
      // Pause
      await new Promise(resolve => setTimeout(resolve, 1400));
      if (!active) return;

      // Bot begins typing anim
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (!active) return;
      setIsTyping(false);

      // Bot Message 1
      setVisibleMessages(prev => [...prev, { sender: 'bot', text: scenario.messages[1].text }]);

      // Pause
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!active) return;

      // User Message 2
      setVisibleMessages(prev => [...prev, { sender: 'user', text: scenario.messages[2].text }]);

      // Pause
      await new Promise(resolve => setTimeout(resolve, 1400));
      if (!active) return;

      // Bot begins typing anim 2
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (!active) return;
      setIsTyping(false);

      // Bot Message 2
      setVisibleMessages(prev => [...prev, { sender: 'bot', text: scenario.messages[3].text }]);
    };

    playNextStep();

    return () => {
      active = false;
    };
  }, [activeTab, userResetTrigger]);

  // Handle auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % SCENARIOS.length);
    }, 13000);
    return () => clearInterval(timer);
  }, [activeTab, userResetTrigger]);

  // Scroll to bottom inside messages container only (direct scrollTop prevents iframe/host page scroll jumping)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const handleManualTabSelect = (idx: number) => {
    setActiveTab(idx);
    setUserResetTrigger(prev => prev + 1);
  };

  // Get active coloring variables
  const botBubbleColor =
    scenario.color === 'emerald' ? 'bg-emerald-600' :
    scenario.color === 'amber' ? 'bg-amber-600' :
    'bg-blue-600';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Dynamic Tabs list on top */}
      <div className="flex bg-slate-100 p-1 rounded-xl gap-1" dir="rtl">
        {SCENARIOS.map((sc, scIdx) => (
          <button
            key={sc.id}
            onClick={() => handleManualTabSelect(scIdx)}
            className={`flex-1 py-1.5 px-2 text-center text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === scIdx 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main smartphone replica with glowing shadow and high-tech UI */}
      <div className="relative border border-slate-200 rounded-3xl bg-white p-3.5 shadow-xl shadow-slate-200/50">
        <div className="absolute inset-0 bg-blue-400 rounded-3xl filter blur-3xl opacity-5 transform translate-y-4 pointer-events-none" />
        
        {/* Mock Chat Agent Demo Card */}
        <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 flex flex-col h-[320px]">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-3 flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${botBubbleColor} flex items-center justify-center font-extrabold text-[10px] text-white shadow-sm shadow-white/10 ring-2 ring-slate-800`}>
                {scenario.avatarLetter}
              </div>
              <div className="text-right">
                <h4 className="text-xs font-extrabold leading-none">{scenario.title}</h4>
                <span className="text-[9px] text-slate-400 font-bold block mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>دستیار هوشمند ۲۴ ساعته</span>
                </span>
              </div>
            </div>
            
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-md text-slate-400 font-bold">
              تست زنده
            </span>
          </div>

          {/* Messages container - scrollable */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-3.5 space-y-3.5 overflow-y-auto no-scrollbar text-right flex flex-col justify-start" 
            dir="rtl"
          >
            {visibleMessages.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  msg.sender === 'user'
                    ? 'bg-slate-200 text-slate-800 rounded-tr-none mr-auto text-right border border-slate-300 shadow-sm'
                    : `${botBubbleColor} text-white rounded-tl-none ml-auto text-right shadow-md`
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Simulated typing dot animation */}
            {isTyping && (
              <div className="bg-slate-200 text-slate-800 p-2.5 rounded-2xl rounded-tl-none ml-auto text-right animate-pulse flex items-center justify-center w-14 shadow-sm border border-slate-250">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Device input bar replica */}
          <div className="p-2 border-t border-slate-150 bg-white flex items-center justify-between" dir="rtl">
            <span className="text-[10px] text-slate-400 font-bold">
              پاسخ خودکار توسط سیستم پرسا...
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black">
              ⚡
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center gap-1 shadow-md shadow-blue-500/15 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-2 h-2 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5"></div>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">پرسا</span>
              <span className="text-[9px] text-slate-400 font-medium mt-0.5">دستیار هوشمند کسب‌وکار</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition">نحوه کارکرد</a>
            <a href="#verticals" className="hover:text-blue-600 transition">حوزه‌ها</a>
            <a href="#channels" className="hover:text-blue-600 transition">کانال‌ها</a>
            <Link to="/pricing" className="hover:text-blue-600 transition">تعرفه‌ها</Link>
          </nav>

          {/* Nav CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 transition text-sm font-semibold shadow-sm"
              >
                <span>ورود به داشبورد</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                  ورود
                </Link>
                <Link
                  to="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 transition text-sm font-semibold shadow-sm shadow-blue-500/10"
                >
                  شروع رایگان
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Fullscreen slide-down menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6 md:hidden shadow-lg animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="flex flex-col gap-4 text-base font-semibold text-slate-800">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-50"
              >
                نحوه کارکرد
              </a>
              <a
                href="#verticals"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-50"
              >
                حوزه‌های کاری
              </a>
              <a
                href="#channels"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-50"
              >
                کانال‌های ارتباطی
              </a>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-50 block"
              >
                تعرفه‌ها
              </Link>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full bg-slate-900 text-white rounded-xl py-3 text-center font-bold text-sm shadow-sm active-scale"
                >
                  ورود به داشبورد
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full bg-blue-600 text-white rounded-xl py-3 text-center font-bold text-sm shadow-md active-scale"
                  >
                    شروع رایگان
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/auth');
                    }}
                    className="w-full bg-slate-100 text-slate-700 rounded-xl py-3 text-center font-bold text-sm active-scale"
                  >
                    ورود به حساب کاربری
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="flex-1 text-center lg:text-right space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مدیریت پشتیبانی نسل جدید علمی</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            دستیار پشتیبانی هوشمند <br className="hidden sm:inline" />
            با هوش مصنوعی برای کسب‌وکار شما
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            فقط یک‌بار راه‌اندازی کنید. به هوش مصنوعی اجازه دهید ۲۴ ساعته در کل هفته، پاسخگوی مشتریان در واتس‌اپ، تلگرام و وب‌سایت شما باشد. سرعت پاسخ را چند برابر کنید!
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/10 active-scale flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
            >
              <span>{isLoggedIn ? 'ورود به محیط کاربری' : 'رایگان شروع کنید'}</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 bg-white font-semibold rounded-xl px-6 py-3.5 text-center transition active-scale text-sm md:text-base flex items-center justify-center gap-2"
            >
              مشاهده نحوه کارکرد
            </a>
          </div>
        </div>

        {/* Visual Mockup Right */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <ChatSimulator />
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-white border-y border-slate-100 py-8 text-center text-xs md:text-sm font-bold text-slate-400 tracking-wider">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6">
          <div>
            <span className="block text-2xl font-extrabold text-blue-600 mb-0.5">۵۰۰+</span>
            کسب‌وکارهای فعال
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-blue-600 mb-0.5">۱ میلیون+</span>
            سوالات پاسخ داده شده
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-blue-600 mb-0.5">۲۴ ساعت</span>
            پاسخگویی آنی و هوشمند
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-lg mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">مراحل ساده</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">راه‌اندازی هوش مصنوعی در کمتر از ۵ دقیقه</h2>
          <p className="text-sm text-slate-500">پشتیبان هوشمند خود را با توضیحات فارسی ساده بارگذاری کنید و از ارتباط آنی در تمام درگاه‌ها لذت ببرید!</p>
        </div>

        {/* Stepper Grid with Animations and Illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop only */}
          <div className="hidden md:block absolute top-[110px] left-[15%] right-[15%] h-0.5 bg-slate-100 z-0" />

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md z-10 flex flex-col items-center md:items-start text-center md:text-right space-y-4 transition-shadow"
          >
            {/* Step Illustration */}
            <div className="w-full h-32 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-150/60 group">
              {/* Miniature business card */}
              <div className="w-4/5 h-20 bg-white rounded-lg shadow-sm border border-slate-200 p-3 space-y-1.5 transition-transform duration-300 group-hover:scale-105">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-blue-500 rounded-md flex items-center justify-center text-white text-[8px]">★</div>
                  <div className="h-1.5 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-1 w-full bg-slate-100 rounded" />
                <div className="h-1 w-5/6 bg-slate-100 rounded" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-3 w-14 bg-blue-50 text-blue-600 text-[8px] rounded flex items-center justify-center font-bold">آکادمی آیلتس</div>
                  <div className="h-1 w-8 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="absolute bottom-4 right-10 w-4 h-4 bg-blue-500/20 rounded-full border border-blue-500 flex items-center justify-center animate-ping" />
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-500 text-blue-600 flex items-center justify-center font-bold font-mono text-sm shadow-sm ring-4 ring-white">
              ۱
            </div>
            <h3 className="font-bold text-slate-950 text-base">ثبت مشخصات کسب‌وکار</h3>
            <p className="text-xs text-slate-550 leading-relaxed">
              نام برند، ساعات پاسخ‌گویی و قالب معرفی پیام تبریک خوش‌آمدگویی خود را به صورت فارسی در کادر بنویسید.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md z-10 flex flex-col items-center md:items-start text-center md:text-right space-y-4 transition-shadow"
          >
            {/* Step Illustration */}
            <div className="w-full h-32 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-150/60 group">
              <div className="flex gap-4 items-center justify-center">
                <div className="w-12 h-12 bg-blue-100/80 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200 transition-transform duration-500 group-hover:rotate-12">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1 text-[10px] bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold text-slate-700 flex items-center gap-1">لحن صمیمی <Sparkles className="w-3 h-3 text-amber-500 animate-spin" /></div>
                  <div className="text-[8px] text-emerald-600 font-bold">● پایگاه دانش آماده شد</div>
                </div>
              </div>
              <div className="absolute top-4 left-6 flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-500 text-blue-600 flex items-center justify-center font-bold font-mono text-sm shadow-sm ring-4 ring-white">
              ۲
            </div>
            <h3 className="font-bold text-slate-950 text-base">بارگذاری و آموزش رباط</h3>
            <p className="text-xs text-slate-550 leading-relaxed">
              شهریه دوره‌ها، خدمات کلینیک یا جزئیات مرجوعی کالا را ثبت کنید تا هوش مصنوعی بر پایه‌ آنها مثل مشاور برتر پاسخ دهد.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md z-10 flex flex-col items-center md:items-start text-center md:text-right space-y-4 transition-shadow"
          >
            {/* Step Illustration */}
            <div className="w-full h-32 bg-slate-50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-150/60 group">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow shadow-sky-500/30 transition-transform duration-300 group-hover:scale-110 [animation-delay:0.1s]">
                  <Globe2 className="w-4.5 h-4.5" />
                </div>
                {/* Rubika brand bubble representation */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-pink-500 to-yellow-500 flex items-center justify-center text-white shadow shadow-pink-500/30 transition-transform duration-300 group-hover:scale-110 [animation-delay:0.2s]">
                  <span className="text-[10px] font-black">روبیکا</span>
                </div>
              </div>
              <div className="absolute bottom-2 font-mono text-[9px] font-bold text-blue-600 uppercase tracking-widest animate-pulse">۲۴ ساعته فعال</div>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-500 text-blue-600 flex items-center justify-center font-bold font-mono text-sm shadow-sm ring-4 ring-white">
              ۳
            </div>
            <h3 className="font-bold text-slate-950 text-base">اتصال درگاه و پاسخ خودکار</h3>
            <p className="text-xs text-slate-550 leading-relaxed">
              ابزارک وب‌سایت را کپی کنید یا به روبیکا، تلگرام، بله و واتساپ وصل کنید تا دستیار شما فوراً آنلاین پاسخ دهد.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Verticals Section */}
      <section id="verticals" className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center max-w-lg mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">مناسب هر صنف</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">تنظیم هوشمند پایگاه دانش</h2>
            <p className="text-sm text-slate-500">ما ساختار یادگیری دستیار را بر اساس نوع خدمات کسب‌وکار شما بومی‌سازی می‌کنیم.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Education */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-150 space-y-4 text-right transition-all hover:bg-slate-100/50"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-105 text-blue-600 flex items-center justify-center shadow-inner">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">مجموعه‌های آموزشی و مدارس</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                پاسخ به سوالات کاتالوگ آموزش‌ها، شهریه‌ها، پیش‌نیازها، آزمون‌های تعیین سطح و زمان‌بندی برگزاری کلاس‌ها بصورت یکپارچه.
              </p>
            </motion.div>

            {/* Service */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-150 space-y-4 text-right transition-all hover:bg-slate-100/50"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">کلینیک‌ها و مراکز خدماتی</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                هماهنگی پروتکل‌های رزرو نوبت، بررسی تقویم‌های دردسترس، قوانین لغو وقت و تخصص‌های پزشکان و کارشناسان.
              </p>
            </motion.div>

            {/* Retail */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-150 space-y-4 text-right transition-all hover:bg-slate-100/50"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-950 text-base">خرده‌فروشی و فروشگاه‌های آنلاین</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                پاسخگویی درباره دسته‌بندی محصولات، جزئیات قیمت‌ها، روش‌ها و هزینه‌های ارسال، قوانین مرجوعی کالا و درگاه‌های پرداختی.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported Channels Section with Real Logos */}
      <section id="channels" className="py-20 px-4 max-w-6xl mx-auto w-full text-center">
        <div className="max-w-lg mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">حضور همه‌جانبه</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">اتصال به درگاه‌های ارتباطی با مشتری</h2>
          <p className="text-sm text-slate-500">پاسخگویی کاملاً هماهنگ به صورت لحظه‌ای در بله، روبیکا، تلگرام و واتس‌اپ.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto pt-4">
          
          {/* Web Widget */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-blue-300 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <h2>ابزارک آنلاین وب‌سایت</h2>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-emerald-300 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h2>پیام‌رسان واتس‌اپ</h2>
          </motion.div>

          {/* Telegram */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-sky-300 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-md">
              <Globe2 className="w-6 h-6" />
            </div>
            <h2>ربات تلگرام</h2>
          </motion.div>

          {/* Rubika Section with Real Brand Logo */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-pink-300 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              {/* Official Rubika colorful multi-vector identity */}
              <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="url(#rubikaGrad)" />
                <path d="M50 18 L76 34 L76 66 L50 82 L24 66 L24 34 Z" fill="#ffffff" opacity="0.3" />
                <path d="M50 28 L68 38 L68 62 L50 72 L32 62 L32 38 Z" fill="#ffffff" />
                <circle cx="50" cy="50" r="12" fill="url(#rubikaCenter)" />
                <defs>
                  <linearGradient id="rubikaGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e3c72" />
                    <stop offset="30%" stopColor="#ff007f" />
                    <stop offset="70%" stopColor="#ffb900" />
                    <stop offset="100%" stopColor="#00c6ff" />
                  </linearGradient>
                  <linearGradient id="rubikaCenter" x1="38" y1="38" x2="62" y2="62" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff007f" />
                    <stop offset="100%" stopColor="#ffb900" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2>پیام‌رسان روبیکا</h2>
          </motion.div>

          {/* Bale Section with Real Brand Logo */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-emerald-450 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shadow-md bg-[#14a86e]">
              {/* Bale Logo Leaf shape in Emerald chat bg */}
              <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20 C68 20 82 34 82 50 C82 66 68 80 50 80 C44 80 38 78 33 74 L18 78 L22 63 C18 58 16 52 16 50 C16 34 30 20 50 20 Z" fill="#ffffff" />
                <ellipse cx="50" cy="48" rx="20" ry="17" fill="#14a86e" />
                <path d="M42 42 C48 38 58 44 58 52 C58 58 54 62 48 62 C40 62 38 52 42 42 Z" fill="#ffffff" />
              </svg>
            </div>
            <h2>پیام‌رسان بله</h2>
          </motion.div>

          {/* Connected tickets */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white hover:border-slate-400 text-slate-800 font-bold text-xs py-5 px-3 rounded-2xl border border-slate-200/80 transition flex flex-col items-center gap-3.5 shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2>تیکت‌های یکپارچه</h2>
          </motion.div>

        </div>
      </section>

      {/* Comparison Section (Old tools vs New tools) */}
      <section className="bg-slate-900 text-white py-24 px-4 border-t border-slate-800">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block font-mono">تفاوت‌ها را مقایسه کنید</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              مقایسه رویکرد سنتی با نسل هوشمند پرسا
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              چرا روش‌های گذشته پاسخ‌گویی به مشتریان دیگر کارآمد نیستند و چطور هوش مصنوعی پیشرفته شما را دگرگون می‌کند؟
            </p>
          </div>

          {/* Graphical side-by-side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">
            
            {/* Old Handlers side */}
            <div className="bg-slate-800/40 border border-red-500/20 rounded-2xl p-6 sm:p-8 space-y-6 text-right relative overflow-hidden">
              <div className="absolute top-4 left-4 text-red-500/10">
                <TrendingDown className="w-24 h-24 stroke-[1]" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">ابزارها و روش‌های سنتی (پاسخ‌گویی قدیمی)</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">ربات‌های منوی دکمه‌ای کلیدواژه‌ای یا استخدام منشی‌های نوبتی</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                
                <div className="flex items-start gap-3 justify-start bg-slate-800/35 p-3 rounded-xl">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">رابط خشک و پینگ‌پنگی دکمه‌ای</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      کاربر مجبور است ساعت‌ها روی دکمه‌های تکراری کلیک کند و سیستم بلافاصله با کوچکترین کلمه خارج از ساختار، پیام خطا نشان می‌دهد.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-slate-800/35 p-3 rounded-xl">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">عدم درک جملات محاوره‌ای و غلط تایپی</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      تنها با تایپ «دندونپزشکی» به جای «دندان‌‌پزشکی» سیستم گیج شده و پاسخی صادر نمی‌کند. فاقد هرگونه هوش و درک معنایی واقعی.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-slate-800/35 p-3 rounded-xl">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">تعطیلی پس از ساعات اداری یا هزینه‌های بالا</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      ایجاد صف انتظار بی‌روح در نیمه‌شب یا تحمیل حقوق‌های گزاف چند میلیونی ماهیانه جهت استخدام اپراتور شیفت شب چت زنده.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-slate-800/35 p-3 rounded-xl">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">پروسه راه‌اندازی فرسایشی</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      هفته‌ها برنامه‌نویسی و طراحی فلوچارت‌های درختی سردرگم‌کننده که مداخله کوچک در کلمات نیاز به آپدیت کل این فرایند دارد.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* SupportCore AI side */}
            <div className="bg-slate-800/80 border-2 border-blue-500/50 rounded-2xl p-6 sm:p-8 space-y-6 text-right relative overflow-hidden shadow-xl shadow-blue-500/5">
              <div className="absolute top-4 left-4 text-blue-500/10 animate-pulse">
                <TrendingUp className="w-24 h-24 stroke-[1]" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white">دستیار هوشمند پرسا (جدید و نوین)</h3>
                    <span className="bg-blue-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase text-white">فعلی</span>
                  </div>
                  <p className="text-[10px] text-blue-300 mt-0.5">آموزش دیده اختصاصی با بافتار، خدمات و لحن مشتری‌نویسی شما</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                
                <div className="flex items-start gap-3 justify-start bg-blue-950/40 p-3 rounded-xl border border-blue-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      <span>مکالمه عمیق، روان و فوق فصیح انسانی</span>
                      <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      مکالمات واقع‌گرایانه درست مانند یک مشاور حرفه‌ای دلسوز. هیچ منوی از پیش تعریف شده‌ای وجود ندارد کاربر مستقیماً چت می‌کند.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-blue-950/40 p-3 rounded-xl border border-blue-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">درک عامیانه، کنایه و غلط‌گیری اتوماتیک</h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      اگر مشتری بنویسد «سلام خست نباشین، توروخدا قیمت این دوره‌هاتون ک چنده برام بگید؟» کاملاً مقصود او را دریافت کرده و درجا منصفانه‌ترین پاسخ را می‌دهد.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-blue-950/40 p-3 rounded-xl border border-blue-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">پایداری دائم ۲۴ ساعته و پاسخ همزمان</h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      پاسخ‌گویی موازی به بیش از ۱,۰۰۰ کاربر در یک ثانیه در بستر روبیکا، تلگرام، بله یا ویجت وب‌سایت شما بدون مرخصی، خستگی یا خطا.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start bg-blue-950/40 p-3 rounded-xl border border-blue-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">راه‌اندازی بهینه‌سازی شده در ۵ دقیقه</h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      کافی‌ست متون دلخواه برای حوزه کاری خود را تایپ کنید؛ نیازی به فرمول‌نویسی درختی نیست. مغز هوش مصنوعی الگوها را صادر می‌کند.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Premium Start Free CTA Banner (No complicated boards) */}
      <section id="pricing" className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>شروع کاملاً رایگان تجاری</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-normal text-white">
              همین امروز دستیار هوش مصنوعی خود را بسازید
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              نیازی به وارد کردن اطلاعات پرداخت یا اعتبار نیست. فوراً ثبت‌نام کنید، اطلاعات کسب‌وکارتان را بدهید و از ۵۰,۰۰۰ توکن هدیه فعال‌سازی اولیه جهت بکارگیری در تمامی درگاه‌ها استفاده کنید.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-10 py-4.5 shadow-xl shadow-blue-500/25 transition-transform active-scale flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base border-none outline-none"
            >
              <span>{isLoggedIn ? 'ورود به محیط کاربری' : 'ساخت رایگان دستیار در کمتر از ۱ دقیقه'}</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800 text-right">
            <div className="flex items-center gap-2 justify-start text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>بدون نیاز به کارت اعتباری</span>
            </div>
            <div className="flex items-center gap-2 justify-start text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>۵۰,۰۰۰ توکن فعال‌سازی هدیه</span>
            </div>
            <div className="flex items-center gap-2 justify-start text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>پشتیبانی بله، روبیکا و وب‌سایت</span>
            </div>
            <div className="flex items-center gap-2 justify-start text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>آماده‌سازی لایو در ۵ دقیقه</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-900 mt-auto text-right">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
          {/* Brand block */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 shadow-md shadow-blue-500/15 relative shrink-0">
                <div className="absolute bottom-1 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5"></div>
                <span className="w-1 h-1 rounded-full bg-white"></span>
                <span className="w-1 h-1 rounded-full bg-white"></span>
                <span className="w-1 h-1 rounded-full bg-white"></span>
              </div>
              <span className="font-extrabold text-white text-base">پرسا</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ارائه تحولی بی‌نظیر در تجربه ارتباط مشتریان با خدمات هوشمند و خودکار بر پایه پیام‌رسان‌های ایرانی و پیام‌رسانی وب با تاخیر صفر.
            </p>
          </div>

          {/* Quick links columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">امکانات</h4>
            <ul className="text-[11px] space-y-2">
              <li><a href="#how-it-works" className="hover:text-blue-400">موتور یادگیری هوشمند</a></li>
              <li><a href="#verticals" className="hover:text-blue-400">شخصی‌سازی بافتار تجاری</a></li>
              <li><a href="#channels" className="hover:text-blue-400">درگاه‌های ارتباطی متصل</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">تعرفه‌ها</h4>
            <ul className="text-[11px] space-y-2">
              <li><Link to="/pricing" className="hover:text-blue-400 font-semibold text-blue-400">مشاهده پلن‌ها و مقایسه</Link></li>
              <li><Link to="/auth" className="hover:text-blue-400">شروع رایگان تجاری</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">اعتماد و امنیت</h4>
            <ul className="text-[11px] space-y-2 text-slate-500 font-sans">
              <li className="flex items-center gap-1.5 justify-start">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>رعایت استانداردهای همگام‌سازی ارتباطات هوشمند</span>
              </li>
              <li className="flex items-center gap-1.5 justify-start">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>۹۹.۹٪ پایداری پاسخی مستقر در سرور با تاخیر صفر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-10 pt-6 text-center text-[10px] text-slate-650">
          © ۱۴۰۵ تمامی حقوق برای پرسا محفوظ است. ساخته شده بر پایه React Vite با رویکرد اولویت‌دهی به دسترسی موبایل.
        </div>
      </footer>
    </div>
  );
}
