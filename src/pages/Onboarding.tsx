import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationHat01,
  Tool01,
  Check,
  ChevronRight,
  ChevronLeft,
  LayersThree01,
  File01,
  Plus,
  RefreshCw01,
  MessageSquare01,
  Pencil01,
  XClose,
  Trash01,
  AlertTriangle,
} from '@untitled-ui/icons-react';
import { Bot, Sparkles } from 'lucide-react';
import { api, aiSuggestQuestions } from '../services/api';
import { Business, BusinessType, ResponseStyle } from '../types';
import { Button, Input, Textarea } from '../components/ui';

interface AiQuestion {
  id: string;
  question: string;
  answer: string;
  placeholder: string;
  fromAi: boolean;
}

const EDUCATION_FIELDS = [
  { label: 'برنامه‌نویسی', icon: '💻' },
  { label: 'زبان', icon: '🌍' },
  { label: 'ریاضی', icon: '📐' },
  { label: 'هنر و طراحی', icon: '🎨' },
  { label: 'موسیقی', icon: '🎵' },
  { label: 'آمادگی کنکور', icon: '📚' },
  { label: 'ورزش', icon: '⚽' },
  { label: 'سایر', icon: '✏️' },
];

const SERVICE_FIELDS = [
  { label: 'دندانپزشکی', icon: '🦷' },
  { label: 'آرایشگاه', icon: '💇' },
  { label: 'تعمیرات', icon: '🔧' },
  { label: 'پزشکی', icon: '🏥' },
  { label: 'مشاوره', icon: '🤝' },
  { label: 'رستوران / کافه', icon: '☕' },
  { label: 'باشگاه ورزشی', icon: '🏋️' },
  { label: 'سایر', icon: '⚙️' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<'education' | 'services'>('education');
  const [brandColor, setBrandColor] = useState('#2563eb');
  const [basicsError, setBasicsError] = useState('');

  const [selectedField, setSelectedField] = useState('');
  const [customField, setCustomField] = useState('');
  const [fieldError, setFieldError] = useState('');

  const [aiQuestions, setAiQuestions] = useState<AiQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [tempAnswer, setTempAnswer] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) navigate('/auth');
  }, [navigate]);

  const getEffectiveField = () => customField.trim() || selectedField;

  const loadAiQuestions = async () => {
    const field = getEffectiveField();
    if (!field) return;
    setIsLoadingQuestions(true);
    setQuestionsLoaded(false);
    try {
      const suggestions = await aiSuggestQuestions(businessType, field);
      setAiQuestions(suggestions.map((s, idx) => ({
        id: 'ai_' + idx,
        question: s.question,
        answer: '',
        placeholder: s.placeholder,
        fromAi: true,
      })));
      setQuestionsLoaded(true);
    } catch {
      setAiQuestions([]);
      setQuestionsLoaded(true);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!name.trim()) { setBasicsError('نام کسب‌وکار الزامی است.'); return; }
      setBasicsError('');
    }
    if (step === 2) {
      if (!getEffectiveField()) { setFieldError('لطفاً حوزه فعالیت خود را مشخص کنید.'); return; }
      setFieldError('');
      await loadAiQuestions();
    }
    setStep(p => Math.min(p + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(p => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = (id: string) => setAiQuestions(p => p.filter(q => q.id !== id));

  const handleStartEdit = (q: AiQuestion) => { setEditingAnswerId(q.id); setTempAnswer(q.answer); };
  const handleSaveAnswer = (id: string) => {
    setAiQuestions(p => p.map(q => q.id === id ? { ...q, answer: tempAnswer } : q));
    setEditingAnswerId(null);
    setTempAnswer('');
  };
  const handleCancelEdit = () => { setEditingAnswerId(null); setTempAnswer(''); };

  const handleAddCustomQuestion = () => {
    const newQ: AiQuestion = {
      id: 'custom_' + Date.now(),
      question: '',
      answer: '',
      placeholder: 'پاسخ خود را اینجا بنویسید...',
      fromAi: false,
    };
    setAiQuestions(p => [...p, newQ]);
    setTimeout(() => { setEditingAnswerId(newQ.id); setTempAnswer(''); }, 50);
  };

  const handleUpdateCustomQuestion = (id: string, question: string) =>
    setAiQuestions(p => p.map(q => q.id === id ? { ...q, question } : q));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const field = getEffectiveField();
      await api.business.create({
        name,
        type: businessType as BusinessType,
        field,
        brandColor,
        contact: '',
        workingHours: 'شنبه تا پنجشنبه ۹:۰۰ تا ۱۸:۰۰',
        welcomeMessage: `سلام! به ${name} خوش آمدید. چطور می‌توانم کمکتان کنم؟`,
        responseStyle: 'friendly' as ResponseStyle,
        maxTokens: 1000,
      });
      const details = aiQuestions
        .filter(q => q.question.trim() && q.answer.trim())
        .map((q, idx) => ({ key: `ai_qa_${idx}`, title: q.question, value: q.answer }));
      if (details.length > 0) await api.details.saveAll(details);
      navigate('/dashboard');
    } catch {
      alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = aiQuestions.filter(q => q.answer.trim()).length;
  const totalCount = aiQuestions.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-right" dir="rtl">

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-30 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center gap-0.5 shadow-md shadow-blue-500/15 relative shrink-0">
              <div className="absolute bottom-1 right-0 w-1.5 h-1.5 bg-blue-600 rounded-bl-full transform translate-x-0.5 translate-y-0.5" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span className="font-extrabold text-xs tracking-tight text-slate-800">راه‌اندازی پرسا</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 font-mono">مرحله {step} از ۴</span>
        </div>
        <div className="w-full bg-slate-100 h-1">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 mb-28 space-y-6">

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {step === 1 && 'درباره کسب‌وکار خود بگویید'}
            {step === 2 && 'دقیقاً چه کاری انجام می‌دهید؟'}
            {step === 3 && 'سوالات پیشنهادی هوش مصنوعی'}
            {step === 4 && 'بررسی نهایی اطلاعات'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 1 && 'نام، رنگ سازمانی و حوزه فعالیت کسب‌وکارتان را وارد کنید.'}
            {step === 2 && 'هوش مصنوعی بر اساس تخصص شما، سوالات مرتبط پیشنهاد می‌دهد.'}
            {step === 3 && 'پاسخ سوالاتی که می‌خواهید دستیار پاسخ دهد را بنویسید. سوالات ناخواسته را حذف کنید.'}
            {step === 4 && 'اطلاعات نهایی خود را مرور کنید و دستیار را فعال کنید.'}
          </p>
        </div>

        {/* ─── STEP 1 ─── */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Input
              label="نام کسب‌وکار"
              value={name}
              onChange={e => { setName(e.target.value); setBasicsError(''); }}
              placeholder="مثال: آموزشگاه آینده‌ساز یا کلینیک دکتر رضایی"
              error={basicsError}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">حوزه کاری</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'education' as const, icon: GraduationHat01, title: 'آموزشی', sub: 'دوره‌ها، کلاس، آموزشگاه' },
                  { type: 'services' as const, icon: Tool01, title: 'خدماتی', sub: 'کلینیک، آرایشگاه، تعمیرات' },
                ].map(opt => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => { setBusinessType(opt.type); setSelectedField(''); setCustomField(''); }}
                    className={`p-4 rounded-xl border-2 text-right flex flex-col justify-between h-28 cursor-pointer transition relative ${
                      businessType === opt.type ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <opt.icon className={`w-6 h-6 ${businessType === opt.type ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-none mb-1">{opt.title}</h3>
                      <p className="text-[10px] text-slate-400 leading-tight">{opt.sub}</p>
                    </div>
                    {businessType === opt.type && (
                      <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">رنگ سازمانی برند</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { hex: '#2563eb', label: 'آبی' }, { hex: '#10b981', label: 'سبز' },
                  { hex: '#4f46e5', label: 'نیلی' }, { hex: '#8b5cf6', label: 'بنفش' },
                  { hex: '#f43f5e', label: 'صورتی' }, { hex: '#f59e0b', label: 'نارنجی' },
                  { hex: '#475569', label: 'خاکستری' },
                ].map(c => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setBrandColor(c.hex)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      brandColor === c.hex ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: c.hex }} />
                    {c.label}
                    {brandColor === c.hex && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2 ─── */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 font-semibold flex items-center gap-2">
              <Bot className="w-4 h-4 shrink-0" />
              <span>
                بر اساس انتخاب شما (<b>{businessType === 'education' ? 'آموزشی' : 'خدماتی'}</b>)، هوش مصنوعی سوالات مناسب پیشنهاد می‌دهد.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {businessType === 'education' ? 'حوزه آموزشی' : 'نوع خدمات'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(businessType === 'education' ? EDUCATION_FIELDS : SERVICE_FIELDS).map(f => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => { setSelectedField(f.label); setCustomField(''); setFieldError(''); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      selectedField === f.label && !customField
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="یا دقیقاً بنویسید چه کاری انجام می‌دهید"
              value={customField}
              onChange={e => {
                setCustomField(e.target.value);
                if (e.target.value) setSelectedField('');
                setFieldError('');
              }}
              placeholder={businessType === 'education'
                ? 'مثال: آموزش برنامه‌نویسی Flutter'
                : 'مثال: مطب دندانپزشکی کودکان'}
              error={fieldError}
            />

            {getEffectiveField() && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-emerald-700">
                  انتخاب شما: <span className="text-emerald-900">{businessType === 'education' ? 'آموزشی' : 'خدماتی'} — {getEffectiveField()}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 3 ─── */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {isLoadingQuestions && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-blue-600 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-700">هوش مصنوعی در حال تحلیل حوزه کاری شماست...</p>
                  <p className="text-xs text-slate-400">سوالات مرتبط با <b>{getEffectiveField()}</b> در حال آماده‌سازی است</p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {!isLoadingQuestions && questionsLoaded && (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold">نکته مهم درباره اس‌ام‌اس</span>
                  </div>
                  <p className="text-amber-700 font-normal leading-relaxed">
                    اگر مشتری سوالی بپرسد که پاسخی ثبت نشده باشد، پرسا فوراً یک <b>اس‌ام‌اس</b> به شما می‌فرستد.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">{totalCount} سوال پیشنهادی</span>
                  <span className="text-emerald-600 font-bold">{answeredCount} پاسخ داده شده</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: totalCount ? `${(answeredCount / totalCount) * 100}%` : '0%' }}
                  />
                </div>

                <div className="space-y-3">
                  {aiQuestions.map(q => (
                    <div
                      key={q.id}
                      className={`bg-white border rounded-xl p-4 space-y-3 shadow-sm ${q.answer ? 'border-emerald-200' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <MessageSquare01 className={`w-4 h-4 mt-0.5 shrink-0 ${q.answer ? 'text-emerald-500' : 'text-blue-400'}`} />
                          {q.fromAi ? (
                            <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.question}</p>
                          ) : (
                            <input
                              type="text"
                              value={q.question}
                              onChange={e => handleUpdateCustomQuestion(q.id, e.target.value)}
                              placeholder="متن سوال را بنویسید..."
                              className="flex-1 text-xs font-bold text-slate-800 bg-transparent outline-none border-b border-slate-200 focus:border-blue-400 pb-0.5"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition cursor-pointer shrink-0"
                        >
                          <Trash01 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {editingAnswerId === q.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={tempAnswer}
                            onChange={e => setTempAnswer(e.target.value)}
                            placeholder={q.placeholder}
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                              onClick={() => handleSaveAnswer(q.id)}
                            >
                              ذخیره پاسخ
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              leftIcon={<XClose className="w-3.5 h-3.5" />}
                              onClick={handleCancelEdit}
                            >
                              انصراف
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(q)}
                          className={`w-full text-right p-2.5 rounded-lg border text-xs transition cursor-pointer group ${
                            q.answer
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                              : 'bg-slate-50 border-slate-200 border-dashed text-slate-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                          }`}
                        >
                          {q.answer ? (
                            <span className="flex items-center justify-between gap-2">
                              <span className="leading-relaxed">{q.answer}</span>
                              <Pencil01 className="w-3 h-3 shrink-0 text-emerald-400 group-hover:text-emerald-600" />
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Pencil01 className="w-3 h-3" />
                              <span>برای نوشتن پاسخ کلیک کنید... <span className="text-[10px] text-slate-300">(بدون پاسخ = SMS دریافت می‌کنید)</span></span>
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  fullWidth
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={handleAddCustomQuestion}
                  className="border-dashed"
                >
                  افزودن سوال اختصاصی
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<RefreshCw01 className="w-3.5 h-3.5" />}
                  onClick={loadAiQuestions}
                >
                  بارگذاری مجدد سوالات پیشنهادی
                </Button>
              </>
            )}
          </div>
        )}

        {/* ─── STEP 4 ─── */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <LayersThree01 className="w-4 h-4" /> نمایه کسب‌وکار
                </span>
                <button type="button" onClick={() => setStep(1)} className="text-[11px] text-blue-600 font-extrabold hover:underline">ویرایش</button>
              </div>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                {[
                  { label: 'نام کسب‌وکار', val: name },
                  { label: 'حوزه کاری', val: businessType === 'education' ? 'آموزشی' : 'خدماتی' },
                  { label: 'تخصص', val: getEffectiveField() },
                ].map(row => (
                  <div key={row.label}>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">{row.label}</span>
                    <span className="font-semibold text-slate-900">{row.val}</span>
                  </div>
                ))}
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">رنگ سازمانی</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: brandColor }} />
                    <span className="font-semibold text-slate-900">{brandColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <File01 className="w-4 h-4" /> پایگاه دانش دستیار
                </span>
                <button type="button" onClick={() => setStep(3)} className="text-[11px] text-blue-600 font-extrabold hover:underline">ویرایش</button>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'تعداد کل سوالات', val: totalCount, cls: '' },
                  { label: 'سوالات با پاسخ آماده', val: answeredCount, cls: 'text-emerald-600' },
                  { label: 'سوالات بدون پاسخ (SMS)', val: totalCount - answeredCount, cls: 'text-amber-600' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between font-semibold text-slate-700">
                    <span>{row.label}</span>
                    <span className={`font-bold ${row.cls}`}>{row.val}</span>
                  </div>
                ))}
              </div>
              {totalCount - answeredCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700 font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>برای {totalCount - answeredCount} سوال بدون پاسخ، وقتی مشتری بپرسد اس‌ام‌اس می‌گیرید.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-30">
        <div className="max-w-xl mx-auto flex gap-3 items-center justify-between">
          <Button
            variant="ghost"
            size="md"
            leftIcon={<ChevronRight className="w-4 h-4" />}
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            مرحله قبل
          </Button>

          {step < 4 ? (
            <Button
              size="md"
              loading={isLoadingQuestions}
              rightIcon={!isLoadingQuestions ? <ChevronLeft className="w-4 h-4" /> : undefined}
              onClick={handleNext}
            >
              {isLoadingQuestions ? 'در حال بارگذاری...' : 'مرحله بعدی'}
            </Button>
          ) : (
            <Button
              size="md"
              loading={isSubmitting}
              rightIcon={!isSubmitting ? <Sparkles className="w-4 h-4" /> : undefined}
              onClick={handleSubmit}
            >
              فعال‌سازی دستیار هوشمند
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

export type { BusinessType, ResponseStyle };
