import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Wrench,
  ShoppingBag,
  Bot,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { api } from '../services/api';
import { Business, BusinessType, ResponseStyle, CustomQA } from '../types';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // STEP 1: Basics (Farsi preloaded values)
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('education');
  const [field, setField] = useState('');
  const [brandColor, setBrandColor] = useState('#2563eb');
  const [contact, setContact] = useState('');
  const [workingHours, setWorkingHours] = useState('شنبه تا پنجشنبه ۹:۰۰ صبح الی ۱۸:۰۰ عصر');
  const [welcomeMessage, setWelcomeMessage] = useState('سلام! چطور می‌توانم امروز به شما کمک کنم؟');

  // STEP 2: AI Settings
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>('friendly');
  const [maxTokens, setMaxTokens] = useState(1000);

  // STEP 3: Knowledge details (per vertical defaults - localized)
  // Education fields
  const [eduCourses, setEduCourses] = useState('آماده‌سازی آزمون آیلتس فشرده (آکادمیک و عمومی)، تقویت مکالمه انگلیسی کاربری، دوره فونیکس کودکان');
  const [eduSchedule, setEduSchedule] = useState('عصر روزهای زوج (شنبه/دوشنبه/چهارشنبه) از ساعت ۱۸:۰۰ الی ۲۰:۳۰، پنجشنبه‌ها از ساعت ۹:۰۰ صبح الی ۱۳:۳۰ ظهر');
  const [eduEnrollment, setEduEnrollment] = useState('۱. انجام آزمون تعیین سطح آنلاین. ۲. مصاحبه شفاهی آیلتس توسط سوپروایزر. ۳. پرداخت شهریه و تکمیل ثبت‌نام.');
  const [eduTuition, setEduTuition] = useState('دوره آمادگی آیلتس: ۲,۵۰۰,۰۰۰ تومان برای هر ترم (۱۲ هفته). دوره‌های فونیکس: ۱,۲۰۰,۰۰۰ تومان.');
  const [eduFormat, setEduFormat] = useState<'online' | 'inperson' | 'hybrid'>('hybrid');

  // Service fields
  const [serServices, setSerServices] = useState('جرم‌گیری تخصصی دندان، عصب‌کشی دندان، ایمپلنت دیجیتال، زیبایی کامپوزیت');
  const [serProcess, setSerProcess] = useState('ثبت رزرو مستقیم از تقویم سایت یا ارسال شماره تماس برای هماهنگی منشی تلفنی.');
  const [serCancel, setSerCancel] = useState('امکان لغو نوبت تا ۲۴ ساعت قبل بدون جریمه. لغو دیرهنگام شامل جریمه ۲۰٪ هزینه نوبت خواهد شد.');
  const [serSpecialists, setSerSpecialists] = useState('دکتر محمد راد (متخصص ارتودنسی)، دکتر مریم شجاعی (جراح و دندانپزشک عمومی)');

  // Retail fields
  const [retProducts, setRetProducts] = useState('شوینده‌های گیاهی صورت، سرم‌های آبرسان پوست، کرم‌های ترمیم‌کننده شب');
  const [retShipping, setRetShipping] = useState('ارسال رایگان سراسری برای خریدهای بالای ۵۰۰,۰۰۰ تومان. ارسال معمولی ۳ روز کاری زمان می‌برد.');
  const [retReturn, setRetReturn] = useState('قوانین ۳۰ روز مرجوعی برای محصولات پلمب‌شده پوستی و آرایشی در بسته‌بندی اولیه خود.');
  const [retPayments, setRetPayments] = useState({
    card: true,
    cash: false,
    transfer: true,
    other: false
  });

  // Common custom Q&As
  const [qas, setQas] = useState<Omit<CustomQA, 'id'>[]>([]);

  // Step state validations
  const [basicsError, setBasicsError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleNext = () => {
    if (step === 1) {
      if (!name) {
        setBasicsError('نام تجاری یا قانونی کسب‌وکار الزامی است.');
        return;
      }
      setBasicsError('');
    }
    setStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddField = () => {
    setQas([...qas, { question: '', answer: '' }]);
  };

  const handleUpdateField = (index: number, fld: 'question' | 'answer', text: string) => {
    const list = [...qas];
    list[index][fld] = text;
    setQas(list);
  };

  const handleRemoveField = (index: number) => {
    setQas(qas.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
       // 1. Save core business specifications
      const bObj = await api.business.create({
        name,
        type: businessType,
        field,
        brandColor,
        contact,
        workingHours,
        welcomeMessage,
        responseStyle,
        maxTokens,
      });

      // 2. Format details depending on selected vertical
      const details: any[] = [];
      if (businessType === 'education') {
        details.push(
          { key: 'courses_offered', title: 'دوره‌های آموزشی ما', value: eduCourses },
          { key: 'schedule_timing', title: 'ساعات زمانی برگزاری کلاس‌ها', value: eduSchedule },
          { key: 'enrollment_process', title: 'فرآیند ثبت‌نام و پذیرش', value: eduEnrollment },
          { key: 'tuition_fees', title: 'شهریه دوره‌ها و پرداخت', value: eduTuition },
          { key: 'format', title: 'شیوه برگزاری کلاس‌ها', value: eduFormat === 'online' ? 'آنلاین' : eduFormat === 'inperson' ? 'حضوری' : 'ترکیبی (حضوری و آنلاین)' }
        );
      } else if (businessType === 'services') {
        details.push(
          { key: 'services_offered', title: 'خدمات ارائه‌شده', value: serServices },
          { key: 'appointment_booking_process', title: 'فرآیند رزرو وقت نوبت', value: serProcess },
          { key: 'cancellation_policy', title: 'مقررات لغو نوبت', value: serCancel },
          { key: 'staff_specialists', title: 'پزشکان و کارشناسان مرکز', value: serSpecialists }
        );
      } else if (businessType === 'retail') {
        const methods: string[] = [];
        if (retPayments.card) methods.push('درگاه پرداخت اینترنتی / کارت');
        if (retPayments.cash) methods.push('پرداخت نقدی در محل');
        if (retPayments.transfer) methods.push('کارت به کارت / حواله پایا');
        if (retPayments.other) methods.push('سایر شیوه‌های پرداخت');
        
        details.push(
          { key: 'products_categories', title: 'دسته‌بندی محصولات', value: retProducts },
          { key: 'shipping_delivery', title: 'تعرفه و شیوه‌های ارسال کالا', value: retShipping },
          { key: 'return_refund_policy', title: 'قوانین بازگردانی کالا و مرجوعی', value: retReturn },
          { key: 'payment_methods', title: 'روش‌های پرداخت پذیرفته‌شده', value: methods.join('، ') }
        );
      }

      await api.details.saveAll(details);

      // 3. Save Custom Q&A list items
      for (const item of qas) {
        if (item.question.trim() && item.answer.trim()) {
          await api.qas.add(item);
        }
      }

      // 4. Redirect to home dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete setup configuration', err);
      alert('خطایی در حین ثبت و راه‌اندازی تنظیمات محیط کاربری رخ داد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans mb-10 text-right" dir="rtl">
      
      {/* Dynamic progression headers: sticky top element */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-30 shadow-sm flex flex-col pt-safe">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 shadow-md shadow-blue-500/15 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5"></div>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white"></span>
            </div>
            <span className="font-extrabold text-xs tracking-tight text-slate-800">راه‌اندازی پرسا</span>
          </div>
          <span className="text-[11px] font-bold text-slate-450 uppercase font-mono">مرحله {step} از ۴</span>
        </div>
        {/* Fill colored bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </header>

      {/* Main step container panel */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 mb-24 space-y-6">
        
        {/* Title guidelines */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {step === 1 && 'درباره کسب‌وکار خود بگویید'}
            {step === 2 && 'تنظیم سبک رفتار هوش مصنوعی'}
            {step === 3 && 'ایجاد پایگاه دانش دستیار'}
            {step === 4 && 'بررسی نهایی اطلاعات پیش‌نویس'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 1 && 'مشخصات اولیه را برای بومی‌سازی دقیق پاسخ‌های دستیار هوشمند وارد کنید.'}
            {step === 2 && 'لحن صحبت دستیار را سفارشی‌سازی کرده و سقف طول پاسخ‌ها را تعیین کنید.'}
            {step === 3 && 'اطلاعات دوره‌ها، شرایط خدمات یا مرجوعی کالا را برای آموزش به هوش مصنوعی ثبت کنید.'}
            {step === 4 && 'مرور متغیرها و کاتالوگ‌های آموزشی جهت مونتاژ نهایی دستیار شما.'}
          </p>
        </div>

        {/* STEP 1: BASICS FORM */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Legal Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">نام کسب‌وکار</label>
              <input
                type="text"
                id="biz-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setBasicsError('');
                }}
                placeholder="مثال: کلینیک آیلتس تهران یا فروشگاه هوم‌کِر"
                className="w-full h-12 px-3.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none"
              />
              {basicsError && <p className="text-rose-600 text-[11px] font-bold mt-1">{basicsError}</p>}
            </div>

            {/* Selection vertical grids */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">صنف فعالیت اصلی</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Edu */}
                <button
                  type="button"
                  id="type-education"
                  onClick={() => setBusinessType('education')}
                  className={`p-4 rounded-xl border-2 text-right flex flex-col justify-between h-28 cursor-pointer transition active-scale relative ${
                    businessType === 'education'
                      ? 'border-blue-600 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <GraduationCap className={`w-6 h-6 ${businessType === 'education' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-none mb-1">آموزشی و کلاس‌ها</h3>
                    <p className="text-[10px] text-slate-400 leading-tight">دوره‌ها، شهریه و ثبت‌نام</p>
                  </div>
                  {businessType === 'education' && (
                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-2.5 h-2.5" /></div>
                  )}
                </button>

                {/* Service */}
                <button
                  type="button"
                  id="type-services"
                  onClick={() => setBusinessType('services')}
                  className={`p-4 rounded-xl border-2 text-right flex flex-col justify-between h-28 cursor-pointer transition active-scale relative ${
                    businessType === 'services'
                      ? 'border-blue-600 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Wrench className={`w-6 h-6 ${businessType === 'services' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-none mb-1">خدماتی و کلینیک</h3>
                    <p className="text-[10px] text-slate-400 leading-tight">رزرو وقت، پرسنل و لغو نوبت</p>
                  </div>
                  {businessType === 'services' && (
                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-2.5 h-2.5" /></div>
                  )}
                </button>

                {/* Retail */}
                <button
                  type="button"
                  id="type-retail"
                  onClick={() => setBusinessType('retail')}
                  className={`p-4 rounded-xl border-2 text-right flex flex-col justify-between h-28 cursor-pointer transition active-scale relative ${
                    businessType === 'retail'
                      ? 'border-blue-600 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <ShoppingBag className={`w-6 h-6 ${businessType === 'retail' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 leading-none mb-1">فروشگاه آنلاین</h3>
                    <p className="text-[10px] text-slate-400 leading-tight">محصولات، ارسال و مرجوعی</p>
                  </div>
                  {businessType === 'retail' && (
                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-2.5 h-2.5" /></div>
                  )}
                </button>
              </div>
            </div>

            {/* Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">شاخه تخصصی فعالیت</label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="مثال: آموزشگاه زبان‌های خارجی یا دندان‌پزشکی زیبایی"
                className="w-full h-12 px-3.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none text-right"
              />
            </div>

            {/* Brand Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">رنگ سازمانی برند</label>
              <p className="text-[10px] text-slate-400">رنگی که مایلید به عنوان تم اصلی پنل‌ها و ابزارک گفتگوهایتان اعمال شود.</p>
              <div className="flex flex-wrap gap-2 pt-1 justify-start" dir="rtl">
                {[
                  { hex: '#2563eb', label: 'آبی هوشمند' },
                  { hex: '#10b981', label: 'سبز زمردی' },
                  { hex: '#4f46e5', label: 'نیلی مدرن' },
                  { hex: '#8b5cf6', label: 'بنفش لوکس' },
                  { hex: '#f43f5e', label: 'صورتی زیبایی' },
                  { hex: '#f59e0b', label: 'نارنجی پرانرژی' },
                  { hex: '#475569', label: 'زغال‌سنگی مدرن' },
                ].map((colorItem) => (
                  <button
                    key={colorItem.hex}
                    type="button"
                    onClick={() => setBrandColor(colorItem.hex)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition active-scale cursor-pointer ${
                      brandColor === colorItem.hex
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: colorItem.hex }}
                    />
                    <span>{colorItem.label}</span>
                    {brandColor === colorItem.hex && (
                      <Check className="w-3 h-3 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone/Link */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">پل ارتباطی عمومی (تلفن/سایت/آدرس)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="مثال: 09123456789 یا ieltsrange.com"
                className="w-full h-12 px-3.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none text-left"
                dir="ltr"
              />
            </div>

            {/* Hours */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">ساعات کاری مجموعه</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full h-12 px-3.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none text-right"
              />
            </div>

            {/* Welcome messages */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">پیام خوش‌آمدگویی پیش‌فرض ربات</label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                className="w-full p-3.5 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-sm font-semibold tracking-wide transition outline-none resize-none text-right"
              />
            </div>
          </div>
        )}

        {/* STEP 2: AI AGENT PRESETS */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Style cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">لحن پاسخ‌گویی هوش مصنوعی</label>
              <div className="space-y-3">
                {/* Friendly */}
                <button
                  type="button"
                  onClick={() => setResponseStyle('friendly')}
                  className={`w-full p-4 rounded-xl border-2 text-right transition flex items-center justify-between cursor-pointer active-scale ${
                    responseStyle === 'friendly' ? 'border-blue-600 bg-blue-50/15' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">😊</span>
                    <div className="text-right">
                      <h3 className="font-bold text-xs text-slate-900 leading-tight mb-0.5">گرماگرم و صمیمی</h3>
                      <p className="text-[10px] text-slate-400">گفت‌وگوی همدلانه، عامیانه، صبورانه و دوستانه با مشتریان.</p>
                    </div>
                  </div>
                  {responseStyle === 'friendly' && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                </button>

                {/* Formal */}
                <button
                  type="button"
                  onClick={() => setResponseStyle('formal')}
                  className={`w-full p-4 rounded-xl border-2 text-right transition flex items-center justify-between cursor-pointer active-scale ${
                    responseStyle === 'formal' ? 'border-blue-600 bg-blue-50/15' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div className="text-right">
                      <h3 className="font-bold text-xs text-slate-900 leading-tight mb-0.5">رسمی و اداری</h3>
                      <p className="text-[10px] text-slate-400">ادب کامل، جملات ساختاریافته، موضع تجاری محترمانه و خلاصه.</p>
                    </div>
                  </div>
                  {responseStyle === 'formal' && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                </button>

                {/* Technical */}
                <button
                  type="button"
                  onClick={() => setResponseStyle('technical')}
                  className={`w-full p-4 rounded-xl border-2 text-right transition flex items-center justify-between cursor-pointer active-scale ${
                    responseStyle === 'technical' ? 'border-blue-600 bg-blue-50/15' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div className="text-right">
                      <h3 className="font-bold text-xs text-slate-900 leading-tight mb-0.5">تخصصی و فنی</h3>
                      <p className="text-[10px] text-slate-400">ارائه دقیق‌ترین اطلاعات، دستورالعمل‌های گام‌به‌گام و مستند.</p>
                    </div>
                  </div>
                  {responseStyle === 'technical' && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative text-right">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">سقف توکن‌های مجاز پاسخ (طول متن)</label>
                <span className="font-mono text-sm font-bold text-blue-600" dir="ltr">{maxTokens} توکن</span>
              </div>
              
              <input
                type="range"
                min="200"
                max="4000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />

              <div className="flex justify-between text-[10px] text-slate-450 font-bold px-0.5">
                <span>۲۰۰ (پاسخ کوتاه)</span>
                <span>۲۰۰۰ (پاسخ متوسط)</span>
                <span>۴۰۰۰ (پاسخ کامل و با جزئیات)</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal font-normal pt-2 flex items-start gap-1">
                <Settings className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                <span>تنظیم سقف توکن‌های پایین‌تر سرعت پاسخ را بهینه می‌کند. سقف‌های بیشتر به شرح جزئیات مفصل کمک می‌کند.</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC KNOWLEDGE FORMS */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Dynamic education questions template */}
            {businessType === 'education' && (
              <div className="space-y-5 text-right">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">لیست دوره‌ها و کلاس‌های فعال</label>
                  <textarea
                    value={eduCourses}
                    onChange={(e) => setEduCourses(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">برنامه زمانی و تقویم دوره‌ها</label>
                  <textarea
                    value={eduSchedule}
                    onChange={(e) => setEduSchedule(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">فرآیند پذیرش و تعیین سطح</label>
                  <textarea
                    value={eduEnrollment}
                    onChange={(e) => setEduEnrollment(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">شهریه‌ها و نحوه پرداخت نقدی/اقساط</label>
                  <textarea
                    value={eduTuition}
                    onChange={(e) => setEduTuition(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">شیوه و نحوه ارائه خدمات کلاس</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['online', 'inperson', 'hybrid'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setEduFormat(fmt as any)}
                        className={`py-2 px-3 text-center text-xs font-bold rounded-xl border transition cursor-pointer capitalize active-scale ${
                          eduFormat === fmt
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                        }`}
                      >
                        {fmt === 'online' ? 'آنلاین / بستر مجازی' : fmt === 'inperson' ? 'حضوری رسمی' : 'ترکیبی و دوگان'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Service questions template */}
            {businessType === 'services' && (
              <div className="space-y-5 text-right">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">خدمات و درمان‌های ارائه‌شده</label>
                  <textarea
                    value={serServices}
                    onChange={(e) => setSerServices(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">پروتکل و فرآیند رزرو نوبت</label>
                  <textarea
                    value={serProcess}
                    onChange={(e) => setSerProcess(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">مقررات لغو و جابه‌جایی نوبت</label>
                  <textarea
                    value={serCancel}
                    onChange={(e) => setSerCancel(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">پزشکان، کارشناسان و متخصصان فعال</label>
                  <textarea
                    value={serSpecialists}
                    onChange={(e) => setSerSpecialists(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Retail questions template */}
            {businessType === 'retail' && (
              <div className="space-y-5 text-right">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">کالاها و کاتالوگ محصولات</label>
                  <textarea
                    value={retProducts}
                    onChange={(e) => setRetProducts(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">هزینه‌ها و شیوه‌های ارسال سفارش</label>
                  <textarea
                    value={retShipping}
                    onChange={(e) => setRetShipping(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">قوانین عودت کالا و مرجوعی</label>
                  <textarea
                    value={retReturn}
                    onChange={(e) => setRetReturn(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none tracking-wide resize-none text-right"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">شیوه‌های پرداخت مورد پذیرش</label>
                  <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-right">
                    {Object.keys(retPayments).map((mKey) => (
                      <label key={mKey} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          checked={(retPayments as any)[mKey]}
                          onChange={(e) => setRetPayments({ ...retPayments, [mKey]: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500"
                        />
                        <span>
                          {mKey === 'card' ? 'درگاه بانکی / کارت به کارت' : 
                          mKey === 'transfer' ? 'حواله معتبر پایا/ساتنا' : 
                          mKey === 'cash' ? 'پرداخت در محل (نقدی)' : 'سایر روش‌ها'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Q&A options lists */}
            <div className="space-y-4 pt-4 border-t border-slate-200 text-right">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">پرسش و پاسخ‌های متداول بیشتر</label>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold tracking-wide cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 ml-1" />
                  <span>ثبت پرسش و پاسخ جدید</span>
                </button>
              </div>

              {/* QA card list */}
              <div className="space-y-3">
                {qas.map((qaItem, qIdx) => (
                  <div key={qIdx} className="bg-white border border-slate-200 p-4 rounded-xl relative shadow-sm space-y-3 animate-in slide-in-from-bottom-2 duration-150 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveField(qIdx)}
                      className="absolute top-3 left-3 text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* inputs */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide text-right">پرسش شماره {qIdx + 1}</span>
                      <input
                        type="text"
                        value={qaItem.question}
                        onChange={(e) => handleUpdateField(qIdx, 'question', e.target.value)}
                        placeholder="مثال: آیا در ایام تعطیلات رسمی کلاس‌ها فعال هستند؟"
                        className="w-full h-10 px-3 bg-slate-50 focus:bg-white border border-slate-250 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide text-right">پاسخ متناظر</span>
                      <textarea
                        value={qaItem.answer}
                        onChange={(e) => handleUpdateField(qIdx, 'answer', e.target.value)}
                        rows={2}
                        placeholder="مثال: خیر، تمامی کلاس‌های رسمی در روزهای تعطیل عمومی کشور، تعطیل خواهند بود."
                        className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-250 focus:border-blue-500 rounded-lg text-xs font-semibold outline-none resize-none text-right"
                      />
                    </div>
                  </div>
                ))}

                {qas.length === 0 && (
                  <p className="text-center text-[11px] text-slate-400 py-4 bg-slate-100/40 rounded-xl border border-dashed border-slate-200">
                    هنوز هیچ پرسش و پاسخ سفارشی وارد نکرده‌اید (اختیاری)
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: REVIEW SUMMARY VIEW */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-right">
            {/* Business summary card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"><Layers className="w-4 h-4" /> <span>نمایه تجاری کسب‌وکار</span></span>
                <button type="button" onClick={() => setStep(1)} className="text-[11px] text-blue-600 font-extrabold hover:underline">ویرایش مرحله ۱</button>
              </div>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">نام کسب‌وکار</span>
                  <span className="font-semibold text-slate-900">{name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">صنف فعالیت</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {businessType === 'education' ? 'آموزشی و درسی' : businessType === 'services' ? 'خدمات تخصصی' : 'فروشگاهی و خرده‌فروشی'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">تخصص فرعی</span>
                  <span className="font-semibold text-slate-900 truncate block">{field || 'ثبت نشده'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">رنگ سازمانی برند</span>
                  <div className="flex items-center gap-1 mt-0.5 justify-start">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: brandColor }} />
                    <span className="font-semibold text-slate-900 block truncate">
                      {brandColor === '#2563eb' ? 'آبی هوشمند' :
                       brandColor === '#10b981' ? 'سبز زمردی' :
                       brandColor === '#4f46e5' ? 'نیلی مدرن' :
                       brandColor === '#8b5cf6' ? 'بنفش لوکس' :
                       brandColor === '#f43f5e' ? 'صورتی زیبایی' :
                       brandColor === '#f59e0b' ? 'نارنجی پرانرژی' : 'زغال‌سنگی مدرن'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">پل‌های تماس</span>
                  <span className="font-semibold text-slate-900">{contact || 'ثبت نشده'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold font-medium">ساعات کار دفتری</span>
                  <span className="font-semibold text-slate-900">{workingHours}</span>
                </div>
              </div>
            </div>

            {/* AI Agent Tones card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"><Settings className="w-4 h-4" /> <span>سبک تعاملی دستیار هوشمند</span></span>
                <button type="button" onClick={() => setStep(2)} className="text-[11px] text-blue-600 font-extrabold hover:underline">ویرایش مرحله ۲</button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">لحن پاسخ‌گویی</span>
                  <span className="font-semibold text-slate-900">
                    {responseStyle === 'friendly' ? 'صمیمی و صبورانه' : responseStyle === 'formal' ? 'رسمی و اداری' : 'فنی و تخصصی'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">سقف توکن پاسخ‌ها</span>
                  <span className="font-semibold text-slate-900 font-mono" dir="ltr">{maxTokens} توکن</span>
                </div>
              </div>
            </div>

            {/* Knowledge block overview */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"><FileSpreadsheet className="w-4 h-4" /> <span>خلاصه پایگاه دانش آموزش‌دیده</span></span>
                <button type="button" onClick={() => setStep(3)} className="text-[11px] text-blue-600 font-extrabold hover:underline">ویرایش مرحله ۳</button>
              </div>
              <div className="space-y-3.5 text-xs">
                {businessType === 'education' && (
                  <>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">برنامه دوره‌ها</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{eduCourses}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">زمان‌بندی کلاس‌ها</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{eduSchedule}</p>
                    </div>
                  </>
                )}
                {businessType === 'services' && (
                  <>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">خدمات اصلی</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{serServices}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5 font-medium">مسیر رزرو وقت</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{serProcess}</p>
                    </div>
                  </>
                )}
                {businessType === 'retail' && (
                  <>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">اقلام و محصولات</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{retProducts}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">مقررات مرسولات</span>
                      <p className="font-semibold text-slate-800 leading-relaxed truncate">{retShipping}</p>
                    </div>
                  </>
                )}
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">سوالات متداول اختصاصی</span>
                  <span className="font-semibold text-slate-900">{qas.filter(q => q.question && q.answer).length} مورد پرسش و پاسخ سفارشی فعال شده است.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Fixed footer action buttons panel - ensures inputs don't hide buttons */}
      <footer className="fixed bottom-0 left-0 right-0 h-18 bg-white border-t border-slate-250 px-4 flex items-center justify-center z-30 pb-safe">
        <div className="max-w-2xl w-full flex gap-3 h-full items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 py-3 px-4 rounded-xl disabled:opacity-30 cursor-pointer active-scale"
          >
            <ChevronRight className="w-4 h-4" />
            <span>مرحله قبل</span>
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              id="onboarding-next"
              onClick={handleNext}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer text-xs active-scale"
            >
              <span>مرحله بعدی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="onboarding-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-7 rounded-xl shadow-md cursor-pointer text-xs active-scale"
            >
              <span>تجهیز و ساخت محیط کاربری هوشمند</span>
              <Sparkles className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
export type { BusinessType, ResponseStyle };
