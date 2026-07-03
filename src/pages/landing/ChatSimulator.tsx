import React, { useState, useEffect, useRef } from 'react';

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

export default function ChatSimulator() {
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

      <div className="relative border border-slate-200 rounded-3xl bg-white p-3 shadow-xl shadow-slate-200/60">
        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex flex-col h-[300px] sm:h-[320px]">
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

          <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center justify-between" dir="rtl">
            <span className="text-[10px] text-slate-400 font-semibold">پاسخ خودکار توسط پرسا...</span>
            <span className="text-slate-400 text-xs">⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
}
