import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Bot,
  Check,
  X,
  Zap,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const handleCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const faqs = [
    {
      q: 'آیا ۵۰,۰۰۰ توکن رایگان اولیه هدیه آزمایشی محدودیت زمانی دارد؟',
      a: 'خیر، این برندینگ هدیه هیچگونه ضرب‌الاجل انقضایی ندارد. شما می‌توانید در کمال آرامش سیستم را تنظیم کرده، سناریوهای دستیار خود را بسازید و آن را تست کنید.'
    },
    {
      q: 'کلمه «توکن» به چه معناست و چطور کسر می‌شود؟',
      a: 'هر کلمه‌ای که کاربر شما ارسال می‌کند یا پاسخ هوشمندی که سیستم ارائه می‌دهد تقریباً معادل ۱.۳ توکن است. ۵۰,۰۰۰ توکن برای بیش از ۲,۵۰۰ پیام کامل پاسخ به مشتریان کافی خواهد بود.'
    },
    {
      q: 'آیا امکان تغییر پلن، ارتقا یا لغو در هر زمان وجود دارد؟',
      a: 'بله؛ شما در هر ثانیه بدون جریمه یا دردسر فنی می‌توانید مستقیماً از بخش داشبورد پلن خود را افزایش یا کاهش دهید یا کیف پول خود را شارژ کنید.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition">صفحه اصلی</Link>
            <Link to="/#how-it-works" className="hover:text-blue-600 transition">نحوه کارکرد</Link>
            <span className="text-blue-600 border-b-2 border-blue-600 py-1 font-bold">تعرفه‌ها و مقایسه</span>
          </nav>

          {/* CTA Link */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-slate-800 transition text-xs font-semibold shadow-sm"
              >
                <span>ورود به داشبورد</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium text-xs hidden sm:inline-block">
                  ورود
                </Link>
                <Link
                  to="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 transition text-xs font-semibold shadow-sm shadow-blue-500/10"
                >
                  شروع رایگان
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 max-w-6xl mx-auto w-full text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>پیشنهاد ویژه: ۵۰,۰۰۰ توکن هدیه فعال‌سازی بدون نیاز به درگاه</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-3xl mx-auto">
          طرح‌های تعرفه ماهانه و سالانه پرسا
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          بدون هزینه‌های پنهان، با مناسب‌ترین مبالغ، ابزار کاملاً هوشمند تراز نوین هوش مصنوعی کشور را در خدمت ارتقای کسب‌وکار خود بگیرید.
        </p>
      </section>

      {/* 3-Column Pricing Cards */}
      <section className="px-4 max-w-6xl mx-auto w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1: Small Businesses */}
          <motion.div
            onMouseEnter={() => setHoveredTier(1)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`bg-white border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative text-right flex-1 ${
              hoveredTier === 1 
                ? 'border-blue-400 shadow-xl shadow-blue-500/5 -translate-y-1' 
                : 'border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">پلن پایه</span>
                <h3 className="text-xl font-bold text-slate-900">کسب‌وکارهای کوچک</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مناسب تیم‌های نوپا، کسب‌وکارهای خانگی، آنلاین‌شاپ‌های تازه‌کار اینستاگرامی و کلینیک‌های تک‌نفره.
                </p>
              </div>

              <div className="py-4 border-y border-slate-100 flex items-baseline gap-1.5 justify-start">
                <span className="text-3xl font-extrabold text-slate-900">۴۰۰,۰۰۰</span>
                <span className="text-xs font-semibold text-slate-500">تومان / ماهانه</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>۱۵۰,۰۰۰ توکن ماهانه</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>۲ کانال ارتباطی لایو (وب + بله)</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>آموزش دستیار هوشمند برای ۱ صنف</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>پشتیبانی معمولی تیکتی با تعهد ۴ ساعته</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={handleCTA}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition active-scale cursor-pointer text-center"
              >
                شروع با پلن پایه
              </button>
            </div>
          </motion.div>

          {/* Plan 2: Medium Businesses (POPULAR) */}
          <motion.div
            onMouseEnter={() => setHoveredTier(2)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`bg-slate-900 border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative text-right flex-1 text-white ${
              hoveredTier === 2 
                ? 'shadow-2xl shadow-blue-500/10 scale-[1.02]' 
                : 'shadow-lg'
            }`}
          >
            {/* Recommendation badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] uppercase font-black tracking-widest text-white py-1 px-40 rounded-full shadow-lg whitespace-nowrap">
              محبوب‌ترین پیشنهاد صنف‌ها
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block font-mono">پلن رشد</span>
                <h3 className="text-xl font-bold text-white">کسب‌وکارهای متوسط</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  بهترین گزینه برای کلینیک‌های پررفت‌وآمد، آموزشگاه‌های علمی زبان، آژانس‌های هواپیمایی، و شرکت‌های خدماتی رو به رشد.
                </p>
              </div>

              <div className="py-4 border-y border-slate-800 flex items-baseline gap-1.5 justify-start">
                <span className="text-3xl md:text-4xl font-extrabold text-white">۱,۰۰۰,۰۰۰</span>
                <span className="text-xs font-semibold text-slate-400">تومان / ماهانه</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-200">
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">۵۰۰,۰۰۰ توکن ماهانه</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>۴ کانال فعال همزمان (وب، بله، روبیکا، تلگرام)</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>آموزش پیشرفته با ۳۰ سوال و جواب سفارشی</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>پشتیبانی تلفنی، واتس‌اپ و تلگرام فوق‌العاده سریع</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-bold">بدون حتی ۱ ثانیه قطعی با اولویت سرور اختصاصی</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={handleCTA}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg shadow-blue-500/20 active-scale cursor-pointer text-center border-none outline-none"
              >
                شروع با پلن رشد تجاری
              </button>
            </div>
          </motion.div>

          {/* Plan 3: Large Businesses */}
          <motion.div
            onMouseEnter={() => setHoveredTier(3)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`bg-white border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative text-right flex-1 ${
              hoveredTier === 3 
                ? 'border-blue-400 shadow-xl shadow-blue-500/5 -translate-y-1' 
                : 'border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">پلن حرفه‌ای</span>
                <h3 className="text-xl font-bold text-slate-900">کسب‌وکارهای بزرگ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مخصوص هولدینگ‌های چندمنظوره، کلینیک‌های زنجیره‌ای پزشکی، آکادمی‌های برتر دانشگاهی و پلتفرم‌های ابری پرمخاطب.
                </p>
              </div>

              <div className="py-4 border-y border-slate-100 flex items-baseline gap-1.5 justify-start">
                <span className="text-3xl font-extrabold text-slate-900">۲,۰۰۰,۰۰۰</span>
                <span className="text-xs font-semibold text-slate-500">تومان / ماهانه</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-blue-600">توکن‌های ممتد و نامحدود (بر پایه کلید اختصاصی)</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>تمامی کانال‌ها متصل (وب‌سایت، بله، روبیکا، تلگرام، واتس‌اپ)</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>آموزش خودکار و بی‌واسطه فایل‌های متنی PDF، اکسل و ورد</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>پشتیبانی اختصاصی VIP کاملاً ۲۴ ساعته اختصاصی تلفنی</span>
                </li>
                <li className="flex items-center gap-2 justify-start">
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>سرور کلود اختصاصی فاقد اشتراک لود با پایداری استثنایی</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={handleCTA}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition active-scale cursor-pointer text-center"
              >
                شروع با پلن حرفه‌ای
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Comparison Section (Old tools vs New tools) */}
      <section className="bg-slate-900 text-white py-20 px-4">
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

      {/* FAQs Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto w-full text-right space-y-12">
        <div className="text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-blue-600 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">سوالات رایج کاربران</h2>
          <p className="text-xs sm:text-sm text-slate-500">پاسخ کوتاه و صریح به ابهامات متداول شما پیرامون خدمات و فاکتورها</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-150 p-6 rounded-2xl space-y-2 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 justify-start">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-4">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Start Free CTA */}
      <section className="bg-slate-950 text-white py-16 px-4 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-normal">
            آماده شگفت‌زده کردن مشتریان خود هستید؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            با پرسا هیچ فرصت خریدی را از دست ندهید. ثبت‌نام رایگان در کمتر از ۳۰ ثانیه بدون هیچ پیش‌شرطی امکان‌پذیر است.
          </p>
          <div className="pt-2">
            <button
              onClick={handleCTA}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/25 transition active-scale inline-flex items-center gap-2 cursor-pointer border-none outline-none"
            >
              <span>رایگان شروع کنید و هدیه تستی خود را بگیرید</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-450 py-10 px-4 border-t border-slate-900 text-right mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
          {/* Brand block */}
          <div className="space-y-3 md:col-span-1">
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
              ارائه تحولی بی‌نظیر در تجربه ارتباط مشتریان با خدمات هوشمند و خودکار بر پایه پیام‌رسان‌های ایرانی و وب‌سایت.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">مکانیزم کاری</h4>
            <ul className="text-[11px] space-y-2">
              <li><Link to="/" className="hover:text-blue-400">موتور یادگیری هوشمند</Link></li>
              <li><Link to="/" className="hover:text-blue-400">شخصی‌سازی بافتار تجاری</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">سازماندهی</h4>
            <ul className="text-[11px] space-y-2">
              <li><Link to="/pricing" className="hover:text-blue-400 font-bold text-blue-400">طرح‌ها و مقایسه تعرفه</Link></li>
              <li><Link to="/" className="hover:text-blue-400">صفحه خانگی</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">اعتماد و امنیت</h4>
            <ul className="text-[11px] space-y-2 text-slate-500">
              <li className="flex items-center gap-1.5 justify-start">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>رعایت حریم خصوصی برند شما</span>
              </li>
              <li className="flex items-center gap-1.5 justify-start">
                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>پایداری بسیار عالی اتصالات</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-8 pt-6 text-center text-[10px] text-slate-600">
          © ۱۴۰۵ تمامی حقوق برای پرسا محفوظ است. ساخته شده بر پایه React Vite با رویکرد اولویت‌دهی به دسترسی موبایل.
        </div>
      </footer>
    </div>
  );
}
